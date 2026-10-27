import type {ContentAsset} from '@/lib/content/storage';

export default function AssetPreview({assets}:{assets:ContentAsset[]}){
  const videos=assets.filter(asset=>asset.kind==='mp4');
  return <section className="studio-preview">
    <h2>Prévia desta revisão</h2>
    {videos.length===0?<p>Esta revisão ainda não tem vídeos. Alterar o roteiro exige uma nova renderização.</p>:<>
      <p>Use os controles para tocar, pausar ou ajustar o som. Vídeos privados, com acesso temporário.</p>
      <div className="studio-preview-grid">{videos.map(video=>{
        const slide=video.provenance.slide,vertical=video.provenance.format==='reel'||video.provenance.format==='story';
        const label=vertical?(video.provenance.format==='reel'?'Reel narrado':'Story'):'Slide '+slide;
        const poster=assets.find(asset=>asset.kind==='png'&&asset.provenance.slide===slide);
        return <article key={video.id}>
          <h3>{label}</h3>
          <video controls playsInline loop={!vertical} preload="none" width={1080} height={vertical?1920:1350}
            poster={poster?'/api/content/assets/'+poster.id:undefined}
            src={'/api/content/assets/'+video.id} aria-label={'Prévia de '+label}/>
          <a href={'/api/content/assets/'+video.id} target="_blank" rel="noreferrer">Abrir vídeo ↗</a>
          {poster&&<a href={'/api/content/assets/'+poster.id} target="_blank" rel="noreferrer">Imagem estática ↗</a>}
        </article>;
      })}</div>
    </>}
  </section>;
}
