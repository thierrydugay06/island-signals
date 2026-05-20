import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { to, signals } = await req.json();

    const highConfidence = signals.filter((s: any) => s.confidence >= 75);
    if (highConfidence.length === 0) {
      return NextResponse.json({ message: "No high-confidence signals to alert" });
    }

    const rows = highConfidence
      .map(
        (s: any) => `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #1a2440;font-weight:700;color:#eef2ff">${s.symbol}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #1a2440;">
            <span style="background:${s.signal === "BUY" ? "rgba(16,217,160,0.15)" : s.signal === "SELL" ? "rgba(244,63,94,0.15)" : "rgba(251,191,36,0.15)"};color:${s.signal === "BUY" ? "#10d9a0" : s.signal === "SELL" ? "#f43f5e" : "#fbbf24"};padding:4px 12px;border-radius:6px;font-weight:700;font-size:13px">${s.signal}</span>
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #1a2440;color:#8892b4">$${s.price?.toLocaleString()}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #1a2440;color:#5b8af5;font-weight:600">${s.confidence}%</td>
          <td style="padding:12px 16px;border-bottom:1px solid #1a2440;color:#8892b4;font-size:13px">${s.reasoning?.slice(0, 80)}…</td>
        </tr>`
      )
      .join("");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Island Signals <alerts@islandsignals.com>",
      to,
      subject: `🏝️ ${highConfidence.length} High-Confidence Signal${highConfidence.length > 1 ? "s" : ""} Detected`,
      html: `
        <div style="background:#080b14;color:#eef2ff;font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;padding:40px 24px">
          <div style="margin-bottom:32px">
            <div style="font-size:24px;font-weight:700;margin-bottom:4px">🏝️ Island Signals</div>
            <div style="color:#8892b4;font-size:14px">AI Crypto Education Platform</div>
          </div>

          <h1 style="font-size:28px;font-weight:700;margin-bottom:8px">High-Confidence Signals Detected</h1>
          <p style="color:#8892b4;font-size:15px;margin-bottom:32px">
            Our AI flagged ${highConfidence.length} signal${highConfidence.length > 1 ? "s" : ""} with 75%+ confidence. For educational purposes only — not financial advice.
          </p>

          <table style="width:100%;border-collapse:collapse;background:#0d1424;border-radius:12px;overflow:hidden;border:1px solid rgba(99,115,155,0.15)">
            <thead>
              <tr style="background:#131d35">
                <th style="padding:12px 16px;text-align:left;font-size:12px;color:#8892b4;letter-spacing:0.06em;font-weight:600">COIN</th>
                <th style="padding:12px 16px;text-align:left;font-size:12px;color:#8892b4;letter-spacing:0.06em;font-weight:600">SIGNAL</th>
                <th style="padding:12px 16px;text-align:left;font-size:12px;color:#8892b4;letter-spacing:0.06em;font-weight:600">PRICE</th>
                <th style="padding:12px 16px;text-align:left;font-size:12px;color:#8892b4;letter-spacing:0.06em;font-weight:600">CONFIDENCE</th>
                <th style="padding:12px 16px;text-align:left;font-size:12px;color:#8892b4;letter-spacing:0.06em;font-weight:600">AI REASONING</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <div style="margin-top:32px;text-align:center">
            <a href="${appUrl}/dashboard" style="display:inline-block;background:#5b8af5;color:#fff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px">
              View Full Dashboard →
            </a>
          </div>

          <p style="color:#3d4d70;font-size:12px;text-align:center;margin-top:32px;line-height:1.7">
            This is an educational tool. AI signals are not financial advice.<br/>
            Past signal performance does not guarantee future results.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ sent: true, count: highConfidence.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
