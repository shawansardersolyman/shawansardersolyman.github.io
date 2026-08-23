
const AUTO_FOLDERS = {
  achievements:{dir:"assets/awards/",prefix:"award-",max:100},
  moments:{dir:"assets/moments/",prefix:"moment-",max:200},
  places:{dir:"assets/places/",prefix:"place-",max:100},
  builds:{dir:"assets/builds/",prefix:"project-",max:100}
};

async function findImages(cfg){
  const out=[];
  for(let i=1;i<=cfg.max;i++){
    const n=String(i).padStart(2,"0");
    let found="";
    for(const ext of ["jpg","jpeg","png","webp"]){
      const url=`${cfg.dir}${cfg.prefix}${n}.${ext}`;
      const ok=await new Promise(resolve=>{ const img=new Image(); img.onload=()=>resolve(true); img.onerror=()=>resolve(false); img.src=url+"?v="+Date.now(); });
      if(ok){found=url;break;}
    }
    if(found) out.push(found);
    else if(i>1) break;
  }
  return out;
}

async function loadAutoPhotos(){
  const [a,m,p,b]=await Promise.all([
    findImages(AUTO_FOLDERS.achievements),
    findImages(AUTO_FOLDERS.moments),
    findImages(AUTO_FOLDERS.places),
    findImages(AUTO_FOLDERS.builds)
  ]);
  if(!SITE.achievements.length) SITE.achievements=a.map((image,i)=>({title:`Achievement ${String(i+1).padStart(2,"0")}`,meta:"ACHIEVEMENT",text:"",image}));
  if(!SITE.moments.length) SITE.moments=m.map((image,i)=>({caption:`Moment ${String(i+1).padStart(2,"0")}`,image}));
  if(!SITE.places.length) SITE.places=p.map((image,i)=>({place:`Place ${String(i+1).padStart(2,"0")}`,note:"",image}));
  if(!SITE.builds.length) SITE.builds=b.map((image,i)=>({title:`Project ${String(i+1).padStart(2,"0")}`,type:"PROJECT",text:"",image}));
}

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

