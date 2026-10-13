import { spawnSync } from 'node:child_process';
import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const root=process.cwd();
let r=spawnSync(process.execPath,['tools/sync.mjs'],{stdio:'inherit'});if(r.status)process.exit(r.status||1);
const gradle=process.platform==='win32'?'gradlew.bat':'./gradlew';
const args=['assembleRelease','-PmywayApplicationId=br.com.myway.open135'];
r=spawnSync(gradle,args,{cwd:resolve(root,'android'),stdio:'inherit',shell:process.platform==='win32'});
if(r.error||r.status){console.error('\nConfigure Android SDK 35 e a assinatura MYWAY_KEYSTORE_* antes de compilar.');process.exit(1)}
const candidates=['android/build/outputs/apk/release/MyWay-release.apk','android/build/outputs/apk/release/android-release.apk','android/build/outputs/apk/release/app-release.apk'];
await mkdir(resolve(root,'releases'),{recursive:true});
for(const c of candidates){try{await copyFile(resolve(root,c),resolve(root,'releases/MyWay_Android_CLEAN_v1.4.0.apk'));console.log('APK clean pronto em releases/MyWay_Android_CLEAN_v1.4.0.apk');process.exit(0)}catch{}}
console.error('Gradle terminou, mas o APK não foi localizado.');process.exit(1);
