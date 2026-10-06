(function(root){
 const basis=['cirkel','vierkant','driehoek','rechthoek'];
 const extra=[...basis,'ovaal','ruit','zeshoek'];
 const levels=[{shapes:basis,rotate:false},{shapes:basis,rotate:true},{shapes:extra,rotate:false,focus:['zeshoek','ovaal','ruit']},{shapes:extra,rotate:true,still:['vierkant','cirkel','ruit'],focus:['zeshoek','ovaal','ruit']},{shapes:['kubus','bol','balk','piramide','cilinder'],rotate:false}];
 class Assistance{
  constructor(){this.count=3;this.recent=[];this.streak=0}
  record(good){this.count=good?3:2}
 }
 const rules={levels,Assistance,level:round=>levels[Math.min(4,round)],rotates:(round,shape)=>{const l=levels[Math.min(4,round)];return l.rotate&&!l.still?.includes(shape)},fits:(offset,width,size)=>Math.abs(offset)+size*.30<=width*.24};
 rules.angle=(round,shape,time,offset=0)=>{if(!rules.rotates(round,shape))return 0;if(shape==='driehoek')return time*45+offset;return Math.sin(time*1.3+offset)*(shape==='vierkant'?12:65)};
 if(typeof module!=='undefined')module.exports=rules;else root.GameRules=rules;
})(globalThis);

