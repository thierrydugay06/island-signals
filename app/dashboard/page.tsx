"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Signal = {
  symbol: string;
  price: number;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  keyMetric: string;
  change24h: string;
  change7d: string;
  high24h: number;
  low24h: number;
  volume24h: number;
  image?: string;
};

const SIG = {
  BUY:  { bg: "rgba(16,217,160,0.08)",  border: "rgba(16,217,160,0.25)",  text: "#10d9a0",  label: "BUY"  },
  SELL: { bg: "rgba(244,63,94,0.08)",   border: "rgba(244,63,94,0.25)",   text: "#f43f5e",  label: "SELL" },
  HOLD: { bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.25)",  text: "#fbbf24",  label: "HOLD" },
};

function fmt(v: number) {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`;
  return `$${v.toLocaleString()}`;
}

function ConfidenceRing({ value, signal }: { value: number; signal: "BUY" | "SELL" | "HOLD" }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  const color = SIG[signal].text;
  return (
    <div style={{ position: "relative", width: 54, height: 54, flexShrink: 0 }}>
      <svg width="54" height="54" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="27" cy="27" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle
          cx="27" cy="27" r={r} fill="none"
          stroke={color} strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color,
        }}
      >
        {value}%
      </div>
    </div>
  );
}

// Inline SVG icons (no external dep for nav)
const icons = {
  grid:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  zap:      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  star:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  book:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  settings: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  refresh:  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
};

const NAV_ITEMS = [
  { icon: icons.grid,     label: "Overview",   active: false },
  { icon: icons.zap,      label: "Signals",    active: true  },
  { icon: icons.star,     label: "Watchlist",  active: false },
  { icon: icons.book,     label: "Learn",      active: false },
  { icon: icons.settings, label: "Settings",   active: false },
];

function SignalCard({ s }: { s: Signal }) {
  const style = SIG[s.signal];
  const change24 = parseFloat(s.change24h);
  const change7  = parseFloat(s.change7d);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1px solid var(--border)`,
        borderRadius: 16,
        padding: "22px",
        transition: "border-color 0.2s, transform 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = style.border;
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {s.image && <img src={s.image} alt={s.symbol} style={{ width: 32, height: 32, borderRadius: "50%" }} />}
          <div>
            <div style={{ color: "var(--t1)", fontWeight: 700, fontSize: 16 }}>{s.symbol}</div>
            <div style={{ color: "var(--t3)", fontSize: 12 }}>
              ${s.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
        <ConfidenceRing value={s.confidence} signal={s.signal} />
      </div>

      {/* Signal badge */}
      <div style={{ marginBottom: 14 }}>
        <span
          style={{
            display: "inline-block",
            background: style.bg,
            color: style.text,
            border: `1px solid ${style.border}`,
            padding: "5px 14px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.08em",
          }}
        >
          {style.label}
        </span>
      </div>

      {/* Key metric */}
      <div
        style={{
          background: "var(--elevated)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "8px 12px",
          marginBottom: 12,
          fontSize: 12,
          color: "var(--t2)",
        }}
      >
        🔑 {s.keyMetric}
      </div>

      {/* Reasoning */}
      <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.7, marginBottom: 16 }}>
        {s.reasoning}
      </p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        {[
          { label: "24h",    val: `${change24 >= 0 ? "+" : ""}${s.change24h}%`, up: change24 >= 0 },
          { label: "7d",     val: `${change7  >= 0 ? "+" : ""}${s.change7d}%`,  up: change7  >= 0 },
          { label: "Volume", val: fmt(s.volume24h), up: true },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--elevated)",
              borderRadius: 8,
              padding: "8px",
              textAlign: "center",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ color: "var(--t3)", fontSize: 10, marginBottom: 3, letterSpacing: "0.04em" }}>
              {stat.label}
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: stat.label === "Volume" ? "var(--t2)" : stat.up ? "var(--green)" : "var(--red)",
              }}
            >
              {stat.val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type FilterType = "ALL" | "BUY" | "SELL" | "HOLD";

export default function Dashboard() {
  const [signals, setSignals]       = useState<Signal[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [updated, setUpdated]       = useState<Date | null>(null);
  const [filter, setFilter]         = useState<FilterType>("ALL");

  const fetchSignals = useCallback(async () => {
    try {
      setError("");
      const res = await fetch("/api/signals");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSignals(data.signals);
      setUpdated(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignals();
    const t = setInterval(fetchSignals, 90_000);
    return () => clearInterval(t);
  }, [fetchSignals]);

  const counts = {
    BUY:  signals.filter((s) => s.signal === "BUY").length,
    SELL: signals.filter((s) => s.signal === "SELL").length,
    HOLD: signals.filter((s) => s.signal === "HOLD").length,
  };
  const avgConf = signals.length
    ? Math.round(signals.reduce((a, s) => a + s.confidence, 0) / signals.length)
    : 0;

  const displayed = filter === "ALL" ? signals : signals.filter((s) => s.signal === filter);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--t1)",
      }}
    >
      {/* ── Sidebar ──────────────────────────────── */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "auto",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            marginBottom: 36,
            padding: "0 8px",
          }}
        >
          <span style={{ fontSize: 20 }}>🏝️</span>
          <span
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--t1)",
            }}
          >
            Island Signals
          </span>
        </Link>

        {/* Nav items */}
        <nav style={{ flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                marginBottom: 4,
                cursor: "pointer",
                background: item.active ? "var(--accent-dim)" : "transparent",
                color: item.active ? "var(--accent)" : "var(--t3)",
                fontSize: 14,
                fontWeight: item.active ? 600 : 400,
                border: item.active ? "1px solid rgba(91,138,245,0.2)" : "1px solid transparent",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  (e.currentTarget as HTMLDivElement).style.color = "var(--t1)";
                  (e.currentTarget as HTMLDivElement).style.background = "var(--elevated)";
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  (e.currentTarget as HTMLDivElement).style.color = "var(--t3)";
                  (e.currentTarget as HTMLDivElement).style.background = "transparent";
                }
              }}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </nav>

        {/* Upgrade card — inspired by image 4 */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(91,138,245,0.15), rgba(124,58,237,0.15))",
            border: "1px solid rgba(91,138,245,0.25)",
            borderRadius: 14,
            padding: "20px",
            marginTop: 16,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.08em", marginBottom: 8 }}>
            PRO SIGNALS
          </div>
          <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.5, marginBottom: 14 }}>
            Unlock real-time signals & deep AI analysis.
          </p>
          <button
            style={{
              width: "100%",
              padding: "9px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(91,138,245,0.3)",
            }}
          >
            Upgrade to Pro
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────── */}
      <main style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: 28,
                fontWeight: 700,
                color: "var(--t1)",
                marginBottom: 4,
              }}
            >
              Live AI Signals
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 6px var(--green)", display: "inline-block" }} />
              <span style={{ color: "var(--t2)", fontSize: 13 }}>
                {updated ? `Updated ${updated.toLocaleTimeString()}` : "Loading…"}
              </span>
            </div>
          </div>

          <button
            onClick={fetchSignals}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              color: "var(--t2)",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--t1)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--t2)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
            }}
          >
            {icons.refresh}
            Refresh
          </button>
        </div>

        {/* Summary row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "BUY Signals",    val: loading ? "—" : String(counts.BUY),  color: "var(--green)",  sub: "Strong momentum"      },
            { label: "HOLD Signals",   val: loading ? "—" : String(counts.HOLD), color: "var(--yellow)", sub: "Wait for clarity"     },
            { label: "SELL Signals",   val: loading ? "—" : String(counts.SELL), color: "var(--red)",    sub: "Bearish pressure"     },
            { label: "Avg Confidence", val: loading ? "—" : `${avgConf}%`,       color: "var(--accent)", sub: "Across all signals"   },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "20px 22px",
              }}
            >
              <div style={{ fontSize: 11, color: "var(--t3)", letterSpacing: "0.06em", marginBottom: 8, fontWeight: 600 }}>
                {stat.label.toUpperCase()}
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: stat.color, lineHeight: 1, marginBottom: 4 }}>
                {stat.val}
              </div>
              <div style={{ fontSize: 12, color: "var(--t3)" }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["ALL", "BUY", "SELL", "HOLD"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "7px 18px",
                borderRadius: 8,
                border: "1px solid",
                borderColor: filter === f
                  ? (f === "BUY" ? "rgba(16,217,160,0.4)" : f === "SELL" ? "rgba(244,63,94,0.4)" : f === "HOLD" ? "rgba(251,191,36,0.4)" : "rgba(91,138,245,0.4)")
                  : "var(--border)",
                background: filter === f
                  ? (f === "BUY" ? "rgba(16,217,160,0.08)" : f === "SELL" ? "rgba(244,63,94,0.08)" : f === "HOLD" ? "rgba(251,191,36,0.08)" : "rgba(91,138,245,0.08)")
                  : "transparent",
                color: filter === f
                  ? (f === "BUY" ? "var(--green)" : f === "SELL" ? "var(--red)" : f === "HOLD" ? "var(--yellow)" : "var(--accent)")
                  : "var(--t3)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
                letterSpacing: "0.04em",
              }}
            >
              {f}{f !== "ALL" && !loading && ` · ${counts[f]}`}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(244,63,94,0.08)",
              border: "1px solid rgba(244,63,94,0.25)",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 24,
              color: "var(--red)",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  height: 300,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        )}

        {/* Signal grid */}
        {!loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {displayed.map((s) => (
              <SignalCard key={s.symbol} s={s} />
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <p style={{ fontSize: 11, color: "var(--t3)", textAlign: "center", marginTop: 48, lineHeight: 1.7 }}>
          Island Signals is an educational tool. AI signals are generated from publicly available market data.
          Past performance does not guarantee future results. Always conduct your own research before investing.
        </p>
      </main>
    </div>
  );
}
