"use client";

import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";

type Signal = {
  symbol: string;
  price: number;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  keyMetric: string;
  change24h: string;
  change7d: string;
  image?: string;
};

type GeneratedContent = {
  hook: string;
  script: string;
  caption: string;
};

type Platform = "tiktok" | "twitter" | "linkedin" | "instagram";

const PLATFORMS: { id: Platform; label: string; icon: string; color: string }[] = [
  { id: "tiktok",    label: "TikTok",    icon: "🎵", color: "#ff0050" },
  { id: "twitter",   label: "Twitter/X", icon: "𝕏",  color: "#1da1f2" },
  { id: "linkedin",  label: "LinkedIn",  icon: "in", color: "#0077b5" },
  { id: "instagram", label: "Instagram", icon: "📷", color: "#e1306c" },
];

const SIG_COLOR = { BUY: "#10d9a0", SELL: "#f43f5e", HOLD: "#fbbf24" };

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      style={{
        padding: "6px 14px",
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: copied ? "rgba(16,217,160,0.1)" : "var(--elevated)",
        color: copied ? "var(--green)" : "var(--t2)",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s",
        flexShrink: 0,
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function ContentBlock({ label, text }: { label: string; text: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.08em" }}>
          {label}
        </span>
        <CopyButton text={text} />
      </div>
      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "14px 16px",
          fontSize: 14,
          color: "var(--t2)",
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </div>
    </div>
  );
}

export default function ContentStudio() {
  const [signals, setSignals]     = useState<Signal[]>([]);
  const [selected, setSelected]   = useState<Signal | null>(null);
  const [platform, setPlatform]   = useState<Platform>("tiktok");
  const [content, setContent]     = useState<GeneratedContent | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loadingSignals, setLoadingSignals] = useState(true);
  const [error, setError]         = useState("");
  const [scheduleQueue, setScheduleQueue] = useState<{ signal: Signal; platform: Platform; content: GeneratedContent; time: string }[]>([]);

  const fetchSignals = useCallback(async () => {
    try {
      const res = await fetch("/api/signals");
      const data = await res.json();
      if (data.signals) {
        setSignals(data.signals);
        setSelected(data.signals[0]);
      }
    } catch {
      setError("Failed to load signals. Add your Anthropic API key in .env.local");
    } finally {
      setLoadingSignals(false);
    }
  }, []);

  useEffect(() => { fetchSignals(); }, [fetchSignals]);

  const generate = async () => {
    if (!selected) return;
    setGenerating(true);
    setContent(null);
    setError("");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol:    selected.symbol,
          signal:    selected.signal,
          price:     selected.price,
          change24h: selected.change24h,
          change7d:  selected.change7d,
          reasoning: selected.reasoning,
          keyMetric: selected.keyMetric,
          platform,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setContent(data.content);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const addToSchedule = () => {
    if (!selected || !content) return;
    const now = new Date();
    now.setHours(now.getHours() + scheduleQueue.length * 6 + 6);
    setScheduleQueue((q) => [
      ...q,
      {
        signal: selected,
        platform,
        content,
        time: now.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const platformInfo = PLATFORMS.find((p) => p.id === platform)!;
  const sigColor = selected ? SIG_COLOR[selected.signal] : "var(--accent)";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--t1)" }}>
      <Sidebar />

      <main style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "var(--font-playfair),Georgia,serif", fontSize: 28, fontWeight: 700, color: "var(--t1)", marginBottom: 6 }}>
            Content Studio
          </h1>
          <p style={{ color: "var(--t2)", fontSize: 14 }}>
            Generate TikTok scripts, captions, and social posts from live AI signals.
          </p>
        </div>

        {/* Platform tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => { setPlatform(p.id); setContent(null); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 18px",
                borderRadius: 10,
                border: "1px solid",
                borderColor: platform === p.id ? p.color + "60" : "var(--border)",
                background: platform === p.id ? p.color + "15" : "transparent",
                color: platform === p.id ? p.color : "var(--t3)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 14 }}>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" }}>

          {/* Left: Signal selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--t3)", letterSpacing: "0.08em", marginBottom: 4 }}>
              SELECT A COIN
            </div>

            {loadingSignals ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ height: 60, borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)", animation: "pulse 1.5s infinite" }} />
              ))
            ) : signals.map((s) => (
              <button
                key={s.symbol}
                onClick={() => { setSelected(s); setContent(null); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid",
                  borderColor: selected?.symbol === s.symbol ? SIG_COLOR[s.signal] + "50" : "var(--border)",
                  background: selected?.symbol === s.symbol ? SIG_COLOR[s.signal] + "08" : "var(--surface)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {s.image && <img src={s.image} alt={s.symbol} style={{ width: 28, height: 28, borderRadius: "50%" }} />}
                  <div>
                    <div style={{ color: "var(--t1)", fontWeight: 600, fontSize: 14 }}>{s.symbol}</div>
                    <div style={{ color: "var(--t3)", fontSize: 12 }}>
                      {parseFloat(s.change24h) >= 0 ? "+" : ""}{s.change24h}% 24h
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: SIG_COLOR[s.signal],
                  background: SIG_COLOR[s.signal] + "15",
                  padding: "3px 8px",
                  borderRadius: 6,
                  letterSpacing: "0.06em",
                }}>
                  {s.signal}
                </span>
              </button>
            ))}

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={!selected || generating}
              style={{
                marginTop: 8,
                padding: "14px",
                borderRadius: 12,
                border: "none",
                background: generating ? "var(--elevated)" : "var(--accent)",
                color: generating ? "var(--t3)" : "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: generating ? "not-allowed" : "pointer",
                boxShadow: generating ? "none" : "0 4px 20px rgba(91,138,245,0.3)",
                transition: "all 0.2s",
              }}
            >
              {generating ? "✦ Generating…" : `✦ Generate ${platformInfo.label} Content`}
            </button>
          </div>

          {/* Right: Content output */}
          <div>
            {error && (
              <div style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.25)", borderRadius: 12, padding: "16px 20px", marginBottom: 20, color: "var(--red)", fontSize: 14 }}>
                {error}
              </div>
            )}

            {!content && !generating && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 400,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                color: "var(--t3)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{platformInfo.icon}</div>
                <div style={{ fontSize: 16, color: "var(--t2)", marginBottom: 8 }}>Ready to generate</div>
                <div style={{ fontSize: 13 }}>Select a coin and click Generate</div>
              </div>
            )}

            {generating && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 400,
                background: "var(--surface)",
                border: "1px solid rgba(91,138,245,0.2)",
                borderRadius: 16,
              }}>
                <div style={{ fontSize: 32, marginBottom: 16, animation: "spin 2s linear infinite" }}>✦</div>
                <div style={{ color: "var(--accent)", fontSize: 15, fontWeight: 600 }}>Claude is writing your content…</div>
                <div style={{ color: "var(--t3)", fontSize: 13, marginTop: 8 }}>Usually takes 3-5 seconds</div>
              </div>
            )}

            {content && selected && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px" }}>
                {/* Content header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 20 }}>{platformInfo.icon}</span>
                    <div>
                      <div style={{ color: "var(--t1)", fontWeight: 700, fontSize: 15 }}>
                        {platformInfo.label} Content — {selected.symbol}
                      </div>
                      <div style={{ color: sigColor, fontSize: 12, fontWeight: 600 }}>
                        {selected.signal} Signal · {selected.confidence}% confidence
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={addToSchedule}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "1px solid rgba(91,138,245,0.3)",
                        background: "rgba(91,138,245,0.1)",
                        color: "var(--accent)",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      + Schedule
                    </button>
                    <CopyButton text={`${content.hook}\n\n${content.script}\n\n${content.caption}`} />
                  </div>
                </div>

                {/* Content blocks */}
                <ContentBlock
                  label={platform === "twitter" ? "TWEET 1 — HOOK" : "HOOK"}
                  text={content.hook}
                />
                <ContentBlock
                  label={platform === "twitter" ? "THREAD (TWEETS 2-4)" : platform === "tiktok" ? "FULL SCRIPT (READ THIS OUT LOUD)" : "POST BODY"}
                  text={content.script}
                />
                <ContentBlock
                  label={platform === "twitter" ? "CLOSING TWEET + HASHTAGS" : "CAPTION + HASHTAGS"}
                  text={content.caption}
                />

                <div style={{ padding: "12px 16px", background: "var(--elevated)", borderRadius: 10, border: "1px solid var(--border)", fontSize: 12, color: "var(--t3)" }}>
                  ⚠️ Always review AI-generated content before posting. Ensure accuracy and add personal context where appropriate.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Schedule Queue */}
        {scheduleQueue.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--t3)", letterSpacing: "0.08em", marginBottom: 16 }}>
              CONTENT QUEUE ({scheduleQueue.length} posts)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {scheduleQueue.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 18 }}>{PLATFORMS.find((p) => p.id === item.platform)?.icon}</span>
                    <div>
                      <div style={{ color: "var(--t1)", fontWeight: 600, fontSize: 14 }}>
                        {item.signal.symbol} · {item.signal.signal}
                      </div>
                      <div style={{ color: "var(--t3)", fontSize: 12 }}>{item.content.hook.slice(0, 60)}…</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ color: "var(--t2)", fontSize: 12 }}>🕐 {item.time}</span>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      background: "rgba(251,191,36,0.1)",
                      color: "var(--yellow)",
                    }}>
                      QUEUED
                    </span>
                    <button
                      onClick={() => setScheduleQueue((q) => q.filter((_, j) => j !== i))}
                      style={{ background: "none", border: "none", color: "var(--t3)", cursor: "pointer", fontSize: 16 }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p style={{ fontSize: 11, color: "var(--t3)", textAlign: "center", marginTop: 40, lineHeight: 1.7 }}>
          Content is AI-generated for educational purposes. Always review before posting. Never present signals as guaranteed outcomes.
        </p>
      </main>
    </div>
  );
}
