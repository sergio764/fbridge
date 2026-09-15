# FBridge GitHub Pages Site

This is the public static version of the FBridge brand site.

FBridge is a weBridge vertical that finds ingredient suppliers in Latin America for European food and beverage companies. The commercial model is success fee.

Live site: https://fbridge.webridge.es/

GitHub Pages repository URL: https://sergio764.github.io/fbridge/

Repository: https://github.com/sergio764/fbridge

## Design Direction

Use a restrained ingredient-sourcing-desk direction: cream surfaces, deep green, sage/olive accents, editorial typography, flatter sections, and carefully selected ingredient imagery. The opening is a full-width, typography-led dark-green hero with subtle animated cocoa-bean drawings and no photograph or monogram watermark. Do not bring back the rejected framed hero image, loud green version, bright lime, heavy dark cards, colorful marketplace styling, or lead-gen/outbound positioning.

Use the embedded Futura Std family throughout the website. Book is the default text weight, Medium is used for emphasis and interface labels, and Bold is available for strong legal text. Do not reintroduce a separate serif display face.

The official monogram is the user-supplied dark-green mark stored as `assets/fbridge-monogram.png`, with the B lowered slightly so both letterforms sit on the same optical line. Use it in the header and footer, with one low-opacity oversized version in the process section. Do not place the monogram behind the opening headline.

The first screen should say one thing clearly: FBridge finds ingredient suppliers in Latin America. Buyers only pay when they move forward with a supplier FBridge found.

The ingredient gallery uses a consistent set of original, AI-generated editorial photographs for cocoa powder, cacao nibs, green coffee, black tea, matcha and dates.

Keep the public copy short. Do not add named retailers, German-market positioning, country lists, long supplier checklists or repeated explanations of the same offer. The intended page order is the opening, ingredient gallery, one short process section, request form, compact parent-company origin section and legal footer.

The opening makes the external 15-minute Cal.com booking link the primary action and states that calls are available within 24 hours. The final contact area contains an on-page ingredient request form delivered to `fbridge@webridge.es` through FormSubmit, plus the calendar route and a visible email address for general questions. The footer identifies the operating company and links to FBridge-specific legal, privacy and website-terms pages.

## Why This Version Exists

The earlier `chatgpt.site` preview is private and asks visitors to sign in with ChatGPT. This folder is a plain static site that can be published through GitHub Pages so the page is public and does not require ChatGPT login.

Lovable chat/build/publish actions are intentionally not used for this version because the user wants to avoid Lovable credit usage. If FBridge needs to appear inside Lovable later, connect a Lovable project to GitHub first, then push these static files into the connected repository rather than asking Lovable chat to rebuild the site.

## Files

- `index.html` - one-page FBridge site.
- `styles.css` - green FBridge visual system.
- `hero-background.js` - lightweight animated cocoa-bean drawings for the opening background.
- `request-form.js` - asynchronous form submission and visible success/error states.
- `assets/fbridge-monogram.png` - optimized transparent FBridge monogram.
- `assets/fbridge-favicon.png` - monogram favicon on a warm-cream tile.
- `assets/fonts/FuturaStd-*.otf` - embedded Futura Std web fonts for Book, Medium and Bold.
- `assets/ingredient-*.jpg` - optimized ingredient gallery photographs.
- `assets/webridge-wordmark.png` - official weBridge wordmark used in the About section.
- `assets/og.png` - social preview image.
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
