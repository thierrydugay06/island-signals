"use client";

import Link from "next/link";

// Static mock data for hero preview card
const PREVIEW_SIGNALS = [
  { symbol: "BTC", price: "$67,420", signal: "BUY",  change: "+2.4%", color: "#10d9a0" },
  { symbol: "ETH", price: "$3,891",  signal: "HOLD", change: "+0.8%", color: "#fbbf24" },
  { symbol: "SOL", price: "$184",    signal: "BUY",  change: "+5.2%", color: "#10d9a0" },
];

const TICKER_COINS = [
  { s: "BTC",  p: "$67,420", c: "+2.4%",  up: true  },
  { s: "ETH",  p: "$3,891",  c: "+0.8%",  up: true  },
  { s: "SOL",  p: "$184",    c: "+5.2%",  up: true  },
  { s: "BNB",  p: "$612",    c: "-0.3%",  up: false },
  { s: "XRP",  p: "$0.58",   c: "+1.1%",  up: true  },
  { s: "ADA",  p: "$0.44",   c: "-1.8%",  up: false },
];

const FEATURES = [
  {
    num: "01",
    title: "AI Signal Engine",
    desc: "Claude AI reads price action, volume trends, and momentum across the top cryptocurrencies — then translates raw data into clear, human-readable buy, sell, or hold signals.",
    tag: "POWERED BY CLAUDE AI",
  },
  {
    num: "02",
    title: "Real-Time Market Data",
    desc: "Live price feeds refreshed every 60 seconds. 24h and 7-day trend comparisons, volume analysis, and distance from all-time highs — every data point the AI uses, visible to you.",
    tag: "LIVE COINGECKO DATA",
  },
  {
    num: "03",
    title: "Educational Breakdowns",
    desc: "Every signal includes a plain-English explanation of exactly why the AI generated it. You're not just following signals — you're learning to read markets the way AI does.",
    tag: "LEARN AS YOU TRADE",
  },
];

const STEPS = [
  { n: "1", title: "Open the Dashboard", desc: "See live AI signals for the top 6 cryptocurrencies the moment you log in." },
  { n: "2", title: "Read the AI Reasoning", desc: "Each signal explains what market patterns the AI detected and why it matters." },
  { n: "3", title: "Make Informed Decisions", desc: "Use the signals as one tool in your research — never as the only one." },
];

