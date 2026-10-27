import {NextRequest,NextResponse} from 'next/server';
import {finishInstagramAuthorization} from '@/lib/content/instagram-oauth';
export const dynamic='force-dynamic';
export async function GET(request:NextRequest){
 let status='connected';try{await finishInstagramAuthorization(new URL(request.url));}catch{status='connection_failed';}
 const response=NextResponse.redirect('https://www.edevshub.com/admin/conteudo?instagram='+status);
 response.headers.set('Cache-Control','no-store');response.headers.set('Referrer-Policy','no-referrer');return response;
}
