import test from 'node:test';
import assert from 'node:assert/strict';
import { contactEligibility, auditFixture, validateWorkspace } from '../public/projects/enhancement-models.js';
import { normalizeWebsiteUrl } from '../public/projects/study-models.js';

test('Outbound eligibility requires known incomplete status, consent and an unused cross-channel budget',()=>{
 for (const booking of ['unknown','completed']) assert.equal(contactEligibility({booking,consent:true,contacted:false}).eligible,false);
 assert.equal(contactEligibility({booking:'incomplete',consent:false,contacted:false}).eligible,false);
 assert.equal(contactEligibility({booking:'incomplete',consent:true,contacted:true}).eligible,false);
 assert.equal(contactEligibility({booking:'incomplete',consent:true,contacted:false}).eligible,true);
});

test('Audit fixtures preserve missingness, disagreement and an inspectable denominator',()=>{
 const context={brand:'Example',industry:'Design',competitors:'Other',query:'Example task'};
 const empty=auditFixture(context,'none');assert.equal(empty.percentage,null);assert.equal(empty.returned,0);assert.equal(empty.missing,4);
 const partial=auditFixture(context,'partial');assert.equal(partial.returned,2);assert.equal(partial.missing,2);
 const conflict=auditFixture(context,'conflict');assert.equal(conflict.percentage,50);assert.equal(conflict.conflicting,true);
 context.brand='Changed after audit';assert.equal(conflict.context.brand,'Example');
});

test('Workspace restore refuses unsafe, duplicate or orphaned records before replacement',()=>{
 const restore=sites=>validateWorkspace({version:1,sites},normalizeWebsiteUrl);
 assert.throws(()=>restore([{title:'Unsafe',url:'javascript:alert(1)',category:'Work'}]));
 assert.throws(()=>restore([{title:'Orphan',url:'https://example.com',category:'Gone'}]));
 assert.throws(()=>restore([{title:'A',url:'https://example.com/#one',category:'Work'},{title:'B',url:'https://example.com',category:'Work'}]));
 const valid=restore([{title:'Reference',url:'https://example.com/notes#heading',category:'Learn'}]);
 assert.equal(valid.sites.length,1);assert.equal(valid.sites[0].url,'https://example.com/notes');
});
