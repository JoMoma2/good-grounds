// Reproducible catalog-wide audit, including historical edges and archived guides.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),C=require(root+'/app/web/core.js'),D=require(root+'/app/web/data.json'),I=C.index(D),baselines=require(root+'/research/prerequisite-baselines.json');
const reasons={
 'LEAVE-2':'Floor practice uses a leash and harness to prevent access, so comfortable equipment is required.',
 'LAUNDRY-1':'A close cloth deposit needs basket release, not a completed outward retrieve.',
 'LAUNDRY-2':'The floor cloth pickup explicitly requires FETCH-2 when it is introduced.',
 'SHELF-1':'Introducing the carrier at the hand needs give; floor/shelf pickup follows separately.',
 'SHELF-2':'Mock-shelf pickup and delivery explicitly require FETCH-2.',
 'FREE-1':'Any comfortable position supports release; a finished sit was an artificial gate.',
 'BOX-1':'A basket release needs give, not an outward retrieve.',
 'BOX-2':'Floor pickup and carry still need FETCH-2 as well as the basket deposit.',
 'CLOSE-1':'Door-pad work builds on the independent object target instead of hand targeting.',
 'OPEN-1':'Appliance movement comfort can be learned before rope pulling.',
 'OPEN-2':'Actual door pulling explicitly requires PULL-3 and appliance comfort.',
 'SHELF-3':'Fridge retrieval needs appliance comfort as well as mock-shelf retrieval.',
 'CLOSE-3':'Transfer to this appliance also requires comfortable appliance movement.',
 'DRINK-1':'Rehearse the retrieval ending independently; opening is needed when added at DRINK-2.',
 'DRINK-2':'Joining opening and pickup requires OPEN-3; PULL-3 is directly visible here as well.',
 'TURN-2':'Leashed turns require comfortable equipment, without gating the leash-free introduction.',
 'TEETH-1':'Brush appearance is independent of a chin rest.',
 'TEETH-2':'Lip touch uses the voluntary start/exit signal established by CHIN-2.',
 'WEAVE-2':'The other loop can be taught from the same MIDDLE foundation without learning the first loop.',
 'WEAVE-3':'The joined figure eight requires both independent loops.',
 'CARDS-1':'The first symbol uses an already familiar pose; hand targeting belongs at the second symbol.',
 'TOYNAME-1':'Enjoyable toy-label pairing does not require a retrieve.',
 'TWOOBJECT-1':'The second toy label can be taught separately; its criterion now concerns that pair alone.',
 'TWOOBJECT-2':'Mixed choices require both the first toy association and the independently taught second one.',
 'CARDS-2':'The second symbol can be paired with the known touch independently of the first symbol.',
 'CARDS-3':'Mixed symbol choices require both symbol-action pairings.',
 'POUCH-1':'An empty pouch handover needs give; carrying is introduced at the next step.',
 'POUCH-2':'Moving with the pouch requires CARRY-1 alongside its familiar handover.',
 'MESSENGER-1':'Giving to the second person can be taught before the carry.',
 'MESSENGER-2':'Moving toward that person requires CARRY-1 as well as the handover.'
};
const result={curriculum:D.version,skills:D.skills.length,activeSteps:I.steps.size,archivedSteps:I.archivedSteps.size,baselines:{},newProjects:[]};
const replacement=new Map();for(const s of D.skills)for(const st of s.steps)for(const id of st.replaces||[]){assert.ok(!replacement.has(id),'Duplicate replacement '+id);replacement.set(id,st.id);}
for(const [version,old] of Object.entries(baselines)){
 const changes=[],missing=[];let unchanged=0;
 for(const s of old.skills)for(const st of s.steps){
  const current=I.steps.get(st.id);
  if(!current){assert.ok(I.archivedSteps.has(st.id)&&replacement.has(st.id),'Lost original step '+st.id);missing.push({id:st.id,disposition:'Original guide and records retained',replacement:replacement.get(st.id)});continue;}
  if(JSON.stringify(st.deps)===JSON.stringify(current.step.deps)){unchanged++;continue;}
  assert.ok(reasons[st.id],'Unreviewed prerequisite change: '+st.id);
  changes.push({id:st.id,before:st.deps,after:current.step.deps,reason:reasons[st.id]});
 }
 result.baselines[version]={commit:old.commit,unchanged,changes,archived:missing};
}
// Every literal lesson reference in every current teaching guide resolves.
for(const s of D.skills)for(const st of s.steps){
 for(const id of [s.setup,st.teach,st.advance,st.easier].join(' ').match(/\b[A-Z][A-Z0-9]*-[0-9]+\b/g)||[])assert.ok(I.steps.has(id),'Unresolved teaching reference '+st.id+' -> '+id);
 for(const old of st.replaces||[])assert.ok(I.archivedSteps.has(old));
}
for(const {step} of I.archivedSteps.values())for(const [id] of step.deps)assert.ok(I.steps.has(id)||I.archivedSteps.has(id),'Broken earlier reference '+id);
for(const s of D.skills.filter(s=>s.project)){
 const p=C.projectPlan(D,C.freshState(),s.code);
 result.newProjects.push({code:s.code,title:s.title,modules:p.modules.map(m=>({code:m.code,optional:!!m.optional,steps:m.steps.length})),requiredSteps:p.total,totalSteps:p.modules.reduce((n,m)=>n+m.steps.length,0),assemblySteps:s.steps.length});
}
const md=['# Full prerequisite audit — curriculum '+D.version,'',`Reviewed ${D.skills.length} current skills, ${I.steps.size} active teaching steps and ${I.archivedSteps.size} preserved earlier steps against versions 1.1.0, 1.1.1 and 1.2.0. Active dependencies resolve and are acyclic. Every historical step has an active or preserved earlier page. No undocumented historical edge change is allowed by the audit script.`,'','## Historical changes',''];
for(const [v,r] of Object.entries(result.baselines)){
 md.push('### Compared with '+v,'',r.unchanged+' steps keep identical prerequisites; '+r.changes.length+' have reviewed changes; '+r.archived.length+' retain their original guides with explicit replacement links.','', '| Step | Before | Now | Decision |','| --- | --- | --- | --- |');
 for(const c of r.changes)md.push(`| ${c.id} | ${JSON.stringify(c.before)} | ${JSON.stringify(c.after)} | ${c.reason} |`);
 md.push('');
}
md.push('## Every current skill','', '| Skill | Required component edges across its steps | Review |','| --- | --- | --- |');
for(const s of D.skills){
 const deps=s.steps.flatMap(st=>st.deps.filter(([id])=>I.steps.get(id).skill.code!==s.code).map(([id,level])=>id+(level===2?' (nearly there)':' (consistent)')));
 const changed=s.steps.filter(st=>reasons[st.id]).map(st=>st.id);
 const decision=s.project?'Project assembly; component groups remain independent.':s.steps.some(st=>st.replaces)?'Compact guide; original records retained and completion credit requires all mapped criteria.':changed.length?'Reviewed changes at '+changed.join(', ')+'.':'Keep: teaching actions match these dependencies; no removed historical edge.';
 md.push(`| ${s.code} · ${s.title} | ${[...new Set(deps)].join(', ')||'No external gate'} | ${decision} |`);
}
if(process.argv.includes('--write')){
 fs.writeFileSync(root+'/research/PREREQUISITE_AUDIT.md',md.join('\n')+'\n');
 fs.writeFileSync(root+'/research/prerequisite-audit.json',JSON.stringify(result,null,2)+'\n');
}
console.log('PASS: full catalog audit;',result.skills,'skills,',result.activeSteps,'active steps,',result.archivedSteps,'preserved earlier steps; three historical baselines; all changes reviewed.');
