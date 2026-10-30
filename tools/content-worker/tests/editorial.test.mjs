import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import * as carry from '../../../src/lib/content/revision-carry.mjs';

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
    'react': { cache: f => f },
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
  assert.equal(parseDraft(form).format, 'carousel');
  form.set('format','reel'); assert.equal(parseDraft(form).format,'reel');
  form.set('format','story'); assert.equal(parseDraft(form).format,'story');
  form.set('format','unsupported'); assert.throws(()=>parseDraft(form));
  form.set('format','carousel');
  form.set('sources','javascript:alert(1)'); assert.throws(() => parseDraft(form));
  form.set('sources',''); form.set('caption','a'.repeat(2201)); assert.throws(() => parseDraft(form));
  form.set('caption',''); form.set('slides','Um'); assert.throws(() => parseDraft(form));
});

test('save failure returns an error without navigating away from the unsaved draft', async () => {
  const api = load('../../app/(pt)/admin/actions', {
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
    const api = load('repository', { 'node:crypto': { createHash }, './revision-carry.mjs': carry, './storage': { copyAssetObjects: async () => { throw Error('no copy expected'); }, removeAssetObjects: async () => {} }, './db': { contentDb: () => ({ connect: async () => client }) }, './auth': { requireAdmin: async () => ({ id: actor }) }, './brand': { currentBrand: async () => ({ id: (await db.query("select id from content_studio.brands where handle='edevshub'")).rows[0].id, handle: 'edevshub' }) } });
    const input = { topic:'Teste editorial',brief:'Brief claro',caption:'Legenda',slides:['Um','Dois'],sources:[],format:'reel' };
    const id = await api.saveDraft(input);
    const first = (await db.query('select active_revision_id from content_studio.posts where id=$1',[id])).rows[0].active_revision_id;
    assert.equal((await db.query('select brief from content_studio.revisions where id=$1',[first])).rows[0].brief.format,'reel');
    await db.query("update content_studio.revisions set brief=brief || $1::jsonb where id=$2",[JSON.stringify({vertical:{series:'Minha série',scenes:[{title:'A',narration:'Fala original'},{title:'B',narration:'Outra fala'}]}}),first]);
    await db.query("insert into content_studio.schedules(revision_id,account_id,local_date,slot_id,local_time,state) values($1,'test-account','2030-01-01','main','12:30','scheduled')",[first]);
    await db.query("insert into content_studio.jobs(revision_id,kind) values($1,'render')",[first]);
    await api.saveDraft({...input,caption:'Atualizada'},id,first);
    const latest=(await db.query('select brief from content_studio.revisions where id=(select active_revision_id from content_studio.posts where id=$1)',[id])).rows[0];
    assert.equal(latest.brief.vertical.series,'Minha série');
    await assert.rejects(api.saveDraft(input,id,first));
    assert.equal((await db.query('select count(*)::int n from content_studio.revisions')).rows[0].n,2);
    assert.equal((await db.query('select caption from content_studio.revisions where id=$1',[first])).rows[0].caption,'Legenda');
    assert.equal((await db.query('select state from content_studio.schedules')).rows[0].state,'paused');
    assert.equal((await db.query('select state from content_studio.jobs')).rows[0].state,'cancelled');
  } finally { await db.close(); }
});

// Post pronto importado: editar só a legenda leva a mídia conferida para a revisão nova (cópia com ids novos)
test('imported post: caption edit copies the media, script edit leaves it without media, failures roll back', async () => {
  const db = new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create role service_role; create schema auth; create table auth.users(id uuid primary key);');
    const dir = new URL('../../../supabase/migrations/', import.meta.url);
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort()) await db.exec(fs.readFileSync(new URL(f, dir), 'utf8'));
    const brand = (await db.query("select id from content_studio.brands where handle='revix'")).rows[0].id;
    let failInsert = false, copyFails = false; const copies = [], removed = [];
    const client = { query: (sql, ...args) => { if (failInsert && String(sql).startsWith('insert into content_studio.assets')) return Promise.reject(Error('db down')); return db.query(sql, ...args); }, release() {} };
    const storage = { copyAssetObjects: async plan => { if (copyFails) throw Error('Não foi possível copiar as mídias.'); copies.push(...plan.map(p => [p.from, p.to])); return plan.map(p => p.to); }, removeAssetObjects: async keys => { removed.push(...keys); } };
    const api = load('repository', { 'node:crypto': { createHash }, './revision-carry.mjs': carry, './storage': storage, './db': { contentDb: () => ({ connect: async () => client }) }, './auth': { requireAdmin: async () => ({ id: '00000000-0000-4000-8000-000000000001' }) }, './brand': { currentBrand: async () => ({ id: brand, handle: 'revix' }) } });
    // como o studio-importar grava
    const post = (await db.query("insert into content_studio.posts(brand_id,topic,state) values($1,'Story importado','draft') returning id", [brand])).rows[0].id;
    const brief = { text: 'Post pronto importado', format: 'story', production: 'manual-only', ai_generated: false, collaborators: ['formula.foto'], import_key: 'k1', importado: { ferramenta: 'studio-importar' } };
    const first = (await db.query("insert into content_studio.revisions(post_id,brief,slides,caption,content_hash) values($1,$2,$3,'Nota',$4) returning id", [post, JSON.stringify(brief), JSON.stringify(['Hoje tem encontro', 'Abre o app']), 'a'.repeat(64)])).rows[0].id;
    await db.query("insert into content_studio.assets(revision_id,kind,object_key,sha256,provenance) values($1,'jpg',$2,$3,$4)", [first, first + '/imp-01-abc.jpg', 'b'.repeat(64), JSON.stringify({ format: 'story', slide: 1, width: 1080, height: 1920, publish: true, qa: 'image-checked' })]);
    await db.query("update content_studio.posts set active_revision_id=$1,state='review' where id=$2", [first, post]);
    const input = { topic: 'Story importado', brief: 'Post pronto importado', caption: 'Nota nova', slides: ['Hoje tem encontro', 'Abre o app'], sources: [], format: 'story' };
    // falha ao copiar: nada muda
    copyFails = true;
    await assert.rejects(api.saveDraft(input, post, first));
    assert.equal((await db.query('select active_revision_id from content_studio.posts where id=$1', [post])).rows[0].active_revision_id, first);
    // banco falha depois de copiar: desfaz e apaga as cópias
    copyFails = false; failInsert = true;
    await assert.rejects(api.saveDraft(input, post, first));
    assert.equal(removed.length, 1); assert.equal((await db.query('select count(*)::int n from content_studio.revisions')).rows[0].n, 1);
    failInsert = false; copies.length = 0;
    // só a legenda: a mídia segue, o post volta para revisão e precisa de aprovação nova
    await api.saveDraft(input, post, first);
    const second = (await db.query('select active_revision_id,state from content_studio.posts where id=$1', [post])).rows[0];
    assert.notEqual(second.active_revision_id, first); assert.equal(second.state, 'review');
    const rev2 = (await db.query('select brief,caption from content_studio.revisions where id=$1', [second.active_revision_id])).rows[0];
    assert.equal(rev2.caption, 'Nota nova');
    assert.deepEqual({ ...rev2.brief }, { text: 'Post pronto importado', format: 'story', production: 'manual-only', ai_generated: false, collaborators: ['formula.foto'], import_key: 'k1', importado: { ferramenta: 'studio-importar' } });
    const assets2 = (await db.query('select id,kind,object_key,sha256,provenance from content_studio.assets where revision_id=$1', [second.active_revision_id])).rows;
    assert.deepEqual(copies, [[first + '/imp-01-abc.jpg', second.active_revision_id + '/imp-01-abc.jpg']]);
    assert.equal(assets2.length, 1); assert.equal(assets2[0].object_key, second.active_revision_id + '/imp-01-abc.jpg');
    assert.equal(assets2[0].provenance.publish, true); assert.ok(assets2[0].provenance.copied_from);
    const ev = (await db.query("select metadata from content_studio.events where action='draft.saved' order by created_at desc limit 1")).rows[0].metadata;
    assert.equal(ev.mediaCopiedFrom, first); assert.equal(ev.assets, 1);
    // mudou o roteiro: segue importado, mas sem mídia (reimportar)
    await api.saveDraft({ ...input, slides: ['Outro texto', 'Abre o app'] }, post, second.active_revision_id);
    const third = (await db.query('select active_revision_id,state from content_studio.posts where id=$1', [post])).rows[0];
    assert.equal(third.state, 'draft'); assert.equal(copies.length, 1);
    assert.equal((await db.query('select count(*)::int n from content_studio.assets where revision_id=$1', [third.active_revision_id])).rows[0].n, 0);
    assert.equal((await db.query('select brief from content_studio.revisions where id=$1', [third.active_revision_id])).rows[0].brief.production, 'manual-only');
  } finally { await db.close(); }
});

