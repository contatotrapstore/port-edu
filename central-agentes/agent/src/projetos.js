// Cartão do projeto (clique na sala) e relatório mensal por cliente.
// Tudo local: git da pasta, custos de data/custos.json, últimos prompts das sessões, deploys da Vercel.
import { spawnSync } from 'node:child_process';
import { config } from './config.js';
import { store } from './store.js';
import { readCosts, dayKey } from './history.js';
import { listaTarefas } from './orquestra.js';

const git = (cwd, args) => { try { const r = spawnSync('git', ['-C', cwd, ...args], { encoding: 'utf8', timeout: 5000, windowsHide: true }); return r.status === 0 ? r.stdout.trim() : null; } catch { return null; } };
const sala = nome => (config.rooms || []).find(r => r.room === nome);

/** Custo e tarefas por dia de um conjunto de projetos (chaves de custos.json) */
function custosDe(filtro, desde) {
  let usd = 0, tarefas = 0; const dias = new Set();
  for (const [d, projs] of Object.entries(readCosts())) {
    if (d < desde) continue;
    for (const [nome, v] of Object.entries(projs)) if (filtro(nome, v)) { usd += v.costUsd || 0; tarefas += v.tasks || 0; if ((v.costUsd || 0) > 0 || v.tasks) dias.add(d); }
  }
  return { usd, tarefas, dias: dias.size };
}
const diasAtras = n => dayKey(Date.now() - n * 86400e3);

