const project=new URLSearchParams(location.search).get('project');
if([...document.querySelector('#project').options].some(o=>o.value===project))document.querySelector('#project').value=project;
document.querySelector('#notes-form').addEventListener('submit',event=>{
 event.preventDefault();
 const fields=['project','participant','version','context','task','observation','quote','interpretation','severity','change','retest'];
 const record=Object.fromEntries(fields.map(id=>[id,document.getElementById(id).value.trim()]));
 record.recordedAt=new Date().toISOString();
 record.evidenceType='Human-entered session note; source and permissions require reviewer confirmation';
 const url=URL.createObjectURL(new Blob([JSON.stringify(record,null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download=`${record.project}-${record.participant.replace(/[^a-z0-9-]/gi,'-')}-observation.json`;a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#note-status').textContent='Note downloaded. No note was sent to a service or saved automatically.';
});