loadAutoPhotos().then(()=>{
$("#heroName").textContent = SITE.fullName;
$("#heroIntro").textContent = SITE.heroIntro;
$("#aboutText").textContent = SITE.about;
const profile = $("#profileImage");
if(profile){
  profile.src = SITE.profileImage || "assets/profile.jpg";
  profile.onerror = () => { profile.style.display="none"; const f=$("#profileFallback"); if(f) f.style.display="flex"; };
}

$("#heroYear").textContent = new Date().getFullYear();
$("#year").textContent = new Date().getFullYear();

function media(image, label="ADD PHOTO") {
  return image
    ? `<img src="${esc(image)}" alt="" loading="lazy">`
    : `<div class="placeholder"><span>${label}</span></div>`;
}

$("#storyList").innerHTML = SITE.story.map((x,i)=>`
  <article class="story-item reveal">
    <span class="story-no">${String(i+1).padStart(2,"0")}</span>
    <span class="story-year">${esc(x.year)}</span>
    <div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div>
  </article>`).join("");

$("#achievementGrid").innerHTML = SITE.achievements.map((x,i)=>`
  <article class="achievement-card reveal">
    <div class="achievement-media">${media(x.image,"AWARD PHOTO")}</div>
    <div class="achievement-body"><span>${esc(x.meta)}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div>
  </article>`).join("");

$("#momentGrid").innerHTML = SITE.moments.map((x,i)=>`
  <button class="moment-card reveal" data-full="${esc(x.image)}" aria-label="Open ${esc(x.caption)}">
    ${media(x.image,"MOMENT")}
    <span>${esc(x.caption)}</span>
  </button>`).join("");

$("#placeGrid").innerHTML = SITE.places.map(x=>`
  <article class="place-card reveal">
    <div class="place-media">${media(x.image,"TRAVEL PHOTO")}</div>
    <div><small>MEMORY FROM</small><h3>${esc(x.place)}</h3><p>${esc(x.note)}</p></div>
  </article>`).join("");

$("#buildGrid").innerHTML = SITE.builds.map(x=>`
  <article class="build-card reveal">
    <div class="build-media">${media(x.image,"PROJECT PHOTO")}</div>
    <div class="build-body"><small>${esc(x.type)}</small><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div>
  </article>`).join("");

$("#nowList").innerHTML = SITE.now.map(x=>`<div><span>↗</span>${esc(x)}</div>`).join("");

const icons = {
 facebook:'<svg viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H7.7v3h2.7v8h3.1Z"/></svg>',
 instagram:'<svg viewBox="0 0 24 24"><path d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm0 2A3.2 3.2 0 0 0 4 7.2v9.6A3.2 3.2 0 0 0 7.2 20h9.6a3.2 3.2 0 0 0 3.2-3.2V7.2A3.2 3.2 0 0 0 16.8 4H7.2Zm9.9 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>',
 linkedin:'<svg viewBox="0 0 24 24"><path d="M5 3.5A2.5 2.5 0 1 1 5 8.5 2.5 2.5 0 0 1 5 3.5ZM3 10h4v11H3V10Zm6 0h3.8v1.5h.1c.5-.9 1.8-1.9 3.8-1.9 4.1 0 4.9 2.6 4.9 6v5.4h-4v-4.8c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21H9V10Z"/></svg>',
 github:'<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.2-4.5-1.1-4.5-4.8 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.7-2.3 4.6-4.5 4.8.4.3.7 1 .7 2v2.9c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>',
 youtube:'<svg viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z"/></svg>',
 telegram:'<svg viewBox="0 0 24 24"><path d="m21.8 3.3-3.1 17.4c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6.1 14.2l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.6 2.9c.9-.3 1.7.2 1.2.4Z"/></svg>',
 whatsapp:'<svg viewBox="0 0 24 24"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L.2 24l6.5-1.7a11.8 11.8 0 0 0 5.4 1.3h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.1-1.2-6.1-3.5-8.3ZM12.1 21.5h-.1c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.9 1 1-3.8-.2-.4a9.8 9.8 0 1 1 8.5 4.7Zm5.4-7.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.5-.7-2.5-1.3-3.5-2.9-.3-.5.3-.4.8-1.4.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3 1.8.8 2.5.9 3.4.8.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4Z"/></svg>',
 email:'<svg viewBox="0 0 24 24"><path d="M2.5 5h19A2.5 2.5 0 0 1 24 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 0 16.5v-9A2.5 2.5 0 0 1 2.5 5Zm0 2a.5.5 0 0 0-.5.5v.2l10 6.2 10-6.2v-.2a.5.5 0 0 0-.5-.5h-19Zm19.5 3-8.9 5.5a2 2 0 0 1-2.1 0L2 10v6.5a.5.5 0 0 0 .5.5h19a.5.5 0 0 0 .5-.5V10Z"/></svg>'
};

const normalizeUrl = url => {
  const v = String(url || "").trim();
  if(!v) return "";
  if(/^(https?:\/\/|mailto:|tel:)/i.test(v)) return v;
  return "https://" + v;
};
const active = SITE.socials.map(x => ({...x, url: normalizeUrl(x.url)})).filter(x => x.url);
$("#socials").innerHTML = active.length
 ? active.map(x => `<a class="social" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(x.name)}">${icons[x.icon] || icons.email}<span>${esc(x.name)}</span></a>`).join("")
 : `<span class="social-empty">Your social links will appear here.</span>`;

const observer = new IntersectionObserver(entries => entries.forEach(e => {
  if(e.isIntersecting){ e.target.classList.add("visible"); observer.unobserve(e.target); }
}), {threshold:.1});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const theme = $("#themeToggle");
if(localStorage.getItem("shawan-theme")==="light") document.body.classList.add("light");
theme.onclick = () => {
  document.body.classList.toggle("light");
  localStorage.setItem("shawan-theme", document.body.classList.contains("light") ? "light" : "dark");
};

const menu = $("#mobileNav"), menuBtn = $("#menuToggle");
menuBtn.onclick = () => {
  const open = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
};
menu.querySelectorAll("a").forEach(a => a.onclick = () => {
  menu.classList.remove("open"); menuBtn.setAttribute("aria-expanded","false");
});

const glow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", e => {
  glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px";
});

document.addEventListener("click", e => {
  const card = e.target.closest(".moment-card");
  if(!card || !card.dataset.full) return;
  const box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML = `<button aria-label="Close">×</button><img src="${esc(card.dataset.full)}" alt="">`;
  document.body.appendChild(box);
  requestAnimationFrame(()=>box.classList.add("show"));
  box.onclick = ev => { if(ev.target===box || ev.target.tagName==="BUTTON") box.remove(); };
});