# Package verification

Prepared on 20 October 2026.

## Checks completed

- Built the source into 16 HTML pages with the included build script.
- Checked 392 local page/asset references and 26 image references: no missing files or broken anchors.
- Parsed the source JSON and generated HTML; checked page titles, descriptions, one main heading, navigation labels and duplicate IDs.
- Checked the syntax of the build, preview, validation and browser scripts.
- Requested all 15 ordinary pages from the local server, plus a missing page at a nested URL. Checked HTTP status codes, CSS and JPEG content types, HEAD requests, and the separation between source files and the public output.
- In a separate temporary copy, checked that drafts disappear from pages and listings, samples stay out of sitemap/RSS, confirmed stories enter sitemap/RSS, and a configured public URL creates canonical links.
- Confirmed that invalid JSON and a missing cover image cause a clear build failure.

The build was run with the available Node.js 24 runtime. The project targets Node.js 22 or later and includes `.node-version` set to `22` for Cloudflare.

## Limits of these checks

Full browser rendering and visual checks at phone/desktop sizes could not be run in this environment: a browser was unavailable and its download was blocked. The responsive CSS and menu/filter code were reviewed, but that is not a substitute for opening the final website in Safari or Chrome. Use `START-HERE.html` or the local preview instructions in the README to review it before sharing it publicly.

External stock-photo downloads were also blocked. The included image files are copies of the supplied grid placeholder, as listed in `PHOTOS.md`.

This package has not been deployed to a live Cloudflare project. The deployment settings were checked against Cloudflare's official documentation, linked in `CLOUDFLARE.md`.
