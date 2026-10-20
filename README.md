# Louis.Peaks — website & editing guide

A complete, portable personal website for Louis.Peaks: endurance sport, mountains, challenges and honest stories from the journey.

**Start here:** unzip this package, then open `START-HERE.html` for a visual guide or `dist/index.html` to look around the included website preview. To publish through GitHub and Cloudflare Pages, upload the **source files and folders inside `louis-peaks-website` to the root of your GitHub repository**. Upload the extracted contents, not the ZIP itself. The prebuilt `dist` folder is for previewing; Cloudflare rebuilds it from your source files.

## 1. What is included?

- Separate pages for Home, The Challenge, Journal, Sidequests, About and Contact.
- Individual URLs for journal articles and sidequests.
- Mobile navigation, journal search and category filters.
- Editable text and settings in `content/`, separated from the page templates and styling.
- Labelled image slots for banners, article pictures, sidequests and a portrait.
- Reusable templates for adding a post or sidequest.
- A build script, local preview server, output checks and Cloudflare configuration.
- Privacy, imprint, photo-credit and missing-page pages.

**About the pictures:** the bundled image slots contain copies of your supplied cream-grid image with the black frame. Downloading external stock-photo files was blocked while preparing this package. The site therefore includes working local placeholders, plus selected replacement photo links and credits in [docs/PHOTOS.md](docs/PHOTOS.md). It does not contain the suggested stock-photo files. Replace the placeholders with your photos or downloaded stock photos whenever you are ready.

The included stories are labelled sample content. `sample: true` still publishes the page visibly, adds a search-engine `noindex` instruction and leaves it out of the sitemap and RSS feed. Only `draft: true` hides an item from the generated site. Check your personal text, challenge details, dates and links before sharing the site as your finished website.

## 2. Where do I put what?

| You want to change… | Edit or add this | What to do |
| --- | --- | --- |
| Site name, description, email, social links | `content/site.json` | Edit the values between quotation marks. |
| Navigation links and labels | `content/navigation.json` | Edit the list of labels and URLs. |
| Homepage headings and text | `content/pages/home.json` | Edit the page content. |
| Challenge page | `content/pages/challenge.json` | Edit the story, labels and any confirmed event details. |
| Journal introduction | `content/pages/journal.json` | Edit the heading and description. |
| Sidequests introduction | `content/pages/sidequests.json` | Edit the heading and description. |
| About page | `content/pages/about.json` and `content/pages/about.md` | JSON contains the page settings; Markdown contains the longer text. |
| Contact page | `content/pages/contact.json` and `content/site.json` | Edit the introduction and your real contact details. |
| Banner images | `public/images/banners/` | Replace `home.jpg`, `challenge.jpg`, `journal.jpg`, `sidequests.jpg`, `about.jpg` or `contact.jpg`. |
| Your portrait | `public/images/portraits/louis.jpg` | Replace it with a picture of you; update its description where used. |
| Journal post details | `content/posts/your-post/post.json` | Set title, date, category, summary, image and publication flags. |
| Journal post text | `content/posts/your-post/story.md` | Write the article in Markdown. |
| Journal pictures | `public/images/posts/` | Add images here, then reference them in the post. |
| Sidequest details and text | `content/sidequests/your-quest/quest.json` and `story.md` | Use one folder per sidequest. |
| Sidequest pictures | `public/images/sidequests/` | Add the image and reference it in `quest.json`. |
| Optional activity log | `content/training.json` | Add rows only when you have entries to share. |
| Privacy and imprint text | `content/pages/privacy.md` and `imprint.md` | Replace the starter text with your actual details and setup. |
| Photo-credit text | `content/pages/credits.md` | Record the photos you actually use and their credits. |
| Colours, fonts, spacing and layout | `src/assets/styles.css` | Edit the CSS; colours are grouped near the top. |
| Interactive behaviour | `src/assets/main.js` | Mobile menu, search and filter behaviour. |
| Shared header, footer and cards | `src/components/` | These are reused across the site. |
| Shared interface labels | `src/components/` | Edit labels used across pages; main page text belongs in its matching JSON file. |
| Page layouts | `src/pages/` and `src/layouts/base.html` | Usually leave these alone when changing content. |
| Browser-tab icon | `public/favicon.svg` | Replace or edit the favicon. |

See [FILE-MAP.md](FILE-MAP.md) for the full folder guide and [docs/EDITING.md](docs/EDITING.md) for practical examples.

## 3. Publish with GitHub and Cloudflare Pages

GitHub stores the editable project and its history. Cloudflare Pages builds those files into the website and serves it to visitors. You do not need to enable GitHub Pages.

### Put the project on GitHub

1. Create a GitHub repository named, for example, `louis-peaks`.
2. Open **Add file → Upload files**. In a new empty repository, use its upload-files link.
3. Upload the extracted project contents, **excluding `dist/`**. Keep all the source folders and files. The repository should show `README.md`, `package.json`, `content/`, `public/`, `scripts/`, `src/`, `templates/` and `vendor/` at its top level.
4. Commit the upload to the `main` branch.

Do not put an extra `louis-peaks-website/` folder around everything inside the repository. GitHub's browser upload accepts up to 100 files at a time; use several uploads if needed. A computer is usually easiest for the first folder upload. On an iPad, folder selection and dragging can vary by browser; GitHub Desktop is a computer alternative.

### Connect Cloudflare

