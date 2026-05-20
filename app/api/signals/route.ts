import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const COINS = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "solana", symbol: "SOL" },
  { id: "binancecoin", symbol: "BNB" },
  { id: "ripple", symbol: "XRP" },
  { id: "cardano", symbol: "ADA" },
];

async function fetchMarketData() {
  const ids = COINS.map((c) => c.id).join(",");
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&price_change_percentage=1h,24h,7d`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch market data");
  return res.json();
}

function buildPrompt(coins: object[]) {
  const summary = coins.map((c: any) => ({
    symbol: c.symbol.toUpperCase(),
    price: c.current_price,
    change1h: c.price_change_percentage_1h_in_currency?.toFixed(2),
    change24h: c.price_change_percentage_24h?.toFixed(2),
    change7d: c.price_change_percentage_7d_in_currency?.toFixed(2),
    volume24h: c.total_volume,
    marketCap: c.market_cap,
    high24h: c.high_24h,
    low24h: c.low_24h,
    ath: c.ath,
    priceVsAth: ((c.current_price / c.ath) * 100).toFixed(1),
  }));

  return `You are a crypto market analyst for an educational trading tool. Analyze the following real-time market data and generate a signal for each coin.

Market Data:
${JSON.stringify(summary, null, 2)}

For each coin, respond with a JSON array. Each object must have:
- symbol: string
- price: number
- signal: "BUY" | "SELL" | "HOLD"
- confidence: number (0-100)
- reasoning: string (2-3 sentences, plain English, educational — explain the WHY behind the signal based on the data)
- keyMetric: string (the single most important data point driving this signal, e.g. "Strong 7-day momentum +18.3%")

Keep reasoning educational and factual. Never guarantee profits. Base signals purely on the provided data patterns.

Respond with only valid JSON array, no markdown.`;
}

export async function GET() {
  try {
    const marketData = await fetchMarketData();

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{ role: "user", content: buildPrompt(marketData) }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text.trim();
    const signals = JSON.parse(raw);

    // Attach live price data back to signals
    const enriched = signals.map((sig: any) => {
      const coinData = marketData.find(
        (c: any) => c.symbol.toUpperCase() === sig.symbol
      );
      return {
        ...sig,
        change24h: coinData?.price_change_percentage_24h?.toFixed(2),
        change7d: coinData?.price_change_percentage_7d_in_currency?.toFixed(2),
        high24h: coinData?.high_24h,
        low24h: coinData?.low_24h,
        volume24h: coinData?.total_volume,
        image: coinData?.image,
      };
    });

    return NextResponse.json({ signals: enriched, generatedAt: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
