/* A continuous mesh keeps the original ink drawing connected at the neck,
   knees and ankles. Stance feet stay in world space while the torso travels. */
window.WitchRig=class {
 constructor(host,front){
  this.host=host;this.front=front;this.canvas=document.createElement('canvas');
  host.replaceChildren(this.canvas);this.ctx=this.canvas.getContext('2d');
  this.fctx=front.getContext('2d');this.image=new Image();this.image.src='webp/hazel-met-ketel.webp';
  this.feet=[];this.turn=-.18;this.bob=0;this.lean=0;this.lastX=null;
 }
 render(x,w,h,t,dt,look,facing=1){
  if(!this.image.complete||!this.image.naturalWidth)return;
  const scale=2,pad=30,W=w+pad*2,H=h+pad*2;
  for(const c of [this.canvas,this.front])if(c.width!==Math.round(W*scale)||c.height!==Math.round(H*scale)){c.width=Math.round(W*scale);c.height=Math.round(H*scale);c.style.width=W+'px';c.style.height=H+'px'}
  this.canvas.style.left=-pad+'px';this.canvas.style.top=-pad+'px';
  this.front.style.left=(x-w/2-pad)+'px';this.front.style.top=(this.host.parentElement.clientHeight-h-10-pad)+'px';
  this.canvas.style.transform=this.front.style.transform='scaleX('+facing+')';
  this.host.dataset.facing=String(facing);
  if(facing!==this.facing){this.lastX=null;this.facing=facing}
  // Solve the gait in drawing coordinates, then mirror the complete drawing.
  x*=facing;
  if(look&&facing===-1)look={x:w-look.x,y:look.y};
  if(this.lastX===null||Math.abs(x-this.lastX)>w){this.feet=[{world:x-w*.23,lift:0},{world:x+w*.23,lift:0}];this.lastX=x}
  const velocity=dt?(x-this.lastX)/dt:0;this.lastX=x;
  let stepping=this.feet.find(f=>f.step);
  if(!stepping&&Math.abs(velocity)>5){const candidates=this.feet.map((f,i)=>({f,i,d:x+(i?1:-1)*w*.23-f.world})).sort((a,b)=>Math.abs(b.d)-Math.abs(a.d));const c=candidates[0];if(Math.abs(c.d)>w*.07){c.f.step={start:c.f.world,end:x+(c.i?1:-1)*w*.23+Math.sign(velocity)*w*.22,age:0};stepping=c.f}}
  for(const f of this.feet){if(f.step){f.step.age+=dt;const p=Math.min(1,f.step.age/.15),e=p*p*(3-2*p);f.world=f.step.start+(f.step.end-f.step.start)*e;f.lift=Math.sin(p*Math.PI)*h*.035;if(p===1){delete f.step;f.lift=0}}}
  const ease=1-Math.exp(-dt*9);
  const desired=look?Math.max(-.52,Math.min(.24,Math.atan2(look.y-(h*.3),look.x-w*.55)*.21)):-.23;
  this.turn+=(desired-this.turn)*ease;this.lean+=(Math.max(-.035,Math.min(.035,velocity/8000))-this.lean)*ease;
  this.bob+=((stepping?-h*.009:Math.sin(t*2)*h*.002)-this.bob)*ease;
  const smooth=(a,b,v)=>{const p=Math.max(0,Math.min(1,(v-a)/(b-a)));return p*p*(3-2*p)};
  const warp=(u,v)=>{
   let px=u*w,py=v*h;
   const head=1-smooth(.30,.37,v),a=this.turn*head,cx=w*.55,cy=h*.345;
   const ox=px-cx,oy=py-cy;px=cx+ox*Math.cos(a)-oy*Math.sin(a);py=cy+ox*Math.sin(a)+oy*Math.cos(a);
   const upper=1-smooth(.69,.95,v);px+=this.lean*(h-py)*upper;py+=this.bob*upper;
   if(v>.70){const f=this.feet[u<.50?0:1],base=x+(u<.50?-1:1)*w*.23,leg=smooth(.70,.91,v);px+=(f.world-base)*leg;py-=f.lift*leg;px+=Math.sin((v-.7)/.3*Math.PI)*f.lift*.4}
   return [px+pad,py+pad];
  };
  for(const ctx of [this.ctx,this.fctx]){ctx.setTransform(scale,0,0,scale,0,0);ctx.clearRect(0,0,W,H)}
  const sw=this.image.naturalWidth,sh=this.image.naturalHeight;
  const triangle=(ctx,uv)=>{
   const p=uv.map(([u,v])=>warp(u,v)),s=uv.map(([u,v])=>[u*sw,v*sh]);
   const [a,b,c]=s,den=(b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]);
   const ax=((p[1][0]-p[0][0])*(c[1]-a[1])-(p[2][0]-p[0][0])*(b[1]-a[1]))/den;
   const bx=((p[2][0]-p[0][0])*(b[0]-a[0])-(p[1][0]-p[0][0])*(c[0]-a[0]))/den;
   const ay=((p[1][1]-p[0][1])*(c[1]-a[1])-(p[2][1]-p[0][1])*(b[1]-a[1]))/den;
   const by=((p[2][1]-p[0][1])*(b[0]-a[0])-(p[1][1]-p[0][1])*(c[0]-a[0]))/den;
   ctx.save();ctx.beginPath();const mx=(p[0][0]+p[1][0]+p[2][0])/3,my=(p[0][1]+p[1][1]+p[2][1])/3;
   p.forEach(([px,py],i)=>ctx[i?'lineTo':'moveTo'](px+(px-mx)*.015,py+(py-my)*.015));ctx.closePath();ctx.clip();
   ctx.transform(ax,ay,bx,by,p[0][0]-ax*a[0]-bx*a[1],p[0][1]-ay*a[0]-by*a[1]);ctx.drawImage(this.image,0,0);ctx.restore();
  };
  for(let j=0;j<32;j++)for(let i=0;i<20;i++){const u=i/20,v=j/32,U=(i+1)/20,V=(j+1)/32;triangle(this.ctx,[[u,v],[U,v],[u,V]]);triangle(this.ctx,[[U,v],[U,V],[u,V]])}
  // Repaint only the whites inside the original ink outlines; pupils follow
  // the closest falling object, including distractors, without giving answers.
  const blink=t%4.7>4.52;
  for(const [u,v,rx,ry] of [[.542,.214,.014,.009],[.584,.207,.010,.007]]){
   const p=warp(u,v),ctx=this.ctx;ctx.save();ctx.translate(...p);ctx.rotate(this.turn);
   ctx.beginPath();ctx.ellipse(0,0,w*rx,h*ry,0,0,Math.PI*2);ctx.clip();ctx.fillStyle=blink?'#e8ba86':'#fff8dc';ctx.fillRect(-w*rx,-h*ry,2*w*rx,2*h*ry);
   if(!blink){const dx=look?look.x-u*w:0,dy=look?look.y-v*h:-h,length=Math.hypot(dx,dy)||1;ctx.fillStyle='#20271e';ctx.beginPath();ctx.ellipse(dx/length*w*rx*.53,dy/length*h*ry*.50,w*rx*.42,h*ry*.55,0,0,Math.PI*2);ctx.fill()}
   ctx.restore();
  }
  // The cauldron's near rim occludes only the submerged part of a shape.
  this.fctx.save();this.fctx.beginPath();
  const nearRim=Array.from({length:25},(_,i)=>{const a=Math.PI-i*Math.PI/24;return [.561+.249*Math.cos(a),.417+.029*Math.sin(a)]});
  [...nearRim,[.91,.49],[.85,.64],[.72,.70],[.37,.70],[.23,.61],[.20,.47]].forEach(([u,v],i)=>{const p=warp(u,v);this.fctx[i?'lineTo':'moveTo'](...p)});this.fctx.closePath();this.fctx.clip();this.fctx.drawImage(this.canvas,0,0,W,H);this.fctx.restore();
  this.host.dataset.headAngle=this.turn.toFixed(3);
  this.host.dataset.feet=this.feet.map(f=>f.world.toFixed(1)).join(',');
 }
};

