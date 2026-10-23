# Astro Painting Co. — website

Marketing site for Astro Painting Co. LLC, a residential painting company based in western Wisconsin (River Falls / Hammond area). Static HTML/CSS/JS, no build step.

## Structure
- `index.html` — home page (hero, services, about, service areas, FAQ, quote form)
- `interior-painting/`, `exterior-painting/`, `cabinet-refinishing/` — one `index.html` per service page
- `css/site.css` — shared styles and color/font tokens (defined on `:root`, with dark-mode overrides)
- `js/nav.js` — header Services dropdown and mobile menu
- `images/` — logo, dark logo, mascot, favicons, OG image
- `404.html`, `robots.txt`, `sitemap.xml` — add any new page to `sitemap.xml`

## Hosting and publishing
- Hosted on Netlify; canonical URL is https://www.astropainting.co/
- Domain registered and DNS managed at Cloudflare (CNAME records, "DNS only"/gray cloud). Don't touch DNS unless asked.
- Repo is linked to Netlify, but **auto-publishing is locked**: pushes create deploys/previews, and nothing goes live until Jared clicks Publish in Netlify.
- Workflow: make changes on a branch, open one pull request per batch of changes, show what changed. Jared merges and publishes. Never push straight to `main`.
- Netlify bills credits per production deploy, so batch changes rather than making many small merges.

## Brand
- Colors: Black #1A1A1A, Red #B3312C, Silver #C9CDD1, Baby Blue #A9D6E5. Use the CSS variables in `site.css`, not hardcoded hex values.
- Fonts: Young Serif (headings), Figtree (body), IBM Plex Mono (small labels/eyebrows)
- Tone: calm, confident, craftsmanship-focused. No hype.

## Business details
- Phone: (651) 341-7483 (`tel:+16513417483`)
- Email: hello@astropainting.co
- Instagram: @astropaintingco
- Services: interior painting, exterior painting, cabinet refinishing
- Offer: free on-site assessment with written estimate
- Service area: Wisconsin towns only for now (no Minnesota cities): River Falls, Hammond, Hudson, Roberts, Baldwin, New Richmond, Somerset, Prescott, Ellsworth, Spring Valley, Woodville, Glenwood City
- Keep the `HousePainter` JSON-LD in `index.html` in sync with any change to these details.

## Quote form
- Netlify Forms: `data-netlify="true"`, form name `quote`. Submissions appear under Forms in Netlify.
- Keep the hidden `form-name` input and the `company` honeypot field when editing.
- Submitted via `fetch` in an inline script on `index.html`.

## Working with Jared
- Answer "can you / is it possible" questions without acting on them; wait to be asked before making changes.
