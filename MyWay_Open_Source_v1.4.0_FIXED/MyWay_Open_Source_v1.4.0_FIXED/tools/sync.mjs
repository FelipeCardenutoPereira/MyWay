import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
let build=spawnSync(process.execPath,['tools/build-ui.mjs'],{cwd:root,stdio:'inherit'});if(build.status)process.exit(build.status||1);
const src=resolve(root,'src');
const targets=[resolve(root,'web'),resolve(root,'desktop/www'),resolve(root,'android/assets/www')];
for(const target of targets){await rm(target,{recursive:true,force:true});await mkdir(target,{recursive:true});await cp(src,target,{recursive:true});}
console.log('MyWay sincronizado: módulos → src → web / desktop/www / android/assets/www');
