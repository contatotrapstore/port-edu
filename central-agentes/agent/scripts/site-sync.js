// Copia o painel da Central para o site (Port Edu/public/central), que a Vercel publica em /central.
// - site/central/index.html  → public/central/index.html (login + painel do celular)
// - web/predio/*             → public/central/predio/   (o mesmo prédio 3D, aberto com ?fonte=nuvem)
// - web/icones/*             → public/central/icones/
// - config.json com SUPABASE_URL e SUPABASE_ANON_KEY (chaves públicas). A service_role NUNCA vai para o site.
// Uso: npm run site:sync (depois revise e faça o commit/push do site).
import fs from 'node:fs';
import path from 'node:path';
import { ROOT_DIR } from '../src/config.js';

const SITE = path.resolve(ROOT_DIR, '..');
const pkg = (() => { try { return JSON.parse(fs.readFileSync(path.join(SITE, 'package.json'), 'utf8')); } catch { return {}; } })();
if (!fs.existsSync(path.join(SITE, 'next.config.ts')) || !pkg.dependencies?.next) { console.error(`Não achei o site Next.js em ${SITE}. Nada foi copiado.`); process.exit(1); }

const url = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const anon = String(process.env.SUPABASE_ANON_KEY || '');
// Trava contra colar a chave errada: chave secreta ou JWT com role service_role não pode ir para um arquivo público
const isSecret = k => /^sb_secret_/.test(k) || (() => { try { return JSON.parse(Buffer.from(k.split('.')[1], 'base64url').toString()).role === 'service_role'; } catch { return false; } })();
if (anon && isSecret(anon)) { console.error('SUPABASE_ANON_KEY parece ser a chave secreta (service_role). Use a chave pública (anon / publishable). Nada foi copiado.'); process.exit(1); }

const DEST = path.join(SITE, 'public', 'central');
fs.rmSync(DEST, { recursive: true, force: true });
fs.mkdirSync(path.join(DEST, 'predio'), { recursive: true });

fs.copyFileSync(path.join(ROOT_DIR, 'site', 'central', 'index.html'), path.join(DEST, 'index.html'));
for (const f of fs.readdirSync(path.join(ROOT_DIR, 'web', 'predio'))) {
  let buf = fs.readFileSync(path.join(ROOT_DIR, 'web', 'predio', f));
  // O Next tira a barra do fim da URL (/central/predio), então caminhos relativos quebrariam: tudo absoluto
  if (f === 'index.html') buf = Buffer.from(buf.toString('utf8')
    .replace(/(src|href)="(?!https?:|\/)([\w.-]+\.(?:js|css))"/g, '$1="/central/predio/$2"')
    .replaceAll('href="/manifest.webmanifest"', 'href="/central/manifest.webmanifest"')
    .replaceAll('"/icones/', '"/central/icones/')
    .replace('<head>', '<head>\n<meta name="robots" content="noindex, nofollow">'));
  fs.writeFileSync(path.join(DEST, 'predio', f), buf);
}
fs.cpSync(path.join(ROOT_DIR, 'web', 'icones'), path.join(DEST, 'icones'), { recursive: true });
fs.cpSync(path.join(ROOT_DIR, 'web', 'marcas'), path.join(DEST, 'marcas'), { recursive: true });
// ícone da Higgsfield (imagem) mora em /central/marcas no site
const marcas = path.join(DEST, 'predio', 'marcas.js');
fs.writeFileSync(marcas, fs.readFileSync(marcas, 'utf8').replaceAll("'/marcas/", "'/central/marcas/"));
fs.writeFileSync(path.join(DEST, 'manifest.webmanifest'), JSON.stringify({
  name: 'Central de Agentes · EDevsHub', short_name: 'Central', lang: 'pt-BR', start_url: '/central/', scope: '/central/', display: 'standalone',
  background_color: '#0B1210', theme_color: '#0B1210',
  icons: [192, 512].map(s => ({ src: `/central/icones/icone-${s}.png`, sizes: `${s}x${s}`, type: 'image/png', purpose: 'any maskable' })),
}, null, 2) + '\n');
fs.writeFileSync(path.join(DEST, 'config.json'), JSON.stringify({ supabaseUrl: url || null, supabaseAnonKey: anon || null }, null, 2) + '\n');

console.log(`Copiado para ${DEST}`);
console.log(url && anon ? `Supabase: ${url} (chave pública)` : 'Supabase ainda não configurado: a página vai mostrar "Não configurado" até você preencher o .env e rodar de novo.');
console.log('Próximo passo: revisar e publicar o site (commit + push).');