// Mini sparkline SVG (decorative, static)
function Sparkline({ up }: { up: boolean }) {
  const color = up ? "#10d9a0" : "#f43f5e";
  const path = up
    ? "M0,20 L10,18 L20,15 L30,16 L40,10 L50,12 L60,6 L70,8 L80,3"
    : "M0,4 L10,6 L20,8 L30,7 L40,12 L50,11 L60,16 L70,15 L80,20";
  return (
    <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
      <path d={path} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroCard() {
  return (
    <div
      className="float relative"
      style={{
        background: "rgba(13,20,36,0.92)",
        border: "1px solid rgba(99,115,155,0.25)",
        borderRadius: 20,
        backdropFilter: "blur(24px)",
        padding: "24px",
        width: 340,
        boxShadow: "0 32px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "#10d9a0", boxShadow: "0 0 6px #10d9a0" }}
          />
          <span style={{ color: "#8892b4", fontSize: 12, fontWeight: 500, letterSpacing: "0.05em" }}>
            LIVE SIGNALS
          </span>
        </div>
        <span
          style={{
            background: "rgba(91,138,245,0.12)",
            color: "#5b8af5",
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 20,
            border: "1px solid rgba(91,138,245,0.25)",
          }}
        >
          AI Active
        </span>
      </div>

      {/* Signal rows */}
      {PREVIEW_SIGNALS.map((s) => (
        <div
          key={s.symbol}
          className="flex items-center justify-between mb-3 pb-3"
          style={{ borderBottom: "1px solid rgba(99,115,155,0.1)" }}
        >
          <div>
            <div style={{ color: "#eef2ff", fontWeight: 600, fontSize: 15 }}>{s.symbol}</div>
            <div style={{ color: "#8892b4", fontSize: 12 }}>{s.price}</div>
          </div>
          <Sparkline up={s.signal === "BUY"} />
          <div className="text-right">
            <span
              style={{
                display: "block",
                color: s.color,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.06em",
                background: s.signal === "BUY" ? "rgba(16,217,160,0.1)" : "rgba(251,191,36,0.1)",
                padding: "2px 8px",
                borderRadius: 6,
                border: `1px solid ${s.color}40`,
                marginBottom: 3,
                textAlign: "center",
              }}
            >
              {s.signal}
            </span>
            <span style={{ color: s.color, fontSize: 12 }}>{s.change}</span>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <span style={{ color: "#3d4d70", fontSize: 11 }}>Not financial advice</span>
        <span style={{ color: "#8892b4", fontSize: 11 }}>6 coins tracked</span>
      </div>
    </div>
  );
}

export default function Home() {
  const doubleTicker = [...TICKER_COINS, ...TICKER_COINS];

  return (
    <div style={{ background: "var(--bg)", color: "var(--t1)", overflowX: "hidden" }}>

      {/* ── Nav ───────────────────────────────────── */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 48px",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          background: "rgba(8,11,20,0.85)",
          backdropFilter: "blur(20px)",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🏝️</span>
          <span
            className="font-display"
            style={{ fontSize: 20, fontWeight: 700, color: "var(--t1)", letterSpacing: "-0.01em" }}
          >
            Island Signals
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {["Features", "How It Works", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
              style={{ color: "var(--t2)", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--t1)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--t2)")}
            >
              {item}
            </a>
          ))}
        </div>

        <Link
          href="/dashboard"
          style={{
            background: "var(--accent)",
            color: "#fff",
            padding: "10px 22px",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
        >
          View Live Signals →
        </Link>
      </nav>

      {/* ── Hero ──────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "100px 48px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        {/* Left */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--green-dim)",
              border: "1px solid rgba(16,217,160,0.2)",
              borderRadius: 100,
              padding: "6px 14px",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--green)",
                boxShadow: "0 0 8px var(--green)",
                display: "inline-block",
              }}
            />
            <span style={{ color: "var(--green)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em" }}>
              AI SIGNALS LIVE NOW
            </span>
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(52px, 6vw, 88px)",
              lineHeight: 1.0,
              fontWeight: 700,
              color: "var(--t1)",
              marginBottom: 24,
              letterSpacing: "-0.02em",
            }}
          >
            Read The<br />
            <span style={{ color: "var(--accent)" }}>Market</span><br />
            Like AI Does.
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "var(--t2)",
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 440,
            }}
          >
            Island Signals uses Claude AI to analyze crypto markets in real time — and explains every signal in plain English so you actually learn.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <Link
              href="/dashboard"
              style={{
                background: "var(--accent)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 8px 32px rgba(91,138,245,0.35)",
              }}
            >
              View Live Signals →
            </Link>
            <span style={{ color: "var(--t3)", fontSize: 13 }}>Free to start · No account needed</span>
          </div>
        </div>

        {/* Right — floating product preview */}
        <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
          {/* Glow behind card */}
          <div
            style={{
              position: "absolute",
              width: 280,
              height: 280,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(91,138,245,0.15) 0%, transparent 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              pointerEvents: "none",
            }}
          />
          <HeroCard />
        </div>
      </section>

      {/* ── Ticker strip ───────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          padding: "14px 0",
          overflow: "hidden",
        }}
      >
        <div className="ticker-track" style={{ display: "flex", gap: 0, width: "max-content" }}>
          {doubleTicker.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 32px",
                borderRight: "1px solid var(--border)",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "var(--t2)", fontSize: 13, fontWeight: 600 }}>{c.s}</span>
              <span style={{ color: "var(--t1)", fontSize: 13 }}>{c.p}</span>
              <span style={{ color: c.up ? "var(--green)" : "var(--red)", fontSize: 12, fontWeight: 600 }}>
                {c.c}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats bar ─────────────────────────────── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "64px 48px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
        }}
      >
        {[
          { val: "6",    label: "Cryptocurrencies Tracked" },
          { val: "24/7", label: "AI Monitoring Active" },
          { val: "90s",  label: "Signal Refresh Rate" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--surface)",
              padding: "32px",
              textAlign: "center",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="font-display"
              style={{ fontSize: 52, fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}
            >
              {s.val}
            </div>
            <div style={{ color: "var(--t2)", fontSize: 14, marginTop: 8, letterSpacing: "0.04em" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Features ─────────────────────────────── */}
      <section id="features" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 48px 80px" }}>
        <div style={{ marginBottom: 64 }}>
          <p style={{ color: "var(--accent)", fontSize: 12, letterSpacing: "0.12em", fontWeight: 600, marginBottom: 12 }}>
            WHAT YOU GET
          </p>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 700, color: "var(--t1)", lineHeight: 1.1 }}
          >
            Everything you need to<br />understand the market.
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.num}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: 48,
                padding: "40px 48px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                alignItems: "start",
              }}
            >
              <div>
                <div
                  className="font-display"
                  style={{ fontSize: 72, fontWeight: 700, color: "var(--t3)", lineHeight: 1, opacity: 0.5 }}
                >
                  {f.num}
                </div>
              </div>
              <div>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--accent)",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    display: "block",
                    marginBottom: 10,
                  }}
                >
                  {f.tag}
                </span>
                <h3
                  className="font-display"
                  style={{ fontSize: 32, fontWeight: 600, color: "var(--t1)", marginBottom: 14, lineHeight: 1.2 }}
                >
                  {f.title}
                </h3>
                <p style={{ color: "var(--t2)", fontSize: 16, lineHeight: 1.8, maxWidth: 540 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "80px 48px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ color: "var(--accent)", fontSize: 12, letterSpacing: "0.12em", fontWeight: 600, marginBottom: 12, textAlign: "center" }}>
            HOW IT WORKS
          </p>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 700, color: "var(--t1)", textAlign: "center", marginBottom: 64, lineHeight: 1.1 }}
          >
            Three steps. That&apos;s it.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {STEPS.map((s) => (
              <div
                key={s.n}
                style={{
                  padding: "36px",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  className="font-display"
                  style={{
                    position: "absolute",
                    right: 20,
                    top: -10,
                    fontSize: 120,
                    fontWeight: 700,
                    color: "var(--t3)",
                    opacity: 0.08,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--accent-dim)",
                    border: "1px solid rgba(91,138,245,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    color: "var(--accent)",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {s.n}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--t1)", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: "var(--t2)", fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────── */}
      <section id="pricing" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 48px" }}>
        <p style={{ color: "var(--accent)", fontSize: 12, letterSpacing: "0.12em", fontWeight: 600, marginBottom: 12, textAlign: "center" }}>
          PRICING
        </p>
        <h2
          className="font-display"
          style={{ fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 700, color: "var(--t1)", textAlign: "center", marginBottom: 56, lineHeight: 1.1 }}
        >
          Start free. Upgrade when ready.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 760, margin: "0 auto" }}>
          {[
            {
              name: "Free",
              price: "$0",
              period: "forever",
              features: ["3 coins monitored", "Daily signal refresh", "Basic AI reasoning"],
              cta: "Start Free",
              highlight: false,
            },
            {
              name: "Pro",
              price: "$29",
              period: "/ month",
              features: ["All 6+ coins", "Real-time signals", "Deep AI analysis", "Signal history", "Email alerts"],
              cta: "Start Pro",
              highlight: true,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.highlight ? "var(--elevated)" : "var(--surface)",
                border: plan.highlight ? "1px solid rgba(91,138,245,0.4)" : "1px solid var(--border)",
                borderRadius: 20,
                padding: "40px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {plan.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    padding: "4px 10px",
                    borderRadius: 100,
                  }}
                >
                  POPULAR
                </div>
              )}
              <div style={{ color: "var(--t2)", fontSize: 14, marginBottom: 8 }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 28 }}>
                <span
                  className="font-display"
                  style={{ fontSize: 52, fontWeight: 700, color: "var(--t1)", lineHeight: 1 }}
                >
                  {plan.price}
                </span>
                <span style={{ color: "var(--t2)", fontSize: 14 }}>{plan.period}</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 32 }}>
                {plan.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 14,
                      color: "var(--t2)",
                      padding: "8px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span style={{ color: "var(--green)", fontSize: 16 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "14px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  background: plan.highlight ? "var(--accent)" : "var(--elevated)",
                  color: "#fff",
                  border: plan.highlight ? "none" : "1px solid var(--border)",
                  boxShadow: plan.highlight ? "0 8px 24px rgba(91,138,245,0.3)" : "none",
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA strip ────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--elevated) 0%, rgba(91,138,245,0.12) 100%)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "80px 48px",
          textAlign: "center",
        }}
      >
        <h2
          className="font-display"
          style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 700, color: "var(--t1)", marginBottom: 20, lineHeight: 1.1 }}
        >
          Start reading the market<br />like AI does.
        </h2>
        <p style={{ color: "var(--t2)", fontSize: 16, marginBottom: 36, maxWidth: 440, margin: "0 auto 36px" }}>
          Free to start. No account needed. Live signals in seconds.
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            background: "var(--accent)",
            color: "#fff",
            padding: "16px 40px",
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 8px 40px rgba(91,138,245,0.4)",
          }}
        >
          Open Live Dashboard →
        </Link>
      </div>

      {/* ── Footer ───────────────────────────────── */}
      <footer
        style={{
          padding: "32px 48px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span className="font-display" style={{ color: "var(--t2)", fontSize: 16 }}>
          🏝️ Island Signals
        </span>
        <p style={{ color: "var(--t3)", fontSize: 12, textAlign: "center", maxWidth: 500 }}>
          Not financial advice. Educational purposes only. Past signal performance does not guarantee future results. Always conduct your own research.
        </p>
        <span style={{ color: "var(--t3)", fontSize: 12 }}>© 2025</span>
      </footer>
    </div>
  );
}
