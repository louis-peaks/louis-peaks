# Everyday editing

Most updates belong in `content/` and `public/images/`. You only need the templates or code when changing how the website works or looks.

## Edit a JSON file safely

JSON stores labelled values. Keep the label on the left and change its value on the right:

```json
{
  "titleLine1": "The next",
  "titleLine2": "chapter.",
  "description": "A place for the process, the setbacks and the good days.",
  "image": "/images/banners/home.jpg",
  "imageAlt": "Morning light on a mountain ridge."
}
```

This example shows a few fields, not a complete replacement for `home.json`. Preserve any other fields in the existing file.

- Use double quotation marks around text.
- Separate fields with commas, but do not add a comma after the last field.
- `true` and `false` are not quoted.
- To put quotation marks inside text, escape them: `"He said \"keep going\"."`.
- JSON does not support comments. Put notes in a Markdown document rather than inside the JSON.
- Keep arrays and field names intact unless deliberately changing the data structure.

If the build reports an invalid JSON file, its error identifies what to recheck. The build reads source files; changing only the generated `dist` version will be overwritten by the next build.

## Change the main page text

Open `content/pages/` and select the matching JSON file. Page introductions use fields such as `eyebrow`, `titleLine1`, `titleLine2`, `description`, `image` and `imageAlt`. Each page can have additional fields for its sections.

The longer About text lives in `about.md`. The privacy, imprint and photo-credit pages also use Markdown: `privacy.md`, `imprint.md` and `credits.md`. Menu labels are in `content/navigation.json`; the site name, description and contact details are in `content/site.json`. Shared interface labels are in `src/components/`; substantive page text belongs in its matching page JSON or Markdown file.

Optional settings such as the site email and URL can stay blank while you prepare the site; the activity log can keep an empty `rows` array. Preserve required values such as titles, descriptions and image settings: the builder validates required fields. Keep unfinished articles as `draft: true` and retain their required template fields while drafting. Add your actual contact details when ready. Do not use a stock-photo model as your portrait or publish fictional race results as personal achievements.

## Write in Markdown

Markdown is ordinary text with a few simple formatting marks:

```markdown
## A section heading

This is a paragraph. Leave a blank line between paragraphs.

Use **bold** for emphasis and *italics* sparingly.

- One observation
- Another observation

1. First step
2. Second step

[A useful link](https://example.com)

![A description of the photo](/images/posts/my-run.jpg)

> A short thought worth pulling out of the story.
```

The article title comes from `post.json`, so start the article body with a paragraph or a `##` heading rather than repeating the title as another main heading.

For your personal writing, useful sections might be: what you hoped to do, what happened, what you learned, and what comes next. They are suggestions, not mandatory fields.

## Add a new journal article

1. Copy the folder `templates/new-post/` into `content/posts/`.
2. Give the copy a unique lower-case name with hyphens, for example `first-mountain-weekend`.
3. Keep the two filenames `post.json` and `story.md`.
4. Fill out the details in `post.json`.
5. Replace the body in `story.md`.
6. Add a matching image to `public/images/posts/`.
7. Set `draft` to `false` when ready. After replacing the sample with your own real story, remove sample-explanation paragraphs from `story.md` as well as setting `sample` to `false`.
8. Build/preview and then commit the source changes.

Example metadata:

```json
{
  "title": "A weekend above the clouds",
  "date": "2026-10-20",
  "category": "Mountains",
  "excerpt": "The first useful lesson from a long day outside.",
  "image": "/images/posts/first-mountain-weekend.jpg",
  "imageAlt": "A narrow trail following a rocky ridge.",
  "draft": true,
  "sample": false
}
```

This is an editing example. Choose the actual date and facts for your article. A draft is left out of the generated website. A future `date` does not schedule publication or hide an article: only the explicit draft setting does that.

The draft flag applies to the article page and its listings. Everything placed in `public/`, including images for a draft, is copied to the public website during a build.

