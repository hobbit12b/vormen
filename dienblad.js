/* Render the player's collected shape types on the empty illustrated tray. */
window.CollectedTray=class{
 constructor(){this.cache=new Map();this.ready=null}
 image(src){if(!this.cache.has(src))this.cache.set(src,new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>{this.cache.delete(src);reject(new Error('Illustratie ontbreekt: '+src))};img.src=src}));return this.cache.get(src)}
 async render(shapes){
 const unique=[...new Set(shapes)],base=await this.image('storyboard-dienblad-leeg.webp');
 const tokens=await Promise.all(unique.map(s=>this.image('vormen/'+s+(['kubus','bol','balk','piramide','cilinder'].includes(s)?'-ruimtelijk':'-basis')+'.svg')));
 this.base=base;this.tokens=tokens;
 return base.src;
 }
 animation(container,shapes,sound){
  const base=this.base,tokens=this.tokens,canvas=document.createElement('canvas');
  canvas.className='story-pour';canvas.width=1536;canvas.height=1024;canvas.naturalWidth=1536;canvas.naturalHeight=1024;canvas.hidden=true;canvas.setAttribute('aria-hidden','true');container.append(canvas);
  const ctx=canvas.getContext('2d'),count=tokens.length,size=Math.min(135,540/Math.max(1,count)),step=Math.min(113,380/Math.max(1,count));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let age=0;const sounded=new Set(),duration=1+Math.max(0,count-1)*.32+1.65+.9;
  function draw(){
   ctx.clearRect(0,0,1536,1024);ctx.drawImage(base,0,0,1536,1024);
   tokens.forEach((img,i)=>{
    const startX=680+(i-(count-1)/2)*step,startY=451-(i%2)*5-size/2;
    const t=age-1-i*.32;let x=startX,y=startY,scale=1,opacity=1,angle=0;
    if(t>0){
     if(reduced){opacity=Math.max(0,1-t/.6)}
     else if(t<.7){const u=t/.7;x=startX+(875-startX)*u*u;y=startY+(453-size/2-startY)*u;angle=u*.22}
     else {const u=Math.min(1,(t-.7)/.85);x=875+105*u;y=453-size/2+(600-(453-size/2))*u*u;angle=.22+u*.5;scale=1-Math.max(0,u-.7)*2;opacity=1-Math.max(0,u-.8)*5;}
    }
    if(opacity>0){ctx.save();ctx.globalAlpha=Math.max(0,opacity);ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);ctx.shadowColor='#ffe16d';ctx.shadowBlur=10;ctx.drawImage(img,-size/2,-size/2,size,size);ctx.restore()}
    if(t>=1.5&&!sounded.has(i)){sounded.add(i);sound(true)}
   });
   // Restore the painted front rim: the shapes sink behind it into the soup.
   ctx.save();ctx.beginPath();ctx.rect(760,605,460,419);ctx.clip();ctx.drawImage(base,0,0,1536,1024);ctx.restore();
   tokens.forEach((_,i)=>{const splash=age-1-i*.32-1.35;if(splash<0||splash>.5)return;const u=splash/.5;ctx.save();ctx.globalAlpha=1-u;ctx.strokeStyle='#fff5a5';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(980,590,15+u*48,5+u*12,0,0,Math.PI*2);ctx.stroke();if(!reduced)for(let j=0;j<5;j++){ctx.fillStyle='#ffe87c';ctx.beginPath();ctx.arc(980+(j-2)*18*u,584-Math.sin(u*Math.PI)*(26+8*(j%2)),3,0,Math.PI*2);ctx.fill()}ctx.restore()});
   canvas.dataset.progress=String(Math.min(1,age/duration));canvas.dataset.shapes=JSON.stringify(shapes);
  }
  return {canvas,duration,start(){age=0;sounded.clear();canvas.hidden=false;draw()},hide(){canvas.hidden=true},remove(){canvas.remove()},tick(dt){age+=dt;draw()}};
 }

};
