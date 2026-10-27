import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {authorizedPublisher,publisherConnectionString} from '../../../src/lib/content/publisher-security.mjs';
import {publicationTick} from '../../../src/lib/content/publication-queue.mjs';
test('cloud time budget stops before starting more provider work',async()=>{
 const db={query:async sql=>{assert.match(sql,/publisher_seen_at/);return {rows:[]};}};
 const result=await publicationTick(db,{api:async()=>{throw Error('must not call Meta');},sign:async()=>{throw Error('must not sign');},shouldContinue:()=>false});
 assert.equal(result.state,'deferred');
});
test('cron authentication fails closed without disclosing secrets',()=>{
 const secret='x'.repeat(64);
 const stamp=String(Math.floor(Date.now()/1000));
 const signed='Bearer '+stamp+'.'+createHmac('sha256',secret).update(stamp).digest('hex');
 for(const header of [null,'','Bearer wrong','bearer '+secret,'Bearer '+secret+' '])assert.equal(authorizedPublisher(header,secret),false);
 assert.equal(authorizedPublisher('Bearer '+secret,undefined),false);
 assert.equal(authorizedPublisher('Bearer short','short'),false);
 assert.equal(authorizedPublisher('Bearer '+secret,secret),false);
 assert.equal(authorizedPublisher(signed,secret),true);
 assert.equal(authorizedPublisher(signed,secret,Date.now()+120000),false);
 assert.equal(authorizedPublisher(signed,secret,Date.now()-120000),false);
});
test('publisher session lock must use session pooler, never transaction pooler',()=>{
 const url=new URL(publisherConnectionString('postgresql://role:pass@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require'));
 assert.equal(url.port,'5432');assert.equal(url.searchParams.has('sslmode'),false);
 assert.equal(new URL(publisherConnectionString('postgresql://role:pass@localhost:5432/test')).port,'5432');
});
