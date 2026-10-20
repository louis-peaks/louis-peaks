/** Serve only the generated dist/ folder. Run the build first. */
import http from 'node:http';
import { readFile, stat, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const portIndex = process.argv.indexOf('--port');
const port = Number(portIndex >= 0 ? process.argv[portIndex + 1] : 8080);
if (!Number.isInteger(port) || port < 1 || port > 65535) { console.error('Use --port with a number between 1 and 65535.'); process.exit(1); }
try { await stat(path.join(root, 'index.html')); }
catch { console.error('No built site found. Run: node scripts/build.mjs'); process.exit(1); }
const rootPath = await realpath(root);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.webm': 'video/webm' };

const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400); response.end('Invalid URL'); return; }
  if (pathname.includes('\0') || pathname.split('/').some(part => part.startsWith('.')) || /(?:^|\/)_headers$|(?:^|\/)_redirects$/.test(pathname)) { response.writeHead(404); response.end('Not found'); return; }
  let file = path.resolve(root, `.${pathname}`);
  if (file !== rootPath && !file.startsWith(rootPath + path.sep)) { response.writeHead(403); response.end('Forbidden'); return; }
  let status = 200;
  try {
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!pathname.endsWith('/')) { response.writeHead(301, { Location: pathname + '/' }); response.end(); return; }
      file = path.join(file, 'index.html');
    }
    const resolved = await realpath(file);
    if (!resolved.startsWith(rootPath + path.sep)) throw new Error('Path outside the preview directory');
    file = resolved;
  } catch { file = path.join(root, '404.html'); status = 404; }
  try {
    const body = await readFile(file);
    response.writeHead(status, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': body.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch { response.writeHead(500); response.end('The built preview is unavailable. Run the build again.'); }
});
server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is busy. Try: node scripts/preview.mjs --port ${port + 1}` : error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Louis.Peaks preview: http://127.0.0.1:${port}\nServing dist/ only. Press Ctrl+C to stop. Rebuild after source edits.`));
