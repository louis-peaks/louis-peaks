# Louis.Peaks — instructions for AI assistants and developers

## Purpose

Maintain a small, understandable personal website about Louis's endurance-sport journey, challenges, training experiences, setbacks, learning and outdoor activities. Preserve its responsive visual identity and the owner's ability to edit ordinary content without navigating application code.

This is a source-controlled static website for Cloudflare Pages. The source is authoritative; `dist/` is generated output. Treat the owner's explicit task and current corrections as authoritative.

## Architecture

- Node.js 22+ runs `scripts/build.mjs` to generate `dist/`.
- The Markdown parser is vendored locally under `vendor/`; preserve its licence.
- No remote build-time dependencies, database or server application are required.
- `content/site.json` holds site-wide identity, URL and contact settings.
- `content/navigation.json` holds navigation labels and URLs.
- Page-specific JSON and Markdown live in `content/pages/`.
- The visible photo-credit text is editable in `content/pages/credits.md`.
- Each journal article lives in `content/posts/SLUG/` with `post.json` and `story.md`.
- Each sidequest lives in `content/sidequests/SLUG/` with `quest.json` and `story.md`.
- `public/` is copied into the deployment output; content image paths begin with `/images/`, not `/public/`.
- Templates are in `src/layouts/`, `src/components/` and `src/pages/`.
- Shared interface labels belong in `src/components/`; substantive page text belongs in the matching content JSON or Markdown file.
- Presentation is in `src/assets/styles.css`; browser behaviour is in `src/assets/main.js`.
- `templates/new-post/` and `templates/new-sidequest/` are starter content folders, not published content collections.

## Contracts to preserve

1. Edit source files and rebuild. Do not hand-edit `dist/` as the lasting fix.
2. Keep ordinary content separate from templates, CSS and browser code.
3. Preserve template tokens, shared component contracts and data shapes unless deliberately updating the builder and all affected callers together.
4. Keep content folder names stable for already-published URLs. When renaming a public route, add a specific redirect in `public/_redirects`.
5. Preserve relative links in ordinary generated HTML so the bundled `dist/index.html` can be opened offline. The 404 page intentionally uses root-relative assets because Cloudflare can serve it from unknown URL depths; preview it through the local server. Hosted clean URLs must also continue to work.
6. Preserve the generated top-level `404.html`; this is a multipage site, not a client-side routing shell.
7. Keep `public/_headers` and `public/_redirects` in the output root. Do not add a blanket SPA rewrite.
8. Do not add a browser-local editor or use `localStorage` as if it publishes website content. Publishing means committing source changes and rebuilding.
9. Escape ordinary data inserted into HTML. Markdown is author-controlled repository content; do not expand this into an arbitrary public HTML submission surface without appropriate handling.
10. Keep navigation, search and filters usable on small screens and with keyboard input. Preserve semantic headings, accessible labels, visible focus and useful image descriptions.

## Content conventions

Use lower-case, hyphenated folder names. A journal folder `content/posts/example/` maps to `/journal/example/`; a sidequest folder maps to `/sidequests/example/`.

Journal metadata fields are `title`, `date`, `category`, `excerpt`, `image`, `imageAlt`, `draft` and `sample`. Sidequest metadata fields are `title`, `meta`, `summary`, `image`, `imageAlt`, `draft` and `sample`.

`draft: true` excludes an item from the generated website. `sample: true` still publishes it visibly with a sample label and `noindex`, but excludes it from the sitemap and RSS feed. The `date` is a content field, not a scheduling mechanism. Do not silently change future-dated content into scheduled publication unless explicitly implementing that feature. Keep sample content labelled until the owner replaces or confirms it. When converting a sample to real content, remove sample-explanation paragraphs in `story.md` as well as changing the flag. Do not invent the owner's achievements, event registration, dates, results, qualifications or links.

The builder validates required content fields. Preserve those values rather than leaving required titles or descriptions blank. Optional site email/URL values may remain empty; incomplete articles should stay drafts.

`content/training.json` is an optional display log with `label`, `updated` and `rows`. Rows use `date`, `activity`, `duration` and `note`; an empty row list hides the table. Do not turn sample display entries into a prescribed training plan.

The supplied local photos are cream-grid placeholders copied from the owner's reference image. Selected stock sources are documented in `docs/PHOTOS.md`, but those binary stock photos were not included. Do not describe the placeholders as actual stock photography or represent a stock model as Louis.

## Commands

Run commands from the repository root:

```bash
node scripts/build.mjs
node scripts/check.mjs
node scripts/preview.mjs
```

Package aliases are `npm run build`, `npm run check` and `npm run preview`. The check command inspects already-generated output, so build first. The preview server defaults to `http://127.0.0.1:8080`; `--port 8081` changes the port. It serves output rather than watching source files for changes.

For substantive changes, verify the affected pages and interactions at desktop and mobile widths, inspect build errors, and ensure referenced local assets exist. Use verification proportionate to the change. Do not install an unrelated framework or expand the toolchain for a routine content edit.

## Deployment

Cloudflare Pages configuration: framework **None**, build command `node scripts/build.mjs`, output directory `dist`, root directory blank, production branch `main`. The included `.node-version` selects Node 22.

The ZIP carries a prebuilt preview, but `.gitignore` excludes `dist/` from normal Git commits. Cloudflare generates output from the committed source. Maintain README instructions when changing paths, build commands, content structures or runtime requirements.

Use the configured site URL when present, with `CF_PAGES_URL` available as the Cloudflare fallback. Canonical links, sitemap and RSS output require a public URL. The included offline preview intentionally omits these because it was built without one; a Pages URL is sufficient and a purchased domain is not required.

No backend, login, CMS, form delivery service or analytics is enabled by default. Add integrations only when part of the owner's task, with real configured links and accurate visible behaviour. Preserve migration-friendly static output and avoid introducing unnecessary recurring services.
