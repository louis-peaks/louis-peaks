/**
 * Build the website using only Node.js and the bundled Marked parser.
 * Source: content/ + src/ + public/. Generated output: dist/.
 * Never edit dist/ directly: the next build replaces it.
 */
import { readFile, writeFile, readdir, mkdir, rm, cp, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { marked } from '../vendor/marked.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const source = (...parts) => path.join(root, ...parts);
const escape = (value = '') => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const text = file => readFile(source(file), 'utf8');
const json = async file => {
  try { return JSON.parse(await text(file)); }
  catch (error) { throw new Error(`Cannot read ${file}: ${error.message}`); }
};
const hash = value => createHash('sha256').update(value).digest('hex').slice(0, 10);
const dateLabel = date => new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
const templateCache = new Map();
const publishedRoutes = [];
marked.setOptions({ gfm: true, breaks: false });

async function template(file, values = {}) {
  if (!templateCache.has(file)) templateCache.set(file, await text(`src/${file}.html`));
  return templateCache.get(file).replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    if (!Object.hasOwn(values, key)) throw new Error(`Missing template value "${key}" in src/${file}.html`);
    return String(values[key]);
  });
}

function requireStrings(object, keys, file) {
  for (const key of keys) if (typeof object[key] !== 'string' || !object[key].trim()) throw new Error(`${file}: "${key}" must be a non-empty text value.`);
}

async function verifyImage(url, label) {
  if (typeof url !== 'string' || !/^\/images\/.+\.(jpe?g|png|webp|avif|gif|svg)$/i.test(url)) throw new Error(`${label}: use a local image path such as /images/banners/home.jpg.`);
  const image = path.resolve(source('public'), `.${url}`);
  if (!image.startsWith(source('public', 'images') + path.sep)) throw new Error(`${label}: image path must remain in public/images/.`);
  try { await access(image); } catch { throw new Error(`${label}: the image does not exist at public${url}. Check its name and capitalisation.`); }
}

async function collection(folder, metadataName) {
  const entries = await readdir(source('content', folder), { withFileTypes: true });
  const items = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)) throw new Error(`content/${folder}/${entry.name}: use a lowercase folder name with hyphens.`);
    const base = `content/${folder}/${entry.name}`;
    const data = await json(`${base}/${metadataName}.json`);
    if (typeof data.draft !== 'boolean' || typeof data.sample !== 'boolean') throw new Error(`${base}: draft and sample must be true or false.`);
    if (data.draft) continue;
    requireStrings(data, ['title', 'image', 'imageAlt', ...(folder === 'posts' ? ['date', 'category', 'excerpt'] : ['meta', 'summary'])], base);
    await verifyImage(data.image, base);
    if (folder === 'posts' && (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(`${data.date}T00:00:00Z`)) || new Date(`${data.date}T00:00:00Z`).toISOString().slice(0, 10) !== data.date)) throw new Error(`${base}: date must be a real date in YYYY-MM-DD format.`);
    const markdown = await text(`${base}/story.md`);
    if (!markdown.trim()) throw new Error(`${base}/story.md is empty.`);
    items.push({ ...data, slug: entry.name, markdown, html: marked.parse(markdown), route: `/${folder === 'posts' ? 'journal' : 'sidequests'}/${entry.name}/` });
  }
  return folder === 'posts' ? items.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)) : items;
}

/**
 * Make generated files usable both on Pages and by opening dist/index.html.
 * Cloudflare automatically redirects these index.html URLs to clean routes.
 * Markdown images should still be authored as /images/... in the source.
 */
function localLinks(html, route) {
  const depth = route === '/404.html' ? 0 : route.split('/').filter(Boolean).length;
  const prefix = '../'.repeat(depth) || './';
  return html.replace(/\b(href|src)="(\/(?!\/)[^"]*)"/g, (_, attr, url) => {
    const match = url.match(/^([^?#]*)(.*)$/);
    let name = match[1].slice(1);
    if (!name || name.endsWith('/')) name += 'index.html';
    return `${attr}="${prefix}${name}${match[2]}"`;
  });
}

async function write(relative, value) {
  const target = path.join(output, relative);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, value);
}

