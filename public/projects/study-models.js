export function normalizeWebsiteUrl(input){
 const value=new URL(input);
 if(!['http:','https:'].includes(value.protocol))throw new Error('Use an http or https URL.');
 if(value.username||value.password)throw new Error('Do not save embedded credentials.');
 value.hash='';
 return value.href.replace(/\/$/,'');
}
export function groceryPlan(ingredients,servings,pantry={}){
 if(!Number.isInteger(servings)||servings<1||servings>6)throw new Error('Choose 1–6 whole servings.');
 return Object.entries(ingredients).map(([ingredient,grams])=>{
  if(!Number.isFinite(grams)||grams<0)throw new Error('Ingredient quantities must be nonnegative.');
  const available=pantry[ingredient]??0;
  if(!Number.isFinite(available)||available<0)throw new Error('Pantry quantities must be nonnegative.');
  const total=grams*servings;
  return {ingredient,total,pantry:available,toBuy:Math.max(0,total-available)};
 });
}
export function advanceTimer(phases,phase,remainingMs){
 if(!Number.isFinite(remainingMs)||!Number.isInteger(phase)||phase<0||phase>=phases.length)throw new Error('Invalid timer projection.');
 let current=phase,left=remainingMs;
 while(left<=0&&current<phases.length-1){
  current++;
  const duration=phases[current].duration;
  if(!Number.isFinite(duration)||duration<0)throw new Error('Invalid phase duration.');
  left+=duration*1000;
 }
 return {phase:current,remainingMs:Math.max(0,left),remainingSeconds:Math.max(0,Math.ceil(left/1000)),complete:current===phases.length-1};
}
