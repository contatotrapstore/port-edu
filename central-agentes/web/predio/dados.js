// Central de Agentes · prédio 3D — dados.js
// Constantes, salas, planos e números do negócio.
// Scripts clássicos: as constantes de nível superior são compartilhadas entre os arquivos, na ordem de carga do index.html.
const $ = id => document.getElementById(id);
const loadingEl = $('loading');
if (!window.THREE || !THREE.MapControls || !THREE.BufferGeometryUtils){ loadingEl.textContent = 'Não consegui carregar o motor 3D. Confira a conexão e recarregue a página.'; throw new Error('Three.js não carregou'); }
let renderer;
try { renderer = new THREE.WebGLRenderer({canvas: $('gl'), antialias: true, powerPreference: 'high-performance'}); }
catch (e) { loadingEl.textContent = 'Este navegador não liberou o WebGL, que a versão 3D precisa. Tente no Chrome ou Edge atualizado.'; throw e; }

/* =============================== DATA =============================== */
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOBILE = matchMedia('(max-width: 700px), (pointer: coarse)').matches;
// Fonte dos dados: 'real' (agente local, padrão quando a página vem dele) ou 'simulada' (protótipo). Troque com ?fonte=simulada
const FONTE = new URLSearchParams(location.search).get('fonte') || (window.EDH_TOKEN ? 'real' : 'simulada');
const NUVEM = FONTE === 'nuvem';            // site (/central/predio): resumo sanitizado do Supabase, com login
const REAL = FONTE === 'real' || NUVEM;
// Layout real (salas do config.json): o agente injeta em window.EDH_LAYOUT; na nuvem vem do estado (boot.js)
const LAYOUT = REAL && window.EDH_LAYOUT && (window.EDH_LAYOUT.rooms || []).length ? window.EDH_LAYOUT : null;
const AVULSOS = ((LAYOUT && LAYOUT.rooms.find(r => r.fallback)) || {}).room || 'Projetos avulsos';
const RW = 10, RD = 8, GAP = 2.5, WH = 2.6, COLS = 4, PLAZA = 6.5, FH = 4.2;
const WW = COLS*RW + (COLS-1)*GAP, WD = 2*RD + GAP;
const WALK = WD + 1.5, DOOR_X = 8.4, AISLE = 4.7, BACK = 7.3;
const EX = WW + 3.3, EZ = WD + 3.4;
let CAMBIO = 5.40; // no modo real vem do agente (config.json → usdBrl)
const AMBER = '#F5B935', CREAM = '#EDE6D6';
const ST = {working:'#5BD69E', waiting:'#FFD84A', error:'#FF6B5E', idle:'#6F837B', empty:'#2A3832', boss:'#F5B935'};
const ST_LABEL = {working:'Trabalhando', waiting:'Precisa de você', error:'Erro', idle:'Ocioso'};
const TOOL_PT = {Edit:'Editando', Read:'Lendo', Bash:'Executando', Grep:'Buscando', Write:'Criando', WebFetch:'Consultando', Imagem:'Gerando imagem', Video:'Gerando vídeo', Voz:'Narrando'};
const KIND_TAG = {wait:'Permissão', err:'Erro', done:'Concluído', prompt:'Prompt', tool:'Ação', xp:'Conquista'};
const MODELS = {
  Opus:{prov:'claude', rin:15, rout:75, w:.012}, Sonnet:{prov:'claude', rin:3, rout:15, w:.006}, Haiku:{prov:'claude', rin:1, rout:5, w:.002},
  Codex:{prov:'gpt', rin:1.25, rout:10, w:.04}, Higgsfield:{prov:'higgs'}, ElevenLabs:{prov:'eleven'}
};
const rand = (a,b) => a + Math.random()*(b-a);
const irand = (a,b) => Math.floor(rand(a,b+1));
const pick = a => a[Math.floor(Math.random()*a.length)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const brlFromUsd = (usd, dec=2) => 'R$ ' + (usd*CAMBIO).toLocaleString('pt-BR',{minimumFractionDigits:dec, maximumFractionDigits:dec});
const brl = (v, dec=0) => 'R$ ' + v.toLocaleString('pt-BR',{minimumFractionDigits:dec, maximumFractionDigits:dec});
const num = n => Math.round(n).toLocaleString('pt-BR');
const fmtTok = n => n >= 1e6 ? (n/1e6).toFixed(2).replace('.',',') + ' M' : Math.round(n/1e3) + ' mil';
const fmtTime = d => d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
const fmtDur = ms => { const s = Math.max(0, Math.floor(ms/1000)); return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0'); };
const fmtSpan = ms => { const m = Math.max(1, Math.round(ms/60000)); if (m < 60) return m + ' min'; const h = Math.floor(m/60); if (h < 48) return h + 'h' + String(m%60).padStart(2,'0'); return Math.round(h/24) + ' dias'; };
const short = (s,n) => s.length > n ? s.slice(0,n-1) + '…' : s;
const base = p => String(p).split('/').pop();
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));

