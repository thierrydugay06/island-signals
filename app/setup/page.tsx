import Link from "next/link";

const STEPS = [
  {
    num: "01",
    title: "Anthropic API Key",
    required: true,
    url: "https://console.anthropic.com",
    urlLabel: "console.anthropic.com",
    env: "ANTHROPIC_API_KEY",
    instructions: [
      "Go to console.anthropic.com and create an account",
      "Navigate to API Keys → Create Key",
      "Copy the key and paste it into .env.local",
      "This powers ALL AI signals and content generation",
    ],
    cost: "~$5-10/month at typical usage",
  },
  {
    num: "02",
    title: "Supabase (Auth + Database)",
    required: true,
    url: "https://supabase.com",
    urlLabel: "supabase.com",
    env: "NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY + SUPABASE_SERVICE_ROLE_KEY",
    instructions: [
      "Go to supabase.com → New Project",
      "Settings → API → copy Project URL and anon key",
      "Also copy the service_role key for server-side operations",
      "Run this SQL in Supabase to create the users table:",
    ],
    sql: `CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`,
    cost: "Free tier: 500MB database, unlimited auth",
  },
  {
    num: "03",
    title: "Stripe (Payments)",
    required: true,
    url: "https://dashboard.stripe.com",
    urlLabel: "dashboard.stripe.com",
    env: "STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET + NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY + STRIPE_PRO_PRICE_ID",
    instructions: [
      "Create account at stripe.com",
      "Developers → API Keys → copy publishable + secret keys",
      "Products → Create Product: 'Island Signals Pro' → $29/month recurring",
      "Copy the Price ID (starts with price_...)",
      "After deploying to Vercel: Webhooks → Add endpoint → your Vercel URL + /api/webhook",
    ],
    cost: "Free to set up. 2.9% + 30¢ per transaction",
  },
  {
    num: "04",
    title: "Resend (Email Alerts)",
    required: false,
    url: "https://resend.com",
    urlLabel: "resend.com",
    env: "RESEND_API_KEY",
    instructions: [
      "Create account at resend.com",
      "API Keys → Create API Key",
      "Add and verify your sending domain (or use their test domain for dev)",
      "Update the 'from' email in app/api/alerts/route.ts",
    ],
    cost: "Free tier: 100 emails/day, 3,000/month",
  },
  {
    num: "05",
    title: "Vercel (Deployment)",
    required: true,
    url: "https://vercel.com",
    urlLabel: "vercel.com",
    env: "N/A — set all env vars in Vercel dashboard",
    instructions: [
      "Go to vercel.com → Import Git Repository",
      "Connect your GitHub account → select island-signals",
      "Add all env vars from .env.local in the Vercel dashboard",
      "Deploy — your site will be live at yourname.vercel.app",
      "Or run: vercel --prod in your terminal",
    ],
    cost: "Free tier: unlimited personal projects",
  },
  {
    num: "06",
    title: "TikTok Developer (Auto-Posting)",
    required: false,
    url: "https://developers.tiktok.com",
    urlLabel: "developers.tiktok.com",
    env: "TIKTOK_CLIENT_KEY + TIKTOK_CLIENT_SECRET + TIKTOK_ACCESS_TOKEN",
    instructions: [
      "Apply at developers.tiktok.com → Create App",
      "Request 'Content Posting API' scope (requires approval, ~1-2 weeks)",
      "Once approved: implement OAuth flow to get user access token",
      "Set TIKTOK_ACCESS_TOKEN in .env.local",
      "The /api/tiktok/post endpoint is ready to go once credentialed",
    ],
    cost: "Free API access",
  },
];

export default function SetupGuide() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--t1)" }}>
      {/* Header */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--font-playfair),Georgia,serif", fontSize: 20, fontWeight: 700, color: "var(--t1)" }}>
            🏝️ Island Signals
          </span>
        </Link>
        <Link href="/dashboard" style={{ color: "var(--accent)", fontSize: 14, textDecoration: "none" }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 48px" }}>
        <h1 style={{ fontFamily: "var(--font-playfair),Georgia,serif", fontSize: 44, fontWeight: 700, color: "var(--t1)", marginBottom: 12, lineHeight: 1.1 }}>
          Setup Guide
        </h1>
        <p style={{ color: "var(--t2)", fontSize: 16, marginBottom: 56, lineHeight: 1.7 }}>
          Complete these steps to fully activate Island Signals. Required steps must be done before launch.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {STEPS.map((step) => (
            <div
              key={step.num}
              style={{
                background: "var(--surface)",
                border: `1px solid ${step.required ? "var(--border)" : "var(--border)"}`,
                borderRadius: 16,
                padding: "28px 32px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Step number watermark */}
              <div style={{
                position: "absolute",
                right: 24,
                top: -8,
                fontFamily: "var(--font-playfair),Georgia,serif",
                fontSize: 80,
                fontWeight: 700,
                color: "var(--t3)",
                opacity: 0.07,
                lineHeight: 1,
                userSelect: "none",
              }}>
                {step.num}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--t1)", margin: 0 }}>{step.title}</h2>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  padding: "3px 10px",
                  borderRadius: 100,
                  background: step.required ? "rgba(244,63,94,0.1)" : "rgba(251,191,36,0.1)",
                  color: step.required ? "var(--red)" : "var(--yellow)",
                  border: `1px solid ${step.required ? "rgba(244,63,94,0.2)" : "rgba(251,191,36,0.2)"}`,
                }}>
                  {step.required ? "REQUIRED" : "OPTIONAL"}
                </span>
              </div>

              <div style={{ marginBottom: 16 }}>
                {step.instructions.map((line, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                    <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 13, flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
                    <span style={{ color: "var(--t2)", fontSize: 14, lineHeight: 1.6 }}>{line}</span>
                  </div>
                ))}
              </div>

              {step.sql && (
                <pre style={{
                  background: "var(--elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "14px 16px",
                  fontSize: 12,
                  color: "var(--green)",
                  overflowX: "auto",
                  marginBottom: 16,
                  fontFamily: "monospace",
                }}>
                  {step.sql}
                </pre>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--t3)", marginBottom: 4, letterSpacing: "0.04em" }}>ENV VARIABLE</div>
                  <code style={{ fontSize: 12, color: "var(--accent)", background: "var(--elevated)", padding: "4px 10px", borderRadius: 6 }}>
                    {step.env}
                  </code>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "var(--t3)" }}>💰 {step.cost}</span>
                  <a
                    href={step.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "8px 18px",
                      background: "var(--elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      color: "var(--accent)",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    {step.urlLabel} →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, background: "rgba(91,138,245,0.08)", border: "1px solid rgba(91,138,245,0.2)", borderRadius: 16, padding: "28px 32px" }}>
          <h3 style={{ color: "var(--accent)", fontWeight: 700, marginBottom: 12 }}>After completing all steps</h3>
          <p style={{ color: "var(--t2)", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            Run this in your terminal to push the final version and deploy:
          </p>
          <pre style={{ background: "var(--bg)", borderRadius: 8, padding: "14px 16px", fontSize: 13, color: "var(--green)", fontFamily: "monospace" }}>
            {`git add -A\ngit commit -m "Complete Island Signals setup"\ngit push\nvercel --prod`}
          </pre>
        </div>
      </div>
    </div>
  );
}
