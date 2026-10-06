/* One shared recording player prevents overlapping voices. */
window.GameVoice=new class {
 constructor(){this.audio=new Audio();this.audio.preload='auto';this.busy=false;this.muted=false;this.paused=false;this.version=0;this.timer=null;
  const unlock=()=>{if(this.unlocked||this.busy)return;this.unlocked=true;this.audio.src='data:audio/wav;base64,UklGRiUAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQEAAACA';this.audio.play().catch(()=>{});};
  document.addEventListener('pointerdown',unlock,{capture:true});document.addEventListener('keydown',unlock,{capture:true});
 }
 stop(){this.version++;clearTimeout(this.timer);this.audio.pause();this.audio.onended=this.audio.onerror=this.audio.onplaying=null;this.busy=false;this.complete?.();this.complete=null}
 play(id){this.stop();this.id=id;if(this.muted||!id)return Promise.resolve();const version=this.version;this.busy=true;
  return new Promise(resolve=>{const finish=()=>{if(version!==this.version)return;clearTimeout(this.timer);this.busy=false;this.complete=null;resolve()};this.complete=resolve;this.finish=finish;
   this.audio.onended=finish;this.audio.onerror=()=>{console.warn('Opname niet beschikbaar:',id);finish()};this.audio.src='geluiden/'+id+'.mp3';
   this.audio.onplaying=()=>{clearTimeout(this.timer);this.timer=setTimeout(finish,Math.max(60000,(this.audio.duration||0)*1000+5000))};
   if(!this.paused)this.resume();
  });
 }
 pause(){this.paused=true;clearTimeout(this.timer);this.audio.pause()}
 resume(){this.paused=false;if(!this.busy)return;const version=this.version;this.timer=setTimeout(()=>{if(version===this.version)this.finish()},30000);this.audio.play().catch(e=>{if(version===this.version){console.warn('Opname kon niet starten:',this.id,e.name);this.finish()}})}
 setMuted(value){this.muted=value;this.audio.muted=value}
};