const FLOORS = [
  {i:0, name:'Térreo', short:'T', desc:'Recepção, TI, Diretoria e convivência'},
  {i:1, name:'Desenvolvimento', short:'1º', desc:'Uma sala por projeto'},
  {i:2, name:'Comercial', short:'2º', desc:'Workana, funil, captação e prospecção'},
  {i:3, name:'Marketing', short:'3º', desc:'EDevsHub, Revix, estúdio e tráfego'},
];
FLOORS.forEach(F => F.y = F.i*FH);
if (LAYOUT) (LAYOUT.floors || []).forEach((x, i) => { if (FLOORS[i] && x){ FLOORS[i].name = x.name || FLOORS[i].name; FLOORS[i].desc = x.desc || ''; } });

const CODE = {
  planet:{name:'PlanetShake', stack:'Capacitor · Android', budget:45, files:['android/app/build.gradle','src/pages/Checkout.tsx','capacitor.config.ts','src/lib/deeplink.ts','android/app/src/main/AndroidManifest.xml'], cmds:['npx cap sync android','./gradlew bundleRelease','npm run build'], prompts:['Configura o Capacitor pra gerar o AAB de release e ajusta o splash','Corrige o deep link do checkout no Android','Revisa as permissões do manifest antes de subir pra Play'], tasks:['Splash','Ícone','Política','Deep link','AAB release','Manifest','Checkout']},
  ligou:{name:'Ligou Chegou', stack:'Android · Firebase', budget:35, files:['app/src/main/java/OrderStatusService.kt','app/build.gradle.kts','functions/src/notify.ts','firestore.rules'], cmds:['./gradlew assembleRelease','firebase deploy --only functions','./gradlew test'], prompts:['No app entregador, notifica quando o pedido muda pra "saiu pra entrega"','Sobe o target SDK pra 35 e corrige o que quebrar'], tasks:['SDK 35','Push status','Rastreio','Regras','Login','Mapa']},
  organzza:{name:'Organzza · Kommo', stack:'Kommo CRM · Webhooks', budget:20, files:['robots/follow-up.json','webhooks/kommo.ts','funis/locacao.yaml'], cmds:['npm run deploy:webhooks','node scripts/test-funil.js'], prompts:['Revisa o robô de follow-up que está duplicando mensagens','Mapeia os campos do funil de locação de vestidos'], tasks:['Follow-up','Funil','Campos','Webhook','Tags']},
  revix:{name:'Revix', stack:'Expo · Meta API', budget:40, files:['app/(tabs)/eventos.tsx','services/meta-insights.ts','app/checkin/[id].tsx','supabase/migrations/0042_checkins.sql'], cmds:['supabase db push','eas build -p ios --profile preview'], prompts:['Puxa as métricas da Meta e monta o resumo semanal dos encontros','Cria a tela de check-in no evento com QR'], tasks:['Check-in QR','Métricas','Eventos','Perfil','Push']},
  meta:{name:'Meta Coleta IA', stack:'Node · Graph API · OpenAI', budget:55, files:['src/collectors/graph.ts','src/queue/publisher.ts','src/ai/summarize.ts','src/db/schema.prisma','tests/collector.spec.ts'], cmds:['npx prisma migrate deploy','npm run test','git push origin main'], prompts:['Implementa o coletor de posts da Graph API com paginação','Cria a fila de publicação agendada','Adiciona a camada de IA que resume os comentários'], tasks:['Coletor','Fila','Resumo IA','Agenda','Painel','Testes']},
  fisko:{name:'Fisko', stack:'Flutter · Node', budget:25, files:['lib/features/iva/report_page.dart','api/src/routes/iva.ts','lib/data/sync_service.dart'], cmds:['flutter build apk --release','flutter test'], prompts:['Gera o relatório de IVA mensal em PDF','Corrige a sincronização offline das notas'], tasks:['IVA PDF','Offline','Notas','Login','Backup']},
  qa:{name:'QA · Code review', stack:'Testes e revisão de PR', budget:30, files:['e2e/checkout.spec.ts','e2e/login.spec.ts','.github/workflows/ci.yml'], cmds:['npx playwright test','npm run test:e2e'], prompts:['Roda os testes E2E de todos os apps e abre issue do que falhar','Revisa os PRs abertos da semana'], tasks:['E2E checkout','E2E login','CI','PR #42','PR #45']},
};
const KINDS = {
  fin:{acts:[['Lendo uso',['uso do Claude','uso do Codex','saldo da Higgsfield','saldo da ElevenLabs']],['Calculando',['projeção semanal','custo por projeto','previsão de renovação']]], waits:[], errs:[], prompts:['Consolida o uso dos planos e me avisa se algo vai estourar','Fecha o custo por projeto da semana'], tasks:[]},
  ops:{acts:[['Verificando',['kingprime.com.br','beeder.me','useconvoo.com.br','DNS do beeder.me']],['Lendo',['logs do Nginx','certificados SSL','fila de e-mails']],['Executando',['backup do banco','renovação do SSL']]], waits:['deploy em produção: kingprime.com.br','reiniciar o servidor do beeder.me'], errs:['kingprime.com.br respondeu 502','certificado expira em 5 dias'], prompts:['Confere o uptime dos sites e me avisa se algo cair','Renova os certificados que vencem este mês'], tasks:['Uptime','SSL','Backup','DNS','Deploy']},
  recep:{acts:[['Respondendo',['lead no WhatsApp','e-mail de orçamento','mensagem no Instagram']],['Agendando',['call de quinta 14h','reunião de briefing']]], waits:['confirmar horário com o lead'], errs:[], prompts:['Atende os leads que chegarem pelo WhatsApp e agenda as calls'], tasks:['WhatsApp','E-mail','Agenda']},
  workana:{acts:[['Lendo',['projeto: app de delivery','projeto: sistema de agendamento','projeto: integração com Pix','projeto: dashboard em React']],['Escrevendo',['proposta: app de delivery','proposta: integração Pix']],['Calculando',['orçamento e prazo']]], waits:['enviar proposta: app de delivery (R$ 4.800)','enviar proposta: integração Pix (R$ 2.200)'], errs:['projeto fechou antes do envio'], prompts:['Filtra os projetos novos da Workana que combinam com o meu perfil','Escreve as propostas no meu formato padrão'], tasks:['Delivery','Pix','Agenda','Dashboard','ERP']},
  funnel:{acts:[['Atualizando',['lead: pousada Serra Verde','lead: clínica Bem Estar','lead: loja Atelier']],['Escrevendo',['follow-up de 3 dias','resposta de objeção de preço']]], waits:['enviar follow-up para 4 leads'], errs:[], prompts:['Faz o follow-up dos leads parados há mais de 3 dias'], tasks:['Follow-up','Objeção','Reativação']},
  direct:{acts:[['Escrevendo',['contrato de prestação de serviço','escopo do projeto']],['Revisando',['cláusula de pagamento','cronograma']]], waits:['enviar contrato para assinatura'], errs:[], prompts:['Monta o contrato do novo cliente com o escopo fechado'], tasks:['Contrato','Escopo','Cronograma']},
  prospect:{acts:[['Buscando',['pousadas em Morretes','chalés em Urubici','cabanas em Gonçalves']],['Qualificando',['lista de 30 leads','site e Instagram dos leads']]], waits:[], errs:['o Maps limitou as buscas'], prompts:['Levanta 30 pousadas sem site de reserva direta'], tasks:['Morretes','Urubici','Gonçalves','Lista 30']},
  social:{acts:[['Escrevendo',['legenda do carrossel','roteiro do reels','post de case']],['Criando',['carrossel de 6 telas','capa do reels']],['Agendando',['post de quinta 18h']]], waits:['publicar post no Instagram'], errs:['imagem fora do tamanho do Instagram'], prompts:[], tasks:['Carrossel','Reels','Case','Stories']},
  ads:{acts:[['Lendo',['métricas da campanha','relatório do Google Ads','Pixel da Meta']],['Ajustando',['público da campanha','criativo vencedor']],['Testando',['nova headline do site']]], waits:['aumentar a verba da campanha para R$ 40/dia'], errs:['campanha reprovada por política'], prompts:['Otimiza a campanha de captação da EDevsHub','Testa duas headlines no site'], tasks:['Campanha','Headline','Pixel','Público']},
  higgs:{prompts:['Gera 12 fotos de lookbook da coleção de outono da ELYVRA','Cria o reels do próximo encontro do Revix','Monta o banner do case do PlanetShake'], errs:['fila da Higgsfield cheia, tentando de novo'], waits:['aprovar lote de 12 imagens (48 créditos)'], tasks:['Lookbook','Reels','Banner']},
  eleven:{prompts:['Narra o anúncio do próximo encontro do Revix','Grava a URA de atendimento do Ligou Chegou'], errs:['texto acima do limite por requisição'], waits:[], tasks:['URA','Narração']},
};
const SOCIAL_PROMPTS = {edevshub:['Cria o carrossel da semana sobre automação com IA','Escreve o post de case do PlanetShake','Prepara o reels de bastidores do escritório'], revix:['Monta o post do próximo encontro em Curitiba','Responde os comentários do último evento']};

