import fs from 'node:fs';
import {generateWithCodex,generateWithClaude} from './draft-generation.mjs';
const input=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
try{
 const draft=input.engine==='codex'?generateWithCodex(input):input.engine==='claude'?generateWithClaude(input,process.cwd()):null;
 if(!draft)throw Error('Invalid engine');
 fs.writeFileSync(process.argv[3],JSON.stringify(draft));
}catch(error){
 const reason=['Invalid input','Invalid topic','Invalid brief','Invalid caption','Invalid slides','Invented source','Unfilled placeholder'].includes(error.message)?error.message:'subscription_execution_failed';
 fs.writeFileSync(process.argv[3]+'.error.json',JSON.stringify({reason}));
 console.error('generation_failed: confira login e limite no aplicativo escolhido.');process.exitCode=1;
}
