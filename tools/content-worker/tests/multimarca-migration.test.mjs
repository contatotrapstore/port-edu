import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PGlite} from '@electric-sql/pglite';

// Todas as migrações em ordem; a última cadastra a Revix e libera a conexão do Instagram por marca
test('migração multimarca cadastra Revix desligada e aceita outra conta do Instagram',async()=>{
 const db=new PGlite();
 try{
  await db.exec('create role anon; create role authenticated; create role service_role; create schema auth; create table auth.users(id uuid primary key);');
  const dir=new URL('../../../supabase/migrations/',import.meta.url);
  for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.sql')).sort())await db.exec(fs.readFileSync(new URL(f,dir),'utf8'));
  const brands=(await db.query("select handle,guidelines->>'instagram_username' u,guidelines->'visual'->'colors'->>'bg' bg from content_studio.brands order by handle")).rows;
  assert.deepEqual(brands.map(b=>b.handle),['edevshub','revix']);
  assert.equal(brands[1].u,'revix.app');assert.equal(brands[1].bg,'#090909');
  const s=(await db.query("select publication_enabled,research_enabled,publication_mode,publisher_location from content_studio.settings s join content_studio.brands b on b.id=s.brand_id where b.handle='revix'")).rows[0];
  assert.deepEqual(s,{publication_enabled:false,research_enabled:false,publication_mode:'approved',publisher_location:'cloud'});
  const id=(await db.query("select id from content_studio.brands where handle='revix'")).rows[0].id;
  await db.query("insert into content_studio.instagram_connections(brand_id,account_id,username,token_ciphertext) values($1,'17841400000000001','revix.app','x.y.z')",[id]);
  await assert.rejects(db.query("insert into content_studio.instagram_connections(brand_id,account_id,username,token_ciphertext) select id,'17841400000000001','outra','x' from content_studio.brands where handle='edevshub'"));
 }finally{await db.close();}
});
