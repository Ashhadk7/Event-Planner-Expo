
THE EVENT PLANNER EXPO 2026 — SPEAKER PORTAL SYSTEM
 Build Brief for Mehroz

EXECUTIVE SUMMARY
Build two dynamic speaker/attendee portals for The Event Planner Expo (EPX):
2026 Speakers Hub — Authority play, fresh speakers, decision-makers (100-200 people)
Past Speakers Hub — 2025 + archive social proof, lead gen, upsell (300-500 people)
Same elegant infrastructure, different narratives. Google Sheet source of truth. Self-upload form for speakers. Admin panel for management. Mobile-first, Web Summit design aesthetic.
Goal: Authority positioning + lead generation + scalable, hands-off speaker management.

PORTAL ARCHITECTURE
Portal 1: 2026 Speakers Hub (/2026-speakers or similar)
Hero section: "Meet the 2026 Speakers, Founders & Decision Makers"
Subtext: "Discover founders, innovators, and industry leaders from companies like [TBD]. Join us in NYC, October 27-29, 2026."
Call-to-action button: "Register for the Expo"
Portal 2: Past Speakers Hub (/past-speakers or similar)
Hero section: "Our 2025 & Past Speakers"
Subtext: "Meet the speakers, ambassadors, and influencers who shaped the Expo. See who's coming this year."
Call-to-action button: "Join the Community" or "See 2026 Speakers"
Both portals share identical UI/UX structure. Data is filtered by year/status from the same Google Sheet.

CORE USER FLOWS
Public Visitor (Speaker Discovery)
Lands on portal (2026 or Past)
Sees micro card grid (5 cards across on desktop, 2-3 on mobile)
Searches by name/company (real-time filter)
Filters by speaker type (dropdown: Main Day, Fireside Chat, Founder, Influencer, Ambassador, Sponsor)
Clicks a card → modal pop-up opens with long-form card
Long card shows: photo, name, title, company, LinkedIn link, bio, expertise tags, speaker type badge
Clicks share button → menu (copy link, LinkedIn share, Twitter share)
Clicks LinkedIn button → Opens LinkedIn in new tab
Closes modal, returns to grid
Speaker (Self-Upload)
Receives unique shareable signup link from EPX (e.g., speakers.theEventPlannerExpo.com/signup?ref=mario-stewart)
Fills form: First name, Last name, Title, Company, LinkedIn URL, Upload photo, Bio (optional), Expertise (optional), Speaker Type (dropdown)
Submits → Data auto-populates into Google Sheet
Confirmation: "Thanks! Your profile will be live soon."
(Optional) Link to their profile page once approved
Admin (Mehroz / Hillary / You)
Logs into admin panel (password protected, simple auth)
Views all speakers (2026 + Past tabs)
Can:
Bulk import from Google Sheet (refresh button)
Edit individual speaker (name, title, photo, bio, etc.)
Delete speaker
Toggle visibility (draft vs live)
View backend (phone, email) for each speaker
Download speaker list as CSV
Settings: Toggle which portal is active, set hero text, etc.

