import {test} from 'node:test';
import assert from 'node:assert/strict';
import {slideHtml,storyboard} from '../scripts/composer.mjs';
test('storyboard varies layouts within a carousel and direction across topics',()=>{
 const a=storyboard(['Como funciona um agente?','Uma etapa por vez. Confira os dados.','Antes de agir, confirme.','Conecte os sistemas.','Revise os resultados.','Defina limites.','Qual etapa começa hoje?']);
 assert.ok(new Set(a.map(s=>s.layout)).size>=4);
 assert.ok(a.some(s=>s.cues.some(c=>c.tipo.startsWith('sfx-key-'))));
 const b=storyboard(['Uma novidade importante','Primeiro detalhe','Outro detalhe','Próximo passo']);
 assert.notDeepEqual(a,b);
});
test('draft text is escaped and never becomes executable HTML',()=>{
 const html=slideHtml('</script><img src="https://evil.test" onerror="alert(1)">',0,7);
 assert.ok(html.includes('&lt;/script&gt;'));assert.equal(html.includes('<img'),false);assert.equal((html.match(/<script>/g)||[]).length,1);assert.ok(html.includes('window.seek='));
});