export function infoProjeto(nome) {
  const r = sala(nome); if (!r) return { erro: 'sala não encontrada' };
  const sessoes = [...store.agents.values()].filter(a => a.room === nome).sort((x, y) => y.lastActivity - x.lastActivity);
  const pasta = sessoes.find(a => a.cwd)?.cwd || null;
  const daSala = (k, v) => v.room ? v.room === nome : k === nome;
  let g = null;
  if (pasta) {
    const branch = git(pasta, ['rev-parse', '--abbrev-ref', 'HEAD']);
    if (branch) {
      const [msg, quando] = (git(pasta, ['log', '-1', '--format=%s%x1f%ct']) || '').split('\x1f');
      const sujos = (git(pasta, ['status', '--porcelain']) || '').split('\n').filter(Boolean).length;
      const remoto = (git(pasta, ['remote', 'get-url', 'origin']) || '').replace(/https:\/\/[^@/]+@/, 'https://').replace(/\.git$/, '');
      g = { branch, ultimoCommit: msg || '', quando: quando ? Number(quando) * 1000 : 0, alteracoes: sujos, remoto };
    }
  }
  const ids = new Set(sessoes.map(a => a.id));
  const prompts = store.feed.filter(e => e.kind === 'prompt' && ids.has(e.agentId)).slice(0, 6).map(e => ({ t: e.t, texto: e.text }));
  return {
    sala: nome, cliente: r.cliente || null, descricao: r.stack || '', pasta, git: g,
    custos: { hoje: custosDe(daSala, dayKey()), semana: custosDe(daSala, diasAtras(6)), mes: custosDe(daSala, dayKey().slice(0, 7) + '-01') },
    sessoes: sessoes.slice(0, 8).map(a => ({ nome: a.name, projeto: a.project, estado: a.state, modelo: a.model, custoUsdHoje: a.costUsdToday })),
    prompts, deploys: (store.deploys || []).filter(d => d.sala === nome),
    tarefas: listaTarefas().filter(t => t.sala === nome).slice(0, 5),
    clientes: [...new Set((config.rooms || []).map(x => x.cliente).filter(Boolean))],
  };
}

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const brl = v => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Relatório do mês para um cliente: projetos, dias com atividade, tarefas e custo equivalente em API. */
export function relatorioHTML(cliente, mes) {
  mes = /^\d{4}-\d{2}$/.test(mes || '') ? mes : dayKey().slice(0, 7);
  const usdBrl = config.usdBrl || 5.4;
  const salas = (config.rooms || []).filter(r => r.cliente === cliente).map(r => r.room);
  const linhas = salas.map(s => {
    const c = custosDe((k, v) => (v.room ? v.room === s : k === s), mes + '-01');
    const ate = custosDe((k, v) => (v.room ? v.room === s : k === s), mes + '-32');   // nada depois do fim do mês
    return { sala: s, descricao: sala(s)?.stack || '', usd: c.usd - ate.usd, tarefas: c.tarefas - ate.tarefas, dias: c.dias - ate.dias };
  });
  const tot = linhas.reduce((t, l) => ({ usd: t.usd + l.usd, tarefas: t.tarefas + l.tarefas }), { usd: 0, tarefas: 0 });
  const [a, m] = mes.split('-').map(Number);
  const nomeMes = new Date(a, m - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Relatório ${esc(cliente)} · ${esc(nomeMes)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&display=swap">
<style>:root{--bg:#0B1210;--fg:#EDE6D6;--amber:#F5B935;--muted:#8E9A92}*{box-sizing:border-box}body{margin:0;font:15px/1.5 "Instrument Sans",system-ui,sans-serif;background:#fff;color:#16211D}
main{max-width:820px;margin:0 auto;padding:40px 28px}header{display:flex;align-items:center;gap:12px;border-bottom:3px solid var(--amber);padding-bottom:16px;margin-bottom:24px}
header b{font-size:20px}header small{display:block;color:#5C625D}h1{font-size:26px;margin:0 0 4px}p.sub{color:#5C625D;margin:0 0 24px}
table{width:100%;border-collapse:collapse;margin:8px 0 18px}th,td{text-align:left;padding:10px 8px;border-bottom:1px solid #E4DED0}th{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#5C625D}td.n{text-align:right;font-variant-numeric:tabular-nums}
tfoot td{font-weight:700;border-top:2px solid #16211D}.note{color:#5C625D;font-size:13px}.acoes{margin:0 0 20px}button{font:inherit;padding:10px 16px;border-radius:10px;border:0;background:var(--amber);font-weight:600;cursor:pointer}
@media print{.acoes{display:none}main{padding:0}}</style></head><body><main>
<header><svg width="34" height="34" viewBox="0 0 30 30" aria-hidden="true"><rect width="30" height="30" rx="7" fill="#0B1210"/><rect x="6" y="5" width="4" height="20" rx="2" fill="#EDE6D6"/><rect x="20" y="5" width="4" height="20" rx="2" fill="#EDE6D6"/><rect x="10" y="13.7" width="3" height="2.6" fill="#EDE6D6"/><rect x="17" y="13.7" width="3" height="2.6" fill="#EDE6D6"/><circle cx="15" cy="15" r="2.4" fill="#F5B935"/></svg><div><b>EDevsHub</b><small>Software, sistemas e IA</small></div></header>
<div class="acoes"><button onclick="print()">Salvar em PDF / imprimir</button></div>
<h1>Relatório de ${esc(cliente)}</h1><p class="sub">${esc(nomeMes)} · trabalho com agentes de IA (Claude e Codex)</p>
<table><thead><tr><th>Projeto</th><th>Dias com trabalho</th><th class="n">Tarefas concluídas</th><th class="n">Custo equivalente</th></tr></thead><tbody>
${linhas.map(l => `<tr><td><b>${esc(l.sala)}</b><br><span class="note">${esc(l.descricao)}</span></td><td>${l.dias}</td><td class="n">${l.tarefas}</td><td class="n">${brl(l.usd * usdBrl)}</td></tr>`).join('') || '<tr><td colspan="4">Sem projetos para este cliente.</td></tr>'}
</tbody><tfoot><tr><td>Total</td><td></td><td class="n">${tot.tarefas}</td><td class="n">${brl(tot.usd * usdBrl)}</td></tr></tfoot></table>
<p class="note">"Custo equivalente" é quanto esse uso custaria nas APIs da Anthropic e da OpenAI (US$ 1 = ${brl(usdBrl)}). É um indicador interno de esforço, não um valor cobrado. Tarefas = turnos de trabalho concluídos pelos agentes.</p>
</main></body></html>`;
}
