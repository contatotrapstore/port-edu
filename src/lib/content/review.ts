import 'server-only';
import {createHash} from 'node:crypto';
import {requireAdmin} from './auth';
import {contentDb} from './db';

type Asset={id:string;sha256:string;kind:string;object_key:string;provenance:{slide?:number}};
export type Review={decision:'approved'|'changes';notes:string;revisionId:string;assetFingerprint:string};
export function assetFingerprint(assets:Asset[]){return createHash('sha256').update(JSON.stringify(assets.map(a=>[a.id,a.sha256,a.kind,a.object_key,a.provenance.slide]).sort((a,b)=>String(a[0]).localeCompare(String(b[0]))))).digest('hex');}
export async function getReview(postId:string,revisionId:string,assets:Asset[]):Promise<Review|null>{
 await requireAdmin();const db=contentDb();
 const event=(await db.query<{metadata:Review}>("select metadata from content_studio.events where entity_id=$1 and action='review.recorded' and metadata->>'revisionId'=$2 order by created_at desc,id desc limit 1",[postId,revisionId])).rows[0];
 if(!event)return null;
 return event.metadata.assetFingerprint===assetFingerprint(assets)?event.metadata:null;
}
export async function recordReview(postId:string,revisionId:string,decision:string,notes:string,confirmed:boolean,expectedFingerprint:string){
 const actor=await requireAdmin();
 if(!['approved','changes'].includes(decision)||notes.length>2000)throw Error('Revise os campos.');
 if(decision==='approved'&&!confirmed)throw Error('Confirme que conferiu os slides, o áudio e a legenda salvos.');
 if(decision==='changes'&&notes.trim().length<5)throw Error('Descreva o ajuste desejado.');
 const db=await contentDb().connect();
 try{await db.query('begin');
  const post=(await db.query('select p.active_revision_id,p.state,r.slides from content_studio.posts p join content_studio.revisions r on r.id=p.active_revision_id where p.id=$1 for update of p',[postId])).rows[0];
  if(!post||post.active_revision_id!==revisionId||['publishing','publishing_unknown','published'].includes(post.state))throw Error('A revisão mudou. Recarregue antes de avaliar.');
  const assets=(await db.query<Asset>('select id,sha256,kind,object_key,provenance from content_studio.assets where revision_id=$1',[revisionId])).rows;
  if(assetFingerprint(assets)!==expectedFingerprint)throw Error('As mídias mudaram. Recarregue e confira novamente.');
  const videos=assets.filter(a=>a.kind==='mp4');
  if(decision==='approved'&&(videos.length!==post.slides.length||!post.slides.every((_:string,i:number)=>videos.some(v=>v.provenance.slide===i+1))))throw Error('Gere todos os vídeos desta revisão antes de aprovar.');
  const metadata={decision,notes:notes.trim(),revisionId,assetFingerprint:assetFingerprint(assets)};
  await db.query("insert into content_studio.events(actor,entity_id,action,metadata) values($1,$2,$3,$4)",[actor.id,postId,'review.recorded',JSON.stringify(metadata)]);
  await db.query('commit');
 }catch(error){await db.query('rollback');throw error;}finally{db.release();}
}
