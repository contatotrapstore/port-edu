import {NextResponse,type NextRequest} from 'next/server';
import {contentAuth} from '@/lib/content/auth';
export async function GET(request:NextRequest){
 const code=request.nextUrl.searchParams.get('code');
 if(code){const auth=await contentAuth();const {error}=await auth.auth.exchangeCodeForSession(code);if(!error)return NextResponse.redirect(new URL('/admin/conteudo',request.url));}
 return NextResponse.redirect(new URL('/admin/login?status=expired',request.url));
}
