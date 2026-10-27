import {authorizedPublisher} from '@/lib/content/publisher-security.mjs';
import {runPublisher} from '@/lib/content/publisher-runner.mjs';
export const runtime='nodejs';
export const maxDuration=300;
export const dynamic='force-dynamic';
export async function POST(request:Request){
 const headers={'Cache-Control':'no-store','X-Robots-Tag':'noindex'};
 if(!authorizedPublisher(request.headers.get('authorization'),process.env.CONTENT_PUBLISHER_SECRET))return Response.json({error:'unauthorized'},{status:401,headers});
 const result=await runPublisher(process.env,'cloud');
 return Response.json(result,{status:result.state==='error'?503:200,headers});
}
