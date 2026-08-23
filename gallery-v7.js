
/* v7.1 Safe Gallery Enhancement */
(() => {
  window.addEventListener("load", () => {
    const all = () => [...document.querySelectorAll(
      ".achievement-card img,.moment-card img,.place-card img,.build-card img"
    )];

    const open = (list, index) => {
      let current = index;
      const box = document.createElement("div");
      box.className = "v7-lightbox";
      box.innerHTML = `
      <button class="v7-close">×</button>
      <button class="v7-prev">‹</button>
      <div class="v7-content"><img><div class="v7-caption"></div></div>
      <button class="v7-next">›</button>`;
      document.body.appendChild(box);

      const img = box.querySelector("img");
      const cap = box.querySelector(".v7-caption");

      const render = () => {
        img.src = list[current];
        cap.textContent = list[current].split("/").pop();
      };

      render();
      requestAnimationFrame(()=>box.classList.add("show"));

      box.querySelector(".v7-close").onclick = ()=>box.remove();
      box.querySelector(".v7-next").onclick = ()=>{
        current=(current+1)%list.length; render();
      };
      box.querySelector(".v7-prev").onclick = ()=>{
        current=(current-1+list.length)%list.length; render();
      };

      const key = e=>{
        if(!document.body.contains(box)) return document.removeEventListener("keydown",key);
        if(e.key==="Escape") box.remove();
        if(e.key==="ArrowRight") box.querySelector(".v7-next").click();
        if(e.key==="ArrowLeft") box.querySelector(".v7-prev").click();
      };
      document.addEventListener("keydown",key);
    };

    document.addEventListener("click", e=>{
      const img=e.target.closest(".achievement-card img,.moment-card img,.place-card img,.build-card img");
      if(!img) return;
      const list=all().map(x=>x.src);
      open(list,list.indexOf(img.src));
    });
  });
})();