async function main() {
  const [site, navigation, training, posts, quests, styles, client] = await Promise.all([
    json('content/site.json'), json('content/navigation.json'), json('content/training.json'),
    collection('posts', 'post'), collection('sidequests', 'quest'),
    text('src/assets/styles.css'), text('src/assets/main.js')
  ]);
  requireStrings(site, ['name', 'tagline', 'description', 'language', 'location', 'copyrightName'], 'content/site.json');
  if (!Array.isArray(navigation) || !Array.isArray(site.socials) || !Array.isArray(training.rows)) throw new Error('navigation, socials and training.rows must be arrays.');
  for (const social of site.socials) {
    requireStrings(social, ['label', 'url'], 'content/site.json socials');
    if (!/^https:\/\//.test(social.url)) throw new Error(`The social link ${social.label} must start with https://.`);
  }
  if (site.email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(site.email)) throw new Error('content/site.json email must be empty or a valid email address.');
  let siteUrl = (site.url || process.env.CF_PAGES_URL || '').replace(/\/+$/, '');
  if (siteUrl) {
    const parsed = new URL(siteUrl);
    if (!['https:', 'http:'].includes(parsed.protocol) || parsed.pathname !== '/' || parsed.search || parsed.hash || parsed.username || parsed.password) throw new Error('site.url must be an origin such as https://louispeaks.ch, with no path, password, query or fragment.');
    siteUrl = parsed.origin;
  }
  const pages = {};
  for (const name of ['home', 'challenge', 'journal', 'sidequests', 'about', 'contact']) {
    pages[name] = await json(`content/pages/${name}.json`);
    requireStrings(pages[name], ['eyebrow', 'titleLine1', 'titleLine2', 'description', 'image', 'imageAlt'], `content/pages/${name}.json`);
    await verifyImage(pages[name].image, `content/pages/${name}.json`);
  }
  await verifyImage(pages.about.portrait, 'content/pages/about.json portrait');
  const pageValues = name => Object.fromEntries(Object.entries(pages[name]).filter(([, value]) => typeof value === 'string').map(([key, value]) => [key, escape(value)]));
  const challengeName = `${pages.challenge.titleLine1} ${pages.challenge.titleLine2}`.replace(/[.!?]+$/, '');
  if (!Array.isArray(pages.challenge.distances) || !Array.isArray(pages.challenge.roadmap)) throw new Error('challenge.distances and challenge.roadmap must be arrays.');
  for (const row of training.rows) requireStrings(row, ['date', 'activity', 'duration', 'note'], 'content/training.json row');

  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(source('public'), output, { recursive: true, filter: file => !path.basename(file).startsWith('.') });
  await write('assets/styles.css', styles);
  await write('assets/main.js', client);

  const socials = site.socials.map(item => `<a href="${escape(item.url)}" target="_blank" rel="noopener noreferrer">${escape(item.label)} <span aria-hidden="true">↗</span></a>`).join('');
  const footer = await template('components/footer', {
    name: escape(site.name), tagline: escape(site.tagline), description: escape(site.description), socials,
    year: new Date().getUTCFullYear(), copyrightName: escape(site.copyrightName), feedLink: siteUrl ? '<a href="/feed.xml">RSS feed</a>' : ''
  });
  const postCard = post => template('components/post-card', {
    title: escape(post.title), category: escape(post.category), date: escape(post.date), dateLabel: dateLabel(post.date),
    excerpt: escape(post.excerpt), image: escape(post.image), imageAlt: escape(post.imageAlt), url: post.route,
    search: escape(`${post.title} ${post.excerpt} ${post.category}`), sampleBadge: post.sample ? '<span class="sample-badge">Example story</span>' : ''
  });
  const cards = async items => items.length ? (await Promise.all(items.map(postCard))).join('\n') : '<p class="empty-state">The first field note is still ahead. Come back soon.</p>';
  const recent = await cards(posts.slice(0, 3));
  const sampleNotice = (sample, kind = 'story') => sample ? `<p class="sample-notice">Example ${kind} · Starter copy to show how this section works.</p>` : '';
  const distances = pages.challenge.distances.map(item => `<div><strong>${escape(item.value)}</strong><span>${escape(item.label.replace(' · target format', ''))}</span></div>`).join('');
  const hero = async (name, options = {}) => template('components/hero', {
    ...Object.fromEntries(Object.entries(pages[name]).filter(([, value]) => typeof value === 'string').map(([key, value]) => [key, escape(value)])),
    heroClass: name === 'home' ? 'hero-home' : 'hero-inner',
    heroActions: options.actions || '', heroAside: options.aside || ''
  });

  async function page(route, title, description, content, options = {}) {
    const header = await template('components/header', {
      name: escape(site.name), tagline: escape(site.tagline),
      navigation: navigation.map(item => {
        const active = item.url === '/' ? route === '/' : route.startsWith(item.url);
        return `<a href="${escape(item.url)}"${active ? ' aria-current="page" class="active"' : ''}>${escape(item.label)}</a>`;
      }).join('')
    });
    const absolute = siteUrl ? `${siteUrl}${route}` : '';
    const headMeta = [
      `<meta property="og:title" content="${escape(title)}">`,
      `<meta property="og:description" content="${escape(description)}">`,
      `<meta property="og:type" content="${options.article ? 'article' : 'website'}">`,
      `<meta property="og:site_name" content="${escape(site.name)}">`,
      ...(absolute ? [`<link rel="canonical" href="${escape(absolute)}">`, `<meta property="og:url" content="${escape(absolute)}">`] : []),
      ...(siteUrl && options.image ? [`<meta property="og:image" content="${escape(siteUrl + options.image)}">`] : []),
      ...(options.noindex ? ['<meta name="robots" content="noindex,follow">'] : []),
      ...(siteUrl ? [`<link rel="alternate" type="application/rss+xml" title="${escape(site.name)} journal" href="/feed.xml">`] : [])
    ].join('\n  ');
    const html = await template('layouts/base', {
      language: escape(site.language), title: escape(`${title} | ${site.name}`), description: escape(description),
      headMeta, bodyClass: options.bodyClass || '', header, content, footer, cssVersion: hash(styles), jsVersion: hash(client)
    });
    const relative = route === '/404.html' ? '404.html' : path.posix.join(route.slice(1), 'index.html');
    // A 404 can be served at any URL depth. Root paths are needed in this one page.
    await write(relative, route === '/404.html' ? html : localLinks(html, route));
    if (route !== '/404.html' && !options.noindex) publishedRoutes.push(route);
  }

  const home = await template('pages/home', {
    ...pageValues('home'),
    hero: await hero('home', {
      actions: '<div class="button-row"><a class="button primary" href="/challenge/">Follow the challenge <span aria-hidden="true">↗</span></a><a class="button light-outline" href="/journal/">Read the field notes</a></div>',
      aside: `<aside class="hero-note"><span class="status-pill"><i aria-hidden="true"></i>A journey in progress</span><p>Small steps.<br>Long way to go.</p><a href="/challenge/">${escape(challengeName)} <span aria-hidden="true">↗</span></a><span class="hero-note-location">${escape(site.location)}</span></aside>`
    }),
    ...Object.fromEntries(['introHeading', 'introText', 'quote', 'bioIntro'].map(key => [key, escape(pages.home[key])])),
    challengeGoal: escape(pages.challenge.goal), challengeDate: escape(pages.challenge.dateLabel), phase: escape(pages.challenge.phase),
    challengeTitle: `${escape(pages.challenge.titleLine1)}<br>${escape(pages.challenge.titleLine2)}`,
    distances, posts: recent, portrait: escape(pages.about.portrait), portraitAlt: escape(pages.about.portraitAlt), portraitCaption: escape(pages.about.portraitCaption)
  });
  await page('/', `${pages.home.titleLine1} ${pages.home.titleLine2}`, pages.home.description, home, { image: pages.home.image, bodyClass: 'home-page' });

  const trainingSection = training.rows.length ? `<section class="section"><div class="container"><p class="eyebrow">Training log</p><h2>${escape(training.label)}</h2>${training.updated ? `<p class="subtle-note">Updated ${escape(training.updated)}</p>` : ''}<div class="table-scroll" tabindex="0" role="region" aria-label="Training log"><table><thead><tr><th scope="col">Date</th><th scope="col">Activity</th><th scope="col">Duration</th><th scope="col">Note</th></tr></thead><tbody>${training.rows.map(row => `<tr><td>${escape(row.date)}</td><td>${escape(row.activity)}</td><td>${escape(row.duration)}</td><td>${escape(row.note)}</td></tr>`).join('')}</tbody></table></div></div></section>` : '';
  await page('/challenge/', 'The challenge', pages.challenge.description, await template('pages/challenge', {
    ...pageValues('challenge'),
    hero: await hero('challenge', { actions: `<div class="button-row"><a class="button primary" href="/journal/">Follow the preparation <span aria-hidden="true">↗</span></a></div>` }),
    trainingNote: escape(pages.challenge.trainingNote), phase: escape(pages.challenge.phase), challengeDate: escape(pages.challenge.dateLabel),
    roadmap: pages.challenge.roadmap.map((item, index) => `<li class="roadmap-step${item.current ? ' current' : ''}"><span class="step-number">0${index + 1}</span><h3>${escape(item.title)}</h3><p>${escape(item.text)}</p>${item.current ? '<span class="current-label">Current focus</span>' : ''}</li>`).join(''),
    raceDistances: distances, posts: recent, training: trainingSection,
    sponsorHeading: escape(pages.challenge.sponsorHeading), sponsorText: escape(pages.challenge.sponsorText)
  }), { image: pages.challenge.image });

  const categories = [...new Set(posts.map(item => item.category))].sort();
  await page('/journal/', 'Field notes', pages.journal.description, await template('pages/journal', {
    ...pageValues('journal'),
    hero: await hero('journal'), posts: await cards(posts),
    filters: ['all', ...categories].map(category => `<button class="filter${category === 'all' ? ' active' : ''}" type="button" data-filter="${escape(category)}" aria-pressed="${category === 'all'}">${category === 'all' ? 'All' : escape(category)}</button>`).join('')
  }), { image: pages.journal.image });

  const questCards = await Promise.all(quests.map((quest, index) => template('components/quest-card', {
    title: escape(quest.title), meta: escape(quest.meta), summary: escape(quest.summary), image: escape(quest.image), imageAlt: escape(quest.imageAlt), url: quest.route,
    number: String(index + 1).padStart(2, '0'), sampleBadge: quest.sample ? '<span class="sample-badge">Example sidequest</span>' : ''
  })));
  await page('/sidequests/', 'Sidequests', pages.sidequests.description, await template('pages/sidequests', {
    ...pageValues('sidequests'),
    hero: await hero('sidequests'), quests: questCards.join('\n') || '<p class="empty-state">The next detour is still taking shape.</p>'
  }), { image: pages.sidequests.image });

  await page('/about/', 'About Louis', pages.about.description, await template('pages/about', {
    ...pageValues('about'), location: escape(site.location),
    hero: await hero('about'), biography: marked.parse(await text('content/pages/about.md')),
    portrait: escape(pages.about.portrait), portraitAlt: escape(pages.about.portraitAlt), portraitCaption: escape(pages.about.portraitCaption)
  }), { image: pages.about.image });

  await page('/contact/', 'Contact', pages.contact.description, await template('pages/contact', {
    ...pageValues('contact'),
    hero: await hero('contact'), emailBlock: site.email ? `<a class="button dark" href="mailto:${escape(site.email)}">${escape(site.email)} <span aria-hidden="true">↗</span></a>` : '<p class="contact-note">For now, you can reach me through the social channels here.</p>',
    channels: site.socials.map((item, index) => `<a class="channel" href="${escape(item.url)}" target="_blank" rel="noopener noreferrer"><span class="channel-number">0${index + 1}</span><strong>${escape(item.label)}</strong><span aria-hidden="true">↗</span></a>`).join('')
  }), { image: pages.contact.image });

  for (const post of posts) {
    await page(post.route, post.title, post.excerpt, await template('pages/article', {
      title: escape(post.title), category: escape(post.category), date: escape(post.date), dateLabel: dateLabel(post.date), excerpt: escape(post.excerpt),
      image: escape(post.image), imageAlt: escape(post.imageAlt), readingTime: Math.max(1, Math.ceil(post.markdown.split(/\s+/).length / 220)),
      sampleNotice: sampleNotice(post.sample), story: post.html
    }), { article: true, image: post.image, noindex: post.sample });
  }
  for (const quest of quests) {
    await page(quest.route, quest.title, quest.summary, await template('pages/quest', {
      title: escape(quest.title), meta: escape(quest.meta), summary: escape(quest.summary), image: escape(quest.image), imageAlt: escape(quest.imageAlt),
      sampleNotice: sampleNotice(quest.sample, 'sidequest'), story: quest.html
    }), { image: quest.image, noindex: quest.sample });
  }
  for (const [name, title] of [['privacy', 'Privacy'], ['imprint', 'Imprint']]) {
    await page(`/${name}/`, title, `${title} for ${site.name}.`, await template('pages/text', {
      eyebrow: 'Project details', title, text: marked.parse(await text(`content/pages/${name}.md`))
    }), { noindex: true });
  }
  await page('/credits/', 'Image credits', 'Image credits for the Louis.Peaks website.', await template('pages/text', {
    eyebrow: 'Behind the visuals', title: 'Image credits.', text: marked.parse(await text('content/pages/credits.md'))
  }));
  await page('/404.html', 'Page not found', 'This page is off the marked trail.', await template('pages/404'), { noindex: true });

  await write('robots.txt', `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : ''}`);
  if (siteUrl) {
    await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publishedRoutes.map(route => `<url><loc>${escape(siteUrl + route)}</loc></url>`).join('')}</urlset>\n`);
    const feedPosts = posts.filter(post => !post.sample);
    await write('feed.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${escape(site.name)} — Field notes</title><link>${escape(siteUrl)}/journal/</link><description>${escape(site.description)}</description><language>${escape(site.language)}</language>${feedPosts.map(post => `<item><title>${escape(post.title)}</title><link>${escape(siteUrl + post.route)}</link><guid>${escape(siteUrl + post.route)}</guid><pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate><description>${escape(post.excerpt)}</description></item>`).join('')}</channel></rss>\n`);
  }
  console.log(`Built ${6 + posts.length + quests.length + 4} HTML pages in dist/ (${posts.length} journal stories, ${quests.length} sidequests).`);
  console.log(siteUrl ? `Canonical URL: ${siteUrl}` : 'No public URL configured. Canonical links, RSS and sitemap are added when site.url or CF_PAGES_URL is set.');
}

main().catch(error => { console.error(`\nBuild failed: ${error.message}\n`); process.exitCode = 1; });
