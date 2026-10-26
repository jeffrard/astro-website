# Astro Painting Co. — website

Marketing site for Astro Painting Co. LLC, a residential painting company serving the Twin Cities East Metro and St. Croix Valley (based in the River Falls / Hammond area). Static HTML/CSS/JS, no build step.

## Structure
- `index.html` — home page (hero, services, about, service areas, FAQ, quote form)
- `interior-painting/`, `exterior-painting/` — one `index.html` per service page
- `css/site.css` — shared styles and color/font tokens (defined on `:root`, with dark-mode overrides)
- `js/nav.js` — header Services dropdown and mobile menu
- `js/gallery.js` — photo sliders on the home page Interior and Exterior Painting cards (photos in `images/interior/` and `images/exterior/` as WebP, 16:10 crops at 600 and 1200px wide; make new crops from the original photos, not by re-encoding existing files; blur house numbers and license plates)
- `images/` — logo, dark logo, mascot, favicons, OG image
- `404.html`, `robots.txt`, `sitemap.xml` — add any new page to `sitemap.xml`
- `_redirects` — Netlify redirects (old `/cabinet-refinishing/` URLs go to the home page)
- `netlify/functions/submission-created.mjs` — sends each quote request to Go High Level (see Quote form)

## Hosting and publishing
- Hosted on Netlify; canonical URL is https://www.astropainting.co/
- Domain registered and DNS managed at Cloudflare (CNAME records, "DNS only"/gray cloud). Don't touch DNS unless asked.
- Repo is linked to Netlify, but **auto-publishing is locked**: pushes create deploys/previews, and nothing goes live until Jared clicks Publish in Netlify.
- Workflow: make changes on a branch, open one pull request per batch of changes, show what changed. Jared merges and publishes. Never push straight to `main`.
- Netlify bills credits per production deploy, so batch changes rather than making many small merges.

## Brand
- Colors: Black #1A1A1A, Red #B3312C, Silver #C9CDD1, Baby Blue #A9D6E5. Use the CSS variables in `site.css`, not hardcoded hex values.
- Font: Public Sans only (Google Fonts, weights 400/600/800), everywhere. Don't add or substitute any other font. Headings 800 with -0.025em letter-spacing; body 400; buttons, eyebrows, and small labels 600, eyebrows uppercase with 0.06em letter-spacing.
- Tone: calm, confident, craftsmanship-focused. No hype.

## Business details
- Phone: (651) 341-7483 (`tel:+16513417483`)
- Email: hello@astropainting.co
- Instagram: @astropaintingco
- Services: interior painting and exterior painting only (no cabinet refinishing)
- Offer: free on-site assessment with written estimate
- Service area, always called "Twin Cities East Metro and St. Croix Valley" (not "western Wisconsin"):
  - Wisconsin: River Falls, Hammond, Hudson, Roberts, Baldwin, New Richmond, Somerset, Prescott, Ellsworth, Spring Valley, Woodville, Glenwood City
  - Minnesota: Woodbury, Stillwater, Lake Elmo, Oakdale, Cottage Grove, Afton, Hastings, Bayport, Oak Park Heights, Mahtomedi
  - The town list appears in the home page Areas section and FAQ, each service page's town pills, and every page's `areaServed` JSON-LD; keep them all in sync.
- Keep the `HousePainter` JSON-LD in `index.html` in sync with any change to these details.

## Quote form
- Netlify Forms: `data-netlify="true"`, form name `quote`. Submissions appear under Forms in Netlify.
- Keep the hidden `form-name` input and the `company` honeypot field when editing.
- Submitted via `fetch` in an inline script on `index.html`.
- Every verified submission also goes to Go High Level (the CRM) via `netlify/functions/submission-created.mjs`, which upserts a contact (tags: `website lead` + the service) and adds the project details as a note. It uses GHL's API directly, not a GHL premium trigger, so there's no per-lead charge.
- That function needs Netlify environment variables `GHL_API_TOKEN` (a GHL Private Integration token with contact scopes) and `GHL_LOCATION_ID`. Never commit the token. If you rename or add form fields, update the function too.

## Working with Jared
- Answer "can you / is it possible" questions without acting on them; wait to be asked before making changes.
