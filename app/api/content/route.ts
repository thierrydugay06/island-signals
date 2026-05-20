import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PLATFORM_PROMPTS: Record<string, string> = {
  tiktok: `Generate TikTok content. Respond with JSON containing:
- hook: The first 1-2 sentences (max 20 words). Must grab attention immediately. Use curiosity, surprise, or a bold educational statement. Example: "Our AI just caught something on Bitcoin that 99% of traders completely missed."
- script: Full 45-60 second spoken TikTok script. Conversational, fast-paced, educational. Break complex ideas into simple sentences. End with: "Follow for daily AI signals — link in bio to see all of them free." Always include "This is not financial advice."
- caption: Under 150 characters. Punchy, emoji-rich. Followed by 8 hashtags mixing large (#crypto #bitcoin) and niche (#aisignals #islandsignals #cryptoeducation).`,

  twitter: `Generate a Twitter/X thread. Respond with JSON containing:
- hook: Tweet 1 — the bold opening statement that makes people read on. Max 280 chars.
- script: Tweets 2-4 — the educational breakdown in 3 tweets. Each separated by "|||". Educational, data-driven, not financial advice.
- caption: Tweet 5 — the closing CTA tweet. Include link placeholder "[link]" and relevant hashtags.`,

  linkedin: `Generate a LinkedIn post. Respond with JSON containing:
- hook: The opening line that stops the scroll. Bold, professional, data-driven.
- script: The full post body (150-200 words). Professional tone. Educational breakdown of the signal. Include data points. Mention Island Signals as an educational tool.
- caption: 5 professional hashtags for LinkedIn (e.g. #cryptocurrency #artificialintelligence #investing #fintech #trading).`,

  instagram: `Generate an Instagram caption. Respond with JSON containing:
- hook: First line of the caption — the scroll-stopper (max 15 words).
- script: Full caption body (100-150 words). Educational, conversational. Explain what the AI found and why it matters for learning about markets.
- caption: 15-20 hashtags mixing popular and niche crypto/AI tags.`,
};

export async function POST(req: NextRequest) {
  try {
    const { symbol, signal, price, change24h, change7d, reasoning, keyMetric, platform = "tiktok" } = await req.json();

    const platformPrompt = PLATFORM_PROMPTS[platform] || PLATFORM_PROMPTS.tiktok;

    const prompt = `You are the content creator for Island Signals — an AI-powered crypto education platform. Your job is to create engaging, educational social media content based on AI signal data.

SIGNAL DATA:
- Coin: ${symbol}
- Signal: ${signal}
- Current Price: $${price?.toLocaleString()}
- 24h Change: ${change24h}%
- 7-day Change: ${change7d}%
- Key Metric: ${keyMetric}
- AI Reasoning: ${reasoning}

${platformPrompt}

Rules:
1. Never guarantee profits or promise returns
2. Always frame content as educational/analytical
3. Be genuinely interesting — teach people something real
4. Reference the Island Signals dashboard as a free educational tool
5. Keep it authentic, not salesy

Respond with only valid JSON (no markdown, no explanation).`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text.trim();
    const content = JSON.parse(raw);

    return NextResponse.json({ content, platform, symbol, signal });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
