/* assets/app.js */
(function(){
  const $ = (q, el=document) => el.querySelector(q);
  const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));

  // Mark active nav item
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$("[data-nav]").forEach(a=>{
    const href = (a.getAttribute("href")||"").toLowerCase();
    if(href === path || (path==="" && href==="index.html")) a.classList.add("active");
  });

  // Scroll reveal
  const reveal = $$("[data-reveal]");
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add("on");
    });
  }, {threshold:.12});
  reveal.forEach(el=>io.observe(el));

  // Mobile sheet
  const sheet = $("#mobileSheet");
  const openBtn = $("#mobileOpen");
  const closeBtn = $("#mobileClose");
  const shade = sheet ? $(".shade", sheet) : null;
  const openSheet = ()=> sheet && sheet.classList.add("show");
  const closeSheet = ()=> sheet && sheet.classList.remove("show");
  if(openBtn) openBtn.addEventListener("click", openSheet);
  if(closeBtn) closeBtn.addEventListener("click", closeSheet);
  if(shade) shade.addEventListener("click", closeSheet);

  // Toast
  let toastTimer = null;
  window.VOIDToast = (msg) => {
    const t = $("#toast");
    if(!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>t.classList.remove("show"), 2200);
  };

  // Command palette
  const palette = $("#cmdPalette");
  const cmdInput = $("#cmdInput");
  const cmdList = $("#cmdList");
  const openPalette = ()=>{
    if(!palette) return;
    palette.classList.add("show");
    setTimeout(()=>cmdInput && cmdInput.focus(), 0);
  };
  const closePalette = ()=>{
    if(!palette) return;
    palette.classList.remove("show");
    cmdInput && (cmdInput.value="");
    filterCmd("");
  };

  const cmds = [
    {name:"Home", desc:"Governance overview", href:"index.html", key:"H"},
    {name:"Moderation", desc:"Ticket protocol + routing", href:"moderation.html", key:"M"},
    {name:"Roster", desc:"Roster standards + divisions", href:"roster.html", key:"R"},
    {name:"Command Center", desc:"Operations discipline", href:"operations.html", key:"O"},
    {name:"Certification", desc:"Scenario exam portal", href:"certification.html", key:"C"},
    {name:"Recruitment", desc:"Hiring pipeline + templates", href:"recruitment.html", key:"Q"},
    {name:"Leadership", desc:"Roles, escalation, governance", href:"leadership.html", key:"L"},
  ];

  function renderCmd(items){
    if(!cmdList) return;
    cmdList.innerHTML = "";
    items.forEach(item=>{
      const div = document.createElement("div");
      div.className = "cmd";
      div.innerHTML = `
        <div>
          <div style="font-weight:700">${item.name}</div>
          <small>${item.desc}</small>
        </div>
        <kbd>${item.key}</kbd>
      `;
      div.addEventListener("click", ()=> location.href = item.href);
      cmdList.appendChild(div);
    });
  }
  function filterCmd(q){
    const query = (q||"").trim().toLowerCase();
    const filtered = !query ? cmds : cmds.filter(c =>
      (c.name + " " + c.desc).toLowerCase().includes(query)
    );
    renderCmd(filtered);
  }

  if(cmdInput){
    cmdInput.addEventListener("input", e=> filterCmd(e.target.value));
  }
  renderCmd(cmds);

  document.addEventListener("keydown", (e)=>{
    const k = e.key.toLowerCase();
    const meta = e.metaKey || e.ctrlKey;

    if(meta && k === "k"){
      e.preventDefault();
      if(palette && palette.classList.contains("show")) closePalette();
      else openPalette();
      return;
    }
    if(k === "escape"){
      closePalette();
      closeSheet();
    }

    // quick nav while palette open
    if(palette && palette.classList.contains("show")){
      const found = cmds.find(c => c.key.toLowerCase() === k);
      if(found){ location.href = found.href; }
    }
  });

  // Close palette on click outside
  if(palette){
    palette.addEventListener("click", (e)=>{
      if(e.target === palette) closePalette();
    });
  }
})();