// Sala real a partir do config.json: tipo do prédio + "kind" usado nas telas e animações
const REAL_KIND = {control: 'fin', reception: 'recep', infra: 'ops'};
const realRoomDef = r => ({f: r.floor, slot: r.slot, type: r.type || 'project', name: r.room, stack: r.stack || '', kind: r.type === 'studio' ? undefined : (REAL_KIND[r.type] || 'code'), files: [], cmds: [], prompts: [], tasks: [], budget: r.budgetBrl || 0, fallback: !!r.fallback});
const ROOM_DEFS = LAYOUT ? LAYOUT.rooms.map(realRoomDef) : [
  {f:0, slot:0, type:'reception', name:'Recepção', stack:'Atendimento e agenda', kind:'recep'},
  {f:0, slot:1, type:'meeting', name:'Sala de reunião', stack:'Calls com clientes'},
  {f:0, slot:2, type:'infra', name:'TI · Infra', stack:'Servidores, deploys e domínios', kind:'ops'},
  {f:0, slot:3, type:'control', name:'Diretoria', stack:'Planos, custos e metas', kind:'fin'},
  ...['planet','ligou','organzza','qa','revix','meta','fisko'].map((k, i) => ({f:1, slot:[0,1,2,3,4,5,6][i], type: k === 'qa' ? 'qa' : 'project', key:k, kind:'code', ...CODE[k]})),
  {f:2, slot:0, type:'sales', name:'Workana', stack:'Triagem e propostas', kind:'workana', budget:15},
  {f:2, slot:1, type:'sales', name:'Funil · CRM', stack:'Leads e follow-up', kind:'funnel', budget:8},
  {f:2, slot:2, type:'sales', name:'Captação direta', stack:'Site, contratos e indicações', kind:'direct', budget:8},
  {f:2, slot:3, type:'sales', name:'Prospecção', stack:'Pousadas, chalés e cabanas', kind:'prospect', budget:6},
  {f:2, slot:4, type:'calls', name:'Cabines de call', stack:'Reuniões rápidas'},
  {f:3, slot:0, type:'social', name:'EDevsHub · Social', stack:'Instagram @edevshub e site', kind:'social', brand:'edevshub', budget:12},
  {f:3, slot:1, type:'social', name:'Revix · Social', stack:'Instagram e Facebook', kind:'social', brand:'revix', budget:6},
  {f:3, slot:2, type:'studio', name:'Estúdio criativo', stack:'Higgsfield · ElevenLabs'},
  {f:3, slot:3, type:'ads', name:'Tráfego & Site', stack:'Campanhas e testes no site', kind:'ads', budget:10},
];
const ROOMS = ROOM_DEFS.map((d, i) => {
  const R = {...d}; R.i = i; R.c = d.slot % COLS; R.r = Math.floor(d.slot / COLS);
  R.ox = R.c*(RW+GAP); R.oz = R.r*(RD+GAP);
  R.base = d.kind === 'code' && !REAL ? rand(.6, 2.4) : 0;
  R.todo = REAL ? 0 : irand(3,6); R.done = REAL ? 0 : irand(2,5);
  const K = KINDS[d.kind] || {};
  R.files = R.files || []; R.cmds = R.cmds || K.waits || []; R.prompts = R.prompts || K.prompts || []; R.tasks = R.tasks || K.tasks || ['Tarefa'];
  if (d.type === 'studio') R.cmds = KINDS.higgs.waits;
  if (REAL){ R.tasks = []; R.budget = d.budget || 0; } // quadro com os prompts reais (fonte.js); orçamento só se vier do config
  return R;
});
const roomAt = (f, slot) => ROOMS.find(R => R.f === f && R.slot === slot);
const DESK_X = [1.7, 4.8, 7.9];
function SEAT(R, d){
  if (R.type === 'control' && d === 0) return {x:R.ox+2.0, z:R.oz+3.45};
  if (R.type === 'reception') return {x:R.ox+4.8, z:R.oz+3.45};
  return {x:R.ox+DESK_X[d], z:R.oz+3.45};
}
const IDLE_SPOTS = {
  office:[{x:4.0, z:6.1, pose:'sofa', yaw:Math.PI, via:'front'},{x:5.2, z:6.1, pose:'sofa', yaw:Math.PI, via:'front'},{x:.95, z:4.3, pose:'look', yaw:-Math.PI/2, via:'front'}],
  studio:[{x:2.55, z:6.45, pose:'bean', yaw:Math.PI, via:'front'},{x:3.85, z:6.45, pose:'bean', yaw:Math.PI, via:'front'},{x:5.15, z:6.45, pose:'bean', yaw:Math.PI, via:'front'}],
  control:[{x:4.7, z:6.65, pose:'chair', yaw:Math.PI, via:'back'},{x:5.8, z:6.65, pose:'chair', yaw:Math.PI, via:'back'},{x:6.9, z:6.65, pose:'chair', yaw:Math.PI, via:'back'}],
};
const idleFor = R => R.type === 'studio' ? IDLE_SPOTS.studio : R.type === 'control' ? IDLE_SPOTS.control : IDLE_SPOTS.office;

