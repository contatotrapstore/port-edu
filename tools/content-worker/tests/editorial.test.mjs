import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';

const require = createRequire(new URL('../../../package.json', import.meta.url));
const ts = require('typescript');
function load(name, dependencies = {}) {
  const source = fs.readFileSync(new URL('../../../src/lib/content/' + name + '.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: id => {
    if (id === 'server-only') return {};
    if (!(id in dependencies)) throw Error('Unexpected import: ' + id);
    return dependencies[id];
  }, process: { env: { CONTENT_DATABASE_URL: 'configured', CONTENT_SUPABASE_STORAGE_KEY: 'test-only', NEXT_PUBLIC_CONTENT_SUPABASE_URL: 'configured', NEXT_PUBLIC_CONTENT_SUPABASE_PUBLISHABLE_KEY: 'configured' } }, URL });
  return exports;
}

test('admin authorization rejects missing session and nonmember, accepts only verified member', async () => {
  let user = null, member = false, reads = 0;
  const api = load('auth', {
    '@supabase/ssr': { createServerClient: () => ({ auth: { getUser: async () => ({ data: { user }, error: null }) } }) },
    'next/headers': { cookies: async () => ({ getAll: () => [] }) },
    './db': { contentDb: () => ({ query: async () => { reads++; return { rowCount: member ? 1 : 0 }; } }) },
  });
  await assert.rejects(api.requireAdmin()); assert.equal(reads, 0);
  user = { id: 'user-1', email: 'admin@example.test' };
  await assert.rejects(api.requireAdmin());
  member = true; assert.equal((await api.requireAdmin()).id, 'user-1');
});

test('draft input rejects unsafe source schemes, huge captions and invalid slide counts', () => {
  const { parseDraft } = load('input');
  const form = new FormData();
  for (const [key,value] of Object.entries({ topic:'Tema válido',brief:'Objetivo claro do conteúdo',caption:'Legenda',slides:'Primeiro slide\nSegundo slide',sources:'https://example.test' })) form.set(key,value);
  assert.equal(parseDraft(form).slides.length, 2);
  form.set('sources','javascript:alert(1)'); assert.throws(() => parseDraft(form));
  form.set('sources',''); form.set('caption','a'.repeat(2201)); assert.throws(() => parseDraft(form));
  form.set('caption',''); form.set('slides','Um'); assert.throws(() => parseDraft(form));
});

test('save failure returns an error without navigating away from the unsaved draft', async () => {
  const api = load('../../app/admin/actions', {
    'next/headers': {}, 'next/navigation': { redirect: () => { throw Error('Unexpected navigation'); } },
    'next/cache': {}, '@/lib/content/auth': {}, '@/lib/content/review': {}, '@/lib/content/render': {},
    '@/lib/content/input': { parseDraft: () => ({}) },
    '@/lib/content/repository': { saveDraft: async () => { throw Error('Conflict'); } },
  });
  const form = new FormData(); form.set('topic', 'Meu texto não salvo');
  const result = await api.savePost(form);
  assert.equal(typeof result.error, 'string');
  assert.equal(form.get('topic'), 'Meu texto não salvo');
});

test('private preview authorizes before reading asset and issues only short-lived URLs', async () => {
  let allowed=false, reads=0, signed=0;
  const api=load('storage',{
    './auth':{requireAdmin:async()=>{if(!allowed)throw Error('Unauthorized');return {id:'admin'};}},
    './db':{contentDb:()=>({query:async()=>{reads++;return {rows:[{object_key:'00000000-0000-4000-8000-000000000001/slide-01.mp4'}]};}})},
    '@supabase/supabase-js':{createClient:()=>({storage:{from:bucket=>{assert.equal(bucket,'content-studio');return {createSignedUrl:async(key,ttl)=>{assert.equal(ttl,300);signed++;return {data:{signedUrl:'https://example.test/private'},error:null};}};}}})},
  });
  await assert.rejects(api.getPreviewUrl('00000000-0000-4000-8000-000000000001'));
  assert.equal(reads,0);assert.equal(signed,0);allowed=true;
  assert.equal(await api.getPreviewUrl('00000000-0000-4000-8000-000000000001'),'https://example.test/private');
  assert.equal(signed,1);
});

test('draft revision is immutable, stale edits roll back and editing suspends prior schedule', async () => {
  const db = new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key);');
    await db.exec(fs.readFileSync(new URL('../../../supabase/migrations/20261027001716_content_studio_foundation.sql',import.meta.url),'utf8'));
    const actor = '00000000-0000-4000-8000-000000000001';
    const client = { query: (...args) => db.query(...args), release() {} };
    const api = load('repository', { 'node:crypto': { createHash }, './db': { contentDb: () => ({ connect: async () => client }) }, './auth': { requireAdmin: async () => ({ id: actor }) } });
    const input = { topic:'Teste editorial',brief:'Brief claro',caption:'Legenda',slides:['Um','Dois'],sources:[] };
    const id = await api.saveDraft(input);
    const first = (await db.query('select active_revision_id from content_studio.posts where id=$1',[id])).rows[0].active_revision_id;
    await db.query("insert into content_studio.schedules(revision_id,account_id,local_date,slot_id,local_time,state) values($1,'test-account','2030-01-01','main','12:30','scheduled')",[first]);
    await db.query("insert into content_studio.jobs(revision_id,kind) values($1,'render')",[first]);
    await api.saveDraft({...input,caption:'Atualizada'},id,first);
    await assert.rejects(api.saveDraft(input,id,first));
    assert.equal((await db.query('select count(*)::int n from content_studio.revisions')).rows[0].n,2);
    assert.equal((await db.query('select caption from content_studio.revisions where id=$1',[first])).rows[0].caption,'Legenda');
    assert.equal((await db.query('select state from content_studio.schedules')).rows[0].state,'paused');
    assert.equal((await db.query('select state from content_studio.jobs')).rows[0].state,'cancelled');
  } finally { await db.close(); }
});

