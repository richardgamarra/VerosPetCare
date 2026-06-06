# Vero's Pet Care — Deployment Guide
**Target:** `verospetcare.infoplay.com` · OVH server · Plesk control panel

---

## Step 1 — Complete all [REPLACE] placeholders

Search every file for `[REPLACE` and fill in the real values before uploading.
Run this in PowerShell from the project folder to get a quick list:

```powershell
Select-String -Path *.html,*.xml,*.txt,main.js -Pattern "\[REPLACE" | Select-Object Filename,LineNumber,Line
```

### Required replacements — site won't work without these

| Placeholder | File(s) | What to put |
|---|---|---|
| `[REPLACE: your Formspree form ID]` | book.html | The ID from formspree.io (e.g. `xpzgkqbn`) |
| `[REPLACE: G-XXXXXXXXXX]` | main.js | Your GA4 Measurement ID |
| `[REPLACE: your@email.com]` | privacy.html, terms.html | Vero's contact email |
| `[REPLACE: (703) 000-0000]` | privacy.html, terms.html | Vero's phone number |
| `[REPLACE: phone]` (wa.me links) | All pages (footer WhatsApp) | Phone digits only, e.g. `17035551234` |
| `[REPLACE: handle]` (Instagram) | All pages (footer) | Instagram username without @ |
| `[REPLACE: venmo-handle]` | terms.html, book.html | Venmo @handle |
| `[REPLACE: Last Name]` | privacy.html, terms.html | Vero's last name |
| Google Maps embed | index.html | Replace iframe src with your actual embed URL |

### Optional replacements (cosmetic)

| Placeholder | Where |
|---|---|
| `[REPLACE: street]` / city / zip | JSON-LD in index.html |
| `[REPLACE: price]` | services.html pricing table |
| `[REPLACE: Client Name]` etc. | testimonials.html — swap placeholder testimonials for real ones |
| `[REPLACE: date]` | privacy.html / terms.html last-updated date |
| Calendly embed | book.html sidebar — replace `[REPLACE: calendly URL]` |

---

## Step 2 — Add your photos

Place images into the `img/` folder. Naming convention used in the HTML:

| File name | Used on |
|---|---|
| `hero-dog.jpg` | index.html hero background |
| `vero-about.jpg` | about.html hero |
| `gallery-1.jpg` … `gallery-6.jpg` | index.html gallery teaser |
| `gallery-bath-1.jpg` … | gallery.html — match category: bath / walking / portraits / birthdays |
| `profile-max.jpg`, `profile-luna.jpg`, `profile-rocky.jpg`, `profile-bella.jpg` | gallery.html dog profiles |
| `og-image.jpg` (1200×630 px) | Open Graph share preview — all pages |

All `<img>` tags have `onerror` fallback emoji placeholders, so the site works even without real photos.

**Recommended image sizes:**
- Hero images: 1600×900 px, JPEG, compressed to under 200 KB
- Gallery thumbnails: 600×600 px, JPEG, under 80 KB each
- Dog profiles: 400×400 px
- og-image.jpg: 1200×630 px

