import {test} from 'node:test';
import assert from 'node:assert/strict';
import {motionItem,splitSlide,seedFrom} from '../motion/from-revision.mjs';

test('slide "Título. fala" vira título na tela e fala na narração',()=>{
 assert.deepEqual(splitSlide('Conecte uma vez. Funciona no app e no terminal.'),{title:'Conecte uma vez',speech:'Funciona no app e no terminal.'});
 assert.equal(splitSlide('Sem pontuação aqui').speech,'Sem pontuação aqui');
});

test('roteiro sem estrutura gera gancho, cenas marcadas pela fala e CTA final',()=>{
 const item=motionItem({id:'r1',slides:['Gancho forte. Primeira fala do vídeo.','Meio útil. Segunda fala com detalhe.','Sua vez. Comenta qual você prefere.'],brief:{},source_refs:['https://github.blog/x']},'reel');
 assert.equal(item.scenes[0].kind,'hook');assert.equal(item.scenes.at(-1).kind,'cta');
 assert.equal(item.scenes[1].cue,'Segunda fala com');
 assert.ok(item.narration.startsWith('Primeira fala'));
 assert.equal(item.source,'fonte: github.blog');
});

test('cenas estruturadas no brief têm prioridade e a trilha varia pela semente',()=>{
 const motion={narration:'x',scenes:[{kind:'hook',title:'a'},{kind:'cta',cue:'b',title:'c',options:[]}]};
 assert.equal(motionItem({id:'r2',slides:[],brief:{motion}},'reel').scenes,motion.scenes);
 assert.notEqual(seedFrom('a'),seedFrom('b'));
 assert.throws(()=>motionItem({id:'r3',slides:['só um'],brief:{}},'reel'),/slides_insuficientes/);
});
