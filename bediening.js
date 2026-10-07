/* Full-viewport game and matching, wordless wooden controls. */
(()=>{
const $=id=>document.getElementById(id),svg=body=>'<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'+body+'</svg>';
const icons={fullscreen:'<path d="M4 12V5h7M21 5h7v7M28 21v7h-7M11 28H4v-7"/>',home:'<path d="M16 8Q10 4 4 7v20q6-3 12 1 6-4 12-1V7q-6-3-12 1v20"/>',music:'<path d="M12 23V7l14-3v16M12 12l14-3"/><ellipse cx="8" cy="24" rx="4" ry="3"/><ellipse cx="22" cy="21" rx="4" ry="3"/>',audio:'<path d="M5 12h6l7-6v20l-7-6H5zM23 11q6 5 0 10"/>',pause:'<path d="M11 7v18M21 7v18"/>',repeat:'<path d="M24 10a11 11 0 1 0 2 12M24 4v8h-8"/>'};
function paint(){for(const id of Object.keys(icons)){const el=$(id);if(!el)continue;const off=(id==='music'&&el.getAttribute('aria-pressed')==='false')||(id==='audio'&&el.getAttribute('aria-label')==='Geluid aanzetten');el.innerHTML=svg(id==='pause'&&el.getAttribute('aria-label')==='Verder spelen'?'<path d="M11 6l15 10-15 10z"/>':icons[id]+(off?'<path d="M5 28L28 4"/>':''));el.classList.toggle('control-off',off);el.title=el.getAttribute('aria-label')||''}}
const standalone=()=>matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone;
function state(){const full=!!(document.fullscreenElement||document.webkitFullscreenElement||standalone());$('fullscreen').hidden=full;document.body.classList.toggle('native-fullscreen',full)}
window.requestGameFullscreen=()=>{if(document.fullscreenElement||document.webkitFullscreenElement||standalone())return;const root=document.documentElement,request=root.requestFullscreen||root.webkitRequestFullscreen;if(request){try{const result=request.call(root);result?.catch(()=>{});}catch{}}state()};
$('fullscreen').onclick=window.requestGameFullscreen;
document.addEventListener('fullscreenchange',state);document.addEventListener('webkitfullscreenchange',state);window.addEventListener('resize',state);
for(const id of ['music','audio','pause'])new MutationObserver(paint).observe($(id),{attributes:true,attributeFilter:['aria-label','aria-pressed']});
window.paintGameControls=paint;paint();state();
})();
