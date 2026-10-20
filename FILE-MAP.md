# Where everything lives

Use the source folders to make changes. The build combines them into `dist/`, which contains the website visitors see.

## Project root

| Path | What it is for |
| --- | --- |
| `README.md` | Main editing and publishing guide. |
| `START-HERE.html` | Visual guide that opens in a browser. |
| `FILE-MAP.md` | This folder reference. |
| `AGENTS.md` | Project conventions for another AI or developer. |
| `package.json` | Convenient build, preview and check commands. |
| `.node-version` | Node version used for Cloudflare builds. |
| `.gitignore` | Files and generated folders Git should normally leave out. |
| `content/` | Text, page settings, navigation, posts and sidequests. |
| `public/` | Images, favicon and files copied into the website. |
| `src/` | Page templates, shared components, CSS and browser JavaScript. |
| `templates/` | Starter folders to duplicate when creating new content. |
| `scripts/` | Builder, local preview server and output checks. |
| `vendor/` | Bundled Markdown parser and its licence; normally leave these files alone. |
| `docs/` | Detailed editing, publishing and photo guides. |
| `dist/` | Generated preview and deployment output; do not edit directly. |

## Content

| Path | Contains |
| --- | --- |
| `content/site.json` | Brand name, tagline, description, language, URL, location, email, copyright name and social links. |
| `content/navigation.json` | The menu's labels and URLs. |
| `content/pages/home.json` | Home page text and banner settings. |
| `content/pages/challenge.json` | Challenge page text and settings. |
| `content/pages/journal.json` | Journal introduction and banner settings. |
| `content/pages/sidequests.json` | Sidequest introduction and banner settings. |
| `content/pages/about.json` | About page settings. |
| `content/pages/about.md` | Longer About text. |
| `content/pages/contact.json` | Contact page text and banner settings. |
| `content/pages/privacy.md` | Privacy page text. |
| `content/pages/imprint.md` | Imprint page text. |
| `content/pages/credits.md` | Editable credits for the photographs actually used. |
| `content/training.json` | Optional activity log. An empty `rows` array hides its table. |
| `content/posts/POST-NAME/post.json` | One article's title, date, category, excerpt, image and publication flags. |
| `content/posts/POST-NAME/story.md` | That article's body text. |
| `content/sidequests/QUEST-NAME/quest.json` | One sidequest's title, metadata, summary, image and publication flags. |
| `content/sidequests/QUEST-NAME/story.md` | That sidequest's body text. |

`POST-NAME` and `QUEST-NAME` mean your own short folder names, such as `first-mountain-weekend`; they are not literal folders to create.

## Media

| Path | Where it appears |
| --- | --- |
| `public/images/banners/home.jpg` | Home banner. |
| `public/images/banners/challenge.jpg` | Challenge banner. |
| `public/images/banners/journal.jpg` | Journal banner. |
| `public/images/banners/sidequests.jpg` | Sidequests banner. |
| `public/images/banners/about.jpg` | About banner. |
| `public/images/banners/contact.jpg` | Contact banner. |
| `public/images/portraits/louis.jpg` | Portrait slot. |
| `public/images/posts/` | Journal card and article images. |
| `public/images/sidequests/` | Sidequest card and detail-page images. |
| `public/images/placeholders/grid.jpg` | Original grid-style placeholder reference. |
| `public/favicon.svg` | Browser-tab icon. |

For example, a file saved as `public/images/posts/my-run.jpg` is referenced in content as `/images/posts/my-run.jpg`. The `public` folder name is not part of the website URL.

## Presentation and code

| Path | Responsibility |
| --- | --- |
| `src/assets/styles.css` | Site colours, typography, layout and responsive styles. |
| `src/assets/main.js` | Navigation, search, filtering and browser interactions. |
| `src/layouts/base.html` | Overall HTML document shared by generated pages. |
| `src/components/header.html` | Shared header, navigation and interface labels. |
| `src/components/footer.html` | Shared footer. |
| `src/components/hero.html` | Shared banner/intro section. |
| `src/components/post-card.html` | Journal listing card. |
| `src/components/quest-card.html` | Sidequest listing card. |
| `src/pages/` | Templates for home, challenge, journal, sidequests, about, contact, article, quest, text and 404 pages. |
| `scripts/build.mjs` | Turns the source into the static website in `dist/`. |
| `scripts/preview.mjs` | Serves `dist/` locally for previewing. |
| `scripts/check.mjs` | Checks the already-built output. |
| `vendor/` | Bundled Markdown parser and its licence. |
| `public/_headers` | Cloudflare response-header rules. |
| `public/_redirects` | Cloudflare redirect rules. |

## Website addresses

| Page | URL path |
| --- | --- |
| Home | `/` |
| Challenge | `/challenge/` |
| Journal | `/journal/` |
| One journal article | `/journal/POST-NAME/` |
| Sidequests | `/sidequests/` |
| One sidequest | `/sidequests/QUEST-NAME/` |
| About | `/about/` |
| Contact | `/contact/` |
| Privacy | `/privacy/` |
| Imprint | `/imprint/` |
| Photo credits | `/credits/` |

The builder generates a separate `index.html` inside each page's output folder. It also creates a top-level `404.html` for missing addresses. Shared templates mean you can update the header, footer or shared interface labels once rather than editing every page. Substantive page text belongs in the matching page JSON or Markdown file.

Ordinary generated pages use relative links for offline preview. The 404 page uses root-relative assets because Cloudflare may serve it at an unknown URL depth; use the local preview server to view it. Sitemap and RSS output are generated only when `content/site.json` supplies a public URL or the build has `CF_PAGES_URL`. The included offline preview has neither.
