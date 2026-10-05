/* Render the player's collected shape types on the empty illustrated tray. */
window.CollectedTray=class{
 constructor(){this.cache=new Map();this.ready=null}
 image(src){if(!this.cache.has(src))this.cache.set(src,new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src}));return this.cache.get(src)}
 async render(shapes){
 const unique=[...new Set(shapes)],base=await this.image('storyboard-dienblad-leeg.webp');
 const tokens=await Promise.all(unique.map(s=>this.image('vormen/'+s+(['kubus','bol','balk','piramide','cilinder'].includes(s)?'-ruimtelijk':'-basis')+'.svg')));
 const canvas=document.createElement('canvas');canvas.width=base.naturalWidth;canvas.height=base.naturalHeight;
 const ctx=canvas.getContext('2d');ctx.drawImage(base,0,0);ctx.save();ctx.scale(canvas.width/1536,canvas.height/1024);
 const size=Math.min(122,390/Math.max(1,unique.length)),step=Math.min(113,380/Math.max(1,unique.length)),middle=680;
 tokens.forEach((img,i)=>{const x=middle+(i-(tokens.length-1)/2)*step,baseline=451-(i%2)*5;
 ctx.save();ctx.shadowColor='#ffe16d';ctx.shadowBlur=12;ctx.drawImage(img,x-size/2,baseline-size,size,size);ctx.restore()});
 ctx.restore();return canvas.toDataURL('image/png');
 }
};

