# The Event Planner Expo — Speaker Portal

Your speaker directory now has a full self-service invite system. Instead of
manually collecting speaker details, you invite each speaker by email; they fill
in their own profile and photo through a private link, and nothing appears on the
public site until **you approve it**.

---

## Your links

| What | Link |
|---|---|
| **Public speaker site** | https://event-planner-expo-dusky.vercel.app |
| **Admin panel (you)** | https://event-planner-expo-dusky.vercel.app/login |

**Admin password:** `mario123`

*(Speakers get their own private link automatically by email — you don't need to
share anything with them manually.)*

---

## How it works — the 3 steps

### 1. You invite a speaker
- Go to the **admin panel**, log in with the password above.
- Use the **Invite** form: enter the speaker's first name, last name, and email.
- The system emails them a private link + a password automatically.

### 2. The speaker fills in their profile
- They open the link from their email and log in with the password.
- They enter their title, company, bio, expertise, LinkedIn, and upload a headshot.
- They click **Save** — it's submitted for your approval.
- They can reopen the same link anytime to make edits (each edit needs approval again).

### 3. You approve it
- Back in the admin panel, the **Pending** tab shows every speaker with changes waiting.
- Click **Approve** to publish them to the public site, or **Reject** to discard the change.
- **Until you approve, nothing shows publicly.** The public site always shows only
  what you've approved — a new speaker stays hidden until their first approval, and
  an edit to an existing speaker won't go live until you approve the new version.

---

## Good to know

- **Speakers keep the same link + password forever** — they use it to update their
  profile whenever they like. Every update comes back to you for approval.
- **The public site never breaks.** If anything is ever down, the site keeps showing
  the last approved speakers rather than erroring.
- **Emails** are sent from a Gmail account and will arrive in normal inboxes
  (ask speakers to check spam the first time, just in case).

---

## Try it yourself (2-minute test)

1. Open the admin panel and log in.
2. Invite a speaker using **your own email**.
3. Check your inbox → open the link → fill in a profile → Save.
4. Go back to the admin panel → **Pending** → **Approve**.
5. Open the public site → your test speaker now appears.

---

## A couple of notes for launch

- **Headshot uploads** need one final setting switched on (a storage token). Until
  then, speakers can still submit everything else. *(Your developer can flip this on
  in a minute.)*
- If you'd like invite emails to come **from your own domain** (e.g.
  `speakers@youreventplannerexpo.com`) instead of a Gmail address, that can be set up too.

---

*Questions or changes — just reach out.*
