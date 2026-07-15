import nodemailer from "nodemailer";

// Email delivery. Prefers Resend (RESEND_API_KEY + EMAIL_FROM) which is built
// for bulk sending from a verified domain. Falls back to Gmail SMTP via an App
// Password (GMAIL_USER + GMAIL_APP_PASSWORD) when Resend is not configured, so
// nothing breaks while the domain is being verified.

let _transport: nodemailer.Transporter | null = null;

function gmailTransport(): nodemailer.Transporter {
  if (!_transport) {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    if (!user || !pass) throw new Error("No email provider configured: set RESEND_API_KEY or GMAIL_USER / GMAIL_APP_PASSWORD");
    _transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return _transport;
}

async function deliver(to: string, subject: string, html: string): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const from = process.env.EMAIL_FROM;
    if (!from) throw new Error("EMAIL_FROM is not set (e.g. invites@yourdomain.com)");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `The Event Planner Expo <${from}>`,
        to: [to],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Resend ${res.status}: ${body.slice(0, 300)}`);
    }
    return;
  }

  const from = process.env.GMAIL_FROM || process.env.GMAIL_USER!;
  await gmailTransport().sendMail({
    from: `The Event Planner Expo <${from}>`,
    to,
    subject,
    html,
  });
}

export async function sendInviteEmail(to: string, name: string, link: string, password: string): Promise<void> {
  await deliver(
    to,
    "Your Event Planner Expo speaker portal",
    `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>Welcome, ${name}</h2>
        <p>You have been invited to add your speaker profile for The Event Planner Expo.</p>
        <p><a href="${link}" style="background:#e11d48;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">Open your speaker portal</a></p>
        <p>Or paste this link: <br>${link}</p>
        <p>Your password: <b>${password}</b></p>
        <p>Use the same link and password any time to edit your profile. Every change is reviewed before it goes live.</p>
      </div>`
  );
}
