import nodemailer from "nodemailer";

// Gmail SMTP via an App Password. Delivers to any address without domain
// verification. Credentials come from GMAIL_USER + GMAIL_APP_PASSWORD env vars.
// The transporter is created lazily (not at module load) so importing this
// module never requires the env vars to be present.
let _transport: nodemailer.Transporter | null = null;

function transport(): nodemailer.Transporter {
  if (!_transport) {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    if (!user || !pass) throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD are not set");
    _transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return _transport;
}

export async function sendInviteEmail(to: string, name: string, link: string, password: string): Promise<void> {
  const from = process.env.GMAIL_FROM || process.env.GMAIL_USER!;
  await transport().sendMail({
    from: `The Event Planner Expo <${from}>`,
    to,
    subject: "Your Event Planner Expo speaker portal",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>Welcome, ${name}</h2>
        <p>You have been invited to add your speaker profile for The Event Planner Expo.</p>
        <p><a href="${link}" style="background:#e11d48;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">Open your speaker portal</a></p>
        <p>Or paste this link: <br>${link}</p>
        <p>Your password: <b>${password}</b></p>
        <p>Use the same link and password any time to edit your profile. Every change is reviewed before it goes live.</p>
      </div>`,
  });
}
