import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {encryptToken,decryptToken,instagramRequest,verifyInstagram} from '../../../src/lib/content/instagram-core.mjs';
test('credential encryption authenticates ciphertext and never stores raw token',()=>{
 const key=randomBytes(32).toString('base64'),token='secret-test-token';const encrypted=encryptToken(token,key);
 assert.equal(encrypted.includes(token),false);assert.equal(decryptToken(encrypted,key),token);
 assert.throws(()=>decryptToken(encrypted,randomBytes(32).toString('base64')));
 assert.throws(()=>encryptToken(token,'bad'));
});
test('verification rejects another Instagram account before any publish call',async()=>{
 let calls=0;await assert.rejects(verifyInstagram('a'.repeat(40),async()=>{calls++;return {ok:true,json:async()=>({user_id:'123',username:'other'})};}),/wrong_account/);assert.equal(calls,1);
});
test('network uncertainty after POST is explicit and request does not retry',async()=>{
 let calls=0;await assert.rejects(instagramRequest('secret','123/media_publish',{creation_id:'456'},'POST',async(url,options)=>{calls++;assert.equal(url.href.includes('secret'),false);assert.equal(options.headers.Authorization,'Bearer secret');throw Error('timeout');}),/provider_outcome_unknown/);assert.equal(calls,1);
});
