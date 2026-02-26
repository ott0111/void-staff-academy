/* Void Staff Academy — UI runtime: active nav, mouse glow, cmd palette, helpers */

(function(){
  const root = document.documentElement;

  // mouse glow
  window.addEventListener("mousemove", (e)=>{
    const mx = (e.clientX / window.innerWidth) * 100;
    const my = (e.clientY / window.innerHeight) * 100;
    root.style.setProperty("--mx", mx + "%");
    root.style.setProperty("--my", my + "%");
  }, {passive:true});

  // set active nav based on pathname
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-nav]").forEach(a=>{
    const href = (a.getAttribute("href")||"").toLowerCase();
    if(href.endsWith(path)) a.classList.add("active");
  });

  // command palette
  const cmdk = document.getElementById("cmdk");
  const cmdkInput = document.getElementById("cmdkInput");
  const cmdkList = document.getElementById("cmdkList");
  const cmdkOpenBtn = document.getElementById("cmdkOpen");

  const routes = [
    {name:"Home", href:"index.html", hint:"Overview & modules"},
    {name:"Moderation", href:"moderation.html", hint:"Ticket flow & discipline"},
    {name:"Roster", href:"roster.html", hint:"Competitive / Creative / CC"},
    {name:"Operations", href:"operations.html", hint:"Escalations & logs"},
    {name:"Recruitment", href:"recruitment.html", hint:"Trial pipeline"},
    {name:"Leadership", href:"leadership.html", hint:"Standards & chain"},
    {name:"Certification", href:"certification.html", hint:"Exam portal"},
  ];

  function openCmdk(){
    if(!cmdk) return;
    cmdk.style.display = "grid";
    cmdkInput.value = "";
    renderCmdk("");
    setTimeout(()=>cmdkInput.focus(), 0);
  }
  function closeCmdk(){
    if(!cmdk) return;
    cmdk.style.display = "none";
  }
  function renderCmdk(q){
    if(!cmdkList) return;
    const needle = q.trim().toLowerCase();
    const items = routes.filter(r => !needle || r.name.toLowerCase().includes(needle) || r.hint.toLowerCase().includes(needle));
    cmdkList.innerHTML = items.map(r=>`
      <div class="cmdk-item" data-href="${r.href}">
        <div>${r.name}<div><small>${r.hint}</small></div></div>
        <small>${r.href}</small>
      </div>
    `).join("") || `<div class="cmdk-item"><div>No matches</div><small>Try a different search</small></div>`;
    cmdkList.querySelectorAll(".cmdk-item[data-href]").forEach(el=>{
      el.addEventListener("click", ()=> location.href = el.dataset.href);
    });
  }

  window.addEventListener("keydown", (e)=>{
    const isK = e.key.toLowerCase() === "k";
    if((e.ctrlKey || e.metaKey) && isK){
      e.preventDefault(); openCmdk();
    }
    if(e.key === "Escape"){
      closeCmdk();
      const m = document.getElementById("adminModal");
      if(m) m.style.display = "none";
      const mb = document.getElementById("adminBackdrop");
      if(mb) mb.style.display = "none";
    }
  });

  if(cmdk){
    cmdk.addEventListener("click", (e)=>{ if(e.target === cmdk) closeCmdk(); });
    cmdkInput?.addEventListener("input", ()=> renderCmdk(cmdkInput.value));
  }
  cmdkOpenBtn?.addEventListener("click", openCmdk);

  // helper: set breadcrumb title
  const crumb = document.getElementById("crumbHere");
  if(crumb){
    const map = {
      "index.html":"Home",
      "moderation.html":"Moderation",
      "roster.html":"Roster",
      "operations.html":"Operations",
      "recruitment.html":"Recruitment",
      "leadership.html":"Leadership",
      "certification.html":"Certification",
    };
    crumb.textContent = map[path] || "Portal";
  }
})();