> **Before go-live — og-image.jpg:** The repo includes `img/og-image.svg` as a
> placeholder so the `img/` folder is not empty during development. Social
> platforms (Facebook, Twitter/X, WhatsApp, iMessage) require a real **JPEG**
> at `img/og-image.jpg` (1200×630 px, under 300 KB) — they do not render SVGs
> for Open Graph previews. Replace or convert the SVG before deploying, then
> validate the card at [opengraph.xyz](https://www.opengraph.xyz) and
> [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug).

---

## Step 3 — Set up Formspree

1. Go to [formspree.io](https://formspree.io) → Create a free account
2. Create a new form → copy the Form ID (e.g. `xpzgkqbn`)
3. In `book.html`, replace `[REPLACE: your Formspree form ID]` with your ID
4. In Formspree dashboard: set the redirect URL to `https://verospetcare.infoplay.com/thank-you` (or remove it to stay on the same page with a success message)
5. Optionally create a `thank-you.html` page

---

## Step 4 — Set up Google Analytics 4

1. Go to [analytics.google.com](https://analytics.google.com) → Admin → Create Property
2. Set up a Web data stream for `verospetcare.infoplay.com`
3. Copy the Measurement ID (format: `G-XXXXXXXXXX`)
4. In `main.js`, replace both occurrences of `[REPLACE: G-XXXXXXXXXX]` with your ID
5. Analytics will only fire after the visitor accepts the cookie banner

---

## Step 5 — Deploy to OVH / Plesk

### Option A — File Manager (easiest)

1. Log in to your Plesk control panel
2. Go to **Files** for the `verospetcare.infoplay.com` subdomain (or create it under Domains → Add Domain if it doesn't exist yet)
3. Navigate to `httpdocs/` (the webroot for that subdomain)
4. Upload all files from `C:\Users\richardgamarra\projects\petcare\`:
   - Upload all `.html` files to the root (`httpdocs/`)
   - Upload `style.css`, `main.js`, `sitemap.xml`, `robots.txt` to root
   - Upload the `img/` folder (with all your images inside) to root
5. Verify file permissions — all files should be `644`, directories `755`

### Option B — FTP / SFTP

Use FileZilla or WinSCP:

| Setting | Value |
|---|---|
| Host | Your OVH server IP or hostname |
| Protocol | SFTP (recommended) or FTP |
| Port | 22 (SFTP) or 21 (FTP) |
| Username | Plesk FTP user for the subdomain |
| Password | As set in Plesk |
| Remote path | `/var/www/vhosts/verospetcare.infoplay.com/httpdocs/` (typical OVH path) |

Upload all files from the local project folder to the remote root.

### Option C — Git (if OVH supports it)

```bash
git init
git add .
git commit -m "Initial deploy: Vero's Pet Care website"
git remote add origin ssh://user@server/path/to/repo.git
git push origin main
```

---

## Step 6 — Configure the subdomain in Plesk (if not already done)

1. Plesk → **Domains** → **Add Subdomain**
2. Subdomain name: `verospetcare`
3. Parent domain: `infoplay.com`
4. Document root: `/httpdocs` (default is fine)
5. Enable **SSL/TLS** with Let's Encrypt (free) — Plesk makes this one click

---

## Step 7 — Post-deployment checks

Open each URL and verify:

- [ ] https://verospetcare.infoplay.com/ loads correctly
- [ ] https://verospetcare.infoplay.com/services.html
- [ ] https://verospetcare.infoplay.com/gallery.html — filter buttons work
- [ ] https://verospetcare.infoplay.com/book.html — form validates and submits to Formspree
- [ ] https://verospetcare.infoplay.com/faq.html — accordion opens/closes
- [ ] https://verospetcare.infoplay.com/about.html
- [ ] https://verospetcare.infoplay.com/testimonials.html
- [ ] https://verospetcare.infoplay.com/privacy.html
- [ ] https://verospetcare.infoplay.com/terms.html
- [ ] https://verospetcare.infoplay.com/sitemap.xml
- [ ] https://verospetcare.infoplay.com/robots.txt
- [ ] Mobile nav hamburger toggles correctly on phone
- [ ] Language toggle switches EN ↔ ES on every page
- [ ] Cookie banner appears on first visit; Accept fires analytics; Decline hides it
- [ ] WhatsApp float button appears and opens WhatsApp chat
- [ ] All internal page links work

---

## Step 8 — Submit to Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → URL prefix → `https://verospetcare.infoplay.com`
3. Verify ownership via HTML file or DNS TXT record
4. Sitemaps → Add sitemap → `sitemap.xml`
5. Request indexing on the home page

---

## Step 9 — Legal review reminder

Before going live, send `privacy.html` and `terms.html` to a legal professional for review.
Both files contain the comment `<!-- TEMPLATE — have a legal professional review before publishing -->`.
Key items to confirm:
- Virginia VCDPA compliance
- Liability waiver language for Virginia pet care
- Photo/social media consent clause (Section 8 of terms.html has a placeholder)
- Emergency vet authorization wording

---

## File summary

| File | Size | Purpose |
|---|---|---|
| index.html | 37 KB | Home page |
| services.html | 26 KB | Services + pricing |
| gallery.html | 20 KB | Photo gallery + dog profiles |
| about.html | 19 KB | About Vero |
| book.html | 23 KB | Booking form |
| faq.html | 28 KB | FAQ accordion |
| testimonials.html | 15 KB | Reviews |
| privacy.html | 31 KB | Privacy Policy |
| terms.html | 34 KB | Terms of Service |
| style.css | 29 KB | Shared stylesheet |
| main.js | 7 KB | Shared JavaScript |
| sitemap.xml | 2 KB | Search engine sitemap |
| robots.txt | < 1 KB | Crawler rules |
| img/ | — | Image folder (populate before deploy) |

**Total: 13 files + 1 folder · ~271 KB (HTML+CSS+JS, before images)**
