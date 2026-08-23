
(() => {
 const cards = () => [...document.querySelectorAll('.achievement-card,.moment-card,.place-card,.build-card')];
 document.addEventListener('click', e => {
   const img=e.target.closest('.achievement-card img,.moment-card img,.place-card img,.build-card img');
   if(!img) return;
   const box=document.createElement('div');
   box.className='lightbox show';
   box.innerHTML='<button>×</button><img src="'+img.src+'">';
   document.body.appendChild(box);
   box.onclick=()=>box.remove();
 });
})();
