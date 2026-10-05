/* A cylindrical fold: the printed face stays flat until the curl reaches it.
   The reverse is paper, shaded by the surface angle, not a rotating picture. */
window.PageCurl=class{
 constructor(container,image,forward){
  this.elapsed=0;this.forward=forward;this.image=image;this.container=container;
  this.sheet=document.createElement('canvas');this.sheet.className='paper-curl';this.sheet.setAttribute('aria-hidden','true');container.append(this.sheet);
  this.ctx=this.sheet.getContext('2d');this.buffer=document.createElement('canvas');this.draw(0);
 }
 draw(progress){
  const w=this.container.clientWidth,h=this.container.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
  if(!w||!h||!this.image.naturalWidth)return;
  if(this.w!==w||this.h!==h){
   this.w=w;this.h=h;this.sheet.width=Math.round(w*dpr);this.sheet.height=Math.round(h*dpr);
   this.buffer.width=Math.round(w*dpr);this.buffer.height=Math.round(h*dpr);
   const b=this.buffer.getContext('2d');b.scale(dpr,dpr);if(!this.forward){b.translate(w,0);b.scale(-1,1)}
   const ratio=Math.min(w/this.image.naturalWidth,h/this.image.naturalHeight),iw=this.image.naturalWidth*ratio,ih=this.image.naturalHeight*ratio;
   b.fillStyle='#eddfbe';b.fillRect(0,0,w,h);b.drawImage(this.image,(w-iw)/2,(h-ih)/2,iw,ih);
  }
  const ctx=this.ctx;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  if(!this.forward){ctx.translate(w,0);ctx.scale(-1,1)}
  const p=progress*progress*(3-2*progress),radius=Math.max(22,w*.072),bend=w-(w+Math.PI*radius)*p;
  const project=s=>{const d=s-bend;if(d<=0)return s;if(d<Math.PI*radius)return bend+radius*Math.sin(d/radius);return bend-(d-Math.PI*radius)};
  // A broad, soft shadow falls on the next page alongside the moving curl.
  const edge=bend+radius,shadow=ctx.createLinearGradient(edge-10,0,edge+radius*.7,0);
  shadow.addColorStop(0,'rgba(20,24,21,.28)');shadow.addColorStop(.4,'rgba(20,24,21,.12)');shadow.addColorStop(1,'rgba(20,24,21,0)');
  ctx.fillStyle=shadow;ctx.fillRect(Math.max(0,edge-10),0,radius*.7+10,h);
  const flat=Math.max(0,Math.min(w,bend));
  if(flat>0)ctx.drawImage(this.buffer,0,0,flat*dpr,h*dpr,0,0,flat,h);
  // Thin strips follow the continuously bent sheet; its reverse covers the face.
  const step=1.5;
  for(let s=Math.max(0,bend);s<w;s+=step){
   const end=Math.min(w,s+step),a=project(s),b=project(end),left=Math.min(a,b),width=Math.abs(b-a)+.65;
   if(left+width<0||left>w)continue;
   const angle=Math.min(Math.PI,Math.max(0,(s-bend)/radius));
   const lift=Math.sin(angle)*Math.min(7,h*.012);
   if(angle<Math.PI/2){
    ctx.drawImage(this.buffer,s*dpr,0,(end-s)*dpr,h*dpr,left,-lift,width,h+lift*2);
    ctx.fillStyle='rgba(35,29,18,'+(.14*Math.sin(angle))+')';ctx.fillRect(left,-lift,width,h+lift*2);
   }else{
    const light=.90+.10*Math.abs(Math.cos(angle)),r=Math.round(245*light),g=Math.round(233*light),blue=Math.round(206*light);
    ctx.fillStyle='rgb('+r+','+g+','+blue+')';ctx.fillRect(left,-lift,width,h+lift*2);
    // Barely visible reverse print gives the fold a paper-like translucency.
    ctx.globalAlpha=.045;ctx.drawImage(this.buffer,s*dpr,0,(end-s)*dpr,h*dpr,left,-lift,width,h+lift*2);ctx.globalAlpha=1;
   }
  }
  this.sheet.dataset.progress=progress.toFixed(3);
 }
 tick(dt){this.elapsed+=dt;this.draw(Math.min(1,this.elapsed/1.25));return this.elapsed>=1.25}
 remove(){this.sheet.remove()}
};
