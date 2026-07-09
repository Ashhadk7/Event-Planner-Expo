import { Resend } from "resend";

export async function sendInviteEmail(to: string, name: string, link: string, password: string): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  await resend.emails.send({
    from: process.env.RESEND_FROM!,
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
