import {createServerClient} from '@supabase/ssr';
import {NextResponse,type NextRequest} from 'next/server';
export async function proxy(request:NextRequest){
  let response=NextResponse.next({request});
  const url=process.env.NEXT_PUBLIC_CONTENT_SUPABASE_URL,key=process.env.NEXT_PUBLIC_CONTENT_SUPABASE_PUBLISHABLE_KEY;
  if(url&&key){
    const auth=createServerClient(url,key,{cookies:{getAll:()=>request.cookies.getAll(),setAll:values=>{
      for(const {name,value}of values)request.cookies.set(name,value);
      response=NextResponse.next({request});
      for(const {name,value,options}of values)response.cookies.set(name,value,options);
    }}});
    await auth.auth.getUser();
  }
  response.headers.set('Cache-Control','private, no-store');
  response.headers.set('X-Robots-Tag','noindex, nofollow');
  return response;
}
export const config={matcher:['/admin/:path*','/api/content/:path*']};
