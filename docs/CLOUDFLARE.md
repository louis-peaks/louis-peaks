# Publish through GitHub and Cloudflare Pages

This guide uses **Cloudflare Pages with Git integration**. GitHub holds your editable files; Cloudflare builds and hosts the website. The project does not require GitHub Pages, a database or a server application.

## 1. Create the GitHub repository

1. Extract the ZIP.
2. Create a repository on GitHub, for example `louis-peaks`. Cloudflare supports both public and private repositories.
3. Open **Add file → Upload files**, or the upload link shown in an empty repository.
4. Upload the contents inside `louis-peaks-website/`, excluding `dist/`.
5. Preserve the folders. `package.json`, `README.md`, `content/`, `public/`, `src/`, `scripts/` and `templates/` should be visible at the repository root.
6. Commit the files to `main`.

Uploading the ZIP alone does not make its contents available as website source. Likewise, placing the entire project inside another wrapper folder changes the root directory you would need to configure.

The browser uploader accepts up to **100 files in one upload** and **25 MiB per file**. Split a larger upload into batches, keeping the same directory structure, or use GitHub Desktop. A desktop computer is usually simplest for the first upload. `.gitignore` excludes `dist/` when using normal Git tools; manually leave `dist/` out when selecting files in a browser.

## 2. Connect the repository to Pages

In the Cloudflare dashboard:

1. Open **Workers & Pages**.
2. Choose **Create application → Pages → Connect to Git**.
3. Select GitHub and authorize access to your repository.
4. Select the repository and begin setup.
5. Enter the following build settings.

| Field | Value |
| --- | --- |
| Project name | An available name, such as `louis-peaks` |
| Production branch | `main` |
| Framework preset | **None** |
| Build command | `node scripts/build.mjs` |
| Build output directory | `dist` |
| Root directory | Leave blank |
| Node | `.node-version` contains `22`; alternatively set `NODE_VERSION=22` in build environment variables |

6. Select **Save and Deploy**.
7. Open the `*.pages.dev` address after the build succeeds.

Choose the **Pages** flow when the dashboard offers several application types. This package's settings are for Pages. There is no `wrangler deploy` step and no GitHub Actions workflow to configure.

Cloudflare starts at the repository root, runs the build and publishes only `dist/`. The builder supplies static HTML, styles, scripts and images. Its Markdown parser is included locally in `vendor/`; no npm dependencies need to be downloaded for the project itself.

## 3. Make your next change

Edit the relevant source file in GitHub, or edit it locally and upload/commit the change. A commit to `main` starts a new production build. Once that build succeeds, the new version is served at the same address.

You can prepare changes on another branch to use Cloudflare's preview deployments. Merge the branch into `main` when the changes are ready for the main website.

The old standalone HTML prototype's browser-local editing is not used in this project. The source files are the publishing workflow.

## 4. Add your domain

First confirm that the Pages address works. Then open:

**Workers & Pages → your Pages project → Custom domains → Set up a domain**

Enter the domain you own and follow the instructions.

- For an apex domain such as `louispeaks.ch`, add it as a Cloudflare zone in the same account and point its nameservers to Cloudflare. Cloudflare then guides the DNS record setup.
- For a subdomain such as `www.your-domain.ch`, you can use an external DNS provider with a CNAME to the Pages address. Associate the subdomain with the Pages project first.

Changing a JSON URL does not register a domain or configure DNS. Once your address is live, set `content/site.json` → `url` to the chosen public URL, for example `https://your-project.pages.dev` or the custom domain you connected. Use one preferred address consistently.

If the `url` setting is blank, the builder can use Cloudflare's `CF_PAGES_URL` automatically. Canonical links, sitemap output and the RSS feed need a public URL; the included offline preview was built without one and therefore intentionally omits them. A Pages address is sufficient, so these features do not require a purchased domain. Sample articles remain visible with a `noindex` instruction and are excluded from the sitemap and RSS feed; `draft: true` excludes an article from the site altogether.

## 5. What the Cloudflare files do

The builder copies `public/_headers` and `public/_redirects` to the output root. Cloudflare interprets these files during serving. They are not page content.

The generated top-level `dist/404.html` gives missing URLs an actual missing-page screen. Retain it: without a top-level `404.html`, Pages assumes a single-page application and can serve the homepage for unknown addresses. Its assets intentionally use root-relative paths so they work at unknown URL depths; preview the 404 page through the included local server, not by opening its HTML file directly.

Do not add a catchall redirect for this multipage site. Individual posts already have real HTML pages. Cloudflare handles clean HTML addresses, including redirecting `/about/index.html` to `/about/`.

## 6. Troubleshooting

| Problem | Check |
| --- | --- |
| Cloudflare cannot find `scripts/build.mjs` | Source files are at the repository root and the Root directory field is blank. |
| Build log reports invalid JSON | Recheck the named content file: double quotes, commas and no trailing commas. |
| Homepage returns 404 after a build | Output directory is `dist`, and the build generated `dist/index.html`. |
| A new post does not appear | It is in `content/posts/`, has both required files, and `draft` is `false`. |
| A sample story still appears | `sample: true` labels it and excludes it from the sitemap/feed; set `draft: true` if you want it hidden. |
| No sitemap or RSS feed in the offline preview | These are generated only when the build has a public URL from site settings or `CF_PAGES_URL`. |
| A future-dated post appeared immediately | Dates are labels; use `draft: true` to keep unpublished content out of the site. |
| A photo is missing | Compare the case-sensitive filename with its `/images/...` reference. Check the true file format. |
| A changed local file is not in the preview | Run the build again. The preview server does not watch source files. |
| A local-file preview differs from hosting | Use the included local server. Cloudflare-specific headers and redirects run on Cloudflare only. |
| A custom domain does not resolve | Complete the Custom domains setup and follow the DNS instructions; DNS changes may take time to appear. |

## Official references

Setup details checked **20 October 2026**. Dashboard wording can change; these are the primary references:

- [GitHub: upload files and folders](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [Cloudflare Pages: Git integration setup](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Cloudflare Pages: build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages: build image and Node versions](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Cloudflare Pages: custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Cloudflare Pages: HTML routing and 404 behaviour](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Cloudflare Pages: headers](https://developers.cloudflare.com/pages/configuration/headers/)
- [Cloudflare Pages: redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
