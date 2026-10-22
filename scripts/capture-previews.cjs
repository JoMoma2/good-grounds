// Capture clean, empty browser records through the same first-use flow as the app.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
  const root=path.resolve(__dirname,'..'),out=root+'/previews';fs.mkdirSync(out,{recursive:true});
  const browser=await chromium.launch({headless:true}),context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true}),page=await context.newPage();
  const base=pathToFileURL(root+'/app/web/index.html').href;
  const capture=name=>page.screenshot({path:out+'/'+name+'.png'});
  const go=async hash=>{await page.evaluate(h=>location.hash=h,hash);await page.waitForFunction(h=>{const [route,id='']=h.replace('#/','').split('/'),main=document.querySelector('#main');return main?.dataset.route===route&&main?.dataset.pageId===decodeURIComponent(id);},hash);};
  try{
    await page.goto(base);await page.waitForFunction(()=>GoodGround?.ready);await capture('onboarding');
    await page.getByRole('button',{name:'Continue',exact:true}).click();await page.locator('#setup-profile-form').waitFor();await capture('profile-setup');
    await page.getByRole('button',{name:'Skip profile for now',exact:true}).click();await page.locator('.tour-symbol').waitFor();await capture('tour');
    await page.getByRole('button',{name:'Skip tour',exact:true}).click();await page.locator('.home-heading').waitFor();await capture('today');
    for(const [name,hash] of [['library','#/learn'],['lesson','#/lesson/NAME-1'],['clicker','#/clicker'],['journal','#/journal'],['more','#/more'],['dogs','#/dogs']]){await go(hash);await capture(name);}
    await go('#/settings');await page.locator('[name="theme"]').selectOption('dark');await page.getByRole('button',{name:'Save settings'}).click();await go('#/lesson/NAME-2');await page.waitForTimeout(100);await capture('dark');
    if((await page.evaluate(()=>GoodGround.snapshot())).sessions.length)throw new Error('Preview capture must not invent journal records.');
    console.log('Captured ten clean previews; no dog history or sessions prefilled.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
