import path from 'node:path';
import fs from 'node:fs';
export function inside(root, target) {
  const rel = path.relative(root, target);
  return rel !== '' && !rel.startsWith('..' + path.sep) && rel !== '..' && !path.isAbsolute(rel);
}
export function projectPath(root, input) {
  const target = path.resolve(root, input);
  if (!inside(root, target)) throw new Error('O projeto precisa ficar dentro de output/conteudo.');
  if (!fs.statSync(target).isDirectory()) throw new Error('Projeto não encontrado.');
  if (!inside(fs.realpathSync(root), fs.realpathSync(target))) throw new Error('Link de projeto fora da pasta permitida.');
  return target;
}
export function safeFile(root, url) {
  const decoded = decodeURIComponent(url.split('?')[0]);
  if (decoded.includes('\0')) throw new Error('URL inválida');
  const target = path.resolve(root, '.' + decoded.replaceAll('\\', '/'));
  if (!inside(root, target) || !inside(fs.realpathSync(root), fs.realpathSync(target)) || !fs.statSync(target).isFile()) throw new Error('Arquivo indisponível');
  return target;
}
export function parseArgs(args) {
  const out = {};
  if (args.length !== 4) throw new Error('Uso: --project <pasta> --mode stills|cues|video|qa');
  for (let i=0; i<args.length; i+=2) {
    if (!['--project','--mode'].includes(args[i]) || out[args[i].slice(2)] || !args[i+1]) throw new Error('Argumento inválido');
    out[args[i].slice(2)] = args[i+1];
  }
  if (!out.project || !['stills','cues','video','qa'].includes(out.mode)) throw new Error('Modo inválido');
  return out;
}