/* lounge spots per floor (world coords) */
const COPA = [
  [ // Térreo: convivência
    {x:15.0, z:14.25, kind:'drink', yaw:Math.PI}, {x:17.4, z:14.25, kind:'drink', yaw:Math.PI},
    {x:17.4, z:WD+1.95, kind:'coffee', yaw:Math.PI}, {x:18.6, z:WD+1.95, kind:'coffee', yaw:Math.PI},
    {x:27.0, z:WD+1.95, kind:'arcade', yaw:Math.PI},
    {x:3.45, z:WD+4.1, kind:'pong', yaw:Math.PI/2, pair:'pong'}, {x:6.55, z:WD+4.1, kind:'pong', yaw:-Math.PI/2, pair:'pong'},
    {x:16.4, z:WD+4.62, kind:'sofa', yaw:Math.PI}, {x:17.6, z:WD+4.62, kind:'sofa', yaw:Math.PI},
    {x:28.55, z:WD+4.1, kind:'foos', yaw:Math.PI/2, pair:'foos'}, {x:30.45, z:WD+4.1, kind:'foos', yaw:-Math.PI/2, pair:'foos'},
    {x:28.0, z:13.4, kind:'bench', yaw:Math.PI}, {x:30.0, z:14.2, kind:'bench', yaw:Math.PI}, {x:32.0, z:13.4, kind:'bench', yaw:Math.PI},
    {x:40.3, z:WD+3.2, kind:'bean', yaw:Math.PI}, {x:42.3, z:WD+3.2, kind:'bean', yaw:Math.PI},
  ],
  [ // Desenvolvimento: área aberta no fundo + plaza
    {x:40.0, z:12.6, kind:'coffee', yaw:Math.PI}, {x:41.2, z:12.6, kind:'water', yaw:Math.PI},
    {x:43.0, z:15.0, kind:'standup', yaw:Math.PI/2}, {x:45.2, z:15.0, kind:'standup', yaw:-Math.PI/2}, {x:44.1, z:16.2, kind:'standup', yaw:Math.PI},
    {x:20.0, z:WD+3.6, kind:'bean', yaw:Math.PI}, {x:22.0, z:WD+3.6, kind:'bean', yaw:Math.PI},
  ],
  [ // Comercial
    {x:26.0, z:12.8, kind:'bell', yaw:Math.PI},
    {x:30.4, z:15.2, kind:'sofa', yaw:Math.PI}, {x:31.6, z:15.2, kind:'sofa', yaw:Math.PI},
    {x:40.0, z:12.6, kind:'coffee', yaw:Math.PI}, {x:41.2, z:12.6, kind:'water', yaw:Math.PI},
    {x:44.0, z:15.6, kind:'bean', yaw:Math.PI},
  ],
  [ // Marketing
    {x:6.0, z:15.4, kind:'photo', yaw:0}, {x:5.0, z:16.6, kind:'shoot', yaw:Math.PI},
    {x:17.0, z:15.0, kind:'bean', yaw:Math.PI}, {x:18.6, z:15.0, kind:'bean', yaw:Math.PI},
    {x:28.0, z:12.6, kind:'coffee', yaw:Math.PI}, {x:29.2, z:12.6, kind:'water', yaw:Math.PI},
    {x:40.4, z:15.2, kind:'sofa', yaw:Math.PI}, {x:41.6, z:15.2, kind:'sofa', yaw:Math.PI},
  ],
];
COPA.forEach((list, f) => list.forEach(s => { s.by = null; s.f = f; }));
const COPA_LABEL = {drink:'Pegando energético', coffee:'Tomando café', water:'Pegando água', pong:'Jogando pingue-pongue', arcade:'No fliperama', sofa:'Descansando', foos:'Jogando pebolim', bean:'Relaxando', bench:'Na arquibancada', standup:'Na daily', bell:'Tocando o sino', photo:'Posando pra foto', shoot:'Fotografando'};

