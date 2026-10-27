import fs from 'node:fs';
import {parseEnv} from 'node:util';
import {runPublisher} from '../../../src/lib/content/publisher-runner.mjs';
const env=parseEnv(fs.readFileSync(new URL('../../../.env.local',import.meta.url),'utf8'));
const result=await runPublisher(env,'local');
if(result.state==='error'){console.error('Publicador: '+result.error);process.exitCode=1;}
