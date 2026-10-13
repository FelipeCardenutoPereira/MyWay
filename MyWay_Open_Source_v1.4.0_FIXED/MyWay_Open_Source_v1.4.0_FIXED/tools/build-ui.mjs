import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, relative, dirname } from 'node:path';

const root=process.cwd();

async function walk(dir,ext){
  const base=resolve(root,dir),out=[];
  async function visit(current){
    for(const entry of await readdir(current,{withFileTypes:true})){
      const full=resolve(current,entry.name);
      if(entry.isDirectory())await visit(full);
      else if(entry.isFile()&&entry.name.endsWith(ext))out.push(full);
    }
  }
  try{await visit(base);}catch(e){if(e?.code!=='ENOENT')throw e;}
  return out.sort((a,b)=>relative(base,a).localeCompare(relative(base,b),'en'));
}

async function buildHTML(){
  const shellPath=resolve(root,'src/index.shell.html');
  let html=await readFile(shellPath,'utf8');
  const include=/<!--\s*@include\s+([^\s]+)\s*-->/g;
  const includes=[...html.matchAll(include)];
  for(const match of includes){
    const target=resolve(root,'src',match[1]);
    const chunk=await readFile(target,'utf8');
    html=html.replace(match[0],chunk.trim());
  }
  await writeFile(resolve(root,'src/index.html'),html,'utf8');
  console.log(`index.html ← index.shell.html + ${includes.length} views MVC`);
}

async function buildJS(){
  const allLegacy=await walk('src/js/modules','.js');
  // O bootstrap precisa ser a última etapa executável do bundle. Antes da v1.3.7 ele ficava
  // no meio do arquivo (antes de models/features/controllers), então qualquer erro de init
  // impedia os controles MVC posteriores de sequer serem definidos.
  const boot=allLegacy.filter(file=>file.endsWith('/99-bootstrap.js')||file.endsWith('\\99-bootstrap.js'));
  const legacy=allLegacy.filter(file=>!boot.includes(file));
  const models=await walk('src/mvc/models','.js');
  const features=await walk('src/features','.js');
  const controllers=await walk('src/mvc/controllers','.js');
  const names=[...legacy,...models,...features,...controllers,...boot];
  const chunks=['/* GERADO AUTOMATICAMENTE. Edite src/mvc, src/features e, só quando necessário, src/js/modules. */\n(()=>{\n"use strict";\n'];
  for(const file of names){
    const label=relative(resolve(root,'src'),file).replaceAll('\\','/');
    chunks.push(`\n/* MyWay module: ${label} */\n`,await readFile(file,'utf8'));
  }
  chunks.push('\n})();\n');
  await mkdir(dirname(resolve(root,'src/js/app.js')),{recursive:true});
  await writeFile(resolve(root,'src/js/app.js'),chunks.join(''),'utf8');
  console.log(`app.js ← ${legacy.length} módulos-base + ${models.length} models MVC + ${features.length} features + ${controllers.length} controllers MVC + ${boot.length} bootstrap final`);
}

async function buildCSS(){
  const legacy=await walk('src/styles/modules','.css');
  const features=await walk('src/features','.css');
  const mvc=await walk('src/mvc/styles','.css');
  const names=[...legacy,...features,...mvc];
  const chunks=['/* GERADO AUTOMATICAMENTE. Edite src/mvc/styles, src/features e, só quando necessário, src/styles/modules. */\n'];
  for(const file of names){
    const label=relative(resolve(root,'src'),file).replaceAll('\\','/');
    chunks.push(`\n/* MyWay style module: ${label} */\n`,await readFile(file,'utf8'));
  }
  await writeFile(resolve(root,'src/styles/app.css'),chunks.join(''),'utf8');
  console.log(`app.css ← ${legacy.length} módulos-base + ${features.length} features + ${mvc.length} estilos MVC`);
}

await buildHTML();
await buildJS();
await buildCSS();
