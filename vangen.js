(() => {
'use strict';
const $=id=>document.getElementById(id),field=$('field'),catcher=$('catcher');
const rig=new WitchRig(catcher,$('pot-front'));let sinking=[],facing=1;
let assistance=new GameRules.Assistance(),waveFailed=false;
function catchMistake(){if(waveFailed)return;waveFailed=true;assistance.record(false);correct=Math.max(0,correct-1);combo=0;progress()}
let repeatFlight=false;
let flightLane=1,flyY=0,ringX=0,trailTimer=0,clueSpeaking=false,speechDeadline=0,speechVersion=0;
let phase='start',paused=false,muted=false,round=0,correct=0,combo=0,target='',previous='',items=[],x=0,aim=0,w=0,h=0,cw=0,ch=0,time=0,next=0,flightCount=0,gateAge=0,gateLock=false,last=0,keys=new Set(),audio;
const collected=new Set(),tray=new CollectedTray();let rewardVersion=0;
const intro=new HedgehogIntro(field,mode=>{
 keys.clear();aim=x;
 if(mode==='reward')completeBook();else flight();
},tone);
const shelf=new BookShelf(field,i=>{round=i;previous='';targetBag=[];startMissionStory()});
let targetBag=[];
function showShelf(){GameMusic.stop();field.querySelector('.answer-pop')?.remove();rewardVersion++;phase='start';paused=false;keys.clear();intro.active=false;intro.pour?.hide();intro.cancelTurn();intro.node.hidden=true;field.classList.remove('story-playing','story-ready','flying','is-paused');clear();sinking=[];$('caught').replaceChildren();$('gates').replaceChildren();$('gate-fronts').replaceChildren();$('flyer').hidden=true;catcher.hidden=true;$('pot-front').hidden=true;$('start').hidden=true;$('finished').hidden=true;$('paused').hidden=true;GameVoice.stop();GameVoice.paused=false;shelf.show()}
function completeBook(){const lastImage=intro.pages.at(-1).src;showShelf();phase='complete';shelf.finish(round,lastImage).then(()=>{phase='start'})}
function startMissionStory(){GameMusic.start();collected.clear();combo=0;correct=0;shelf.hide();phase='intro';paused=false;field.classList.remove('is-paused','flying');$('finished').hidden=true;$('start').hidden=true;clear();$('gates').replaceChildren();$('gate-fronts').replaceChildren();$('flyer').hidden=true;catcher.hidden=true;$('pot-front').hidden=true;intro.setMission(round);if(round<4){intro.start()}else{intro.node.hidden=true;field.classList.remove('story-ready','story-playing');flight()}field.focus()}
async function storyReward(){
 phase='landing';const version=++rewardVersion;const shapes=[...collected];
 try{const src=await tray.render(shapes);if(version!==rewardVersion||phase!=='landing')return;
 intro.pour?.remove();intro.pour=tray.animation(intro.node.querySelector('.story-pages'),shapes,tone);
 const page=intro.pages[intro.bridgeIndex];page.src=src;page.dataset.shapes=JSON.stringify(shapes);page.alt='De heks heeft verzameld: '+shapes.join(', ');await page.decode();
 }catch(e){console.error('Dienblad kon niet worden geladen',e)}
 if(version!==rewardVersion||phase!=='landing')return;phase='outro';intro.start('reward');
}
function landStory(){clear();$('gates').replaceChildren();$('gate-fronts').replaceChildren();$('flyer').hidden=true;catcher.hidden=true;$('pot-front').hidden=true;field.classList.remove('flying')}

const shuffle=a=>a.slice().sort(()=>Math.random()-.5);
const level=()=>GameRules.level(round);
const pool=()=>level().shapes;
const named=s=>(s==='vierkant'?'het ':'de ')+s;
const itemSize=()=>parseFloat(getComputedStyle(field).getPropertyValue('--ingredient-size'))||(w<600?62:70);
const src=s=>'vormen/'+s+(GameRules.levels[4].shapes.includes(s)?'-ruimtelijk':'-basis')+'.svg';
function showAnswer(shape){
 field.querySelector('.answer-pop')?.remove();
 const pop=document.createElement('div');pop.className='answer-pop';pop.setAttribute('aria-hidden','true');
 const img=document.createElement('img');img.src=src(shape);img.alt='';pop.append(img);
 pop.addEventListener('animationend',e=>{if(e.target===pop)pop.remove()});field.append(pop);
}
function say(text,kind='feedback'){
 const version=++speechVersion;let id;
 if(kind==='clue')id='vliegen_vraag_'+target;
 else if(text.startsWith('Vang '))id='vangen_vraag_'+target;
 else if(text.startsWith('Ai, dat was geen ')){const match=text.match(/^Ai, dat was geen (\w+), maar een (\w+)!/);if(match)id='vangen_fout_'+match[1]+'_'+match[2]}
 else if(text==='Oeps! Nog eens!')id='vliegen_fout';
 else if(text.startsWith('Een '))id='vliegen_goed_'+text.slice(4).replace('!','');
 else if(GameRules.levels.some(l=>l.shapes.includes(text)))id='vangen_goed_'+text;
 clueSpeaking=!muted&&kind==='clue';speechDeadline=Infinity;
 GameVoice.play(id).then(()=>{if(version===speechVersion)clueSpeaking=false});
}
function tone(ok){if(muted)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.type='sine';o.frequency.setValueAtTime(ok?520:180,audio.currentTime);o.frequency.exponentialRampToValueAtTime(ok?1000:100,audio.currentTime+.2);g.gain.setValueAtTime(.12,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.35);o.start();o.stop(audio.currentTime+.35)}catch{}}
function size(){const oldW=w;w=field.clientWidth;if(oldW&&oldW!==w)items.forEach(item=>item.x=item.x/oldW*w);h=field.clientHeight;cw=parseFloat(getComputedStyle(catcher).width);ch=parseFloat(getComputedStyle(catcher).height);x=Math.max(w/4,Math.min(w*3/4,x||w/2));aim=x;position();for(const group of [$('gates'),$('gate-fronts')])[...group.children].forEach((g,i)=>g.style.top=laneY(i)+'px');if(phase==='flight')flyY=laneY(flightLane)}
function position(){catcher.style.transform='translate('+(x-cw*.5-facing*cw*.05)+'px,'+(h-ch-10)+'px)'}
function particles(px,py,ok=true){for(let i=0;i<10;i++){const e=document.createElement('img');e.src='effecten/'+(ok?'ster':'rook')+'.svg';e.className='spark';e.style.cssText='left:'+px+'px;top:'+py+'px;--dx:'+(Math.random()*150-75)+'px;--dy:'+(-30-Math.random()*100)+'px';$('fx').append(e);setTimeout(()=>e.remove(),1000)}}
function immerse(item,good){
const el=item.el; $(good?'caught':'falling').append(el); sinking.push({el,good,age:0,offset:Math.max(-cw*.08,Math.min(cw*.08,item.x-x))});
}
function animateWitch(dt){if(phase==='intro'||phase==='outro'||phase==='start'||phase==='complete')return;if(phase==='flight'){$('pot-front').hidden=true;return}
const top=h-ch-10;
const nearest=items.filter(i=>i.y<top+ch*.43).sort((a,b)=>Math.hypot(a.x-x,a.y-top-ch*.25)-Math.hypot(b.x-x,b.y-top-ch*.25))[0];
rig.render(x-facing*cw*.05,cw,ch,time,dt,nearest?{x:nearest.x-(x-facing*cw*.05-cw/2),y:nearest.y-top}:null,facing);
$('pot-front').hidden=catcher.hidden;
for(const s of [...sinking]){s.age+=dt;const p=Math.min(1,s.age/.55),sz=itemSize();
const px=x+s.offset*(1-p),rim=top+ch*.417+rig.bob;
const py=s.good?rim-sz*.28+p*(ch*.13+sz*.28):rim-Math.sin(p*Math.PI)*75;
s.el.style.transform='translate('+(px-sz/2+(s.good?0:p*cw*.6))+'px,'+(py-sz/2)+'px) rotate('+(GameRules.rotates(round,s.el.dataset.shape)?p*35:0)+'deg) scale('+(s.good?1-p*.5:1)+')';
s.el.style.opacity=s.good?'1':String(1-p);
if(p===1){s.el.remove();sinking=sinking.filter(a=>a!==s)}
}
}
function progress(){ $('drops').innerHTML=Array.from({length:phase==='flight'?(round===1?5:3):5},(_,i)=>'<i class="'+(i<(phase==='flight'?flightCount:correct)?'on':'')+'"></i>').join('');$('drops').setAttribute('aria-label',(phase==='flight'?flightCount:correct)+' van '+(phase==='flight'?(round===1?5:3):5)+' goed')}
function ask(){if(!targetBag.length)targetBag=shuffle([...pool(),...(level().focus||[]),...(level().focus||[])]);
let pick=targetBag.findIndex(s=>s!==previous);if(pick<0)pick=0;target=targetBag.splice(pick,1)[0];previous=target;$('question').textContent=phase==='flight'?ShapeLanguage.clue(target):'Vang '+named(target)+'!';if(phase==='flight')say($('question').textContent,'clue')}
function clear(){items=[];$('falling').replaceChildren()}
function wave(){if(field.querySelector('.answer-pop')||items.length||phase!=='catch'||(!muted&&GameVoice.busy&&time<speechDeadline))return;waveFailed=false;say('Vang '+named(target)+'!');const choices=shuffle([target,...shuffle(pool().filter(s=>s!==target)).slice(0,assistance.count-1)]);choices.forEach((s,i)=>{const el=document.createElement('div');el.className='ingredient';el.dataset.shape=s;const img=document.createElement('img');img.src=src(s);img.alt=s;el.append(img);$('falling').append(el);items.push({s,el,x:w*(choices.length===2?(i? .75:.25):(i+1)/4),y:115-i*30,seen:false})})}
function begin(){phase='catch';paused=false;assistance=new GameRules.Assistance();field.dataset.level=String(Math.min(5,round+1));correct=0;combo=0;clear();$('start').hidden=true;$('finished').hidden=true;$('paused').hidden=true;$('gates').replaceChildren();$('gate-fronts').replaceChildren();$('flyer').hidden=true;catcher.hidden=false;size();field.classList.remove('flying');field.setAttribute('aria-label','Vang de vorm. Beweeg naar links of rechts met je vinger, muis of pijltjestoetsen.');keys.clear();rig.lastX=null;next=time+.5;ask();progress();field.focus()}

function flight(){
 phase='flight';repeatFlight=false;size();clear();catcher.hidden=true;$('flyer').hidden=false;field.classList.add('flying');flightCount=0;flightLane=1;flyY=h*.52;keys.clear();progress();gates();
 field.setAttribute('aria-label','Vlieg boven, midden of onder. Gebruik pijltje omhoog of omlaag, je muis of je vinger.');
}
function laneY(i){return h*(.25+i*.27)}
function gates(repeat=false){
 gateLock=false;ringX=w+75;$('gates').replaceChildren();$('gate-fronts').replaceChildren();if(repeat){$('question').textContent=ShapeLanguage.clue(target);say($('question').textContent,'clue')}else{ask()}
 shuffle([target,...shuffle(pool().filter(s=>s!==target&&!(target==='vierkant'&&s==='ruit'))).slice(0,2)]).forEach((s,i)=>{
  const b=document.createElement('div');b.className='gate';b.dataset.shape=s;b.dataset.lane=i;b.style.top=laneY(i)+'px';b.setAttribute('aria-label',s);b.innerHTML='<img src="'+src(s)+'" alt="">';$('gates').append(b);const front=document.createElement('div');front.className='gate gate-front';front.style.top=laneY(i)+'px';$('gate-fronts').append(front);
 });
}
function choose(s){
 if(gateLock)return;gateLock=true;const good=s===target;repeatFlight=!good;tone(good);
 $('flyer').className=good?'flight-success':'flight-poof';particles(w*.23,flyY,good);
 const feedback=good?'Een '+s+'!':'Oeps! Nog eens!';if(good)showAnswer(s);
 combo=good?combo+1:0;say(feedback);$('question').textContent=feedback;
 if(good){collected.add(s);flightCount++;}else{flightCount=Math.max(0,flightCount-1)}progress();next=time+.7;
}
function tickFlight(dt){
 for(const gate of $('gates').children)gate.firstChild.style.transform='rotate('+(GameRules.angle(round,gate.dataset.shape,time))+'deg)';
 const oldY=flyY;flyY+=(laneY(flightLane)-flyY)*Math.min(1,dt*12);
 $('flyer').style.top=flyY+'px';$('flyer').style.left=(w*.23)+'px';
 $('flyer').style.setProperty('--bank',Math.max(-12,Math.min(12,(flyY-oldY)*2))+'deg');
 let speed=gateLock?w*.85:w*.85/Math.max(3.5,4.1-combo*.12);
 // Keep the rings moving, while leaving time to hear the entire clue.
 if(!gateLock&&clueSpeaking&&time<speechDeadline&&ringX<w*.55)speed=Math.min(speed,Math.max(0,ringX-w*.24)*.85);
 ringX-=dt*speed;
 $('gates').style.transform='translateX('+ringX+'px)';$('gate-fronts').style.transform=$('gates').style.transform;
 if(!gateLock&&ringX<=w*.23){
  const row=Math.round((flyY/h-.25)/.27);
  const ring=[...$('gates').children].find(e=>+e.dataset.lane===row);
  choose(ring&&Math.abs(flyY-laneY(row))<h*.09?ring.dataset.shape:null);
 }
 trailTimer+=dt;
 if(trailTimer>.10){trailTimer=0;const star=document.createElement('i');star.className='broom-star';star.textContent='✦';star.style.left=(w*.23-$('flyer').clientWidth*.32)+'px';star.style.top=(flyY+Math.random()*16-8)+'px';$('air').append(star);setTimeout(()=>star.remove(),1100)}
 if(ringX< -100&&!field.querySelector('.answer-pop')&&time>=next&&(muted||!GameVoice.busy)){
  if(flightCount>=(round===1?5:3)){begin()}else{$('flyer').className='';gates(repeatFlight)}
 }
}
function togglePause(force){if(['start','finish','complete'].includes(phase))return;paused=force??!paused;field.classList.toggle('is-paused',paused);$('paused').hidden=!paused;$('pause').setAttribute('aria-label',paused?'Verder spelen':'Pauze');keys.clear();if(paused){GameVoice.pause();GameMusic.pause()}else{GameVoice.resume();GameMusic.resume()}}
function frame(now){const dt=Math.min(.035,(now-last)/1000||0);last=now;GameMusic.update(dt,GameVoice.busy);if(!paused){time+=dt;if(phase==='intro'||phase==='outro'){intro.tick(dt);if(phase==='outro'&&!intro.arrival)landStory()}else if(phase==='catch'){if(keys.size)aim=x+((keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0))*cw*1.4*dt;aim=Math.max(w/4,Math.min(w*3/4,aim));const dx=keys.size?aim-x:Math.max(-cw*1.4*dt,Math.min(cw*1.4*dt,(aim-x)*Math.min(1,dt*10)));x+=dx;if(Math.abs(dx)>.05)facing=dx<0?-1:1;catcher.classList.toggle('walking',Math.abs(dx)>.35);position();if(time>=next&&!items.length)wave();const rim=h-ch-10+ch*.417+rig.bob,size=itemSize();for(const item of [...items]){const old=item.y;item.y+=dt*(65+Math.min(round,6)*7+correct*3)*Math.max(.8,h/760);item.el.style.transform='translate('+(item.x-size/2)+'px,'+(item.y-size/2)+'px) rotate('+(GameRules.angle(round,item.s,time,item.x))+'deg)';if(!item.seen&&old+size*.28<rim&&item.y+size*.28>=rim){item.seen=true;if(GameRules.fits(item.x-x,cw,size)){const good=item.s===target;if(good)assistance.record(true);else catchMistake();immerse(item,good);items=items.filter(a=>a!==item);tone(good);particles(item.x,rim,good);if(good){collected.add(item.s);correct++;combo++;showAnswer(target);say(target);progress();clear();next=time+.9;if(correct===5){phase='transition';next=time+1;}else{ask()}break}else{combo=0;say('Ai, dat was geen '+target+', maar een '+item.s+'!');clear();next=time+.65;break}}else if(item.s===target){catchMistake()}}if(item.y>h+size){item.el.remove();items=items.filter(a=>a!==item)}}}else if(phase==='transition'&&time>=next&&!GameVoice.busy&&!field.querySelector('.answer-pop')){storyReward()}else if(phase==='flight'){tickFlight(dt)}else if(phase==='finish'&&time>=next)$('finished').hidden=false;animateWitch(dt)}requestAnimationFrame(frame)}
function move(e){if(paused||e.target.closest('button'))return;const box=field.getBoundingClientRect();if(phase==='flight'){flightLane=Math.max(0,Math.min(2,Math.round(((e.clientY-box.top)/h-.25)/.27)))}else if(phase==='catch')aim=e.clientX-box.left}
field.addEventListener('pointercancel',()=>{aim=x;keys.clear()});
field.addEventListener('pointerdown',e=>{move(e);if(!e.target.closest('button')&&['catch','flight'].includes(phase))field.setPointerCapture(e.pointerId)});field.addEventListener('pointermove',move);
window.addEventListener('keydown',e=>{if(phase==='flight'&&['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();if(!paused&&!e.repeat)flightLane=Math.max(0,Math.min(2,flightLane+(e.key==='ArrowUp'?-1:1)));return}if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();keys.add(e.key)}if(e.code==='Space'&&e.target===field){e.preventDefault();togglePause()}});window.addEventListener('keyup',e=>{keys.delete(e.key);if(e.key==='ArrowLeft'||e.key==='ArrowRight')aim=x});window.addEventListener('blur',()=>{if(!paused)togglePause(true)});document.addEventListener('visibilitychange',()=>{if(document.hidden)togglePause(true)});
$('play').onclick=startMissionStory;$('again').onclick=()=>{round=0;startMissionStory()};$('replay-owl').onclick=()=>{round=1;startMissionStory()};$('pause').onclick=()=>togglePause();$('resume').onclick=()=>togglePause(false);$('repeat').onclick=()=>{if(intro.active)intro.show(intro.index,false);else say($('question').textContent,phase==='flight'&&!gateLock?'clue':'feedback')};$('audio').onclick=()=>{muted=!muted;$('audio').textContent=muted?'🔇':'🔊';$('audio').setAttribute('aria-label',muted?'Geluid aanzetten':'Geluid uitzetten');GameVoice.setMuted(muted);GameMusic.setMuted(muted)};
function musicButton(){const on=GameMusic.enabled;$('music').textContent=on?'♪':'♪̸';$('music').setAttribute('aria-label',on?'Muziek uitzetten':'Muziek aanzetten');$('music').setAttribute('aria-pressed',String(on))}
$('music').onclick=()=>{GameMusic.toggle();musicButton()};musicButton();
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else{document.body.classList.toggle('screen-fit');window.scrollTo(0,0)}size()}catch{document.body.classList.toggle('screen-fit');size()}};
document.addEventListener('fullscreenchange',()=>{$('fullscreen').setAttribute('aria-label',document.fullscreenElement?'Volledig scherm sluiten':'Volledig scherm');size()});
$('home').onclick=()=>{if(!shelf.busy)showShelf()};showShelf();new ResizeObserver(size).observe(field);size();requestAnimationFrame(frame);
})();






