// Focused acceptance checks for the development handoff using real Web Audio.
const {chromium,webkit}=require('playwright');
const {AxeBuilder}=require('@axe-core/playwright');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..'),web=process.env.GG_WEB_ROOT||root+'/app/web',C=require(web+'/core.js'),D=require(web+'/data.json'),engine=process.env.GG_BROWSER||'chromium';
const report={engine,webRoot:web,checks:[],errors:[],externalRequests:[],nativeRuntimeTested:false};
async function main(){
 const browser=await (engine==='webkit'?webkit:chromium).launch({headless:true});let context,page;
 const out=root+'/test-results';fs.mkdirSync(out,{recursive:true});
 const fresh=()=>{const s=C.freshState();s.household.setupComplete=true;s.household.tutorialSeenVersion=1;s.profile.name='Molly';return s;};
 async function boot(s=fresh(),hash='#/lesson/NAME-1'){
  if(context)await context.close();context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await context.addInitScript(state=>{
   window.GOOD_GROUND_BOOT={native:true,state,error:null,smoke:false};window.__saved=state;
   window.webkit={messageHandlers:{ground:{postMessage:m=>{if(m.action==='save')window.__saved=m.state;}}}};
   window.__starts=0;const Audio=window.AudioContext||window.webkitAudioContext;
   if(Audio)window.AudioContext=function(...args){const ctx=new Audio(...args);window.__audio=ctx;const create=ctx.createBufferSource.bind(ctx);ctx.createBufferSource=()=>{const source=create(),start=source.start.bind(source);source.start=(...args)=>{window.__starts++;start(...args);};return source;};return ctx;};
  },s);
  page=await context.newPage();page.setDefaultTimeout(7000);page.on('pageerror',e=>report.errors.push(e.stack||e.message));
  await page.route('http{,s}://**',route=>{report.externalRequests.push(route.request().url());return route.abort();});
  await page.goto(pathToFileURL(web+'/index.html').href+hash);await page.waitForFunction(()=>GoodGround?.ready);
 }
 const snap=()=>page.evaluate(()=>GoodGround.snapshot());
 async function nav(hash){await page.evaluate(h=>location.hash=h,hash);await page.waitForFunction(h=>{const [type,id='']=h.replace('#/','').split('/'),main=document.querySelector('#main');return main?.dataset.route===type&&main?.dataset.pageId===decodeURIComponent(id);},hash);}
 async function check(name,fn){await fn();report.checks.push(name);console.log('PASS '+name);}
 try{
  await check('lesson marker gives immediate visible and readable feedback, exactly once per activation',async()=>{
   await boot();const marker=page.locator('.lesson-marker [data-marker]');
   await marker.tap();await page.waitForFunction(()=>window.__starts===1);
   assert.equal(await page.locator('#marker-feedback').textContent(),'Marked. Reward now.');
   assert.equal(await marker.locator('[data-marker-label]').textContent(),'Marked!');
   for(let i=0;i<8;i++)await marker.tap();assert.equal(await page.evaluate(()=>__starts),9);
   await marker.focus();await page.keyboard.press('Enter');await page.keyboard.press('Space');
   await page.waitForFunction(()=>__starts===11);assert.equal((await snap()).sessions.length,0);assert.deepEqual((await snap()).progress,{});
   await page.screenshot({path:out+'/handoff-lesson-'+engine+'.png',fullPage:true});
  });
  await check('holding Enter or Space marks on keydown once, without marking while typing in fields',async()=>{
   const marker=page.locator('.lesson-marker [data-marker]');await marker.focus();
   for(const key of ['Enter','Space']){
    const before=await page.evaluate(()=>__starts);await page.keyboard.down(key);await page.waitForFunction(n=>__starts===n,before+1);
    for(let i=0;i<4;i++)await page.keyboard.down(key);assert.equal(await page.evaluate(()=>__starts),before+1);
    await page.keyboard.up(key);assert.equal(await page.evaluate(()=>__starts),before+1);
   }
   const before=await page.evaluate(()=>__starts);await page.locator('[data-cue-input]').fill('Molly come');assert.equal(await page.evaluate(()=>__starts),before);
  });
  await check('marker and Set progress stay above navigation and settle at their normal location',async()=>{
   await nav('#/lesson/VISITOR-4');const controls=page.locator('.lesson-actions');
   for(const dimensions of [{width:390,height:844},{width:320,height:568},{width:844,height:390}]){
    await page.setViewportSize(dimensions);
    for(const text of ['normal','large']){
     await page.evaluate(t=>document.documentElement.dataset.text=t,text);
     for(const y of [0,250,600]){
      await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);
      await page.waitForTimeout(40);
      const box=await controls.boundingBox(),bar=await page.locator('.tab-bar').boundingBox();
      assert.ok(box.y>=0&&box.y+box.height<=bar.y,JSON.stringify({dimensions,text,y,box,bar}));
      assert.ok(await page.locator('.lesson-marker [data-marker]').isVisible());
     }
    }
   }
   await page.setViewportSize({width:390,height:844});
   await page.evaluate(()=>{document.documentElement.dataset.text='normal';scrollTo({top:document.body.scrollHeight,behavior:'instant'});});
   await page.waitForTimeout(40);const box=await controls.boundingBox(),bar=await page.locator('.tab-bar').boundingBox();assert.ok(box.y+box.height<bar.y-20,'Controls should rest above the remaining lesson footer');
   await page.getByRole('button',{name:'Set progress',exact:true}).click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Close dialog',exact:true}).click();
  });
  await check('Settings can hide and restore the lesson marker, preserving the preference through backup',async()=>{
   await nav('#/settings');await page.locator('[name="lessonMarker"]').uncheck();await page.getByRole('button',{name:'Save settings',exact:true}).click();
   const hidden=await snap();assert.equal(C.parseBackup(JSON.stringify(C.makeBackup(hidden,D))).settings.lessonMarker,false);
   await boot(hidden);assert.equal(await page.locator('.lesson-marker').count(),0);assert.equal(await page.getByRole('link',{name:'Open clicker',exact:true}).count(),1);const shortcut=await page.getByRole('link',{name:'Open clicker',exact:true}).boundingBox(),progress=await page.getByRole('button',{name:'Set progress',exact:true}).boundingBox();assert.ok(shortcut.x+shortcut.width<=progress.x,'Hidden-marker controls must not overlap');
   await nav('#/settings');await page.locator('[name="lessonMarker"]').check();await page.getByRole('button',{name:'Save settings',exact:true}).click();await nav('#/lesson/NAME-1');assert.equal(await page.locator('.lesson-marker').count(),1);
  });
  await check('muted and unavailable audio show an error rather than false success or practice',async()=>{
   const s=fresh();s.settings.markerVolume=0;await boot(s);await page.locator('[data-marker]').tap();assert.ok((await page.locator('#marker-feedback').textContent()).includes('muted'));assert.equal(await page.evaluate(()=>__starts),0);
   await boot();await page.evaluate(()=>{window.AudioContext=undefined;window.webkitAudioContext=undefined;});await page.locator('[data-marker]').tap();await page.waitForFunction(()=>document.querySelector('#marker-feedback').classList.contains('sound-error'));assert.ok((await page.locator('#marker-feedback').textContent()).includes('unavailable'));assert.ok(page.url().endsWith('#/lesson/NAME-1'),'An error reflow must not turn a marker release into navigation');assert.equal(await page.evaluate(()=>__starts),0);assert.equal((await snap()).sessions.length,0);
  });
  await check('clicker current-step criteria expand separately and training tools live under Lessons',async()=>{
   await boot();await page.getByRole('link',{name:'Open clicker',exact:true}).click();await page.locator('.marker-pad').waitFor();
   const criteria=page.locator('.marker-lesson details');assert.equal(await criteria.count(),2);
   await criteria.nth(0).locator('summary').click();assert.equal(await criteria.nth(0).getAttribute('open'),'');assert.equal(await criteria.nth(1).getAttribute('open'),null);
   await nav('#/learn');assert.equal(await page.locator('.training-tools a').count(),4);assert.equal(await page.locator('.tab-bar a').count(),4);
   assert.equal(await page.locator('.tab.active').textContent(),'Lessons');
   const group=page.locator('.training-group').first();await group.locator('summary').first().click();assert.equal(await group.getAttribute('open'),null);
   await page.locator('#learn-search').fill('NAME-1');assert.equal(await page.locator('.training-group').first().getAttribute('open'),'');
   await nav('#/more');assert.equal(await page.locator('.menu-row').count(),4);
   await page.getByRole('link',{name:/Source library/}).click();await page.getByRole('link',{name:'Evidence & limitations',exact:true}).waitFor();
  });
  await check('larger text scales headings, labels, controls and body text throughout the app',async()=>{
   await boot();for(const hash of ['#/lesson/NAME-1','#/settings','#/more','#/sources']){
    await nav(hash);const measure=()=>page.locator('h1,.button,.back-link,.eyebrow,.field>span,.menu-row strong,.source-card h3,.teaching-copy p').evaluateAll(els=>els.filter(e=>e.getBoundingClientRect().height>0).map(e=>parseFloat(getComputedStyle(e).fontSize)));
    await page.evaluate(()=>document.documentElement.dataset.text='normal');const normal=await measure();await page.evaluate(()=>document.documentElement.dataset.text='large');const large=await measure();
    assert.equal(normal.length,large.length);normal.forEach((size,i)=>assert.ok(large[i]>size,hash+' text did not grow: '+size));
   }
  });
  await check('dog names update default name cues while explicit custom cues survive renames',async()=>{
   await boot();assert.equal(await page.locator('[data-cue-input]').inputValue(),'Molly');
   await page.locator('[data-cue-input]').fill('');await page.locator('[data-cue-input]').blur();assert.equal(await page.locator('[data-cue-input]').inputValue(),'Molly');assert.equal((await snap()).cues.NAME,undefined);
   await nav('#/profile');await page.locator('[name="name"]').fill('Poppy');await page.getByRole('button',{name:'Save profile',exact:true}).click();await nav('#/lesson/NAME-1');assert.equal(await page.locator('[data-cue-input]').inputValue(),'Poppy');
   await page.locator('[data-cue-input]').fill('Pops');await page.locator('[data-cue-input]').blur();await nav('#/profile');await page.locator('[name="name"]').fill('Poppy II');await page.getByRole('button',{name:'Save profile',exact:true}).click();await nav('#/lesson/NAME-1');assert.equal(await page.locator('[data-cue-input]').inputValue(),'Pops');
  });
  await check('profile changes update relevant practice pieces; completed starting points disappear',async()=>{
   const s=fresh();s.tailoring.traits=['noise'];await boot(s,'#/lesson/SOUND-1');assert.equal(await page.locator('.tailored-teaching li').count(),3);assert.equal(await page.locator('.tailored-setup').count(),0);
   await nav('#/lesson/SIT-1');assert.equal(await page.locator('.tailored-teaching').count(),0);
   for(const id of ['SAFE-1','SOUND-1'])s.progress[id]={status:C.STATUSES[3],notes:'',updatedAt:new Date().toISOString()};await boot(s,'#/today');assert.equal(await page.locator('.tailored-today').count(),0);
   await nav('#/profile');await page.locator('.support-fields summary').click();await page.locator('[name="trait"][value="noise"]').uncheck();await page.getByRole('button',{name:'Save profile',exact:true}).click();await nav('#/lesson/SOUND-1');assert.equal(await page.locator('.tailored-teaching').count(),0);
  });
  await check('changing breed through Unknown reopens a relevant check while unrelated edits do not',async()=>{
   const s=fresh();s.profile.breed='Lagotto Romagnolo';s.tailoring.reviewedBreed=s.profile.breed;await boot(s,'#/profile');
   await page.locator('[name="rewards"]').fill('A little tug game');await page.getByRole('button',{name:'Save profile',exact:true}).click();await nav('#/today');assert.equal(await page.getByRole('dialog').count(),0);
   const selectBreed=async(name)=>{await nav('#/profile');await page.locator('[data-action="choose-breed"]').click();await page.locator('#breed-search').fill(name);await page.locator('[data-action="pick-breed"]').filter({hasText:name}).first().click();await page.getByRole('button',{name:'Save profile',exact:true}).click();};
   await selectBreed('Unknown');await nav('#/today');assert.equal((await snap()).tailoring.reviewedBreed,'');
   await selectBreed('Lagotto Romagnolo');await page.getByRole('heading',{name:'Does this fit Molly?',exact:true}).waitFor();assert.deepEqual((await snap()).tailoring.traits,[]);
   await page.getByRole('button',{name:'Yes, that fits',exact:true}).click();await nav('#/lesson/SOUND-1');assert.equal(await page.locator('.tailored-teaching').count(),1);
  });
  await check('fridge components stay grouped in both library and topic views; old topic links resolve',async()=>{
   await boot(fresh(),'#/learn');const chain=page.locator('.fridge-chain');assert.equal(await chain.count(),1);assert.equal(await chain.locator('.lesson-card').count(),4);assert.equal(await chain.getAttribute('open'),null);
   await chain.locator('summary').click();await chain.locator('.lesson-card').first().waitFor();
   await nav('#/topic/Clever%20companions');assert.equal(await page.locator('.fridge-chain').count(),1);
   await nav('#/topic/Fridge%20task');assert.equal(await page.locator('.fridge-chain').count(),1);assert.equal(await page.getByRole('heading',{name:'Clever companions',exact:true}).count(),1);
   await nav('#/topic/Play%20and%20jobs');assert.equal(await page.getByRole('heading',{name:'Tug a rope handle',exact:true}).count(),1);
  });
  await check('lesson actions, clicker, settings and grouped library remain accessible at large text',async()=>{
   for(const hash of ['#/lesson/NAME-1','#/clicker','#/settings','#/learn']){
    await nav(hash);await page.evaluate(()=>document.documentElement.dataset.text='large');const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();assert.equal(report.violations.length,0,hash+': '+JSON.stringify(report.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   }
  });
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.externalRequests,[]);
 }finally{fs.writeFileSync(out+'/handoff-'+engine+'.json',JSON.stringify(report,null,2)+'\n');await browser.close();}
}
main().catch(e=>{report.failure=e.stack;fs.writeFileSync(root+'/test-results/handoff-'+engine+'.json',JSON.stringify(report,null,2)+'\n');console.error(e);process.exitCode=1;});
