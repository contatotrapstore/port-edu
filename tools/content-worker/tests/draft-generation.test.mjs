import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateDraft,subscriptionEnv} from '../scripts/draft-generation.mjs';
test('generation rejects invented sources, placeholders and oversized copy',()=>{
 const draft={topic:'Agentes com limites claros',brief:'Explicar limites operacionais.',slides:['Uma tarefa por vez','Defina quando pedir ajuda'],caption:'Qual etapa você começaria?',sources:['https://example.com/source']};
 assert.equal(validateDraft(draft,draft.sources).topic,draft.topic);
 assert.throws(()=>validateDraft({...draft,sources:['https://invented.test']},draft.sources));
 assert.throws(()=>validateDraft({...draft,slides:['[Produto] ganhou [recurso]','Explicar']},draft.sources));
 assert.throws(()=>validateDraft({...draft,caption:'a'.repeat(2201)},draft.sources));
});
test('CLI process gets no API keys, database secrets or provider overrides',()=>{
 const env=subscriptionEnv({APPDATA:'a',USERPROFILE:'b',PATH:'c',ANTHROPIC_API_KEY:'secret',OPENAI_API_KEY:'secret',CONTENT_DATABASE_URL:'secret',ANTHROPIC_BASE_URL:'bad',CLAUDE_CODE_OAUTH_TOKEN:'secret'});
 assert.deepEqual(env,{APPDATA:'a',USERPROFILE:'b',PATH:'c'});
});
