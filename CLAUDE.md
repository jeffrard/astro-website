# Astro Painting Co. — website

Single-page marketing site for Astro Painting Co., a residential painting company in Minnesota.

## How it's hosted
- Everything is in `index.html` (HTML, CSS and JS in one file, no build step).
- Hosted on Netlify; live at https://astropainting.co (www redirects to the bare domain).
- This repo is linked to Netlify: anything pushed to `main` goes live automatically. Check changes before pushing.
- Domain is registered and DNS is managed at Cloudflare. Don't change DNS records unless asked.

## Brand
- Colors: Black #1A1A1A, Red #B3312C, Silver #C9CDD1, Baby Blue #A9D6E5
- Fonts: Young Serif (headings), Figtree (body), IBM Plex Mono (small labels)
- Tone: calm, confident, craftsmanship-focused. No hype.

## Business details
- Email: hello@astropainting.co
- Services: interior painting, exterior painting, cabinet refinishing
- Offer: free on-site assessment with written estimate

## Contact form
- Uses Netlify Forms (`data-netlify="true"`, form name `quote`). Submissions appear under Forms in Netlify.
- Keep the hidden `form-name` input and the `company` honeypot field if editing the form.

## Still to fill in
- Phone number
- Service area
- Instagram handle (the button currently links to instagram.com)
