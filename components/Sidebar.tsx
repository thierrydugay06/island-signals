"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const icons = {
  grid:    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  zap:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  video:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  star:    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  mail:    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  wrench:  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
};

const NAV = [
  { href: "/dashboard", icon: icons.zap,    label: "Live Signals"    },
  { href: "/content",   icon: icons.video,  label: "Content Studio"  },
  { href: "/dashboard", icon: icons.star,   label: "Watchlist"       },
  { href: "/dashboard", icon: icons.mail,   label: "Alerts"          },
  { href: "/setup",     icon: icons.wrench, label: "Setup Guide"     },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside style={{
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
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 36, padding: "0 8px" }}>
        <span style={{ fontSize: 20 }}>🏝️</span>
        <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 16, fontWeight: 700, color: "var(--t1)" }}>
          Island Signals
        </span>
      </Link>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {NAV.map((item) => {
          const active = path === item.href && item.href !== "/dashboard" || (path === item.href);
          const isActive = path.startsWith(item.href) && item.href !== "/dashboard"
            ? true
            : path === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                marginBottom: 4,
                textDecoration: "none",
                background: isActive ? "var(--accent-dim)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--t3)",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                border: isActive ? "1px solid rgba(91,138,245,0.2)" : "1px solid transparent",
                transition: "all 0.15s",
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade card */}
      <div style={{
        background: "linear-gradient(135deg, rgba(91,138,245,0.15), rgba(124,58,237,0.15))",
        border: "1px solid rgba(91,138,245,0.25)",
        borderRadius: 14,
        padding: "20px",
        marginTop: 16,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.08em", marginBottom: 8 }}>
          PRO SIGNALS
        </div>
        <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.5, marginBottom: 14 }}>
          Unlock real-time signals, email alerts & content automation.
        </p>
        <Link
          href="/auth?plan=pro"
          style={{
            display: "block",
            textAlign: "center",
            padding: "9px",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(91,138,245,0.3)",
          }}
        >
          Upgrade to Pro
        </Link>
      </div>
    </aside>
  );
}
