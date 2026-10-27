import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
const sql = fs.readFileSync(new URL('../../content-db/retire-atreia.sql', import.meta.url), 'utf8');
async function fixture() {
  const db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create schema atreia;
    create table public.finance_sentinel(id int primary key, value text);
    insert into public.finance_sentinel values(1,'preserve');
    create table atreia.users(id text primary key);
    create table atreia.sessions(id text primary key, user_id text references atreia.users(id));
    create table atreia.state(id int primary key);
    insert into atreia.users values('retired');`);
  return db;
}
test('retirement keeps Finance data and creates private empty schema', async () => {
  const db = await fixture();
  try {
    await db.exec(sql);
    assert.equal((await db.query(`select value from public.finance_sentinel`)).rows[0].value, 'preserve');
    assert.equal((await db.query(`select to_regnamespace('atreia') as old, to_regnamespace('content_studio') as new`)).rows[0].old, null);
    assert.equal((await db.query(`select has_schema_privilege('anon','content_studio','USAGE') as access`)).rows[0].access,false);
  } finally { await db.close(); }
});
test('external Finance dependency aborts the entire retirement', async () => {
  const db = await fixture();
  try {
    await db.exec(`create view public.finance_dependency as select id from atreia.users;`);
    await assert.rejects(db.exec(sql));
    await db.exec('rollback');
    assert.equal((await db.query('select count(*)::int as n from atreia.users')).rows[0].n,1);
    assert.equal((await db.query(`select to_regnamespace('content_studio') as n`)).rows[0].n,null);
  } finally { await db.close(); }
});
test('unknown marketplace table aborts before any removal', async () => {
  const db = await fixture();
  try {
    await db.exec(`create table atreia.new_unknown(id int);`);
    await assert.rejects(db.exec(sql)); await db.exec('rollback');
    assert.equal((await db.query('select count(*)::int as n from atreia.users')).rows[0].n,1);
  } finally { await db.close(); }
});
