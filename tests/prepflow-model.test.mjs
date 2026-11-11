import test from 'node:test';
import assert from 'node:assert/strict';
import {createPrepWeek,selectedPrepSlot,weeklyGroceries,prepRemaining,startPrepTimer,pausePrep,resumePrep,settlePrepTimer,changePrepServings,completePrepStep,requestPrepSwap,confirmPrepSwap,selectPrepDay,setPrepEquipment,prepConflict} from '../public/projects/prepflow-model.js';

test('A PrepFlow week aggregates repeated ingredients before subtracting pantry stock once',()=>{
 const week=createPrepWeek();
 assert.deepEqual(weeklyGroceries(week).find(row=>row.ingredient==='rice'),{ingredient:'rice',total:480,pantry:100,toBuy:380});
 requestPrepSwap(week,selectedPrepSlot(week),1,0);changePrepServings(week,selectedPrepSlot(week),3,0);
 assert.deepEqual(weeklyGroceries(week).find(row=>row.ingredient==='rice'),{ingredient:'rice',total:560,pantry:100,toBuy:460});
 assert.equal(weeklyGroceries(week).find(row=>row.ingredient==='chickpeas').total,900);
 const before=structuredClone(week);assert.throws(()=>changePrepServings(week,selectedPrepSlot(week),2.5,0),/1–6 whole/);assert.deepEqual(week,before);
});

test('PrepFlow pause and resume preserve elapsed time while a serving change revises the remaining estimate',()=>{
 const week=createPrepWeek(),slot=selectedPrepSlot(week);startPrepTimer(week,slot,0);
 startPrepTimer(week,slot,10000);assert.equal(prepRemaining(slot,65000).step,535000,'Repeated start cannot reset an active timer');
 pausePrep(slot,65000);changePrepServings(week,slot,4,65000);
 assert.equal(prepRemaining(slot,500000).step,775000);
 resumePrep(week,slot,500000);pausePrep(slot,510000);assert.equal(prepRemaining(slot,900000).step,765000);
 resumePrep(week,slot,900000);settlePrepTimer(slot,9999999);
 assert.equal(prepRemaining(slot,9999999).step,0);assert.equal(slot.session.phase,0);assert.equal(slot.session.running,false,'Elapsed estimates never mark cooking stages complete');
});

test('Changed quantities retain completed stages and require an explicit adjustment before continuation',()=>{
 const week=createPrepWeek(),slot=selectedPrepSlot(week);completePrepStep(week,slot,0);startPrepTimer(week,slot,0);
 changePrepServings(week,slot,4,30000);
 assert.equal(slot.session.phase,1);assert.equal(slot.session.elapsed[1],30000);assert.equal(slot.session.paused,true);
 assert.deepEqual(slot.quantityReview,{from:2,to:4,completedStages:1});
 assert.throws(()=>resumePrep(week,slot,60000),/quantity adjustment/);
 changePrepServings(week,slot,2,60000);assert.equal(slot.quantityReview,null);assert.equal(slot.session.phase,1);
 assert.equal(prepRemaining(slot,90000).step,1170000);
});

test('Meal replacement is atomic and resets only the confirmed day’s session',()=>{
 const week=createPrepWeek(),monday=selectedPrepSlot(week);completePrepStep(week,monday,0);
 selectPrepDay(week,'wed',0);const wednesday=selectedPrepSlot(week);completePrepStep(week,wednesday,0);completePrepStep(week,wednesday,0);
 selectPrepDay(week,'mon',0);const retained=structuredClone(wednesday),before=weeklyGroceries(week);
 requestPrepSwap(week,monday,2,0);
 assert.equal(monday.meal,0);assert.equal(monday.session.phase,1);assert.deepEqual(weeklyGroceries(week),before);
 assert.throws(()=>selectPrepDay(week,'wed',0),/Confirm or cancel/);
 confirmPrepSwap(week);assert.equal(monday.meal,2);assert.equal(monday.session.phase,0);assert.deepEqual(wednesday,retained);
 completePrepStep(week,monday,0);completePrepStep(week,monday,0);completePrepStep(week,monday,0);
 setPrepEquipment(week,'none',0);assert.equal(prepConflict(week,monday),false,'Equipment changes must not invalidate a completed record');
 assert.throws(()=>changePrepServings(week,monday,4,0),/preparation is complete/);
});

test('Day switches and lost equipment pause the relevant timer without rebuilding the week',()=>{
 const week=createPrepWeek(),monday=selectedPrepSlot(week);requestPrepSwap(week,monday,2,0);startPrepTimer(week,monday,0);
 selectPrepDay(week,'mon',10000);assert.equal(monday.session.running,true);
 setPrepEquipment(week,'none',30000);assert.equal(monday.session.paused,true);assert.equal(prepRemaining(monday,500000).step,570000);
 assert.throws(()=>resumePrep(week,monday,500000),/requires an oven/);
 setPrepEquipment(week,'oven',500000);assert.equal(monday.session.running,false);resumePrep(week,monday,500000);
 selectPrepDay(week,'wed',510000);assert.equal(prepRemaining(monday,900000).step,560000);assert.equal(monday.session.paused,true);
 assert.equal(selectedPrepSlot(week).servings,2);assert.equal(selectedPrepSlot(week).session.phase,0);
});
