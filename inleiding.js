window.HedgehogIntro=class{
 constructor(field,done,sound){
  this.field=field;this.done=done;this.sound=sound;this.active=false;this.t=0;this.mode='intro';this.index=0;
  this.names=['01-wil-spelen','02-pakt-ballon','03-ballon-knapt','04-egel-verdrietig','05-naar-de-heks','06-heks-maakt-plan','07-drankje-op-ballon','08-heks-geeft-ballon','09-egel-speelt'];
  this.labels=['Egel wil met een ballon spelen','Egel pakt de ballon','De ballon knapt tegen zijn stekels','Egel is verdrietig','Egel vraagt de heks om hulp','De heks gaat een toverdrankje maken','De heks giet het drankje over de nieuwe ballon','De heks geeft de betoverde ballon aan Egel','Egel speelt met de ballon die heel blijft'];
  this.hedgehog={names:this.names,labels:this.labels};
  this.owl={names:['01-uil-wil-vliegen','02-vliegen-lukt-niet','03-uil-verdrietig','04-naar-de-heks','05-zere-vleugel','06-vliegdrank-maken','07-vleugel-betoveren','08-vleugel-genezen','09-uil-vliegt'],labels:['Uil wil naar zijn nest vliegen','De zere vleugel houdt hem tegen','Uil is verdrietig','Uil gaat naar de heks','Uil laat zijn zere vleugel zien','De heks verzamelt vliegende ingrediënten','De heks behandelt de vleugel met toverdrank','Uil kan beide vleugels weer uitstrekken','Uil vliegt vrolijk naar zijn nest']};
  this.gnome={names:['01-hoog-gras','02-op-tenen','03-kabouter-verdrietig','04-kabouter-naar-heks','05-gras-laten-zien','07-dennenappel-betoveren','07b-periscoop-ontstaat','08-periscoop-geven','09-boven-gras-kijken','10-weer-thuis'],labels:['Het hoge gras blokkeert de weg naar huis','Ook op zijn tenen kan de kabouter niet boven het gras kijken','De kabouter weet de weg niet en is verdrietig','De kabouter vraagt de heks om hulp','Hij laat zien hoe hoog het gras is','De heks druppelt toverdrank op een dennenappel','De dennenappel verandert in een periscoop','De heks geeft de periscoop aan de kabouter','De kabouter kijkt boven het gras en ziet de weg naar huis','De kabouter komt vrolijk thuis met zijn periscoop']};
  this.hedgehog.introCount=6;this.owl.introCount=6;this.gnome.introCount=5;
  this.snail={introCount:5,names:['01-samen-spelen','02-slak-blijft-achter','03-te-laat','04-naar-de-heks','05-heks-maakt-plan','06-drankje-drinken','07-sneller-op-pad','08-op-tijd'],labels:['Slak wil met Egel en Uil spelen','Slak kruipt langzaam en raakt achterop','Als Slak aankomt zijn de vrienden al naar huis','Slak vraagt de heks om hulp','De heks maakt een drankje om sneller te kruipen','Slak drinkt het toverdrankje','Slak kruipt vrolijk en snel over het pad','Slak is op tijd en speelt met zijn vrienden']};
  this.spatial={introCount:0,names:[],labels:[]};this.mission=0;this.bridgeIndex=6;
  this.node=document.createElement('section');this.node.id='intro';this.node.className='storybook';
  this.node.innerHTML='<div class="story-pages">'+this.names.map((name,i)=>'<img class="story-page" src="storyboard-egel/platen/'+name+'.webp" alt="'+this.labels[i]+'" decoding="async">').join('')+'</div><div class="story-navigation"><button id="previous-panel" aria-label="Vorige plaat">‹</button><div class="story-dots" aria-hidden="true"></div><button id="next-panel" aria-label="Volgende plaat">›</button></div><button id="skip-intro" aria-label="Verhaal overslaan">⏭</button>';
  field.append(this.node);this.pages=[...this.node.querySelectorAll('.story-page')];this.$=id=>this.node.querySelector('#'+id);
  this.$('skip-intro').onclick=()=>this.finish();this.$('next-panel').onclick=()=>this.advance();this.$('previous-panel').onclick=()=>{if(!field.classList.contains('is-paused'))this.show(Math.max(this.first,this.index-1))};
  this.first=0;this.last=5;this.show(0);
 }
 setMission(mission){
  this.cancelTurn();this.pour?.remove();this.pour=null;this.mission=mission;const story=[this.hedgehog,this.owl,this.gnome,this.snail,this.spatial][mission];this.bridgeIndex=story.introCount;this.names=[...story.names.slice(0,this.bridgeIndex),'verzameld',...story.names.slice(this.bridgeIndex)];this.labels=[...story.labels.slice(0,this.bridgeIndex),'De heks heeft alle vormen verzameld voor de toverdrank',...story.labels.slice(this.bridgeIndex)];
  const animal=['egel','uil','kabouter','slak','ruimtelijk'][mission];const folder='storyboard-'+animal+'/platen';
  this.node.querySelector('.story-pages').innerHTML=this.names.map((name,i)=>'<img class="story-page" src="'+(name==='verzameld'?'storyboard-dienblad-leeg':folder+'/'+name)+'.webp" alt="'+this.labels[i]+'" decoding="async">').join('');this.pages=[...this.node.querySelectorAll('.story-page')];this.node.dataset.mission=animal;
 }
 start(mode='intro'){this.cancelTurn();this.mode=mode;this.first=mode==='reward'?this.bridgeIndex:0;this.last=mode==='reward'?this.pages.length-1:this.bridgeIndex-1;this.active=true;this.node.hidden=false;this.field.classList.add('story-ready','story-playing');this.show(this.first,false);this.arrival=mode==='reward'&&!matchMedia('(prefers-reduced-motion: reduce)').matches?1.3:0;this.node.style.opacity=this.arrival?'0':'1'}
 cancelTurn(){this.arrival=0;this.node.style.opacity='1';if(this.turn){this.turn.remove();this.turn=null}}
 show(index,animate=true){
  if(this.turn||this.arrival>0)return;
  const previous=this.index;
  if(animate&&this.active&&previous!==index&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   this.turn=new PageCurl(this.node.querySelector('.story-pages'),this.pour&&!this.pour.canvas.hidden?this.pour.canvas:this.pages[previous],index>previous);
  }
  this.index=index;this.t=0;if(this.pour){if(index===this.bridgeIndex)this.pour.start();else this.pour.hide()}this.node.dataset.panel=String(index+1);
  this.pages.forEach((p,i)=>{p.classList.toggle('visible',i===index);p.setAttribute('aria-hidden',String(i!==index));p.style.transform='scale(1)'});
  this.$('previous-panel').disabled=index===this.first;
  this.node.querySelector('.story-dots').innerHTML=Array.from({length:this.last-this.first+1},(_,i)=>'<i class="'+(this.first+i===index?'selected':'')+'"></i>').join('');
  if(this.active&&index===2&&this.mission===0)this.sound(false);if(this.active&&index===this.bridgeIndex)this.sound(true);
 }
 advance(){if(!this.active||this.arrival>0||this.field.classList.contains('is-paused'))return;if(this.index<this.last)this.show(this.index+1);else this.finish()}
 finish(){if(!this.active)return;this.pour?.hide();this.cancelTurn();this.active=false;this.node.hidden=true;this.field.classList.remove('story-ready','story-playing');this.done(this.mode)}
 tick(dt){
  if(!this.active)return;
  if(this.arrival>0){this.arrival=Math.max(0,this.arrival-dt);const p=1-this.arrival/1.3;this.node.style.opacity=String(p*p*(3-2*p));return}
  if(this.turn){if(this.turn.tick(dt))this.cancelTurn();return}
  const image=this.pages[this.index];if(!image.complete||!image.naturalWidth)return;
  this.t+=dt;if(this.index===this.bridgeIndex)this.pour?.tick(dt);const duration=this.index===this.bridgeIndex&&this.pour?this.pour.duration:this.index===2?2.5:this.index===this.bridgeIndex-1?4.2:this.index===this.bridgeIndex?4.6:3.6;
  if(this.t>=duration)this.advance();
 }
};

