"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

function AuthForm() {
  const params       = useSearchParams();
  const plan         = params.get("plan");
  const [mode, setMode]       = useState<"signin" | "signup">("signup");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError]     = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signup") {
        const { error } = await getSupabase().auth.signUp({ email, password });
        if (error) throw error;

        if (plan === "pro") {
          // Redirect to Stripe checkout after sign up
          const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          if (data.url) { window.location.href = data.url; return; }
        }

        setMessage("Check your email to confirm your account, then come back to sign in.");
      } else {
        const { error } = await getSupabase().auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/dashboard";
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <Link href="/" style={{ textDecoration: "none", marginBottom: 40 }}>
        <span style={{ fontFamily: "var(--font-playfair),Georgia,serif", fontSize: 22, fontWeight: 700, color: "var(--t1)" }}>
          🏝️ Island Signals
        </span>
      </Link>

      <div style={{ width: "100%", maxWidth: 420, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: "40px" }}>
        {plan === "pro" && (
          <div style={{ background: "rgba(91,138,245,0.1)", border: "1px solid rgba(91,138,245,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: 14, color: "var(--accent)" }}>
            ✦ Create an account to unlock Pro — you&apos;ll be taken to checkout after signup.
          </div>
        )}

        {/* Toggle */}
        <div style={{ display: "flex", gap: 4, background: "var(--elevated)", borderRadius: 10, padding: 4, marginBottom: 28 }}>
          {(["signup", "signin"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); setMessage(""); }}
              style={{
                flex: 1,
                padding: "9px",
                borderRadius: 8,
                border: "none",
                background: mode === m ? "var(--surface)" : "transparent",
                color: mode === m ? "var(--t1)" : "var(--t3)",
                fontSize: 14,
                fontWeight: mode === m ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.4)" : "none",
              }}
            >
              {m === "signup" ? "Create Account" : "Sign In"}
            </button>
          ))}
        </div>

        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, color: "var(--t2)", marginBottom: 8, fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--elevated)",
                color: "var(--t1)",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, color: "var(--t2)", marginBottom: 8, fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min. 8 characters"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--elevated)",
                color: "var(--t1)",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "var(--red)", fontSize: 13 }}>
              {error}
            </div>
          )}
          {message && (
            <div style={{ background: "rgba(16,217,160,0.1)", border: "1px solid rgba(16,217,160,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "var(--green)", fontSize: 13 }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background: loading ? "var(--elevated)" : "var(--accent)",
              color: loading ? "var(--t3)" : "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 20px rgba(91,138,245,0.3)",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Processing…" : mode === "signup" ? (plan === "pro" ? "Create Account & Upgrade →" : "Create Free Account →") : "Sign In →"}
          </button>
        </form>
      </div>

      <p style={{ marginTop: 20, color: "var(--t3)", fontSize: 13 }}>
        By creating an account you agree that this is an educational tool, not financial advice.
      </p>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