FEATURES & SPECIFICATIONS
Grid View (Public)
Layout: 5 columns desktop, 3 columns tablet, 2 columns mobile
Card size: ~150x200px (portrait, compact like Web Summit)
Card content:
Headshot (photo or elegant initials placeholder)
Name (bold, black)
Title (gray, smaller)
Company (gray, smaller)
Speaker Type badge (small colored tag: "Main Day" = navy, "Fireside" = teal, "Founder" = orange, etc.)
Hover state: Slight shadow lift, cursor changes to pointer
Click behavior: Opens modal, does NOT navigate away
Modal Pop-Up (Long Card View)
Layout: Rectangle card, portrait orientation (~400px wide on desktop, full-width mobile)
Content (left-aligned or grid):
Large headshot (top or left, ~200px)
Name (large, bold black)
Title (gray)
Company (gray)
"Speaker Type" label (e.g., "Main Day Speaker" or "Founder")
Short bio paragraph (if available, max 150 words)
Expertise tags (if available, small colored pills)
LinkedIn icon + clickable link (opens in new tab)
Share button (menu)
"Back" or close button (X in corner)
Background: Slight gradient or white bg with EPX navy accent bar
Close: Click X, click outside modal, or press Esc key
Search
Real-time search by name OR company (as you type, filters grid below)
Search box at top of grid
Placeholder text: "Search speakers by name or company..."
Clear button (X) to reset
Filter
Dropdown: "All Speaker Types" → Main Day, Fireside Chat, Founder, Influencer, Ambassador, Sponsor
Default: All Types
Updates grid immediately
Mobile: Dropdown, desktop: dropdown or inline toggle (your call, I suggest dropdown for cleanliness)
Share Button
Button in long card modal
Click → reveals menu:
"Copy Link" (copies direct URL to speaker profile, e.g., "speakers.theEventPlannerExpo.com?speaker=mario-stewart")
"Share on LinkedIn" (pre-fills with speaker name, title, company + link)
"Share on Twitter" (pre-fills with speaker name + event link)
(Optional) "Email to Friend" (generates mailto link)
Icons for each option (standard social icons)
Placeholders (No Photo)
Design: Elegant centered initials on solid EPX navy background
Initials: Large, white, sans-serif (e.g., "MS" for Mario Stewart)
Font: Clean sans-serif, bold weight
Size: Matches photo size (responsive)
Subtle detail: Optional thin white border around card or very subtle gradient at bottom
Mobile: Scales smoothly
Branding Lock
Primary color: EPX navy (from your home page, exact hex code needed from you)
Accent color: EPX red/orange (from your home page CTA buttons)
Secondary text color: Medium gray
Fonts: Use system stack or Google Fonts (suggest clean sans-serif like Inter, Poppins, or Roboto)
Logo: EPX logo in top-left header of both portals, clickable back to home
Responsive: Mobile-first, all components scale fluidly

DATA SCHEMA (GOOGLE SHEET)
Sheet name: EPX_Speakers_2026_2025 (or whatever you call it)
Columns (in order):
ID (auto-generated, internal reference)
First Name (required)
Last Name (required)
Title (required, e.g., "CEO", "Founder & Designer")
Company (required)
LinkedIn URL (required, full URL, e.g., linkedin.com/in/mario-stewart)
Photo URL (optional, direct image link or Google Drive shareable link)
Bio (optional, plain text, 150-250 words)
Expertise (optional, comma-separated tags, e.g., "Event Planning, AI, Leadership")
Speaker Type (required, dropdown: Main Day, Fireside Chat, Founder, Influencer, Ambassador, Sponsor)
Year (required, dropdown: 2026, 2025, 2024, etc.)
Cell Phone (backend only, not displayed, for admin contact)
Email (backend only, not displayed, for admin contact)
Status (optional, dropdown: Draft, Live, Hidden — for admin visibility toggle)
Date Added (auto-timestamp)
Data validation:
Speaker Type, Year, Status: dropdowns
Email: email format validation
LinkedIn URL: must start with linkedin.com or https://linkedin.com

SELF-UPLOAD FORM
Flow: Public form, shareable link (e.g., /speakers/signup?ref=mario-stewart)
Form fields:
First Name (text input, required)
Last Name (text input, required)
Title (text input, required, e.g., "CEO")
Company (text input, required)
LinkedIn URL (text input, required, with basic validation)
Photo Upload (file input, accept .jpg .png, max 5MB, optional but encouraged)
Bio (textarea, optional, max 250 chars, counter)
Expertise (text input, optional, instructions: "comma-separated tags")
Speaker Type (dropdown, required: Main Day, Fireside Chat, Founder, Influencer, Ambassador, Sponsor)
Cell Phone (text input, required, for follow-up)
Email (text input, required, for confirmation)
Checkbox: "I agree to be featured on The Event Planner Expo website" (required)
Submit button: "Create My Profile"
On submit:
Validate all required fields
Upload photo to cloud storage (Google Drive or Cloudinary, TBD)
Insert row into Google Sheet
Show confirmation: "Thanks! Your profile is under review and will be live soon."
(Optional) Send confirmation email to speaker
Styling: Match EPX branding, mobile-responsive, clean form layout.