In Cloudflare, go to **Workers & Pages → Create application → Pages → Connect to Git**. Choose GitHub, authorize access to the repository and select it.

Use these settings:

| Setting | Value |
| --- | --- |
| Project name | `louis-peaks`, or an available name you choose |
| Production branch | `main` |
| Framework preset | **None** |
| Build command | `node scripts/build.mjs` |
| Build output directory | `dist` |
| Root directory | Leave blank |
| Node version | The included `.node-version` selects `22`; you can also set `NODE_VERSION` to `22` in build environment variables. |

Select **Save and Deploy**. After the build succeeds, open the `*.pages.dev` address Cloudflare gives you. Future commits to `main` rebuild and update the published site.

No npm package installation is required to build locally. The Markdown parser is already included in `vendor/` with its licence.

For the full instructions, domain setup and troubleshooting, use [docs/CLOUDFLARE.md](docs/CLOUDFLARE.md). The site is prepared for publishing; create and connect your GitHub repository and Cloudflare project using that guide.

## 4. Replace a banner in one minute

1. Choose your photo and save it as a genuine JPEG.
2. Rename it `home.jpg`.
3. Replace `public/images/banners/home.jpg` with the new file.
4. Update `imageAlt` in `content/pages/home.json` so it describes the new photo.
5. Commit the change to GitHub. Cloudflare publishes it after a successful build.

For a different filename, update the JSON image value too:

```json
"image": "/images/banners/my-mountain-photo.jpg"
```

Website image paths start with `/images/`. Do not include `public/` or `dist/` in those values. Filenames are case-sensitive: `home.jpg` and `Home.JPG` are different. Renaming a PNG or HEIC file to `.jpg` does not convert it; export it to JPEG first.

## 5. Add a journal post

1. Duplicate `templates/new-post/` into `content/posts/`.
2. Rename the new folder to a short name such as `first-mountain-weekend`. This name becomes the final part of its URL: `/journal/first-mountain-weekend/`.
3. Edit `post.json`: title, date, category, excerpt, image and image description.
4. Write the actual article in `story.md`.
5. Add its photo to `public/images/posts/` and reference it as `/images/posts/your-photo.jpg`.
6. Keep `draft: true` while preparing it. When ready, set `draft` to `false`. After replacing the example with your real story, remove any sample-explanation paragraphs from `story.md` and set `sample` to `false`.
7. Build and preview locally, or commit the files to GitHub for Cloudflare to build.

The journal and article pages are generated automatically. You do not need to add a separate HTML page or manually update the journal list.

The `date` field is a displayed date, **not a publication timer**. Future dates do not keep a post hidden. Use `draft: true` until you actually want it published.

Sidequests follow the same process using `templates/new-sidequest/`, `content/sidequests/` and `quest.json`.

## 6. Preview and check on a computer

Install Node.js 22 or later. Open a terminal in the project folder, then run:

```bash
node scripts/build.mjs
node scripts/check.mjs
node scripts/preview.mjs
```

Open **http://127.0.0.1:8080**. Stop the server with **Ctrl+C**. If the port is busy:

```bash
node scripts/preview.mjs --port 8081
```

The package also provides `npm run build`, `npm run check` and `npm run preview` as shortcuts. After editing source content, run the build again before refreshing your preview. The preview server serves the existing `dist` output; it is not an automatic rebuild watcher.

You can open the included `dist/index.html` directly for an initial offline look. Ordinary pages support this file preview. The 404 page intentionally uses root-relative assets so Cloudflare can serve it from an unknown URL depth; preview that page through the local server. Cloudflare-specific redirects and response headers take effect on Cloudflare, not when opening a local file.

## 7. The two versions of your website

| Files | Purpose | Edit these? |
| --- | --- | --- |
| `content/`, `public/`, `src/`, `templates/`, `scripts/`, `vendor/` | The editable source project and its bundled parser | Edit content and code in the appropriate folder; normally leave `vendor/` alone |
| `dist/` | Generated website ready for preview or hosting | No; rebuild it from the source |

The ZIP contains an initial `dist` preview for convenience. `.gitignore` excludes it from normal Git command-line commits. Browser uploads do not use `.gitignore` to choose files for you, so leave `dist` out manually when uploading through GitHub.

Source changes committed in GitHub become live after Cloudflare completes the build. The public website uses static files, and the contact page opens the social or email links you configure. Login accounts, a CMS, form delivery and analytics would be separate future features; they are not enabled in this package.

Before your first public share, replace the sample stories and pictures, check the challenge information and dates, set your contact links, and review the privacy/imprint text. Set `content/site.json` → `url` when you know your preferred public address. If it is blank, Cloudflare builds can use `CF_PAGES_URL` automatically. Canonical links, the sitemap and RSS feed require a public URL; the included offline preview was built without one, so it intentionally has none. A purchased domain is not required: a Pages address works too.

## Further guides

- [Visual starting point](START-HERE.html)
- [Full folder guide](FILE-MAP.md)
- [Writing, images and everyday edits](docs/EDITING.md)
- [GitHub, Cloudflare and custom domains](docs/CLOUDFLARE.md)
- [Picture placeholders and selected stock sources](docs/PHOTOS.md)
- [Instructions for a future AI or developer](AGENTS.md)

Cloudflare and GitHub setup details were checked against their official documentation on **20 October 2026**; those pages are linked in the Cloudflare guide.
