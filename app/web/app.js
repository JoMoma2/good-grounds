(function () {
  'use strict';
  const C=GroundCore, D=GOOD_GROUND_DATA, I=C.index(D), $=s=>document.querySelector(s), E=C.esc;
  const native=!!window.GOOD_GROUND_BOOT?.native, STORAGE='good-ground-state-v1';
  let state, loadError='', dirty=false, pendingBackup=null, modalReturn=null, timer=null;
  const routePositions=new Map();let pendingScroll=0,sourceContext=null;
  let saveStatus=native?'Saved on this phone':'Saved in this browser', acknowledged=-1, route='', learnQuery='', learnFilter='all', learnTopic='', journalFilter='', trendTrigger='Other dogs';
  try {
    const initial=native?window.GOOD_GROUND_BOOT.state:JSON.parse(localStorage.getItem(STORAGE)||'null');
    state=initial?C.validateState(initial):C.freshState();
    loadError=window.GOOD_GROUND_BOOT?.error||'';
  } catch {state=C.freshState();loadError='Your saved data could not be read. Import a backup before making new changes; the original saved data has been kept.';}
  if(loadError)saveStatus='Saved records need recovery';
  const icons={
    home:'<path d="m3 11 9-8 9 8v9H6v-9M9 20v-7h6v7"/>',
    learn:'<path d="M4 4h6l2 2 2-2h6v16h-6l-2 2-2-2H4zM12 6v16"/>',
    journal:'<path d="M7 4h13v17H7zM4 7h6M4 12h6M4 17h6M13 8h4M13 12h4"/>',
    chart:'<path d="M4 3v17h17M8 15l4-5 4 2 5-7"/>',
    more:'<circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/>',
    arrow:'<path d="m9 5 7 7-7 7"/>',back:'<path d="m15 5-7 7 7 7"/>',
    check:'<path d="m5 12 4 4L20 5"/>',plus:'<path d="M12 4v16M4 12h16"/>',close:'<path d="m5 5 14 14M5 19 19 5"/>',
    heart:'<path d="M20 5c-3-3-7-1-8 2-1-3-5-5-8-2-5 5 8 15 8 15S25 10 20 5Z"/>',
    search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    leaf:'<path d="M19 3C4 2 1 10 6 15s14 0 13-12ZM5 20 16 7"/>',
    dog:'<path d="m6 10-3-7 7 2h6l5-2-2 8v7l-5 3h-4l-4-3Z"/><path d="M9 12h.1M15 12h.1M10 16h4l-2 2Z"/>',
    shield:'<path d="m12 3 8 3v7c0 5-8 9-8 9S4 18 4 13V6zM8 12l3 3 5-6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
    sound:'<path d="m4 9 4 0 5-5v16l-5-5H4zM17 8c3 2 3 6 0 8M20 5c5 5 5 9 0 14"/>',
    door:'<path d="M5 21V3h13v18M3 21h18M14 12h.1"/>',
    walk:'<path d="m6 20 4-7 4 1 4 6M5 10l5-3 4 4 5-2M10 7v6"/><circle cx="12" cy="3" r="2"/>',
    star:'<path d="m12 3 3 6 6 1-4.5 4.5 1 6.5L12 18l-5.5 3 1-6.5L3 10l6-1Z"/>',
    care:'<path d="M8 3h8v5h5v8h-5v5H8v-5H3V8h5Z"/>',
    box:'<path d="m3 7 9-4 9 4-9 4ZM3 7v12l9 3 9-3V7M12 11v11"/>',
    restore:'<path d="M4 5v6h6M4 11a8 8 0 1 1 1 7M12 8v5l3 2"/>',
    save:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    book:'<path d="M4 3h13l3 3v15H4zM8 8h8M8 12h8M8 16h5"/>',
    tune:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',
  };
  function icon(name,cls='') {return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.leaf}</svg>`;}
  const topicIcon=name=>({'Foundations':'learn','Calm at home':'home','Walk skills':'walk','Other dogs':'dog','People and door':'door','Sounds and novelty':'sound','Care and equipment':'care','Play and jobs':'star','Fridge task':'box','Practice elsewhere':'leaf','Clever companions':'star','Useful little jobs':'box','Scent adventures':'search','Body awareness':'walk'}[name]||'star');
  const topicSubtitle=name=>({'Foundations':'A shared language','Calm at home':'Rest, choice & predictability','Walk skills':'Room to explore','Other dogs':'Comfort at a distance','People and door':'Quieter arrivals','Sounds and novelty':'One gentle change at a time','Care and equipment':'Cooperation comes first','Play and jobs':'Joy with a purpose','Fridge task':'A complete retrieval chain','Practice elsewhere':'Take a known skill somewhere new','Clever companions':'Little moments of brilliance','Useful little jobs':'A helping paw','Scent adventures':'Follow their favorite sense','Body awareness':'Easy, comfortable movement'}[name]||'Explore something enjoyable');
  const path=(type,id)=>'#/'+type+(id?'/'+encodeURIComponent(id):'');
  const link=(type,id,label,cls='')=>`<a class="${cls}" href="${path(type,id)}">${label}</a>`;
  const pill=(text,cls='')=>`<span class="pill ${cls}">${E(text)}</span>`;
  const badge=avail=>pill(avail,avail==='Complete'?'complete':['Ready to start','Continue'].includes(avail)?'ready':'muted');
  const empty=(title,body,action='')=>`<div class="empty">${icon('leaf')}<h3>${E(title)}</h3><p>${E(body)}</p>${action}</div>`;
  const section=(title,action='')=>`<div class="section-heading"><h2>${title}</h2>${action}</div>`;
  const statLabel=value=>C.stageLabel(value);
  const sourceIDs=text=>(text||'').match(/\b[RPNA]\d+\b/g)||[];
  const sourceLinks=text=>`<div class="source-chips">${sourceIDs(text).map(id=>link('source',id,E(id),'source-chip')).join('')}</div>`;
  function dateLabel(value) {const d=new Date(value+'T12:00:00');return isNaN(+d)?value:d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});}
  function send(action,payload={}) {window.webkit?.messageHandlers?.ground?.postMessage({action,...payload});}
  function applySettings() {
    const theme=state.settings.theme==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):state.settings.theme;
    document.documentElement.dataset.theme=theme;
    document.documentElement.dataset.text=state.settings.textSize;
    send('theme',{theme:state.settings.theme});
  }
  function showSave() {const warning=$('#save-warning');if(warning)warning.hidden=!saveStatus.includes('not');document.querySelectorAll('[data-save-indicator]').forEach(el=>{el.textContent=saveStatus;el.classList.toggle('save-error',saveStatus.includes('not'));});}
  function flush() {
    if (loadError) return;
    if (native) {saveStatus='Saving on this phone…';send('save',{state});}
    else {
      try {localStorage.setItem(STORAGE,JSON.stringify(state));saveStatus='Saved in this browser';acknowledged=state.revision;}
      catch {saveStatus='Could not save — export a backup';toast('Browser storage is unavailable. Export a backup to keep these changes.',true);}
    }
    showSave();
  }
  function commit(next) {if(!C.withinStorageLimit(next)){toast('Records are at the storage limit. Export a backup, then shorten notes or remove older sessions before saving more.',true);return false;}if(loadError){toast('Restore a backup before making changes.',true);return false;}state=next;flush();return true;}
  function toast(message,error=false) {const el=$('#toast');el.textContent=message;el.className=error?'visible error':'visible';clearTimeout(toast.timeout);toast.timeout=setTimeout(()=>el.className='',error?6500:3200);}
  function openModal(title,body,wide=false) {
    modalReturn=document.activeElement;
    $('#modal-root').innerHTML=`<div class="modal-shade"><section class="modal ${wide?'wide':''}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-heading"><h2 id="modal-title">${E(title)}</h2><button class="icon-button" data-action="close-modal" aria-label="Close dialog">${icon('close')}</button></div>${body}</section></div>`;
    document.body.classList.add('modal-open');$('#app').inert=true;
    requestAnimationFrame(()=>$('#modal-root button, #modal-root input, #modal-root select')?.focus());
  }
  function closeModal() {$('#modal-root').innerHTML='';document.body.classList.remove('modal-open');$('#app').inert=false;modalReturn?.focus?.();}
  function confirmAction(title,body,action,label='Continue',danger=false) {openModal(title,`<p>${E(body)}</p><div class="button-row"><button class="button secondary" data-action="close-modal">Cancel</button><button class="button ${danger?'danger':''}" data-action="${action}">${E(label)}</button></div>`);}
  function selectOptions(items,value,blank) {return (blank!==undefined?`<option value="">${E(blank)}</option>`:'')+items.map(item=>{const [v,label]=Array.isArray(item)?item:[item,item];return `<option value="${E(v)}" ${v===value?'selected':''}>${E(label)}</option>`;}).join('');}
  function inputField(label,name,value='',type='text',hint='') {return `<label class="field"><span>${E(label)}</span><input name="${name}" type="${type}" value="${E(value)}" ${type==='number'?'min="0" step="any"':''} maxlength="5000">${hint?`<small>${E(hint)}</small>`:''}</label>`;}
  function textField(label,name,value='',hint='') {return `<label class="field"><span>${E(label)}</span><textarea name="${name}" rows="3" maxlength="30000">${E(value)}</textarea>${hint?`<small>${E(hint)}</small>`:''}</label>`;}
  function selectField(label,name,items,value='',blank) {return `<label class="field"><span>${E(label)}</span><select name="${name}">${selectOptions(items,value,blank)}</select></label>`;}
  const formError=()=>'<p class="form-error" role="alert" hidden></p>';
  function failForm(form,message) {const el=form.querySelector('.form-error');if(el){el.textContent=message;el.hidden=false;el.scrollIntoView({block:'center',behavior:'smooth'});}else toast(message,true);}
  function lessonCard(skill,step,compact=false) {
    const a=C.availability(step,state);
    return link('lesson',step.id,`<div class="lesson-symbol">${icon(topicIcon(skill.sheet))}</div><div class="card-copy"><div class="eyebrow">${E(skill.sheet)}</div><h3>${E(skill.title)}</h3><p>${E(step.title)}</p><div class="card-meta">${badge(a)}<span>Step ${skill.steps.indexOf(step)+1} of ${skill.steps.length}</span></div></div>${icon('arrow','chevron')}`,'lesson-card '+(compact?'compact':''));
  }
  function heroArt() {return `<svg class="hero-art" viewBox="0 0 180 165" aria-hidden="true"><path d="M6 144c32-14 118-14 169 0" fill="none" stroke="#b6cec0" stroke-width="2"/><path d="M142 142c-1-29 13-37 14-57M143 116l-13-13M150 103l13-14" stroke="#7eaa8a" stroke-width="3" fill="none"/><ellipse cx="86" cy="124" rx="43" ry="8" fill="#183e35" opacity=".11"/><path d="M54 87c-15 1-24-9-22-22 10 14 21 7 29 9" fill="#294b40"/><path d="M54 81c9-11 24-8 33-2l22 1c14 1 14 17 3 21l-7 21H94l2-26H76l-6 26H59l-1-25" fill="#294b40"/><path d="M83 76V53c-3-20 33-23 35-2l9 12c2 5-3 9-12 9l-6 14Z" fill="#294b40"/><path d="M86 46 78 26c-10 0-13 26 6 31M108 43l12-11c7 10 3 18-5 21" fill="#183b33"/><path d="m97 70 1 18 11-4 7-12" fill="#ebdebd"/><circle cx="108" cy="53" r="2.2" fill="#fcf8e8"/><path d="m122 61 6 1-2 4" fill="#162e29"/><path d="m86 79 24 5" stroke="#dd996c" stroke-width="5"/><path d="M23 133c0-23 12-19 12-36M25 115l-8-8" stroke="#95b89d" stroke-width="3" fill="none"/><circle cx="142" cy="28" r="13" fill="#f0c99a"/></svg>`;}
  function todayView() {
    const sum=C.summary(D,state), choices=C.available(D,state), inProgress=choices.filter(x=>x.available==='Continue');
    const greeting=state.profile.name?`For ${E(state.profile.name)}. At their pace.`:'A little practice. A lot of kindness.';
    return `<div class="home-heading"><div><span class="brand-kicker">GOOD GROUND</span><p class="quiet">${greeting}</p></div><button class="icon-button profile-button" data-go="profile" aria-label="Your dog’s profile">${icon('dog')}</button></div>
    <section class="hero"><div class="hero-copy"><span class="eyebrow">ONE COMFORTABLE STEP</span><h1>Small steps.<br>Better days.</h1><p>Build confidence, find the fun, and learn together.</p></div>${heroArt()}</section>
    ${!state.profile.name?`<a href="#/profile" class="intro-link">${icon('tune')}<span>Make this your dog’s space<small>Add their name, rewards, and priorities</small></span>${icon('arrow')}</a>`:''}
    <div class="stat-strip"><div><strong>${sum.counts.complete}</strong><span>steps learned</span></div><div><strong>${sum.counts.practicing}</strong><span>in practice</span></div><div><strong>${state.sessions.length}</strong><span>sessions logged</span></div></div>
    ${section(inProgress.length?'Pick up where you left off':'A good place to begin',`<button class="text-button" data-action="available">See all ${icon('arrow')}</button>`)}
    <div class="stack">${choices.slice(0,3).map(x=>lessonCard(x.skill,x.step,true)).join('')||empty('Room for something new','Browse the library, revisit a favorite, or simply enjoy a restful day.',link('learn','','Explore lessons','button'))}</div>
    ${funSuggestion(choices)}
    <a class="comfort-note" href="#/basics">${icon('leaf')}<span><strong>Comfort comes before consistency.</strong><small>Food-taking, silence, or a sit alone do not establish calm. Learn what to watch for.</small></span>${icon('arrow')}</a>
    ${section('Explore together',link('learn','','All lessons '+icon('arrow'),'text-link'))}
    <div class="topic-grid">${['Other dogs','People and door','Sounds and novelty','Play and jobs'].map(t=>`<a class="topic-card" href="${path('topic',t)}"><div class="topic-symbol">${icon(topicIcon(t))}</div><h3>${E(t)}</h3><p>${topicSubtitle(t)}</p></a>`).join('')}</div>
    <div class="footer-note">${icon('shield')}<span>${native?'Works offline. Saved on your phone.':'Browser preview · data stays in this browser.'}</span></div>`;
  }
  function funSuggestion(choices) {
    const play=choices.filter(x=>['Enrichment','Optional trick'].includes(x.skill.priority));
    if(!play.length)return '';
    const seed=[...C.dateToday()].reduce((sum,c)=>sum+c.charCodeAt(0),0),choice=play[seed%play.length];
    return `${section('Just for the joy of it',`<button class="text-button" data-action="fun-pick">Another idea ${icon('restore')}</button>`)}<div id="fun-suggestion">${lessonCard(choice.skill,choice.step,true)}</div>`;
  }
  function learnView() {
    return `<div class="page-title"><span class="eyebrow">THE LESSON LIBRARY</span><h1>Find your next<br>little breakthrough.</h1><p>${D.skills.length} skills. Clear teaching steps. Your dog’s pace.</p></div>
    <label class="search-field">${icon('search')}<span class="sr-only">Search skills, goals, cues, or Step IDs</span><input id="learn-search" type="search" placeholder="Search skills, cues, or Step IDs" value="${E(learnQuery)}" autocomplete="off"></label>
    <div class="filter-row" aria-label="Filter lessons">${[['all','All lessons'],['available','Ready / practicing'],['favorites','Saved'],['complete','Learned']].map(([id,label])=>`<button data-action="learn-filter" data-value="${id}" class="filter-chip ${learnFilter===id?'selected':''}" aria-pressed="${learnFilter===id}">${label}</button>`).join('')}</div>
    <label class="field topic-select"><span class="sr-only">Choose a topic</span><select id="learn-topic">${selectOptions([...new Set(D.skills.map(s=>s.sheet))],learnTopic,'All topics')}</select></label><div id="learn-results">${learnResults()}</div>`;
  }
  function learnResults() {
    const q=learnQuery.trim().toLowerCase(),exactStep=I.steps.get(q.toUpperCase());
    const skills=D.skills.filter(s=>(!learnTopic||s.sheet===learnTopic)&&(!exactStep||s.code===exactStep.skill.code)&&(!q||[s.title,s.goal,s.cue,s.sheet,s.code,...s.steps.map(st=>st.id+' '+st.title)].join(' ').toLowerCase().includes(q)))
      .filter(s=>learnFilter==='all'||learnFilter==='favorites'&&state.favorites.includes(s.code)||learnFilter==='complete'&&s.steps.every(st=>C.status(state,st.id)===C.STATUSES[3])||learnFilter==='available'&&s.steps.some(st=>['Ready to start','Continue'].includes(C.availability(st,state))));
    if (!skills.length) return empty('Nothing here just yet','Try another search or switch to All lessons. Paused and prerequisite stages stay available to read.');
    let out=`<p class="result-count" aria-live="polite">${skills.length} ${skills.length===1?'skill':'skills'}</p>`;
    for (const topic of [...new Set(skills.map(s=>s.sheet))]) {
      out+=section(E(topic));
      out+='<div class="stack">'+skills.filter(s=>s.sheet===topic).map(s=>{
        const st=exactStep?.step||s.steps.find(x=>['Continue','Ready to start'].includes(C.availability(x,state)))||s.steps.find(x=>C.status(state,x.id)!==C.STATUSES[3])||s.steps[0];
        return lessonCard(s,st,true);
      }).join('')+'</div>';
    }
    return out;
  }
  function topicView(name) {
    const skills=D.skills.filter(s=>s.sheet===name);
    if(!skills.length)return notFound();
    return `${backBar('learn','','All lessons')}<div class="page-title"><div class="topic-symbol large">${icon(topicIcon(name))}</div><h1>${E(name)}</h1><p>${topicSubtitle(name)}</p></div><div class="stack">${skills.map(s=>lessonCard(s,s.steps.find(st=>['Continue','Ready to start'].includes(C.availability(st,state)))||s.steps[0])).join('')}</div>`;
  }
  function backBar(type,id,label,extra='') {return `<div class="back-bar">${link(type,id,icon('back')+E(label),'back-link').replace('<a ','<a data-restore="true" ')}${extra}</div>`;}
  function lessonView(id) {
    const item=I.steps.get(id);if(!item)return notFound();
    const {skill,step}=item,n=skill.steps.indexOf(step),avail=C.availability(step,state),v=C.status(state,id);
    const dependencies=step.deps.map(([key,min])=>{
      const dep=I.steps.get(key),met=C.rank(C.status(state,key))>=min;
      return `<a href="${path('lesson',key)}" class="dependency ${met?'met':''}">${icon(met?'check':'learn')}<span><strong>${E(dep.skill.title)} · ${E(dep.step.title)}</strong><small>${min===2?'Nearly there permits easy parallel practice':'Meet this step’s consistency criterion'} · ${E(statLabel(C.status(state,key)))}</small></span>${icon('arrow')}</a>`;
    }).join('');
    return `${backBar('topic',skill.sheet,skill.sheet,`<button class="icon-button favorite ${state.favorites.includes(skill.code)?'active':''}" data-action="favorite" data-id="${E(skill.code)}" aria-label="${state.favorites.includes(skill.code)?'Unsave':'Save'} this skill" aria-pressed="${state.favorites.includes(skill.code)}">${icon('heart')}</button>`)}
    <div class="lesson-title"><div class="eyebrow">${E(skill.priority)} · ${E(id)}</div><h1>${E(skill.title)}</h1><p>${E(skill.goal)}</p><div class="card-meta">${badge(avail)}<button class="text-button" data-action="progress" data-id="${E(id)}">${E(statLabel(v))} ${icon('tune')}</button></div></div>
    <nav class="step-strip" aria-label="Teaching steps">${skill.steps.map((s,i)=>link('lesson',s.id,`<span>${C.status(state,s.id)===C.STATUSES[3]?icon('check'):i+1}</span><small>${E(s.title)}</small>`,`step-pill ${s.id===id?'current':''} ${C.status(state,s.id)===C.STATUSES[3]?'done':''}`)).join('')}</nav>
    <section class="lesson-section setup"><div class="eyebrow">GET READY</div><p>${E(skill.setup)}</p><div class="cue-line"><span>Cue</span><strong>${E(skill.cue)}</strong></div></section>
    ${avail==='Build prerequisite'?`<div class="notice amber"><strong>Read ahead; build the earlier piece first.</strong><p>The prerequisite links below show what is missing. For anxiety, comfortable management and easy pairings do not require perfect obedience.</p></div>`:''}
    <section class="lesson-section teaching"><span class="eyebrow">STEP ${n+1} OF ${skill.steps.length}</span><h2>${E(step.title)}</h2><div class="teaching-copy">${E(step.teach).split(/\n\n+/).map(p=>`<p>${p}</p>`).join('')}</div></section>
    <section class="criterion"><div class="criterion-icon">${icon('check')}</div><div><span class="eyebrow">MOVE ON WHEN</span><p>${E(step.advance)}</p></div></section>
    <section class="lesson-section easier"><h2>${icon('leaf')}Make it easier</h2><p>${E(step.easier)}</p></section>
    ${dependencies?`<section class="lesson-section"><h2>Build on these</h2><p class="quiet">Tap a prerequisite to open its exact teaching step.</p><div class="stack">${dependencies}</div></section>`:''}
    <section class="lesson-section"><h2>Your notes</h2><label class="field"><span class="sr-only">Notes for this teaching step</span><textarea id="step-notes" data-id="${E(id)}" rows="3" maxlength="30000" placeholder="What made this comfortable? What helped?">${E(state.progress[id]?.notes||'')}</textarea><small>Saved when you leave this field.</small></label></section>
    <section class="lesson-section references"><details><summary>Why this approach? · Sources</summary><p>These references support the teaching approach. This specific step sequence is an original practical adaptation, not a promise of treatment success.</p>${sourceLinks(skill.sources)}</details></section>
    <div class="lesson-actions"><button class="button" data-action="progress" data-id="${E(id)}">${icon('check')}Set progress</button>${link('session',id,icon('plus')+'Log practice','button secondary')}</div>
    <nav class="step-navigation" aria-label="Previous and next teaching step">${n>0?link('lesson',skill.steps[n-1].id,icon('back')+'Previous','button ghost'):'<span></span>'}${n<skill.steps.length-1?link('lesson',skill.steps[n+1].id,'Next step'+icon('arrow'),'button ghost'):link('topic',skill.sheet,'More in this topic'+icon('arrow'),'button ghost')}</nav>
    <p class="fineprint">A recorded stage is a planning aid. Your dog’s comfort, health, and ability to leave always come first. ${link('basics','','Read the training essentials')}</p>`;
  }
  function progressModal(id) {
    const {step}=I.steps.get(id);
    openModal('How is this step going?',`<div class="mini-criterion"><strong>Move on when</strong><p>${E(step.advance)}</p></div><p class="quiet">Choose the stage that matches this step in its stated setting. You can revise it later.</p><div class="status-options">${C.STATUSES.map((v,i)=>`<button class="status-option ${C.status(state,id)===v?'selected':''}" data-action="set-progress" data-id="${E(id)}" data-value="${E(v)}"><span class="status-dot stage-${i}">${i===3?icon('check'):''}</span><span><strong>${C.LABELS[i]}</strong><small>${['We have not worked on this yet.','Learning the action or building comfort.','Getting reliable; keep it easy.','Meets this exact advancement criterion.','Take a break; dependent stages stay blocked.'][i]}</small></span>${C.status(state,id)===v?icon('check'):''}</button>`).join('')}</div>`);
  }
  function profileView() {
    const p=state.profile;
    return `${backBar('more','','More')}<div class="page-title"><span class="eyebrow">THE INDIVIDUAL IN FRONT OF YOU</span><h1>Your dog,<br>their own way.</h1><p>Optional notes help you choose useful lessons. No diagnosis or starting distance is assumed.</p></div>
    <form id="profile-form" class="form-card">${formError()}${inputField('Their name','name',p.name)}${inputField('Age / life stage','age',p.age)}${textField('Favorite rewards','rewards',p.rewards,'Food, play, sniffing, contact, or distance—whatever they safely enjoy.')}
    <fieldset><legend>Current priorities</legend><p class="quiet">These bring relevant available lessons nearer the top of Today.</p><div class="choice-grid">${D.triggers.map(t=>`<label class="check-chip"><input type="checkbox" name="priority" value="${E(t.name)}" ${p.priorities.includes(t.name)?'checked':''}><span>${E(t.name)}</span></label>`).join('')}</div></fieldset>
    ${textField('Their comfortable baseline','comfort',p.comfort,'Face, posture, movement, sniffing, food-taking, and ordinary recovery.')}${textField('Health, pain, movement, or veterinary directions','health',p.health)}${textField('Equipment and safe retreat','equipment',p.equipment)}${textField('History to share with your professional','history',p.history,'Include bites, attempted bites, redirection, guarding, or sudden changes if relevant.')}${textField('Your veterinary / behavior support','help',p.help)}<button class="button" type="submit">Save profile</button><p class="fineprint">Stored locally. Export a backup from More to keep a separate copy.</p></form>`;
  }
  function journalView() {
    const logs=state.sessions.filter(s=>!journalFilter||s.trigger===journalFilter).slice().sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt.localeCompare(a.createdAt));
    return `<div class="page-title"><span class="eyebrow">NOTICE THE SMALL THINGS</span><h1>Your practice<br>journal.</h1><p>Capture the setup and the dog’s comfort—not just whether they followed a cue.</p></div><a href="#/session" class="button full">${icon('plus')}Record a session</a>
    <label class="field journal-filter"><span>Show sessions</span><select id="journal-filter">${selectOptions(D.triggers.map(t=>t.name),journalFilter,'All triggers and skills')}</select></label>
    <div class="stack">${logs.length?logs.map(s=>sessionCard(s)).join(''):empty('A fresh page','No sample history here. Your first session can be as simple as a few comfortable repetitions.')}</div>`;
  }
  function sessionCard(s) {
    const item=I.steps.get(s.stepId);
    return link('entry',s.id,`<div class="session-date">${icon('journal')}<span>${E(dateLabel(s.date))}</span></div><h3>${E(item?.skill.title||s.trigger||s.type)}</h3><p>${E(s.setup||'No setup note recorded.')}</p><div class="card-meta">${s.trigger?pill(s.trigger):''}${s.response!==null?pill('Response '+s.response):''}${s.recovery!==null?pill(s.recovery+' sec recovery'):''}</div>`,'session-card');
  }
  function sessionForm(id='',editing=false) {
    const existing=editing?state.sessions.find(s=>s.id===id):null;
    if(editing&&!existing)return notFound();
    const item=I.steps.get(id);
    const s=existing||{date:C.dateToday(),stepId:item?id:'',type:item?'Skill practice':'Trigger exposure',trigger:'',setup:'',opportunities:'',successes:'',response:'',recovery:'',recoveryState:'',observations:'',next:''};
    return `${backBar(editing?'entry':'journal',editing?id:'',editing?'Session':'Journal')}<div class="page-title"><span class="eyebrow">A FEW HONEST NOTES</span><h1>${editing?'Edit session':'How did it feel?'}</h1><p>Unknown observations stay blank. Logging does not automatically change lesson progress.</p></div><form id="session-form" data-id="${E(existing?.id||'')}" class="form-card">${formError()}
    ${inputField('Date','date',s.date,'date')}${selectField('Teaching step (optional)','stepId',D.skills.flatMap(sk=>sk.steps.map(st=>[st.id,sk.title+' · '+st.title])),s.stepId,'No linked lesson')}
    ${selectField('Session type','type',['Skill practice','Trigger exposure','Management / event'],s.type)}${selectField('Trigger (if relevant)','trigger',D.triggers.map(t=>t.name),s.trigger,'No trigger recorded')}
    ${textField('Exact setup','setup',s.setup,'Distance, volume, room, helper, equipment, or other context that makes sessions comparable.')}
    <div class="field-pair">${inputField('Opportunities','opportunities',s.opportunities??'','number')}${inputField('Successful / comfortable','successes',s.successes??'','number')}</div><p class="fineprint">Counts mean successful skill responses or comfortable exposure observations, depending on the session. Leave unknown counts blank.</p>
    ${selectField('Observed response (optional)','response',[[0,'0 · Comfortable baseline'],[1,'1 · Briefly alert, recovers'],[2,'2 · Concerned / sticky attention'],[3,'3 · Strong reaction'],[4,'4 · Panic / not recovering']].map(([v,l])=>[String(v),l]),s.response===null?'':String(s.response),'Unknown / not measured')}
    <p class="fineprint">A custom description, not a clinical scale or a safety assessment. Consider the whole dog.</p>
    ${selectField('Recovery state','recoveryState',['Recovered','Not yet recovered','Not measured'],s.recoveryState,'Unknown')}${inputField('Recovery seconds (only if recovered)','recovery',s.recovery??'','number','Time after the event ends until their ordinary comfortable baseline returns. Silence alone is insufficient.')}
    ${textField('Body language and observations','observations',s.observations)}${textField('One next change','next',s.next)}<button class="button" type="submit">Save session</button></form>`;
  }
  function entryView(id) {
    const s=state.sessions.find(x=>x.id===id);if(!s)return notFound();
    const item=I.steps.get(s.stepId);
    return `${backBar('journal','','Journal')}<div class="page-title"><span class="eyebrow">${E(dateLabel(s.date))}</span><h1>${E(item?.skill.title||s.trigger||s.type)}</h1><p>${E(s.type)}${s.trigger?' · '+E(s.trigger):''}</p></div>
    <div class="notice"><strong>For the next session</strong><p>${E(C.sessionGuidance(s))}</p></div><div class="details-card">${[['Setup',s.setup],['Opportunities',s.opportunities],['Successful / comfortable',s.successes],['Observed response',s.response===null?'Not measured':s.response+' / 4 (custom)'],['Recovery',s.recovery!==null?s.recovery+' seconds':s.recoveryState||'Not measured'],['Body language',s.observations],['Next change',s.next]].map(([k,v])=>`<div class="detail-row"><span>${E(k)}</span><p>${E(v??'Not recorded')||'Not recorded'}</p></div>`).join('')}</div>
    ${item?link('lesson',s.stepId,'Open linked teaching step '+icon('arrow'),'button secondary full'):''}<div class="button-row">${link('edit-session',id,'Edit session','button secondary')}<button class="button ghost danger-text" data-action="delete-entry" data-id="${E(id)}">Delete</button></div>`;
  }
  function chart(points,title,unit,maxValue) {
    if(!points.length)return `<section class="chart-card"><h3>${E(title)}</h3>${empty('No observations yet','Record dated sessions with this trigger. Unknown values are omitted rather than drawn as zero.')}</section>`;
    const shown=points.slice(-30), w=340,h=170,l=36,r=12,t=20,b=32,max=maxValue??Math.max(1,...shown.map(p=>p.value))*1.12;
    const x=i=>l+(shown.length===1?(w-l-r)/2:i*(w-l-r)/(shown.length-1)),y=v=>h-b-v*(h-t-b)/max;
    const ticks=[0,max/2,max];
    return `<section class="chart-card"><h3>${E(title)}</h3><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${E(title)}: ${shown.length} observations. ${E(unit)}."><title>${E(title)}</title>${ticks.map(v=>`<path d="M${l} ${y(v)}H${w-r}" class="grid-line"/><text x="${l-6}" y="${y(v)+4}" text-anchor="end">${Math.round(v*10)/10}</text>`).join('')}<polyline points="${shown.map((p,i)=>x(i)+','+y(p.value)).join(' ')}" class="chart-line"/>${shown.map((p,i)=>`<circle cx="${x(i)}" cy="${y(p.value)}" r="4" class="chart-dot"><title>${E(p.date)}: ${p.value} ${E(unit)}</title></circle>`).join('')}<text x="${l}" y="${h-6}">${E(shown[0].date.slice(5))}</text><text x="${w-r}" y="${h-6}" text-anchor="end">${E(shown.at(-1).date.slice(5))}</text></svg><p class="fineprint">Latest ${shown.length} recorded observations · ${E(unit)} · linked in observation order, not evenly spaced calendar time.</p><details><summary>View recorded values</summary><table><thead><tr><th>Date</th><th>${E(unit)}</th></tr></thead><tbody>${shown.map(p=>`<tr><td>${link('entry',p.id,E(dateLabel(p.date)))}</td><td>${p.value}</td></tr>`).join('')}</tbody></table></details></section>`;
  }
  function trendsView() {
    const sum=C.summary(D,state),obs=C.observations(state,trendTrigger);
    return `<div class="page-title"><span class="eyebrow">PROGRESS, WITH CONTEXT</span><h1>Look for<br>comfortable change.</h1><p>Learning a step and feeling less anxious are different things.</p></div>
    <section class="progress-overview"><div class="progress-number">${sum.counts.complete}<span> / ${sum.counts.total}</span></div><h2>teaching steps marked consistent</h2><p>${sum.counts.skills} complete skills · this is not a percentage cure of anxiety.</p></section>
    ${section('Learning by topic')}<div class="topic-progress">${sum.topics.map(t=>link('topic',t.name,`<div class="progress-label"><strong>${E(t.name)}</strong><span>${t.complete} / ${t.total}</span></div><div class="progress-track"><span style="width:${100*t.complete/t.total}%"></span></div>`,'topic-progress-row')).join('')}</div>
    ${section('Trigger observations')}<label class="field"><span>Choose a trigger</span><select id="trend-trigger">${selectOptions(D.triggers.map(t=>t.name),trendTrigger)}</select></label><p class="fineprint">Compare similar contexts. Easier conditions can lower a response without showing comfort in harder conditions. These charts make no clinical judgment.</p>
    ${chart(obs.recovery,'Recovery after the event','seconds')}${chart(obs.response,'Observed response','custom response 0–4',4)}
    <div class="notice"><strong>Describe more than the number.</strong><p>Recovery means returning to their ordinary comfortable behavior after the event ends. The 0–4 description is a personal tracking aid. Keep the setup and body-language notes alongside it.</p></div>`;
  }
  function moreView() {
    const rows=[['profile','dog','Your dog','Preferences, priorities, and baseline'],['plans','tune','Trigger plans','Choose an easy starting version'],['basics','leaf','Training essentials','Comfort, timing, and when to simplify'],['evidence','book','Evidence & limitations','What research supports—and what it doesn’t'],['sources','search','Source library',D.sources.length+' saved reference summaries'],['backup','save','Backup & restore','Keep a separate copy of your progress'],['settings','tune','Appearance','Readable themes and larger type'],['about','shield','About Good Ground','Privacy, build, and compatibility']];
    return `<div class="page-title"><span class="eyebrow">YOUR COMPANION TOOLKIT</span><h1>A little more<br>good ground.</h1><p>The useful details, all in one place.</p></div><div class="menu-list">${rows.map(([p,i,t,d])=>link(p,'',`<div class="menu-icon">${icon(i)}</div><span><strong>${E(t)}</strong><small>${E(d)}</small></span>${icon('arrow')}`,'menu-row')).join('')}</div><div class="local-card">${icon('shield')}<h2>At home on your phone.</h2><p>No account. No analytics. No app-run uploads. Your records stay local unless you choose to export them.</p><small data-save-indicator>${E(saveStatus)}</small></div>`;
  }
  function plansView() {
    return `${backBar('more','','More')}<div class="page-title"><span class="eyebrow">MAKE THE START MANAGEABLE</span><h1>Trigger plans.</h1><p>Use safe existing observations. Never provoke a reaction to measure a threshold. Change one feature at a time.</p></div><div class="stack">${D.triggers.map(t=>link('plan',t.name,`<div class="menu-icon">${icon(topicIcon(I.steps.get(t.step)?.skill.sheet))}</div><span><strong>${E(t.name)}</strong><small>${state.plans[t.name]?.setup?'Your plan is started':E(t.example)}</small></span>${icon('arrow')}`,'menu-row')).join('')}</div>`;
  }
  function planView(name) {
    const t=D.triggers.find(x=>x.name===name);if(!t)return notFound();
    const p=state.plans[name]||{};
    return `${backBar('plans','','Trigger plans')}<div class="page-title"><h1>${E(name)}</h1><p>${E(t.example)} This is an example, not a prescribed starting distance or intensity.</p></div>${link('lesson',t.step,'Open the teaching program '+icon('arrow'),'button secondary full')}
    <form id="plan-form" data-id="${E(name)}" class="form-card">${formError()}${textField('A version my dog can handle comfortably','setup',p.setup)}${textField('Their comfortable body language','baseline',p.baseline)}${textField('One small next change','next',p.next)}${textField('Exit, space, and management','exit',p.exit)}${textField('Notes and support','notes',p.notes)}<button type="submit" class="button">Save trigger plan</button></form>`;
  }
  function basicsView() {
    return `${backBar('more','','More')}<div class="page-title"><span class="eyebrow">THE WAY WE PRACTICE</span><h1>Kindness is<br>part of the method.</h1><p>A useful cue and a comfortable emotional response are different learning goals.</p></div><div class="reading-stack">${D.intro.map(x=>`<section class="reading-card"><h2>${E(x.title)}</h2><p>${E(x.body)}</p></section>`).join('')}</div>
    <section class="reading-card"><h2>Read the progress stages</h2><p>Practicing and Nearly there describe a step in its stated setting. Consistent means it meets the adjacent advancement criterion. Almost-consistent prerequisites permit easy parallel work where the lesson allows it; strict prerequisites need consistency. Paused blocks dependent steps.</p><p>The usual four-in-five rule is a practical planning aid, not a validated scientific cutoff. Comfort overrides every count and availability badge.</p></section>${link('evidence','','Read evidence & limitations '+icon('arrow'),'button secondary full')}`;
  }
  function evidenceView() {
    return `${backBar('more','','More')}<div class="page-title"><span class="eyebrow">RESEARCH, WITHOUT THE OVERCLAIM</span><h1>Evidence &<br>limitations.</h1><p>A focused review with professional guidance, studies, and original teaching adaptations. It is not an exhaustive systematic review.</p></div><div class="reading-stack">${D.evidence.map(x=>`<section class="reading-card"><h2>${E(x.topic)}</h2><p>${E(x.conclusion)}</p><details><summary>Strength and limits</summary><p>${E(x.limits)}</p></details>${sourceLinks(x.sources)}</section>`).join('')}</div>`;
  }
  function sourcesView() {
    return `${backBar('more','','More')}<div class="page-title"><span class="eyebrow">THE REFERENCE SHELF</span><h1>Read the<br>original thinking.</h1><p>Summaries work offline. Original websites require a connection and may have access restrictions.</p></div><label class="search-field">${icon('search')}<span class="sr-only">Search references</span><input id="source-search" type="search" placeholder="Search title, topic, or source ID"></label><div id="source-results" class="stack">${sourcesResults('')}</div>`;
  }
  function sourcesResults(query) {
    const sources=D.sources.filter(s=>[s.id,s.title,s.author,s.finding].join(' ').toLowerCase().includes(query.toLowerCase()));
    return sources.map(s=>link('source',s.id,`<span class="reference-id">${E(s.id)}</span><div class="card-copy"><h3>${E(s.title)}</h3><p>${E(s.author)} · ${E(s.year)}</p><small>${E(s.type)}</small></div>${icon('arrow')}`,'source-card')).join('')||empty('No matching references','Try a shorter title or a source ID.');
  }
  function sourceView(id) {
    const s=D.sources.find(x=>x.id===id);if(!s)return notFound();
    const safeURL=/^https?:\/\//i.test(s.url);
    return `${sourceContext?backBar(sourceContext.type,sourceContext.id,sourceContext.type==='lesson'?'Back to lesson':'Evidence & limitations'):backBar('sources','','Source library')}<div class="page-title"><span class="eyebrow">${E(s.id)} · ${E(s.type)}</span><h1 class="source-title">${E(s.title)}</h1><p>${E(s.author)} · ${E(s.year)}</p></div><div class="reading-stack">${[['Finding',s.finding],['Limits to keep in mind',s.limits],['What was reviewed',s.access],['Use in this guide',s.use]].map(([h,b])=>`<section class="reading-card"><h2>${E(h)}</h2><p>${E(b)}</p></section>`).join('')}</div>${safeURL?`<a class="button secondary full" href="${E(s.url)}" rel="noopener noreferrer">Open original website ↗</a><p class="fineprint">Opens your browser. This is the only part of the guide that needs the original website.</p>`:''}`;
  }
  function backupView() {
    return `${backBar('more','','More')}<div class="page-title"><span class="eyebrow">KEEP WHAT YOU’VE LEARNED</span><h1>A copy of<br>your good work.</h1><p>Lessons come with the app. A backup keeps your personal progress, notes, profile, trigger plans, and journal.</p></div>
    <section class="reading-card"><h2>Export a backup</h2><p>Save a JSON file in Files. Choose <strong>On My iPhone</strong> if you want that copy to stay on the phone. Keep a separate copy before replacing or removing the app or its LiveContainer data container.</p><button class="button" data-action="export">${icon('save')}Save backup to Files</button></section>
    <section class="reading-card"><h2>Restore a backup</h2><p>The file is validated first. You’ll see a summary and confirm before it replaces current records. Canceling leaves your records untouched.</p><button class="button secondary" data-action="import">${icon('restore')}Choose backup file</button></section>${native?'<section class="reading-card"><h2>Previous local save</h2><p>If a recent change or damaged file needs recovery, you can preview the previous local snapshot before deciding whether to restore it.</p><button class="button secondary" data-action="recover-previous">Preview previous save</button></section>':''}<p class="fineprint" data-save-indicator>${E(saveStatus)}</p>`;
  }
  function settingsView() {
    return `${backBar('more','','More')}<div class="page-title"><span class="eyebrow">COMFORTABLE TO READ</span><h1>Make yourself<br>at home.</h1><p>Appearance changes never change your training records.</p></div><form id="settings-form" class="form-card">${selectField('Color theme','theme',[['light','Warm light'],['dark','Quiet dark'],['system','Follow iPhone appearance']],state.settings.theme)}${selectField('Text size','textSize',[['normal','Comfortable'],['large','Larger']],state.settings.textSize)}<button class="button" type="submit">Save appearance</button></form>`;
  }
  function aboutView() {
    return `${backBar('more','','More')}<div class="page-title"><span class="brand-kicker">GOOD GROUND</span><h1>Practice kindly.<br>Keep it local.</h1><p>A personal dog-training companion built around comfortable progress and useful teaching guides.</p></div><div class="reading-stack"><section class="reading-card"><h2>On this phone</h2><p>Version 1.0.0 · Curriculum ${D.version} · Updated ${E(D.updated)}.</p><p>${D.skills.length} skills and programs · ${I.steps.size} teaching steps · ${D.sources.length} reference records.</p><p>The installed app stores its records in its local data container. It has no analytics, remote fonts, advertising, API, or background data uploads. Automatic iCloud backup is excluded for the app’s progress folder; you control any exported files.</p></section><section class="reading-card"><h2>Built for real life</h2><p>The lessons are educational planning guides. Sudden changes, pain, severe panic, bites or redirection, and no comfortable starting setup deserve individual veterinary and behavior support. Secure equipment, barriers, and distance can help while arranging that care.</p></section><section class="reading-card"><h2>In LiveContainer</h2><p>Your records belong to the selected container. Keep using that same container for updates and export a backup before replacing it. File pickers depend on your LiveContainer setup; use its Fix File Picker setting if needed. Compatibility and physical-device behavior still need testing on your iPhone.</p></section></div>`;
  }
  function notFound() {return empty('That page is not here','Return to the library to find the lesson you need.',link('learn','','Open the library','button'));}
  function currentTab(type) {return ['lesson','topic','learn'].includes(type)?'learn':['journal','session','entry','edit-session'].includes(type)?'journal':type==='trends'?'trends':type==='today'?'today':'more';}
  function render(options={}) {
    const previousY=scrollY;dirty=false;
    const [part,raw='']=location.hash.replace(/^#\/?/,'').split('/');const type=part||'today';let id='';try{id=decodeURIComponent(raw);}catch{}
    route=type;
    const views={today:todayView,learn:learnView,topic:()=>topicView(id),lesson:()=>lessonView(id),journal:journalView,session:()=>sessionForm(id),entry:()=>entryView(id),'edit-session':()=>sessionForm(id,true),trends:trendsView,more:moreView,profile:profileView,plans:plansView,plan:()=>planView(id),basics:basicsView,evidence:evidenceView,sources:sourcesView,source:()=>sourceView(id),backup:backupView,settings:settingsView,about:aboutView};
    $('#app').innerHTML=`<div class="app-shell"><div class="top-safe"></div><div id="save-warning" class="load-error" role="alert" ${saveStatus.includes('not')?'':'hidden'}><strong>This change could not be saved.</strong><p>Keep the app open. Retry, or export a backup to protect your work.</p><button class="button secondary" data-action="retry-save">Retry save</button> <button class="button secondary" data-action="export">Export backup</button></div>${loadError?`<div class="load-error" role="alert"><strong>Saved data needs attention.</strong><p>${E(loadError)}</p><button class="button secondary" data-action="import">Restore a backup</button></div>`:''}<main id="main" class="page ${type==='today'?'home-page':''}" tabindex="-1">${(views[type]||notFound)()}</main><nav class="tab-bar" aria-label="Main navigation">${[['today','home','Today'],['learn','learn','Learn'],['journal','journal','Journal'],['trends','chart','Trends'],['more','more','More']].map(([p,i,t])=>`<a href="${path(p)}" class="tab ${currentTab(type)===p?'active':''}" ${currentTab(type)===p?'aria-current="page"':''}>${icon(i)}<span>${t}</span></a>`).join('')}</nav></div>`;
    applySettings();
    document.title=(type==='lesson'?I.steps.get(id)?.skill.title||'Lesson':type.charAt(0).toUpperCase()+type.slice(1))+' · Good Ground';
    window.scrollTo(0,options.preserveScroll?previousY:0);
    if(type==='lesson')requestAnimationFrame(()=>{const strip=$('.step-strip'),active=$('.step-pill.current');if(strip&&active)strip.scrollLeft=Math.max(0,active.offsetLeft-strip.offsetLeft-12);});
  }
  function navigate(type,id) {routePositions.set(location.hash||'#/today',scrollY);pendingScroll=0;location.hash=path(type,id);}
  function stageNotes() {const el=$('#step-notes');if(el&&el.value!==(state.progress[el.dataset.id]?.notes||'')){commit(C.setProgress(state,el.dataset.id,C.status(state,el.dataset.id),el.value));}}
  async function importText(text) {
    try {
      pendingBackup=C.parseBackup(text);
      openModal('Restore this backup?',`<p>This file contains <strong>${pendingBackup.sessions.length} sessions</strong>, <strong>${Object.keys(pendingBackup.progress).length} recorded steps</strong>, and ${pendingBackup.profile.name?`a profile for <strong>${E(pendingBackup.profile.name)}</strong>`:'a dog profile'}.</p><p>Restoring replaces the current profile, progress, plans, and journal. Export your current records first if you want to keep both.</p><div class="button-row"><button class="button secondary" data-action="close-modal">Cancel</button><button class="button" data-action="restore-confirm">Restore backup</button></div>`);
    } catch(error){toast(error.message,true);}
  }
  document.addEventListener('click',event=>{
    const anchor=event.target.closest('a[href^="#/"]');
    if(anchor&&dirty){event.preventDefault();pendingNavigation=anchor.getAttribute('href');confirmAction('Leave these unsaved notes?','Save the form to keep these changes, or leave without saving.','discard-form','Leave without saving');return;}
    if(anchor){
      routePositions.set(location.hash||'#/today',scrollY);
      pendingScroll=anchor.dataset.restore==='true'?(routePositions.get(anchor.getAttribute('href'))||0):0;
      if(anchor.getAttribute('href').startsWith('#/source/')){
        sourceContext=['lesson','evidence'].includes(route)?{type:route,id:decodeURIComponent(location.hash.split('/')[2]||'')}:null;
      }
      stageNotes();
    }
    const go=event.target.closest('[data-go]');if(go){if(dirty){pendingNavigation=path(go.dataset.go);confirmAction('Leave this form?','Unsaved form changes will be discarded.','discard-form','Leave without saving');}else navigate(go.dataset.go);return;}
    const el=event.target.closest('[data-action]');if(!el)return;
    const {action,id,value}=el.dataset;
    switch(action){
      case 'close-modal': closeModal();break;
      case 'retry-save':flush();break;
      case 'recover-previous':send('recoverPrevious');break;
      case 'discard-form':dirty=false;closeModal();location.hash=pendingNavigation;break;
      case 'available':learnFilter='available';learnTopic='';learnQuery='';navigate('learn');break;
      case 'fun-pick':{
        const play=C.available(D,state).filter(x=>['Enrichment','Optional trick'].includes(x.skill.priority));
        if(play.length){const choice=play[Math.floor(Math.random()*play.length)];$('#fun-suggestion').innerHTML=lessonCard(choice.skill,choice.step,true);}break;
      }
      case 'learn-filter':learnFilter=value;render();break;
      case 'progress':stageNotes();progressModal(id);break;
      case 'set-progress':{
        if(commit(C.setProgress(state,id,value))){closeModal();render({preserveScroll:true});$('.lesson-actions [data-action="progress"]')?.focus({preventScroll:true});toast(value===C.STATUSES[3]?'Step recorded as consistent. Related lessons have been updated.':'Progress saved.');}break;
      }
      case 'favorite':{
        const favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];
        if(commit(C.touch({...state,favorites}))){render({preserveScroll:true});$('[data-action="favorite"]')?.focus({preventScroll:true});toast(favorites.includes(id)?'Skill saved to your library.':'Skill removed from Saved.');}break;
      }
      case 'delete-entry':pendingDelete=id;confirmAction('Delete this session?','This removes the session from your journal and charts. Lesson progress stays as recorded.','delete-confirm','Delete session',true);break;
      case 'delete-confirm':if(commit(C.touch({...state,sessions:state.sessions.filter(s=>s.id!==pendingDelete)}))){closeModal();navigate('journal');toast('Session deleted.');}break;
      case 'export':{
        if(loadError){toast('The saved records could not be read. Preview a previous local save or import a backup first.',true);break;}
        try {
          stageNotes();const json=JSON.stringify(C.makeBackup(state,D));
          if(native){send('export',{json});toast('Choose where to save your backup.');}
          else {const url=URL.createObjectURL(new Blob([json],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='Good-Ground-backup-'+C.dateToday()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);toast('Backup prepared for download.');}
        }catch(error){toast(error.message,true);}break;
      }
      case 'import':if(native)send('import');else $('#backup-file').click();break;
      case 'restore-confirm':{
        if(!pendingBackup)break;
        const next={...pendingBackup,revision:Math.max(state.revision,pendingBackup.revision,Number(window.GOOD_GROUND_BOOT?.lastRevision)||0)+1,lastSavedAt:new Date().toISOString()};
        loadError='';state=C.validateState(next);pendingBackup=null;flush();closeModal();render();toast('Backup restored.');break;
      }
    }
  });
  let pendingNavigation='',pendingDelete='';
  document.addEventListener('input',event=>{
    const el=event.target;
    if(el.id==='learn-search'){learnQuery=el.value;$('#learn-results').innerHTML=learnResults();}
    else if(el.id==='source-search')$('#source-results').innerHTML=sourcesResults(el.value);
    else if(el.closest('form'))dirty=true;
  });
  document.addEventListener('change',event=>{
    const el=event.target;
    if(el.id==='step-notes')stageNotes();
    else if(el.id==='learn-topic'){learnTopic=el.value;$('#learn-results').innerHTML=learnResults();}
    else if(el.id==='journal-filter'){journalFilter=el.value;render();}
    else if(el.id==='trend-trigger'){trendTrigger=el.value;render({preserveScroll:true});}
    else if(el.closest('form'))dirty=true;
    if(el.id==='backup-file'&&el.files?.[0]){
      const file=el.files[0];if(file.size>5*1024*1024)toast('Choose a backup smaller than 5 MB.',true);else file.text().then(importText).catch(()=>toast('The backup file could not be read.',true));el.value='';
    }
  });
  document.addEventListener('submit',event=>{
    event.preventDefault();const form=event.target,f=new FormData(form),get=key=>String(f.get(key)||'').trim();
    if(loadError){toast('Restore a readable backup before saving new changes.',true);return;}
    try{
      if(form.id==='profile-form'){
        const profile={...state.profile};for(const key of Object.keys(profile).filter(k=>k!=='priorities'))profile[key]=get(key);profile.priorities=f.getAll('priority');
        if(commit(C.touch({...state,profile}))){dirty=false;navigate('today');toast('Profile saved.');}
      }else if(form.id==='plan-form'){
        const plan=Object.fromEntries(['setup','baseline','next','exit','notes'].map(k=>[k,get(k)]));
        if(commit(C.touch({...state,plans:{...state.plans,[form.dataset.id]:plan}}))){dirty=false;toast('Trigger plan saved.');}
      }else if(form.id==='session-form'){
        const old=state.sessions.find(s=>s.id===form.dataset.id);
        const s=C.normalizeSession({...Object.fromEntries(f),id:old?.id||'',createdAt:old?.createdAt||''});
        const sessions=old?state.sessions.map(x=>x.id===old.id?s:x):[...state.sessions,s];
        if(sessions.length>10000)throw new Error('This journal has reached 10,000 sessions. Export a backup before starting a fresh record.');
        if(commit(C.touch({...state,sessions}))){dirty=false;navigate('entry',s.id);toast('Session saved.');}
      }else if(form.id==='settings-form'){
        if(commit(C.touch({...state,settings:{theme:get('theme'),textSize:get('textSize')}}))){dirty=false;applySettings();toast('Appearance saved.');}
      }
    }catch(error){failForm(form,error.message);}
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&$('#modal-root').children.length){event.preventDefault();closeModal();}
    if(event.key==='Tab'&&$('#modal-root').children.length){
      const focusable=[...$('#modal-root').querySelectorAll('button,a,input,select,textarea,[tabindex="0"]')].filter(x=>!x.disabled);
      const first=focusable[0],last=focusable.at(-1);
      if(event.shiftKey&&document.activeElement===first){last?.focus();event.preventDefault();}
      else if(!event.shiftKey&&document.activeElement===last){first?.focus();event.preventDefault();}
    }
  });
  // Swipes only change which lesson is being read; they never mark progress.
  // Horizontal step pills, controls, text selection and vertical reading are excluded.
  let swipeStart=null;
  document.addEventListener('touchstart',event=>{
    if(route!=='lesson'||event.touches.length!==1||event.target.closest('a,button,input,textarea,select,summary,.step-strip,.modal')){swipeStart=null;return;}
    const t=event.touches[0];swipeStart={x:t.clientX,y:t.clientY,time:Date.now()};
  },{passive:true});
  document.addEventListener('touchend',event=>{
    if(!swipeStart||event.changedTouches.length!==1)return;
    const start=swipeStart;swipeStart=null;
    if(route!=='lesson'||Date.now()-start.time>700||window.getSelection()?.toString())return;
    const end=event.changedTouches[0],dx=end.clientX-start.x,dy=end.clientY-start.y;
    if(Math.abs(dx)<90||Math.abs(dy)>40||Math.abs(dx)<Math.abs(dy)*2)return;
    let current;try{current=decodeURIComponent(location.hash.split('/')[2]||'');}catch{return;}const item=I.steps.get(current);
    if(!item)return;
    const next=item.skill.steps[item.skill.steps.indexOf(item.step)+(dx<0?1:-1)];
    if(next){stageNotes();navigate('lesson',next.id);}
  },{passive:true});
  window.addEventListener('hashchange',()=>{const restoreY=pendingScroll;pendingScroll=0;closeModal();render();$('#main')?.focus({preventScroll:true});if(restoreY)requestAnimationFrame(()=>scrollTo(0,restoreY));});
  window.addEventListener('pagehide',()=>{stageNotes();flush();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stageNotes();flush();}});
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applySettings);
  window.GoodGround={
    flush:()=>{stageNotes();flush();},
    nativeMessage(message){
      if(message.type==='saved'){acknowledged=Math.max(acknowledged,message.revision);if(acknowledged>=state.revision){saveStatus='Saved on this phone';showSave();}}
      else if(message.type==='saveError'){saveStatus='Could not save — export a backup';showSave();toast(message.message,true);}
      else if(message.type==='import')importText(message.json);
      else if(message.type==='error')toast(message.message,true);
    },
    // Read-only diagnostics support browser tests and optional simulator smoke checks.
    snapshot:()=>C.validateState(state),
    ready:true
  };
  render();
  if(window.GOOD_GROUND_BOOT?.smoke){
    setTimeout(async()=>{
      const result={loaded:!!document.querySelector('h1'),skills:D.skills.length,steps:I.steps.size,bridge:false,lesson:false,restored:false,errors:[]};
      try{
        const probe=C.setProgress(state,'NAME-1',C.STATUSES[3]);state=probe;flush();
        location.hash='#/lesson/NAME-2';await new Promise(r=>setTimeout(r,500));
        result.lesson=document.body.textContent.includes('Reward the head turn')&&document.body.textContent.includes('Ready to start');
        result.restored=C.parseBackup(JSON.stringify(C.makeBackup(state,D))).progress['NAME-1'].status===C.STATUSES[3];
        for(let attempt=0;attempt<40&&acknowledged<state.revision;attempt++)await new Promise(r=>setTimeout(r,100));result.bridge=acknowledged>=state.revision;
      }catch(error){result.errors.push(error.message);}
      send('smokeResult',{result});
    },650);
  }
})();
