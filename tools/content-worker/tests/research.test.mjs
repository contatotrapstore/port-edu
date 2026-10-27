import {test} from 'node:test';
import assert from 'node:assert/strict';
import {selectCandidates,validateEngine} from '../scripts/research.mjs';
test('research excludes stale, prerelease, duplicate and untrusted sources',()=>{
 const now=Date.parse('2026-10-26T12:00:00Z');
 const base={title:'Release',url:'https://github.com/openai/codex/releases/tag/v1',publishedAt:'2026-10-25T12:00:00Z',body:'A feature',prerelease:false};
 assert.equal(selectCandidates([base,base],[],now).length,1);
 assert.equal(selectCandidates([base],[base.url],now).length,0);
 assert.equal(selectCandidates([{...base,url:'https://evil.test'},{...base,prerelease:true},{...base,publishedAt:'2025-01-01'}],[],now).length,0);
 assert.throws(()=>validateEngine('api'));assert.equal(validateEngine('codex'),'codex');
});
