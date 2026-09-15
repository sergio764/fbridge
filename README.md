# FBridge GitHub Pages Site

This is the public static version of the FBridge brand site.

FBridge is a weBridge vertical for raw ingredient supplier sourcing. It helps European food and beverage companies find suppliers in Latin America and Africa on a success-fee basis.

Live site: https://fbridge.webridge.es/

GitHub Pages repository URL: https://sergio764.github.io/fbridge/

Repository: https://github.com/sergio764/fbridge

## Design Direction

Use a restrained ingredient-sourcing-desk direction: cream surfaces, deep green, sage/olive accents, smaller typography, flatter sections, and less dominant imagery. Do not bring back the rejected loud green version with bright lime, oversized hero type, heavy dark cards, colorful marketplace styling, or lead-gen/outbound positioning.

The first screen should be easy to understand: FBridge finds raw ingredient suppliers for European food and beverage companies, especially for ingredients such as cocoa, coffee, tea and stevia, and charges a success fee only when the buyer moves forward with a supplier FBridge found.

The ingredient gallery uses a consistent set of original, AI-generated editorial photographs for cocoa powder, cacao nibs, green coffee, black tea, matcha and stevia extract. The categories are presented as popular European ingredient searches, not as a ranked market claim. Matcha also makes the sourcing principle explicit: Latin America and Africa are the core network, but the right origin depends on the ingredient.

The final contact area offers two routes without embedding third-party scripts: an email ingredient request and an external 15-minute Cal.com booking link. The footer identifies the operating company and links to FBridge-specific legal, privacy and website-terms pages.

## Why This Version Exists

The earlier `chatgpt.site` preview is private and asks visitors to sign in with ChatGPT. This folder is a plain static site that can be published through GitHub Pages so the page is public and does not require ChatGPT login.

Lovable chat/build/publish actions are intentionally not used for this version because the user wants to avoid Lovable credit usage. If FBridge needs to appear inside Lovable later, connect a Lovable project to GitHub first, then push these static files into the connected repository rather than asking Lovable chat to rebuild the site.

## Files

- `index.html` - one-page FBridge site.
- `styles.css` - green FBridge visual system.
- `assets/fbridge-hero.png` - hero image.
- `assets/ingredient-*.jpg` - optimized ingredient gallery photographs.
- `assets/og.png` - social preview image.
- `assets/favicon.svg` - site icon.
- `legal-information.html` - company and website ownership information.
- `privacy-policy.html` - FBridge privacy and GDPR information.
- `terms-and-conditions.html` - terms governing use of the FBridge website.

## Deployment

GitHub Pages serves this folder directly from the repository root at `https://fbridge.webridge.es/`. The custom domain is configured by the tracked `CNAME` file, and GitHub Pages enforces HTTPS.

The active DNS record for `webridge.es` is:

- Type: `CNAME`
- Name: `fbridge`
- Value: `sergio764.github.io`
