import {getAdmin} from '@/lib/content/auth';
import {getPreviewUrl} from '@/lib/content/storage';

export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
  const headers={'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow'};
  if(!await getAdmin())return new Response('Acesso necessário',{status:401,headers});
  try{
    const url=await getPreviewUrl((await params).id);
    return new Response(null,{status:302,headers:{...headers,Location:url}});
  }catch{return new Response('Arquivo indisponível',{status:404,headers});}
}
