import { NextRequest, NextResponse } from "next/server";

// TikTok Content Posting API
// Setup: developers.tiktok.com → Create App → Request "Content Posting API" scope
// Once approved, exchange auth code for access token and set TIKTOK_ACCESS_TOKEN in .env.local

export async function POST(req: NextRequest) {
  try {
    const { videoUrl, caption, coverImageUrl } = await req.json();

    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { error: "TikTok access token not configured. See /setup for instructions." },
        { status: 503 }
      );
    }

    // Step 1: Initialize upload
    const initRes = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        post_info: {
          title: caption.slice(0, 150),
          privacy_level: "SELF_ONLY", // Change to PUBLIC_TO_EVERYONE when ready
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
        },
        source_info: {
          source: "PULL_FROM_URL",
          video_url: videoUrl,
          cover_image_url: coverImageUrl,
        },
      }),
    });

    if (!initRes.ok) {
      const err = await initRes.json();
      throw new Error(err.error?.message || "TikTok API error");
    }

    const data = await initRes.json();
    return NextResponse.json({
      success: true,
      publishId: data.data?.publish_id,
      message: "Video submitted to TikTok. Check your TikTok drafts.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET — check publish status
export async function GET(req: NextRequest) {
  const publishId = req.nextUrl.searchParams.get("publishId");
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!accessToken || !publishId) {
    return NextResponse.json({ error: "Missing credentials or publishId" }, { status: 400 });
  }

  const res = await fetch("https://open.tiktokapis.com/v2/post/publish/status/fetch/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ publish_id: publishId }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
