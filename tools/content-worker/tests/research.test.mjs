import {test} from 'node:test';
import assert from 'node:assert/strict';
import {selectCandidates,validateEngine,impactScore} from '../scripts/research.mjs';
test('research excludes stale, prerelease, duplicate and untrusted sources',()=>{
 const now=Date.parse('2026-10-26T12:00:00Z');
 const base={title:'Release',url:'https://github.com/openai/codex/releases/tag/v1',publishedAt:'2026-10-25T12:00:00Z',body:'feat: new MCP tool calling API support',prerelease:false};
 assert.equal(selectCandidates([base,base],[],now).length,1);
 assert.equal(selectCandidates([base],[base.url],now).length,0);
 assert.equal(selectCandidates([{...base,url:'https://evil.test'},{...base,prerelease:true},{...base,publishedAt:'2025-01-01'}],[],now).length,0);
 assert.throws(()=>validateEngine('api'));assert.equal(validateEngine('codex'),'codex');
});

test('impact filter rejects maintenance and ranks material developer changes',()=>{
 const now=Date.parse('2026-10-26T12:00:00Z');
 const base={title:'Release',url:'https://github.com/openai/codex/releases/tag/v1',publishedAt:'2026-10-25T12:00:00Z',prerelease:false};
 assert.equal(selectCandidates([{...base,body:'fix: correct read-only folder permission\nchore: bump dependencies'}],[],now).length,0);
 const candidates=selectCandidates([{...base,body:'feat: new MCP API tool calling support'},{...base,url:base.url+'2',body:'Introducing a new model API with lower latency and pricing'}],[],now);
 assert.equal(candidates.length,2);assert.ok(candidates[0].editorialImpactScore>candidates[1].editorialImpactScore);assert.equal(candidates[0].popularityVerified,false);
});

test('material vulnerabilities and deprecations survive, ordinary Fixed notes do not',()=>{
 assert.ok(impactScore({title:'Release',body:'Deprecated the old API endpoint'})>=4);
 assert.ok(impactScore({title:'Release',body:'Patched a vulnerability in the MCP server'})>=4);
 assert.equal(impactScore({title:'Release',body:'Fixed the new model API crashing on empty input'}),0);
 assert.ok(impactScore({title:'Release',body:'fix: a vulnerability in the MCP server'})>=4);
});
