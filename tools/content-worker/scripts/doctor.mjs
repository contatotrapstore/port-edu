import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { chromium } from 'playwright';
const worker = fileURLToPath(new URL('../', import.meta.url));
export const python = process.env.CONTENT_PYTHON || path.join(worker, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
let failures = 0;
for (const [name, command, args] of [
  ['Node', process.execPath, ['--version']],
  ['Python', python, ['-c', 'import sys,numpy,scipy,PIL; print(sys.version.split()[0], "numpy="+numpy.__version__, "scipy="+scipy.__version__)']],
  ['FFmpeg','ffmpeg',['-version']], ['FFprobe','ffprobe',['-version']],
]) {
  const r = spawnSync(command, args, { encoding:'utf8', windowsHide:true });
  const ok = !r.error && r.status === 0;
  console.log(`${ok ? 'OK' : 'FALHA'} ${name}: ${ok ? r.stdout.split('\n')[0] : r.error?.message || r.stderr.trim()}`);
  if (!ok) failures++;
}
try { const b=await chromium.launch({headless:true}); await b.close(); console.log('OK Chromium'); }
catch(e) { failures++; console.error('FALHA Chromium: instale com npx playwright install chromium.', e.message.split('\n')[0]); }
console.log(fs.existsSync(path.join(worker,'vendor')) ? 'OK referência local disponível' : 'AVISO referência original ainda não baixada');
process.exitCode = failures ? 1 : 0;