`sample: true` has a different purpose: it visibly labels the published article as sample content, adds a search-engine `noindex` instruction, and leaves it out of the sitemap and RSS feed. It does not hide the page or make it private. Changing only the flag does not remove sample explanations that are part of the Markdown story; edit those paragraphs too.

The folder name determines the URL. `content/posts/first-mountain-weekend/` produces `/journal/first-mountain-weekend/`. The builder updates the journal listing and creates the article page automatically.

To add a post directly in GitHub, create `content/posts/first-mountain-weekend/post.json` and `content/posts/first-mountain-weekend/story.md`, copying the corresponding template contents into each. Keep `draft: true` until both files and its image are in place. A temporary build failure while a new folder is incomplete leaves the last successful deployment in place.

## Add a sidequest

Copy `templates/new-sidequest/` into `content/sidequests/` and give it a unique lower-case folder name. Edit `quest.json` and `story.md`.

Sidequest metadata uses these fields:

| Field | Purpose |
| --- | --- |
| `title` | Public title. |
| `meta` | A short contextual label. |
| `summary` | The text shown in the listing. |
| `image` | A path such as `/images/sidequests/my-adventure.jpg`. |
| `imageAlt` | A description of the actual photo. |
| `draft` | `true` keeps it unpublished; `false` includes it. |
| `sample` | `true` visibly labels sample content and adds `noindex`; it does not hide the page. Use `false` for your real content and remove any sample-explanation paragraphs from `story.md`. |

The resulting URL is `/sidequests/your-folder-name/`.

## Replace a photo

The fastest method is to keep the existing filename. For example, replace `public/images/banners/challenge.jpg` with a new genuine JPEG named `challenge.jpg`. Then update the image description in the matching content file.

For a new filename, put the file in the relevant images folder and change the JSON reference:

```json
"image": "/images/posts/my-new-photo.jpg"
```

The browser sees `/images/...`; it never sees the `public/` source-folder prefix. Use lower-case names and hyphens. Names and extensions must match exactly. Export images from HEIC or PNG before naming the output `.jpg`.

Add inline photos to an article with the Markdown image syntax shown above. Keep files reasonably sized and check their crop on both a narrow phone screen and a wider screen. See [PHOTOS.md](PHOTOS.md) for practical sizes, placeholders and source links.

## Maintain your activity log

`content/training.json` has a `label`, an `updated` value and a `rows` array. The table is hidden when `rows` is empty.

Example row shape:

```json
{
  "date": "2026-10-20",
  "activity": "Easy trail run",
  "duration": "45 minutes",
  "note": "An example entry — replace with your actual activity."
}
```

Add rows inside the existing `rows` array. This feature displays a personal activity log; it does not create a training programme or prescribe sessions.

## Change navigation or appearance

Edit `content/navigation.json` to update labels or links. Preserve existing route paths unless you intentionally change the corresponding generated pages too.

Edit `src/assets/styles.css` for colours, fonts, spacing or responsive layout. Shared visual pieces are in `src/components/`; page templates are in `src/pages/`. Browser interactions live in `src/assets/main.js`.

Changing ordinary text does not require editing these files. If asking an AI to help, provide the whole source folder and point it to `AGENTS.md` so it can respect the project structure.

## Rename or remove an article

Changing the folder name changes the URL. If an article has already been shared, add a redirect in `public/_redirects`:

```text
/journal/old-name/ /journal/new-name/ 301
```

The new destination must exist. To temporarily remove content, set its `draft` flag to `true`. To permanently remove it from the project, remove its content folder; remove an image only after confirming no other content uses it.

## Verify your change

From the project folder:

```bash
node scripts/build.mjs
node scripts/check.mjs
node scripts/preview.mjs
```

Look at the changed page, follow its links and check a phone-sized viewport. The check command examines the generated output; run the build first. The preview server does not rebuild automatically.

After committing to GitHub, check the Cloudflare deployment result and open the actual published page. Local browser storage is not a publishing system in this project.