test('render request refuses imported (manual-only) revisions and still queues generated ones', async () => {
  const db = new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key);');
    await db.exec(fs.readFileSync(new URL('../../../supabase/migrations/20261027001716_content_studio_foundation.sql', import.meta.url), 'utf8'));
    const client = { query: (...args) => db.query(...args), release() {} };
    const api = load('render', { './db': { contentDb: () => ({ connect: async () => client }) }, './auth': { requireAdmin: async () => ({ id: '00000000-0000-4000-8000-000000000001' }) } });
    const make = async brief => {
      const post = (await db.query("insert into content_studio.posts(brand_id,topic,state) select id,'Tema','draft' from content_studio.brands returning id")).rows[0].id;
      const rev = (await db.query("insert into content_studio.revisions(post_id,brief,slides,content_hash) values($1,$2,'[\"a\",\"b\"]',$3) returning id", [post, JSON.stringify(brief), 'a'.repeat(64)])).rows[0].id;
      await db.query('update content_studio.posts set active_revision_id=$1 where id=$2', [rev, post]);
      return [post, rev];
    };
    const [imported, importedRev] = await make({ text: 'Importado', format: 'story', production: 'manual-only' });
    await assert.rejects(api.requestRender(imported, importedRev), /Revisão indisponível/);
    const [generated, generatedRev] = await make({ text: 'Gerado', format: 'reel' });
    await api.requestRender(generated, generatedRev);
    assert.deepEqual((await db.query('select revision_id from content_studio.jobs')).rows.map(r => r.revision_id), [generatedRev]);
    assert.equal((await db.query('select state from content_studio.posts where id=$1', [imported])).rows[0].state, 'draft');
  } finally { await db.close(); }
});
