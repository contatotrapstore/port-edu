import type {ContentAsset} from '@/lib/content/storage';

// Prévia como o post vai aparecer: Reel e Story numa moldura de celular (9:16); carrossel como fileira de slides (4:5).
// As URLs chegam assinadas em lote pela página; o vídeo só baixa quando der play (a capa aparece na hora).
export default function AssetPreview({assets,urls={}}:{assets:ContentAsset[];urls?:Record<string,string>}){
  const videos=assets.filter(asset=>asset.kind==='mp4').sort((a,b)=>(a.provenance.slide||0)-(b.provenance.slide||0));
  if(videos.length===0)return <p className="studio-fieldhint">Esta revisão ainda não tem vídeos. Gere os vídeos para ver a prévia; alterar o roteiro exige gerar de novo.</p>;
  const vertical=videos.some(video=>video.provenance.format==='reel'||video.provenance.format==='story');
  const src=(asset:ContentAsset)=>urls[asset.id]||'/api/content/assets/'+asset.id;
  return <div className={vertical?'studio-phones':'studio-slides'}>{videos.map((video,i)=>{
    const slide=video.provenance.slide,format=video.provenance.format;
    const label=format==='reel'?'Reel':format==='story'?'Story':`Slide ${i+1} de ${videos.length}`;
    const poster=assets.find(asset=>asset.kind==='png'&&asset.provenance.slide===slide);
    return <figure key={video.id} className="studio-frame">
      <video controls playsInline loop={!vertical} preload="none" width={1080} height={vertical?1920:1350}
        poster={poster?src(poster):undefined} src={src(video)} aria-label={'Prévia: '+label}/>
      <figcaption><span>{label}</span><a href={src(video)} target="_blank" rel="noreferrer">Abrir ↗</a>{poster&&<a href={src(poster)} target="_blank" rel="noreferrer">Imagem ↗</a>}</figcaption>
    </figure>;
  })}</div>;
}
