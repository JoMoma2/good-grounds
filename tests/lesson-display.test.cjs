const {test}=require('node:test'),assert=require('node:assert/strict');
const C=require('../app/web/core.js'),D=require('../app/web/data.json');
test('old saves gain Simple display without changing household records or existing settings',()=>{
 let s=C.freshState();s.profile.name='Molly';s=C.setProgress(s,'NAME-1',C.STATUSES[2],'Keep this note');s=C.addDog(s,{name:'Poppy'});s.settings.textSize='large';s.settings.markerVolume=55;delete s.settings.lessonMode;delete s.settings.lessonSections;
 const restored=C.validateState(s);for(const field of ['profile','progress','sessions','progressHistory','cues','plans','household'])assert.deepEqual(restored[field],s[field]);
 assert.equal(restored.settings.lessonMode,'simple');assert.deepEqual(restored.settings.lessonSections,{});assert.equal(restored.settings.textSize,'large');assert.equal(restored.settings.markerVolume,55);assert.ok(Object.values(C.lessonSections(restored.settings)).every(v=>v===false));
});
test('preset overrides are independent and survive native storage and backup roundtrips',()=>{
 const s=C.freshState();s.settings.lessonMode='simple';s.settings.lessonSections={easier:true,notes:true};let round=C.parseBackup(JSON.stringify(C.makeBackup(s,D)));
 assert.deepEqual(round.settings,s.settings);assert.equal(C.lessonSections(round.settings).easier,true);assert.equal(C.lessonSections(round.settings).sources,false);
 round.settings.lessonMode='detailed';round.settings.lessonSections={sources:false};round=C.validateState(JSON.parse(JSON.stringify(C.storageState(round))));
 assert.equal(C.lessonSections(round.settings).sources,false);assert.equal(C.lessonSections(round.settings).easier,true);assert.equal(C.lessonSections(round.settings).steps,true);
});
test('unknown or malformed optional preferences safely fall back without invalidating training data',()=>{
 const s=C.freshState();s.settings.lessonMode='unknown';s.settings.lessonSections={easier:'yes',notes:false,arbitrary:true};let copy=C.validateState(s);assert.equal(copy.settings.lessonMode,'simple');assert.deepEqual(copy.settings.lessonSections,{notes:false});
 s.settings.lessonSections=['easier'];assert.deepEqual(C.validateState(s).settings.lessonSections,{});
});
