import fs from 'node:fs';
import path from 'node:path';
import {parseEnv} from 'node:util';
import {spawnSync} from 'node:child_process';

const root=process.cwd();
const project=JSON.parse(fs.readFileSync('.vercel/project.json','utf8'));
if(project.projectId!=='prj_lSAimmwH5dSHaq4QV2eO1Ltkf3kC'||project.orgId!=='team_25VEnKJZFng77RMgFqowhGN5')throw new Error('Unexpected deployment target');
const env=parseEnv(fs.readFileSync('.env.local','utf8'));
env.CONTENT_APP_ORIGIN='https://www.edevshub.com';
const keys=['CONTENT_DATABASE_URL','CONTENT_DATABASE_CA','NEXT_PUBLIC_CONTENT_SUPABASE_URL','NEXT_PUBLIC_CONTENT_SUPABASE_PUBLISHABLE_KEY','CONTENT_SUPABASE_STORAGE_KEY','CONTENT_APP_ORIGIN'];
const cli=path.join(process.env.APPDATA,'npm/node_modules/vercel/dist/index.js');
for(const key of keys){
 if(!env[key])throw new Error('Missing '+key);
 const result=spawnSync(process.execPath,[cli,'env','add',key,'production','--scope','edevs','--yes',key.startsWith('NEXT_PUBLIC_')||key==='CONTENT_APP_ORIGIN'?'--no-sensitive':'--sensitive'],{cwd:root,input:env[key],encoding:'utf8',windowsHide:true});
 // Never print CLI output: only the key and exit status may leave this process.
 console.log(key+': '+(result.status===0?'configured':'failed'));
 if(result.status!==0)process.exit(1);
}
