// assets/app.js
(function(){
  // lucide icons
  function initLucide(){
    if(window.lucide && typeof window.lucide.createIcons === "function"){
      window.lucide.createIcons();
    }
  }

  // active nav link
  function markActive(){
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll("[data-nav]").forEach(a=>{
      const href = (a.getAttribute("href")||"").toLowerCase();
      const isHome = (path === "" || path === "index.html");
      const match = (href === path) || (isHome && (href === "index.html" || href === "./" || href === "/"));
      if(match) a.classList.add("active");
    });
  }

  // fade-in
  function fadeIn(){
    const els = document.querySelectorAll(".fade-in");
    const io = new IntersectionObserver((entries)=>{
      for(const e of entries){
        if(e.isIntersecting) e.target.classList.add("show");
      }
    }, {threshold: 0.12});
    els.forEach(el=>io.observe(el));
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    markActive();
    fadeIn();
    initLucide();
  });

  // if lucide loads after DOM
  window.addEventListener("load", initLucide);
})();
