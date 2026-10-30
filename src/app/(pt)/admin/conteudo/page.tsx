import PublicationControl from './PublicationControl';
import {publicationSettings,listSchedules} from '@/lib/content/scheduling';
import {instagramAppReady} from '@/lib/content/instagram-oauth';
import InstagramConnection from './InstagramConnection';
import {instagramState} from '@/lib/content/instagram';
import AssetPreview from './AssetPreview';
import ResearchControl from './ResearchControl';
import {researchState} from '@/lib/content/research';
import {listAssets,signedPreviewUrls} from '@/lib/content/storage';
import {renderStatus} from '@/lib/content/render';
import RenderControl from './RenderControl';
import ReviewPanel from './ReviewPanel';
import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getAdmin} from '@/lib/content/auth';
import {listPosts} from '@/lib/content/repository';
import {logout,selectBrand} from '../actions';
import {brandContext} from '@/lib/content/brand';
import DraftForm from './DraftForm';
import CentralLink from './CentralLink';
import PautaLink from './PautaLink';
const states:Record<string,string>={draft:'Rascunho',producing:'Em produção',review:'Em revisão',ready:'Pronto',scheduled:'Agendado',publishing:'Publicando',publishing_unknown:'Conferir publicação',published:'Publicado',paused:'Pausado'};
export default async function Studio({searchParams}:{searchParams:Promise<{post?:string;saved?:string;error?:string;instagram?:string}>}){
 const admin=await getAdmin();if(!admin)redirect('/admin/login');
 // tudo em paralelo: antes eram ~10 idas ao banco em fila a cada troca de pauta
 const params=await searchParams;
 const [posts,research,instagram,appReady,publication,schedules,{brand,brands}]=await Promise.all([listPosts(),researchState(),instagramState(),instagramAppReady(),publicationSettings(),listSchedules(),brandContext()]);
 const selected=posts.find(p=>p.id===params.post);
 const [assets,render]=selected?await Promise.all([listAssets(selected.active_revision_id),renderStatus(selected.active_revision_id)]):[[],null];
 const urls=await signedPreviewUrls(assets);
 const online=publication.publisher_online;
 const formato=(p?:typeof selected)=>p?.brief?.format==='reel'?'Reel':p?.brief?.format==='story'?'Story':`Carrossel · ${p?.slides?.length||0} slides`;
 const instagramOk=instagram?.health==='verified';
 const editor=<section className="studio-editor" key={selected?.active_revision_id||'new'}><div className="studio-sectionhead"><h2>{selected?'Texto e roteiro':'Nova pauta'}</h2><span>Salvar cria uma revisão nova</span></div>{selected?.brief?.generation&&<p className="studio-fieldhint">Gerado com {selected.brief.generation.engine==='codex'?'Codex / ChatGPT':'Claude Code'} · {selected.brief.generation.model}</p>}<DraftForm><input type="hidden" name="postId" value={selected?.id||''}/><input type="hidden" name="revisionId" value={selected?.active_revision_id||''}/><fieldset style={{border:0,padding:0,marginBottom:20}}><legend>Formato</legend>{[['carousel','Carrossel animado'],['reel','Reel narrado'],['story','Story']].map(([value,label])=><label key={value} style={{display:'inline-flex',alignItems:'center',gap:8,marginRight:20}}><input type="radio" name="format" value={value} defaultChecked={(selected?.brief?.format??'carousel')===value} style={{width:'auto'}}/>{label}</label>)}</fieldset><label htmlFor="topic">Tema / gancho</label><input id="topic" name="topic" required minLength={5} maxLength={160} defaultValue={selected?.topic} placeholder="Qual problema este post ajuda a resolver?"/><label htmlFor="brief">Briefing</label><textarea id="brief" name="brief" rows={3} required minLength={10} maxLength={5000} defaultValue={selected?.brief?.text} placeholder="Público, objetivo e mensagem principal."/><label htmlFor="slides">Roteiro das cenas</label><p className="studio-fieldhint" id="slides-help">Uma linha por cena, de 2 a 10. Comece com um título curto, seguido da fala. Reels e Stories viram um vídeo vertical contínuo com narração; mantenha o roteiro conciso (Reel até 90 s, Story até 60 s).</p><textarea id="slides" name="slides" rows={7} required maxLength={12000} aria-describedby="slides-help" defaultValue={selected?.slides?.join('\n')} placeholder={'Uma pergunta que abre a conversa.\nUma explicação útil.\nUm próximo passo.'}/><label htmlFor="caption">Legenda</label><textarea id="caption" name="caption" rows={4} maxLength={2200} defaultValue={selected?.caption}/><label htmlFor="sources">Fontes e referências</label><textarea id="sources" name="sources" rows={2} maxLength={5000} defaultValue={selected?.source_refs?.join('\n')} placeholder="Um link HTTPS por linha"/><div className="studio-save"><small>Salvar cria uma nova revisão. Não publica no Instagram.</small><button type="submit">Salvar rascunho</button></div></DraftForm></section>;
 return <div className="studio-shell"><aside className="studio-sidebar"><Link href="/admin/conteudo" className="studio-wordmark studio-brand"><svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><rect x="3" y="3" width="5" height="24" rx="2.5" fill="#EDE6D6"/><rect x="22" y="3" width="5" height="24" rx="2.5" fill="#EDE6D6"/><rect x="8" y="13.5" width="3" height="3" fill="#EDE6D6"/><rect x="19" y="13.5" width="3" height="3" fill="#EDE6D6"/><circle cx="15" cy="15" r="2.6" fill="#F5B935"/></svg><b>EDevsHub<small>Content Studio</small></b></Link><nav className="studio-appswitch" aria-label="Trocar de painel"><CentralLink><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 14V5l6-3 6 3v9h-4v-4H6v4z" fill="currentColor"/></svg>Central</CentralLink><a aria-current="page"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="1.5" y="3" width="13" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M6.5 5.8v4.4L10.3 8z" fill="currentColor"/></svg>Conteúdo</a></nav><nav className="studio-sections" aria-label="Navegação do estúdio"><a href="#editorial" aria-current="page">Pautas <span>{posts.length}</span></a><a href="#agenda">Agenda</a><a href="#pesquisa">Pesquisa automática</a><a href="#ajustes">Ajustes</a><a href="/" target="_blank" rel="noreferrer">Abrir portfólio ↗</a></nav>{brands.length>1&&<form action={selectBrand} className="studio-brands" aria-label="Marca">{brands.map(b=><button key={b.handle} name="marca" value={b.handle} aria-current={b.handle===brand.handle?'true':undefined}>{b.name}<small>@{b.username}</small></button>)}</form>}<div className="studio-account"><span>@{brand.username}</span><small>{admin.email}</small><form action={logout}><button className="studio-link-button">Sair</button></form></div></aside>
 <main className="studio-main" id="editorial">
  <header className="studio-pagehead"><div><p className="studio-eyebrow">ESTÚDIO EDITORIAL</p><h1>Conteúdo com intenção.</h1><p>{String(brand.guidelines.tagline||'Serviços, cases e o que muda no mundo da IA.')}</p></div><Link className="studio-primary" href="/admin/conteudo?post=new">Novo rascunho <span>＋</span></Link></header>
  <div className="studio-statusbar">
   <span data-ok={publication.publication_enabled?'1':'0'}><i/>{publication.publication_enabled?'Publicação habilitada':'Publicação desativada'}</span>
   <span data-ok={instagramOk?'1':'0'}><i/>{instagramOk?'Instagram conectado':'Instagram pendente'}</span>
   <span data-ok={online?'1':'0'}><i/>{online?(publication.publisher_location==='cloud'?'Publicador online na nuvem':'Publicador online neste PC'):'Publicador sem sinal'}</span>
   <span>Horário de Brasília</span>
  </div>
  {params.saved&&<p role="status" className="studio-notice">Nova revisão salva no banco.</p>}{params.error&&<p role="alert" className="studio-notice">Não foi possível salvar. Confira os campos, sua conexão e se o post foi alterado em outra janela.</p>}{params.instagram&&<p role="status" className="studio-notice">{params.instagram==='connected'?'Instagram conectado com sucesso. Confira o estado de publicação na agenda.':'Não foi possível concluir a conexão. Confira permissões e tente novamente.'}</p>}
  <div className="studio-workspace">
   <section className="studio-library"><div className="studio-sectionhead"><h2>Suas pautas</h2><span>{posts.length} registros</span></div>{posts.length===0?<div className="studio-empty"><span className="studio-empty-number">01</span><h3>A próxima ideia começa aqui.</h3><p>Escreva um problema real do seu cliente ou uma novidade de IA que mereça ser explicada.</p></div>:<ul>{posts.map(p=><li key={p.id}><PautaLink href={'/admin/conteudo?post='+p.id} selected={selected?.id===p.id}><span className="studio-post-state" data-state={p.state}>{states[p.state]||p.state}</span><h3>{p.topic}</h3><small>{new Date(p.created_at).toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'})} · {formato(p)}</small></PautaLink></li>)}</ul>}</section>
   <div className="studio-col">
    {selected&&<section className="studio-stage" aria-labelledby="stage-title"><div className="studio-sectionhead"><h2 id="stage-title">Prévia</h2><span><span className="studio-post-state" data-state={selected.state}>{states[selected.state]||selected.state}</span> {formato(selected)}</span></div><h3 className="studio-stage-topic">{selected.topic}</h3>{assets.length===0&&<RenderControl postId={selected.id} revisionId={selected.active_revision_id} state={render?.state}/>}<AssetPreview assets={assets} urls={urls}/></section>}
    {selected&&<ReviewPanel postId={selected.id} revisionId={selected.active_revision_id} assets={assets}/>}
    {selected?<details className="studio-fold"><summary>Editar texto e roteiro</summary>{editor}</details>:editor}
   </div>
  </div>
  <PublicationControl username={brand.username} location={publication.publisher_location} enabled={publication.publication_enabled} mode={publication.publication_mode} time={publication.publish_time} connected={instagramOk} online={online} lastSeen={publication.publisher_seen_at?new Date(publication.publisher_seen_at).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'}):null} error={publication.publisher_error} schedules={schedules} postId={selected?.id} revisionId={selected?.active_revision_id}/>
  <ResearchControl engine={research.settings.preferred_engine} daily={research.settings.research_enabled} runs={research.runs}/>
  <details id="ajustes" className="studio-fold studio-settings"><summary>Ajustes: conexão do Instagram e efeitos sonoros</summary>
   <InstagramConnection connected={instagramOk} appReady={appReady} username={brand.username}/>
   <section className="studio-research"><h2>Biblioteca de efeitos</h2><p className="studio-fieldhint">Amostra dos efeitos que o motor da fila gera (12 famílias). Sem músicas do catálogo do Instagram.</p><audio controls preload="none" aria-label="Amostra das doze famílias de efeitos sonoros" src="/content-studio/sound-preview.mp3?v=2"/></section>
  </details>
 </main></div>;
}