/* plans */
const NOW = Date.now();
function nextDow(dow, h, m){ const d = new Date(); d.setHours(h,m,0,0); let add = (dow - d.getDay() + 7) % 7; if (add === 0 && d.getTime() <= Date.now()) add = 7; d.setDate(d.getDate()+add); return d.getTime(); }
const H5 = 5*3600e3, D7 = 7*86400e3;
const PLANS = [
  {id:'claude', name:'Claude', tier:'Max 20x', brl:1100, mono:'C', color:'#E39B6B', prov:'claude', meters:[{label:'Sessão atual', used:16, reset:NOW + 31*60e3, win:H5}, {label:'Semanal · todos os modelos', used:11, reset:nextDow(3,9,0), win:D7}, {label:'Semanal · Fable', used:0, reset:nextDow(3,9,0), win:D7, frozen:true}]},
  {id:'gpt', name:'ChatGPT', tier:'5x', brl:550, mono:'G', color:'#9BD3B7', prov:'gpt', meters:[{label:'Codex · janela de 5h', used:8, reset:NOW + (3*60+12)*60e3, win:H5}, {label:'Codex · semanal', used:23, reset:nextDow(1,6,0), win:D7}]},
  {id:'higgs', name:'Higgsfield', tier:'a confirmar', brl:null, basis:150, mono:'H', color:'#C8B6F0', prov:'higgs', credit:{total:3000, left:1940, unit:'créditos', daysLeft:12, cycle:30, mix:{Imagens:640, Vídeos:420}}},
  {id:'eleven', name:'ElevenLabs', tier:'Starter', brl:33, approx:true, mono:'E', color:'#F0E2B6', prov:'eleven', credit:{total:30000, left:9400, unit:'créditos', daysLeft:9, cycle:30, mix:{Narração:15100, URA:5500}}},
];
const PLAN = Object.fromEntries(PLANS.map(p => [p.id, p]));
function meterInfo(m){
  const now = Date.now();
  if (REAL){ if (!m.reset || m.reset <= now) return {elapsed: 1, proj: m.reset ? 'Janela reiniciada, aguardando a próxima leitura' : 'Sem data de reinício', cls: '', over: false}; }
  else while (m.reset <= now){ m.reset += m.win; m.used = 0; }
  const elapsed = clamp(1 - (m.reset - now)/m.win, .001, 1); let proj, cls = '';
  if (m.frozen || m.used < .5) proj = 'Sem uso nesta janela';
  else { const rate = m.used / (elapsed*m.win), at = m.used + rate*(m.reset - now);
    if (at <= 100){ proj = `No ritmo atual, sobram ${Math.round(100-at)}% no reset`; cls = at < 70 ? 'good' : ''; }
    else { proj = `No ritmo atual, acaba em ${fmtSpan((100-m.used)/rate)}, antes do reset`; cls = 'bad'; } }
  return {elapsed, proj, cls, over: cls === 'bad'};
}
function creditInfo(c){
  if (!c || !c.total) return {usedPct: 0, elapsed: 0, leftover: 0, proj: (c && c.label) || 'Sem fonte de dados', cls: '', short: false, rate: 0};
  const elapsedD = c.elapsedDays ?? (c.cycle - c.daysLeft), usedC = c.total - c.left, rate = usedC / Math.max(1, elapsedD), need = rate * c.daysLeft, usedPct = usedC / c.total * 100;
  if (need <= c.left) return {usedPct, elapsed: elapsedD/c.cycle, leftover: c.left - need, proj:`No ritmo atual, sobram ~${num(c.left-need)} ${c.unit} na renovação`, cls:'good', short:false, rate};
  return {usedPct, elapsed: elapsedD/c.cycle, leftover:0, runout: c.left/rate, proj:`No ritmo atual, acaba em ~${Math.max(1,Math.round(c.left/rate))} dias (renova em ${c.daysLeft})`, cls:'bad', short:true, rate};
}
const usdPerCredit = {higgs: PLAN.higgs.basis/CAMBIO/PLAN.higgs.credit.total, eleven: PLAN.eleven.brl/CAMBIO/PLAN.eleven.credit.total};
// Modo real: nada de número inventado. Medidores e créditos chegam do agente (fonte.js); sem fonte, ficam vazios
if (REAL) PLANS.forEach(p => { if (p.meters) p.meters = []; else p.credit = null; });

/* business numbers shown on the walls (simulated) */
const BIZ = {
  workana:{propostas:6, respostas:2, contratos:3, metaContratos:6, projetos:182, nota:'4,75'},
  funnel:{Novo:14, Contato:9, Proposta:5, Negociação:3, Fechado:2},
  ads:{cliques:312, leads:11, cpc:.82, gasto:38},
  social:{edevshub:{seguidores:1240, semana:[1,1,0,0,0], alcance:5800}, revix:{seguidores:3480, semana:[1,0,1,0,0], alcance:18400}},
  uptime:[['kingprime.com.br',99.98],['beeder.me',100],['useconvoo.com.br',99.91],['edevshub.com',100]],
  bell:0,
};
