import http from 'node:http';
import { createReadStream, statSync, readdirSync } from 'node:fs';
import { resolve, extname, normalize, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const port=Number(process.env.PORT||5173);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.mp3':'audio/mpeg','.ico':'image/x-icon'};
function buildUI(){const r=spawnSync(process.execPath,['tools/build-ui.mjs'],{cwd:root,stdio:'inherit'});return !r.status;}
function sourceStamp(){let max=0;const scan=dir=>{for(const entry of readdirSync(resolve(root,dir),{withFileTypes:true})){const rel=join(dir,entry.name);if(entry.isDirectory())scan(rel);else try{max=Math.max(max,statSync(resolve(root,rel)).mtimeMs)}catch{}}};for(const dir of ['src/js/modules','src/styles/modules','src/features','src/mvc'])try{scan(dir)}catch{}for(const f of ['src/index.shell.html'])try{max=Math.max(max,statSync(resolve(root,f)).mtimeMs)}catch{}return max;}
buildUI();let stamp=sourceStamp(),building=false;setInterval(()=>{const next=sourceStamp();if(next===stamp||building)return;stamp=next;building=true;try{buildUI();}finally{building=false;}},700);
const server=http.createServer((req,res)=>{let pathname='/';try{pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname)}catch{}if(pathname==='/')pathname='/dev/editor.html';const rel=normalize(pathname).replace(/^([/\\])+/,'');const file=resolve(root,rel);if(!file.startsWith(root)){res.writeHead(403);res.end('Forbidden');return;}let st;try{st=statSync(file)}catch{res.writeHead(404);res.end('Not found');return;}if(st.isDirectory()){res.writeHead(302,{Location:pathname.replace(/\/$/,'')+'/index.html'});res.end();return;}const headers={'Content-Type':mime[extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store, max-age=0','Last-Modified':st.mtime.toUTCString(),'Access-Control-Allow-Origin':'*'};if(req.method==='HEAD'){res.writeHead(200,headers);res.end();return;}res.writeHead(200,headers);createReadStream(file).pipe(res);});
server.listen(port,'127.0.0.1',()=>{console.log(`\nMyWay DEV ativo em http://127.0.0.1:${port}/dev/editor.html`);console.log('Edite src/mvc/views/tabs, src/mvc/controllers, src/mvc/models ou src/features. index.html, app.js e app.css são gerados automaticamente.\n');});
