# FBridge GitHub Pages Site

This is the public static version of the FBridge brand site.

FBridge is a weBridge vertical for ingredient supplier sourcing. It helps food and beverage teams find and check ingredient suppliers in Latin America and Africa.

Live GitHub Pages fallback: https://sergio764.github.io/fbridge/

Target custom domain: https://fbbridge.webridge.es/

Repository: https://github.com/sergio764/fbridge

## Design Direction

Use a restrained ingredient-sourcing-desk direction: cream surfaces, deep green, sage/olive accents, smaller typography, flatter sections, and less dominant imagery. Do not bring back the rejected loud green version with bright lime, oversized hero type, heavy dark cards, colorful marketplace styling, or lead-gen/outbound positioning.

## Why This Version Exists

The earlier `chatgpt.site` preview is private and asks visitors to sign in with ChatGPT. This folder is a plain static site that can be published through GitHub Pages so the page is public and does not require ChatGPT login.

Lovable chat/build/publish actions are intentionally not used for this version because the user wants to avoid Lovable credit usage. If FBridge needs to appear inside Lovable later, connect a Lovable project to GitHub first, then push these static files into the connected repository rather than asking Lovable chat to rebuild the site.

## Files

- `index.html` - one-page FBridge site.
- `styles.css` - green FBridge visual system.
- `assets/fbridge-hero.png` - hero image.
- `assets/og.png` - social preview image.
- `assets/favicon.svg` - site icon.

## Deployment

GitHub Pages serves this folder directly from the repository root.

Do not add the `CNAME` file or set the GitHub Pages custom domain until DNS for `fbbridge.webridge.es` points to GitHub. Otherwise the working GitHub Pages fallback can redirect to a subdomain that still shows the old TLS provisioning page.

The DNS zone for `webridge.es` needs this record:

- Type: `CNAME`
- Name: `fbbridge`
- Value: `sergio764.github.io`

After DNS is changed, add a `CNAME` file containing `fbbridge.webridge.es` and set the same custom domain in GitHub Pages.
