import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeWebsiteUrl,groceryPlan,advanceTimer } from '../public/projects/study-models.js';

test('the organizer recognizes equivalent links and rejects executable or credential-bearing URLs',()=>{
 assert.equal(normalizeWebsiteUrl('https://example.com/#section'),normalizeWebsiteUrl('https://example.com'));
 assert.equal(normalizeWebsiteUrl('https://example.com/path?q=design#top'),'https://example.com/path?q=design');
 for(const input of ['javascript:alert(1)','file:///secret','not a URL','https://name:secret@example.com'])assert.throws(()=>normalizeWebsiteUrl(input));
});
test('a meal swap and serving change share a consistent grocery calculation',()=>{
 const pantry={rice:100,pepper:80};
 const chicken=groceryPlan({rice:80,chicken:180,pepper:100},2,pantry);
 assert.deepEqual(chicken,[{ingredient:'rice',total:160,pantry:100,toBuy:60},{ingredient:'chicken',total:360,pantry:0,toBuy:360},{ingredient:'pepper',total:200,pantry:80,toBuy:120}]);
 const swapped=groceryPlan({rice:80,chickpeas:180,pepper:100},1,pantry);
 assert.equal(swapped.some(i=>i.ingredient==='chicken'),false);
 assert.equal(swapped.find(i=>i.ingredient==='rice').toBuy,0);
 assert.equal(pantry.rice,100);
 for(const n of [0,1.5,7,NaN])assert.throws(()=>groceryPlan({rice:80},n,pantry));
 assert.throws(()=>groceryPlan({rice:-1},2));
});
const phases=[{duration:5},{duration:10},{duration:5},{duration:10},{duration:0}];
test('timer projection handles delayed ticks, exact boundaries and final completion',()=>{
 assert.deepEqual(advanceTimer(phases,0,0),{phase:1,remainingMs:10000,remainingSeconds:10,complete:false});
 assert.deepEqual(advanceTimer(phases,0,-7000),{phase:1,remainingMs:3000,remainingSeconds:3,complete:false});
 assert.deepEqual(advanceTimer(phases,0,-22000),{phase:3,remainingMs:3000,remainingSeconds:3,complete:false});
 assert.deepEqual(advanceTimer(phases,0,-25000),{phase:4,remainingMs:0,remainingSeconds:0,complete:true});
 assert.equal(advanceTimer(phases,2,1).remainingSeconds,1);
 assert.throws(()=>advanceTimer(phases,-1,1000));
});
