/** Check the actual build for missing pages/assets, broken anchors and basic HTML mistakes. */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const failures = [];
let links = 0;
let images = 0;
async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(full)); else result.push(full);
  }
  return result;
}
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
async function main() {
  let all;
  try { all = await files(root); }
  catch { throw new Error('No dist/ folder found. Run node scripts/build.mjs first.'); }
  const pages = all.filter(file => file.endsWith('.html'));
  if (!pages.length) failures.push('The build has no HTML pages.');
  const content = new Map(await Promise.all(pages.map(async file => [file, await readFile(file, 'utf8')])));
  for (const [file, html] of content) {
    const name = path.relative(root, file);
    if (/\{\{\s*\w+\s*\}\}/.test(html)) failures.push(`${name}: unresolved template token.`);
    if ((html.match(/<h1\b/gi) || []).length !== 1) failures.push(`${name}: expected exactly one h1.`);
    if (!/<title>[^<]+<\/title>/i.test(html)) failures.push(`${name}: missing page title.`);
    if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(html)) failures.push(`${name}: missing description.`);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    if (new Set(ids).size !== ids.length) failures.push(`${name}: duplicate element IDs.`);
    for (const match of html.matchAll(/<(a|img|script|link)\b[^>]*>/gi)) {
      const tag = match[0];
      const kind = match[1].toLowerCase();
      if (kind === 'img') { images++; if (!/\balt="[^"]*"/i.test(tag)) failures.push(`${name}: image without alt text.`); }
      const attribute = tag.match(/\b(?:href|src)="([^"]*)"/i);
      if (!attribute) continue;
      const url = decode(attribute[1]);
      if (!url) { failures.push(`${name}: empty href/src.`); continue; }
      if (/^(?:https?:|mailto:|tel:|data:|\/\/)/i.test(url)) continue;
      links++;
      const [withoutHash, fragment] = url.split('#');
      let relative;
      try { relative = decodeURIComponent(withoutHash.split('?')[0]); }
      catch { failures.push(`${name}: malformed URL ${url}.`); continue; }
      let target = relative ? path.resolve(relative.startsWith('/') ? root : path.dirname(file), relative.startsWith('/') ? `.${relative}` : relative) : file;
      if (target !== root && !target.startsWith(root + path.sep)) { failures.push(`${name}: link escapes dist/: ${url}`); continue; }
      try { if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html'); await stat(target); }
      catch { failures.push(`${name}: missing target ${url}`); continue; }
      if (fragment && target.endsWith('.html')) {
        const targetHtml = content.get(target) || await readFile(target, 'utf8');
        let fragmentName;
        try { fragmentName = decodeURIComponent(fragment); } catch { fragmentName = fragment; }
        if (!targetHtml.includes(`id="${fragmentName}"`)) failures.push(`${name}: missing anchor ${url}`);
      }
    }
  }
  for (const required of ['index.html', '404.html', '_headers', '_redirects', 'robots.txt']) {
    try { await stat(path.join(root, required)); } catch { failures.push(`Missing required output file: ${required}`); }
  }
  if (failures.length) { console.error(failures.map(message => `• ${message}`).join('\n')); throw new Error(`${failures.length} build checks failed.`); }
  console.log(`PASS: ${pages.length} HTML pages, ${links} local links/assets, ${images} image references. No missing files, broken anchors, duplicate IDs or unresolved templates.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
