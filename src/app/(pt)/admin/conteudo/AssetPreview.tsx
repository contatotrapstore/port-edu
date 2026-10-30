import Image from 'next/image';
import type {ContentAsset} from '@/lib/content/storage';

// Prévia como o post vai aparecer: Reel e Story numa moldura de celular (9:16); carrossel como fileira de slides (4:5).
// As URLs chegam assinadas em lote pela página; o vídeo só baixa quando der play (a capa aparece na hora).
// Imagem nativa (JPEG publicável do import) aparece como imagem: é exatamente o arquivo que vai para a Meta.
export default function AssetPreview({assets,urls={}}:{assets:ContentAsset[];urls?:Record<string,string>}){
  const media=assets.filter(asset=>asset.kind==='mp4'||(asset.kind==='jpg'&&asset.provenance.publish===true)).sort((a,b)=>(a.provenance.slide||0)-(b.provenance.slide||0));
  if(media.length===0)return <p className="studio-fieldhint">Esta revisão ainda não tem mídia para publicar. Gere os vídeos para ver a prévia; alterar o roteiro exige gerar de novo.</p>;
  const vertical=media.some(item=>item.provenance.format==='reel'||item.provenance.format==='story');
  const src=(asset:ContentAsset)=>urls[asset.id]||'/api/content/assets/'+asset.id;
  return <div className={vertical?'studio-phones':'studio-slides'}>{media.map((item,i)=>{
    const slide=item.provenance.slide,format=item.provenance.format,image=item.kind==='jpg';
    const label=(format==='reel'?'Reel':format==='story'?'Story':`Slide ${i+1} de ${media.length}`)+(image?' · imagem':'');
    const poster=image?undefined:assets.find(asset=>asset.kind==='png'&&asset.provenance.slide===slide);
    return <figure key={item.id} className="studio-frame">
      {image
        // URL assinada e privada do Storage: servida como está, sem passar pelo otimizador de imagens
        ?<Image unoptimized src={src(item)} alt={'Prévia: '+label} width={item.provenance.width||1080} height={item.provenance.height||(vertical?1920:1350)}/>
        :<video controls playsInline loop={!vertical} preload="none" width={1080} height={vertical?1920:1350}
          poster={poster?src(poster):undefined} src={src(item)} aria-label={'Prévia: '+label}/>}
      <figcaption><span>{label}</span><a href={src(item)} target="_blank" rel="noreferrer">Abrir ↗</a>{poster&&<a href={src(poster)} target="_blank" rel="noreferrer">Imagem ↗</a>}</figcaption>
    </figure>;
  })}</div>;
}
