import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Runs daily at 9am via Vercel Cron (vercel.json)
// Fetches top signals → generates TikTok content for each → logs to console
// TODO: Store in Supabase content_queue table and push to TikTok

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function GET(req: NextRequest) {
  // Verify cron secret in production
  const authHeader = req.headers.get("authorization");
  if (process.env.NODE_ENV === "production" && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch live signals
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const signalsRes = await fetch(`${appUrl}/api/signals`);
    const { signals } = await signalsRes.json();

    if (!signals?.length) {
      return NextResponse.json({ message: "No signals available" });
    }

    // 2. Pick the top 3 highest-confidence signals
    const topSignals = [...signals]
      .sort((a: any, b: any) => b.confidence - a.confidence)
      .slice(0, 3);

    // 3. Generate TikTok content for each
    const results = [];
    for (const signal of topSignals) {
      const res = await fetch(`${appUrl}/api/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol:    signal.symbol,
          signal:    signal.signal,
          price:     signal.price,
          change24h: signal.change24h,
          change7d:  signal.change7d,
          reasoning: signal.reasoning,
          keyMetric: signal.keyMetric,
          platform:  "tiktok",
        }),
      });
      const data = await res.json();
      results.push({ symbol: signal.symbol, signal: signal.signal, content: data.content });
    }

    // 4. TODO: Store in Supabase
    // await supabaseAdmin.from("content_queue").insert(results.map(r => ({ ...r, status: "pending", created_at: new Date() })));

    // 5. TODO: Post to TikTok if credentials are set
    // for (const result of results) {
    //   await fetch(`${appUrl}/api/tiktok/post`, { method: "POST", body: JSON.stringify({ caption: result.content.caption }) });
    // }

    console.log(`[Daily Cron] Generated ${results.length} content pieces at ${new Date().toISOString()}`);
    return NextResponse.json({ success: true, generated: results.length, content: results });
  } catch (err: any) {
    console.error("[Daily Cron] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