ADMIN PANEL
Access: Password-protected (simple login, you provide credentials)
Dashboard:
Overview: "Total Speakers: X | 2026: Y | 2025: Z"
Two tabs: "2026 Speakers" | "Past Speakers"
Within each tab:
Table view of all speakers (sortable by name, company, type, date added)
Columns: Photo, Name, Title, Company, Speaker Type, Year, Status, Actions
Search bar (filters table)
Filter by Speaker Type (dropdown)
Actions buttons per row:
Edit (open modal to update speaker details)
Delete (confirm, then delete)
Preview (show public card view)
View Backend (show phone, email, hidden fields)
Bulk actions:
"Refresh from Google Sheet" (pulls latest data, merges new rows)
"Export as CSV" (downloads speaker list)
"Batch Update Status" (change visibility for multiple speakers)
Settings section:
Hero text for 2026 portal (textarea)
Hero text for Past Speakers portal (textarea)
Toggle portals on/off
Logo upload
Brand color picker (optional, or just use defaults)
Auth: Simple username + password. Store as env vars or use Google sign-in (your call).

DESIGN & BRANDING SPECIFICATIONS
Color Palette:
Primary Navy: #001F3F (EPX brand, from your home page)
Accent Red/Orange: #FF4500 (EPX CTA button color)
Light Gray: #F5F5F5 (card background)
Dark Gray: #333333 (text)
Medium Gray: #999999 (secondary text)
Speaker Type Badge Colors:
Main Day: Navy (#001F3F)
Fireside Chat: Teal (#008B8B)
Founder: Orange (#FF4500)
Influencer: Purple (#9370DB)
Ambassador: Gold (#FFD700)
Sponsor: Silver (#C0C0C0)
Typography:
Headings: Bold sans-serif (Inter, Poppins, or Roboto, 24px+)
Body text: Regular sans-serif (same family, 14-16px)
Small text (company, title): 12-14px, gray
Spacing:
Card padding: 16px
Grid gap: 16px
Modal padding: 24px
Section margins: 32px top/bottom
Buttons:
Primary (CTAs like "Register"): EPX red/orange, white text, 12px padding
Secondary (Filter, Close): Navy outline, navy text
Tertiary (Links): Navy text, underline on hover
Responsive breakpoints:
Mobile: < 768px (2 columns, full-width modals)
Tablet: 768-1024px (3 columns)
Desktop: > 1024px (5 columns)

TECHNICAL NOTES
Stack:
Frontend: React (or Vue, your call) + Tailwind CSS for styling
Backend: Node.js + Express (or serverless function)
Database: Google Sheets API (read/write)
Storage: Google Drive or Cloudinary for photos
Hosting: Vercel or similar
Auth: Simple env var password OR Google OAuth (your call)
Integration Points:
Google Sheets API: Read data on page load, write on form submission
Photo storage: Direct URL stored in sheet, OR upload to Google Drive and generate shareable link
Email: Optional, send confirmation email via SendGrid/Mailgun on form submit
Deployment:
Build once, deploy to Vercel (or your preferred host)
Environment variables: Google Sheet ID, API keys, password
Domain: subdomain of theeventplannerexpo.com (e.g., speakers.theeventplannerexpo.com)
Handoff to Mehroz:
Google Sheet ID (you provide)
EPX logo file (PNG, you provide)
Exact brand colors (hex codes, you provide)
Preferred tech stack preference (React vs Vue, etc.)
Hosting preference (Vercel, Netlify, etc.)
Google Sheets API credentials (you set up or Mehroz handles)

ACCEPTANCE CRITERIA (DONE MEANS)
✅ 2026 Portal:
Displays speakers from Google Sheet (Speaker Type = Main Day, Founder, Fireside Chat, etc.; Year = 2026)
Grid renders, search works, filter works
Click card → modal opens with full details
Share button → generates shareable link + social options
Placeholder initials display for speakers with no photo
Mobile responsive, all interactions smooth
EPX branding locked (logo, colors, fonts)
✅ Past Speakers Portal:
Same as above, but Year = 2025 + earlier
Includes upsell CTA: "Join the 2026 Speakers" or "Register for the Expo"
✅ Self-Upload Form:
Public form accessible via shareable link
All form fields validate
Photo uploads to cloud storage
Data inserts into Google Sheet automatically
Confirmation message displays
Styling matches EPX branding
✅ Admin Panel:
Password login works
Table displays all speakers
Edit, delete, preview, view backend all functional
Bulk refresh from Google Sheet works
Export CSV works
Settings (hero text, branding) update portal on save
✅ Overall:
No console errors
Fast load times (< 2s on 4G)
All links work (LinkedIn, share, back buttons)
Mobile flawless (swipe, tap, scroll)
Cross-browser compatible (Chrome, Safari, Firefox, Edge)

Ready for Mehroz. Anything you want me to adjust before he starts building?
Should I save this to Notion as well, or is the chat brief enough?

