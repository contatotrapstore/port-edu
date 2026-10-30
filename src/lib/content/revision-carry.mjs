// Post pronto importado (brief.production==='manual-only'): a mídia veio de fora e o Studio não gera vídeo para ele.
export function isManualOnly(brief){return brief?.production==='manual-only';}
// Campos do brief importado que continuam valendo na revisão nova (texto e formato vêm do formulário).
const IMPORTED=['production','ai_generated','collaborators','import_key','importado','agendar_em'];
export function importedBriefFields(brief){
 if(!isManualOnly(brief))return {};
 return Object.fromEntries(IMPORTED.filter(k=>Object.hasOwn(brief,k)).map(k=>[k,brief[k]]));
}
// A mídia importada só segue para a revisão nova se ela ainda corresponde ao roteiro: mesmo formato e mesmos slides.
// Legenda, tema, briefing e fontes podem mudar. A cópia ganha ids novos, então a aprovação precisa ser refeita.
export function carriesImportedMedia(previous,input){
 return Boolean(previous)&&isManualOnly(previous.brief)&&(previous.brief.format??'carousel')===(input.format??'carousel')&&JSON.stringify(previous.slides)===JSON.stringify(input.slides);
}
const KEY=/^[0-9a-f-]{36}\/[a-zA-Z0-9._-]+$/;
// Cada arquivo é copiado no Storage para a pasta da revisão nova (object_key é único por asset).
export function copiedAssetPlan(assets,revisionId){
 if(!/^[0-9a-f-]{36}$/.test(revisionId)||!assets.every(a=>KEY.test(a.object_key)))throw Error('invalid_asset_copy');
 return assets.map(a=>({from:a.object_key,to:`${revisionId}/${a.object_key.split('/')[1]}`,kind:a.kind,sha256:a.sha256,provenance:{...a.provenance,copied_from:a.id}}));
}
