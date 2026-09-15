# FBridge GitHub Pages Site

This is the public static version of the FBridge brand site.

FBridge is a weBridge vertical for raw ingredient supplier sourcing. It helps European food and beverage companies find suppliers in Latin America and Africa on a success-fee basis.

Live site: https://fbridge.webridge.es/

GitHub Pages repository URL: https://sergio764.github.io/fbridge/

Repository: https://github.com/sergio764/fbridge

## Design Direction

Use a restrained ingredient-sourcing-desk direction: cream surfaces, deep green, sage/olive accents, editorial typography, flatter sections, and carefully selected ingredient imagery. The opening is a full-width, typography-led dark-green hero with subtle animated route linework and no photograph. Do not bring back the rejected framed hero image, loud green version, bright lime, heavy dark cards, colorful marketplace styling, or lead-gen/outbound positioning.

The first screen should be easy to understand: FBridge finds raw ingredient suppliers for European food and beverage companies, especially for ingredients such as cocoa, coffee, tea and stevia, and charges a success fee only when the buyer moves forward with a supplier FBridge found.

The ingredient gallery uses a consistent set of original, AI-generated editorial photographs for cocoa powder, cacao nibs, green coffee, black tea, matcha and stevia extract. The categories are presented as popular European ingredient searches, not as a ranked market claim. Matcha also makes the sourcing principle explicit: Latin America and Africa are the core network, but the right origin depends on the ingredient.

The opening makes the external 15-minute Cal.com booking link the primary action and states that calls are available within 24 hours. The final contact area contains an on-page ingredient request form delivered to `fbridge@webridge.es` through FormSubmit, plus the calendar route and a visible email address for general questions. The footer identifies the operating company and links to FBridge-specific legal, privacy and website-terms pages.

## Why This Version Exists

The earlier `chatgpt.site` preview is private and asks visitors to sign in with ChatGPT. This folder is a plain static site that can be published through GitHub Pages so the page is public and does not require ChatGPT login.

Lovable chat/build/publish actions are intentionally not used for this version because the user wants to avoid Lovable credit usage. If FBridge needs to appear inside Lovable later, connect a Lovable project to GitHub first, then push these static files into the connected repository rather than asking Lovable chat to rebuild the site.

## Files

- `index.html` - one-page FBridge site.
- `styles.css` - green FBridge visual system.
- `hero-background.js` - lightweight animated linework for the opening background.
- `request-form.js` - asynchronous form submission and visible success/error states.
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

## Form Delivery

The form posts to FormSubmit's AJAX endpoint for `fbridge@webridge.es`. The first submission to a new recipient address triggers FormSubmit's one-time activation email. Delivery becomes active after the link in that email is confirmed. The form uses native validation, a honeypot field, privacy consent and in-page submission feedback.
