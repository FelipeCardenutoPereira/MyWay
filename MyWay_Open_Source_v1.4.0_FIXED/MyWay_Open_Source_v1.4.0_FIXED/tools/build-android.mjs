import { spawnSync } from 'node:child_process';
import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const root=process.cwd();
let r=spawnSync(process.execPath,['tools/sync.mjs'],{stdio:'inherit'});if(r.status)process.exit(r.status||1);
const gradle=process.platform==='win32'?'gradlew.bat':'./gradlew';
r=spawnSync(gradle,['assembleRelease'],{cwd:resolve(root,'android'),stdio:'inherit',shell:process.platform==='win32'});
if(r.error||r.status){console.error('\nO código Android está pronto. Para compilar, abra /android no Android Studio (SDK 35) ou configure ANDROID_HOME e rode npm run build:android.');process.exit(1)}
const candidates=['android/build/outputs/apk/release/MyWay-release.apk','android/build/outputs/apk/release/android-release.apk','android/build/outputs/apk/release/app-release.apk'];
await mkdir(resolve(root,'releases'),{recursive:true});
for(const c of candidates){try{await copyFile(resolve(root,c),resolve(root,'releases/MyWay_Android_v1.4.0.apk'));console.log('APK pronto em releases/MyWay_Android_v1.4.0.apk');process.exit(0)}catch{}}
console.error('Gradle terminou, mas o APK não foi localizado. Veja android/build/outputs/apk/release/.');process.exit(1);
