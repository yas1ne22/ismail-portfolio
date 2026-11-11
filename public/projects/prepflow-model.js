import {groceryPlan} from './study-models.js';

export const prepMeals=[
 {id:'chicken',name:'Chicken rice bowl',kcal:560,protein:42,phases:[10,20,5],ingredients:{rice:80,chicken:180,pepper:100}},
 {id:'chickpea',name:'Chickpea rice bowl',kcal:510,protein:21,phases:[8,12,5],ingredients:{rice:80,chickpeas:180,pepper:100}},
 {id:'salmon',name:'Salmon and rice',kcal:610,protein:38,phases:[10,15,5],ingredients:{rice:80,salmon:160,pepper:100},oven:true},
];
export const prepPhaseNames=['Prepare ingredients','Cook the selected meal','Portion and label'];
export const prepPantry={rice:100,pepper:80};
const freshSession=()=>({phase:0,elapsed:[0,0,0],paused:false,running:false,anchor:null,timerStarted:false,done:false});
export function createPrepWeek(){
 return {selected:'mon',equipment:'oven',pendingSwap:null,slots:[['mon','Monday',0],['wed','Wednesday',1],['fri','Friday',2]].map(([id,day,meal])=>({id,day,meal,servings:2,session:freshSession(),quantityReview:null}))};
}
export const selectedPrepSlot=state=>state.slots.find(slot=>slot.id===state.selected);
export const hasPrepWork=slot=>slot.session.phase>0||slot.session.done||slot.session.timerStarted||slot.session.elapsed.some(value=>value>0);
export const prepConflict=(state,slot)=>Boolean(!slot.session.done&&prepMeals[slot.meal].oven&&state.equipment==='none');
export function prepDurations(slot){
 const [prepare,cook,portion]=prepMeals[slot.meal].phases;
 return [Math.max(1,prepare+2*(slot.servings-2)),cook,Math.max(1,portion+slot.servings-2)].map(minutes=>minutes*60000);
}
export function prepElapsed(slot,now){
 const session=slot.session;
 return session.done?0:session.elapsed[session.phase]+(session.running?Math.max(0,now-session.anchor):0);
}
export function prepRemaining(slot,now){
 if(slot.session.done)return {step:0,total:0};
 const durations=prepDurations(slot),phase=slot.session.phase;
 const step=Math.max(0,durations[phase]-prepElapsed(slot,now));
 return {step,total:step+durations.slice(phase+1).reduce((sum,value)=>sum+value,0)};
}
export function settlePrepTimer(slot,now){
 const session=slot.session;if(!session.running||session.done)return;
 session.elapsed[session.phase]=prepElapsed(slot,now);session.anchor=now;
 if(prepRemaining(slot,now).step===0){session.running=false;session.anchor=null;}
}
export function pausePrep(slot,now){
 settlePrepTimer(slot,now);slot.session.running=false;slot.session.anchor=null;
 if(!slot.session.done)slot.session.paused=true;
}
function requireAvailable(state,slot){
 if(slot.id!==state.selected)throw Error('Select this day before working on its preparation.');
 if(state.pendingSwap)throw Error('Confirm or cancel the meal change first.');
 if(slot.session.done)throw Error('This sample preparation is complete. Reset its session to start again.');
 if(slot.quantityReview)throw Error('Review and complete the quantity adjustment before continuing.');
 if(prepConflict(state,slot))throw Error('This sample salmon preparation requires an oven. Choose another meal or restore suitable equipment.');
}
export function startPrepTimer(state,slot,now){
 requireAvailable(state,slot);
 if(slot.session.running)return;
 if(slot.session.paused)throw Error('Resume preparation before starting the sample timer.');
 if(prepRemaining(slot,now).step===0)throw Error('The step estimate has elapsed. Check the step before marking it complete.');
 slot.session.timerStarted=true;slot.session.running=true;slot.session.anchor=now;
}
export function resumePrep(state,slot,now){
 requireAvailable(state,slot);slot.session.paused=false;
 if(slot.session.timerStarted&&prepRemaining(slot,now).step>0){slot.session.running=true;slot.session.anchor=now;}
}
export function completePrepStep(state,slot,now){
 requireAvailable(state,slot);
 if(slot.session.paused)throw Error('Resume preparation before completing this step.');
 settlePrepTimer(slot,now);slot.session.running=false;slot.session.anchor=null;slot.session.timerStarted=false;
 slot.session.phase++;slot.session.done=slot.session.phase===3;
}
export function changePrepServings(state,slot,value,now){
 if(!Number.isInteger(value)||value<1||value>6)throw Error('Choose 1–6 whole servings. The last valid plan is retained.');
 if(slot.session.done)throw Error('This preparation is complete. Reset its session before changing servings.');
 if(state.pendingSwap)throw Error('Confirm or cancel the meal change first.');
 if(value===slot.servings)return;
 settlePrepTimer(slot,now);const previous=slot.servings;slot.servings=value;
 if(slot.session.phase>0){
  const original=slot.quantityReview?.from??previous;
  pausePrep(slot,now);slot.quantityReview=value===original?null:{from:original,to:value,completedStages:slot.session.phase};
 }else settlePrepTimer(slot,now);
}
export function requestPrepSwap(state,slot,meal,now){
 if(!Number.isInteger(meal)||!prepMeals[meal])throw Error('Choose an available sample meal.');
 if(state.pendingSwap)throw Error('Confirm or cancel the current meal change first.');
 if(meal===slot.meal)return;
 if(hasPrepWork(slot)){pausePrep(slot,now);state.pendingSwap={slot:slot.id,meal};}
 else{slot.meal=meal;slot.session=freshSession();slot.quantityReview=null;}
}
export function confirmPrepSwap(state){
 const pending=state.pendingSwap;if(!pending)return;
 const slot=state.slots.find(item=>item.id===pending.slot);
 slot.meal=pending.meal;slot.session=freshSession();slot.quantityReview=null;state.pendingSwap=null;
}
export function selectPrepDay(state,id,now){
 if(state.pendingSwap)throw Error('Confirm or cancel the meal change first.');
 if(!state.slots.some(slot=>slot.id===id))throw Error('Choose a planned day.');
 if(id===state.selected)return;
 const previous=selectedPrepSlot(state);if(previous.session.running)pausePrep(previous,now);
 state.selected=id;
}
export function setPrepEquipment(state,value,now){
 if(!['oven','none'].includes(value))throw Error('Choose one of the available equipment options.');
 state.equipment=value;const slot=selectedPrepSlot(state);
 if(prepConflict(state,slot)&&slot.session.running)pausePrep(slot,now);
}
export function resetPrepSession(slot){slot.session=freshSession();slot.quantityReview=null;}
export function weeklyGroceries(state,pantry=prepPantry){
 const quantities={};
 for(const slot of state.slots){
  if(!Number.isInteger(slot.servings)||slot.servings<1||slot.servings>6)throw Error('Invalid planned servings.');
  for(const [ingredient,grams] of Object.entries(prepMeals[slot.meal].ingredients))quantities[ingredient]=(quantities[ingredient]??0)+grams*slot.servings;
 }
 return groceryPlan(quantities,1,pantry);
}
