import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const script=fileURLToPath(new URL('./worker-once.mjs',import.meta.url));
let stopping=false,child;
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{stopping=true;});
// Finish the current render before stopping. Queue leases prevent duplicate work.
while(!stopping){
 await new Promise(resolve=>{
  child=spawn(process.execPath,[script],{windowsHide:true,stdio:['ignore','pipe','pipe']});
  child.stdout.on('data',data=>{if(!String(data).includes('Nenhum render pendente.'))process.stdout.write(data);});
  child.stderr.on('data',data=>process.stderr.write(data));
  child.once('error',()=>{console.error('Falha ao iniciar worker.');resolve();});child.once('close',resolve);
 });
 if(!stopping)await new Promise(resolve=>setTimeout(resolve,30000));
}
