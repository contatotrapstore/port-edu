import {test} from 'node:test';
import assert from 'node:assert/strict';
import {slideHtml} from '../scripts/composer.mjs';
test('draft text is escaped and never becomes executable HTML',()=>{
 const html=slideHtml('</script><img src="https://evil.test" onerror="alert(1)">',0,7);
 assert.ok(html.includes('&lt;/script&gt;'));assert.equal(html.includes('<img'),false);assert.equal((html.match(/<script>/g)||[]).length,1);assert.ok(html.includes('window.seek='));
});
