/* Music has its own switch; narration always keeps priority. */
window.GameMusic=new class {
 constructor(){this.audio=new Audio('geluiden/spelmuziek%20loop.mp3');this.audio.loop=true;this.audio.preload='none';this.audio.volume=0;this.enabled=true;this.active=false;this.paused=false;this.masterMuted=false;try{this.enabled=localStorage.getItem('vormenspel-muziek')!=='uit'}catch{} }
 sync(){if(this.active&&this.enabled&&!this.paused&&!this.masterMuted)this.audio.play().catch(()=>{});else this.audio.pause()}
 start(){this.active=true;this.paused=false;this.sync()}
 stop(){this.active=false;this.audio.pause();this.audio.currentTime=0;this.audio.volume=0}
 pause(){this.paused=true;this.sync()}
 resume(){this.paused=false;this.sync()}
 toggle(){this.enabled=!this.enabled;try{localStorage.setItem('vormenspel-muziek',this.enabled?'aan':'uit')}catch{}this.sync();return this.enabled}
 setMuted(value){this.masterMuted=value;this.sync()}
 update(dt,speaking){const target=speaking ? .045 : .30;const speed=speaking?18:2;this.audio.volume+= (target-this.audio.volume)*Math.min(1,dt*speed)}
};
