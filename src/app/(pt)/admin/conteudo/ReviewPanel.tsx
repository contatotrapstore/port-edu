import type {ContentAsset} from '@/lib/content/storage';
import {getReview,assetFingerprint} from '@/lib/content/review';
import ReviewForm from './ReviewForm';
export default async function ReviewPanel({postId,revisionId,assets}:{postId:string;revisionId:string;assets:ContentAsset[]}){
 const review=await getReview(postId,revisionId,assets);
 return <section className="studio-editor studio-review" aria-labelledby="review-heading"><h2 id="review-heading">Sua revisão</h2><p><strong>{review?.decision==='approved'?'Conteúdo aprovado · confira a agenda abaixo':review?.decision==='changes'?'Ajustes solicitados':'Aguardando sua análise'}</strong></p>{review?.notes&&<blockquote>{review.notes}</blockquote>}<ReviewForm key={revisionId} postId={postId} revisionId={revisionId} fingerprint={assetFingerprint(assets)}/></section>;
}
