window.BookShelf=class{
 constructor(field,select){
 this.field=field;this.select=select;this.busy=false;
 this.books=[
 {title:'Egeltje en de ballon',color:'#697044',image:'storyboard-egel/platen/09-egel-speelt.webp',shapes:['vierkant','rechthoek','driehoek','cirkel']},
 {title:'Uil en de zere vleugel',color:'#486575',image:'storyboard-uil/platen/09-uil-vliegt.webp',shapes:['vierkant','rechthoek','driehoek','cirkel'],turn:true},
 {title:'Kabouter en het hoge gras',color:'#986035',image:'storyboard-kabouter/platen/02-op-tenen.webp',shapes:['zeshoek','ovaal','ruit']},
 {title:'Slak wil op tijd zijn',image:'storyboard-slak/platen/01-samen-spelen.webp',color:'#745270',shapes:['zeshoek','ovaal','ruit'],turn:true},
 {title:'Eekhoorntje en de wintervoorraad',image:'storyboard-eekhoorn/platen/08-wintervoorraad.webp',color:'#3e7467',shapes:['kubus','bol','balk','piramide','cilinder']}
 ];
 try{this.completed=JSON.parse(localStorage.getItem('heksenbos-books')||'[]');if(!Array.isArray(this.completed))this.completed=[]}catch{this.completed=[]}
 this.node=document.createElement('section');this.node.id='bookshelf';this.node.setAttribute('aria-label','Kies een boek');
 this.node.innerHTML='<div class="bookcase">'+this.books.map((b,i)=>'<button class="shelf-book" data-book="'+i+'" style="--cloth:'+b.color+'" aria-label="Boek '+(i+1)+': '+b.title+'"><span class="book-spine"></span><span class="book-cover"><span class="book-number">'+(i+1)+'</span>'+this.art(b,i)+'<span class="book-shapes">'+b.shapes.map(s=>'<img src="'+this.src(s)+'" alt="">').join('')+'</span>'+(b.turn?'<span class="turn-symbol" aria-hidden="true">↻</span>':'')+'<span class="book-seal" aria-hidden="true">★</span></span></button>').join('')+'</div>';
 field.append(this.node);
 this.node.querySelectorAll('[data-book]').forEach(b=>b.onclick=()=>{if(!this.busy){this.hide();select(+b.dataset.book)}});
 this.setupTeacher();this.show();
 }
 src(s){return 'vormen/'+s+(['kubus','bol','balk','piramide','cilinder'].includes(s)?'-ruimtelijk':'-basis')+'.svg'}
 art(b,i){return b.image?'<span class="cover-picture"><img src="'+b.image+'" alt=""></span>':'<span class="cover-picture shape-emblem"><i>✦</i><img src="'+this.src(b.shapes[0])+'" alt=""><i>✧</i></span>'}
 setupTeacher(){
 const gear=document.createElement("button");gear.id="teacher-settings";gear.className="wood-control";gear.setAttribute("aria-label","Docentinstellingen");gear.innerHTML='<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="m13 3 6 0 1 4 3 2 4-1 3 5-3 3 0 3 2 3-4 5-4-2-3 1-2 4-6-1-1-4-3-2-4 1-2-6 3-2 0-3-2-3 4-4 4 2z"/><circle cx="16" cy="16" r="5"/></svg>';this.node.append(gear);
 const dialog=document.createElement("dialog");dialog.id="teacher-dialog";dialog.setAttribute("aria-labelledby","teacher-title");dialog.innerHTML='<h2 id="teacher-title">Behaalde boeken</h2><p>Haal het vinkje weg om een boek opnieuw te laten behalen.</p><div class="teacher-books"></div><p class="device-note">Dit wordt op dit apparaat bewaard.</p><button class="teacher-close">Klaar</button>';this.node.append(dialog);
 const rows=dialog.querySelector(".teacher-books");
 gear.onclick=()=>{if(this.busy)return;rows.replaceChildren();this.books.forEach((book,i)=>{const label=document.createElement("label"),check=document.createElement("input");check.type="checkbox";check.checked=this.completed.includes(i);check.dataset.resetBook=i;label.append(check,document.createTextNode((i+1)+". "+book.title));check.onchange=()=>{this.completed=this.completed.filter(n=>n!==i);if(check.checked)this.completed.push(i);try{localStorage.setItem("heksenbos-books",JSON.stringify(this.completed))}catch{}this.show()};rows.append(label)});dialog.showModal()};
 dialog.querySelector(".teacher-close").onclick=()=>dialog.close();dialog.addEventListener("close",()=>gear.focus());
 }
 show(){this.node.hidden=false;this.field.classList.add('on-shelf');this.node.querySelectorAll('[data-book]').forEach(b=>{const i=+b.dataset.book,done=this.completed.includes(i);b.classList.toggle('completed',done);b.setAttribute('aria-label','Boek '+(i+1)+': '+this.books[i].title+(done?', behaald':''))})}
 hide(){this.node.hidden=true;this.field.classList.remove('on-shelf')}
 async finish(index,lastImage){
 this.busy=true;if(!this.completed.includes(index))this.completed.push(index);
 try{localStorage.setItem('heksenbos-books',JSON.stringify(this.completed))}catch{}
 this.show();
 const slot=this.node.querySelector('[data-book="'+index+'"]'),b=this.books[index],box=this.field.getBoundingClientRect();
 slot.style.visibility='hidden';
 const flying=document.createElement('div');flying.className='closing-book';flying.style.setProperty('--cloth',b.color);
 flying.innerHTML='<div class="closing-pages">'+(lastImage?'<img src="'+lastImage+'" alt="">':this.art(b,index))+'</div><div class="closing-cover"><span class="book-number">'+(index+1)+'</span>'+this.art(b,index)+'<span class="closing-star">★</span></div>';
 this.field.append(flying);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 try{
 if(!reduced){
 await flying.querySelector('.closing-cover').animate([{transform:'rotateY(-155deg)'},{transform:'rotateY(0deg)'}],{duration:1000,easing:'ease-in-out',fill:'forwards'}).finished;
 const from=flying.getBoundingClientRect(),to=slot.getBoundingClientRect();
 await flying.animate([{transform:'translate(0,0) scale(1)'},{transform:'translate('+(to.left-from.left)+'px,'+(to.top-from.top)+'px) scale('+(to.width/from.width)+','+(to.height/from.height)+')'}],{duration:1050,easing:'cubic-bezier(.45,0,.2,1)',fill:'forwards'}).finished;
 }
 }finally{flying.remove();slot.style.visibility='';this.busy=false;slot.focus({preventScroll:true})}
 }
};
