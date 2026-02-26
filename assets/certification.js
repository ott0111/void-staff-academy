/* Void Staff Academy — Certification system
   - 20 questions
   - autosave answers in localStorage
   - pass/fail scoring
   - admin dashboard (password-gated) with tabs:
     Overview / Attempts / Answers / Questions / Export
   - tracks "who answered" via name field
*/

const VSA = {
  passScore: 70,
  storageKey: "vsa_cert_state_v2",
  attemptsKey: "vsa_cert_attempts_v2",
  adminHashKey: "vsa_admin_hash_v2", // stores hashed pw (sha-256) not plain
};

/* ===== Questions (edit anytime) ===== */
const QUESTIONS = [
  {
    id:"q1",
    domain:"Tickets",
    prompt:"A user opens a ticket and instantly starts spamming pings. What is the correct first response?",
    choices:[
      "Warn them that pings are not allowed and close the ticket immediately.",
      "Acknowledge, set expectations, request their issue clearly, and log the behavior.",
      "Ignore the pings until they stop.",
      "Ping them back so they know you saw it."
    ],
    answer:1
  },
  {
    id:"q2",
    domain:"Escalation",
    prompt:"A member claims a staff member is abusing powers. What should you do first?",
    choices:[
      "Publicly call out the staff member in chat.",
      "Ask for proof, keep it confidential, and escalate through the proper chain.",
      "Ban the staff member instantly to be safe.",
      "Tell the member to post it in announcements."
    ],
    answer:1
  },
  {
    id:"q3",
    domain:"Roster",
    prompt:"A player wants to join Competitive roster but refuses to provide required proof. What is correct?",
    choices:[
      "Accept them anyway to avoid conflict.",
      "Deny intake until requirements are met; document the refusal.",
      "Tell them to DM a different staff member.",
      "Have them repost in general chat."
    ],
    answer:1
  },
  {
    id:"q4",
    domain:"Conduct",
    prompt:"You disagree with another moderator’s decision inside a ticket. What is the correct approach?",
    choices:[
      "Argue in the ticket so the user sees transparency.",
      "Overrule them immediately without discussion.",
      "Move discussion to staff-only channels; escalate if needed; keep user-facing messaging unified.",
      "Do nothing and hope it resolves."
    ],
    answer:2
  },
  {
    id:"q5",
    domain:"Documentation",
    prompt:"What makes a moderation log entry high-quality?",
    choices:[
      "Short as possible, no context.",
      "Only screenshots, no explanation.",
      "Clear timeline, action taken, rule reference, evidence, and who approved if escalated.",
      "Just the user’s name."
    ],
    answer:2
  },
  // 15 more (kept realistic but concise)
  {
    id:"q6", domain:"Tickets",
    prompt:"A ticket is inactive for a while. Best practice?",
    choices:[
      "Close instantly without warning.",
      "Send a final check-in with a timeframe, then close + log if no reply.",
      "Spam them with messages until they answer.",
      "Transfer it randomly."
    ],
    answer:1
  },
  {
    id:"q7", domain:"Safety",
    prompt:"A user shares personal info about another member (dox risk). What do you do?",
    choices:[
      "Quote it so everyone understands the issue.",
      "Delete/hide, warn, document, and escalate to senior staff immediately.",
      "Ignore it if it’s not your problem.",
      "Ask them to repost it clearer."
    ],
    answer:1
  },
  {
    id:"q8", domain:"Roster",
    prompt:"Which intake step reduces fake stats/claims the most?",
    choices:[
      "Trust them if they sound confident.",
      "Ask the same requirement twice in different ways + require proof.",
      "Only accept friends of staff.",
      "Let them join then verify later."
    ],
    answer:1
  },
  {
    id:"q9", domain:"Chain of Command",
    prompt:"You need an exception to a standard rule for a unique case. Correct route?",
    choices:[
      "Make the exception yourself.",
      "Ask the user to decide.",
      "Escalate to the correct lead/head, document the approval, then proceed.",
      "Poll general chat."
    ],
    answer:2
  },
  {
    id:"q10", domain:"Professionalism",
    prompt:"A user is rude but not rule-breaking. Correct response?",
    choices:[
      "Match their energy.",
      "Stay calm, redirect to the issue, set boundaries, document if it escalates.",
      "Timeout instantly.",
      "Close the ticket with no message."
    ],
    answer:1
  },
  {
    id:"q11", domain:"Tickets",
    prompt:"Two staff members respond with conflicting answers. Best fix?",
    choices:[
      "Let the user pick which answer they like.",
      "Delete both messages.",
      "Clarify internally, then send one final unified answer + next steps.",
      "Stop responding."
    ],
    answer:2
  },
  {
    id:"q12", domain:"Evidence",
    prompt:"A report has no evidence, only 'trust me'. What’s correct?",
    choices:[
      "Punish anyway to look strict.",
      "Request evidence and explain what qualifies; log the report outcome.",
      "Mock them for no proof.",
      "Ban both parties."
    ],
    answer:1
  },
  {
    id:"q13", domain:"Operations",
    prompt:"A situation is getting heated fast. Best move?",
    choices:[
      "Wait so it doesn’t look like staff cares.",
      "De-escalate, separate parties, apply policy, escalate if threats appear.",
      "Announce it publicly for deterrence.",
      "Argue until they calm down."
    ],
    answer:1
  },
  {
    id:"q14", domain:"Roster",
    prompt:"Creative roster includes content creators. Intake should verify…",
    choices:[
      "Only their vibe.",
      "Their rank in competitive.",
      "Their portfolio/links, consistency, and if they meet your creator standards.",
      "Their computer specs."
    ],
    answer:2
  },
  {
    id:"q15", domain:"Compliance",
    prompt:"What does “least necessary action” mean in moderation?",
    choices:[
      "Always maximum punishment.",
      "Choose the smallest action that resolves the issue and matches policy.",
      "Never punish anyone.",
      "Punish only if you’re annoyed."
    ],
    answer:1
  },
  {
    id:"q16", domain:"Tickets",
    prompt:"User requests something you can’t do. Correct response?",
    choices:[
      "Make it up so they’re happy.",
      "Explain limits, offer what you *can* do, escalate if needed.",
      "Ignore them.",
      "Close ticket instantly."
    ],
    answer:1
  },
  {
    id:"q17", domain:"Integrity",
    prompt:"Friend asks you to “look the other way” on a rule. Correct move?",
    choices:[
      "Do it to keep loyalty.",
      "Apply the same standard; document; escalate if it’s serious.",
      "Let another mod handle it but don’t log anything.",
      "Delete evidence."
    ],
    answer:1
  },
  {
    id:"q18", domain:"Operations",
    prompt:"What should be in a shift log?",
    choices:[
      "Only your mood.",
      "Key actions, notable incidents, escalations, and any unresolved tickets.",
      "Just memes.",
      "Nothing; logs are pointless."
    ],
    answer:1
  },
  {
    id:"q19", domain:"Security",
    prompt:"A user tries to get staff-only info. Correct response?",
    choices:[
      "Send it if they promise not to leak.",
      "Refuse, remind boundaries, document the attempt, escalate if repeated.",
      "Leak a little to test them.",
      "Argue for 30 minutes."
    ],
    answer:1
  },
  {
    id:"q20", domain:"Final",
    prompt:"What’s the #1 goal of this certification?",
    choices:[
      "Memorize trivia.",
      "Prove you can handle realistic situations with discipline and documentation.",
      "Get a role fast.",
      "Flex in chat."
    ],
    answer:1
  },
];

/* ===== utils ===== */
async function sha256(text){
  const enc = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");
}
function nowISO(){ return new Date().toISOString(); }
function loadState(){
  try{
    return JSON.parse(localStorage.getItem(VSA.storageKey)) || {name:"", answers:{}};
  }catch{ return {name:"", answers:{}}; }
}
function saveState(s){ localStorage.setItem(VSA.storageKey, JSON.stringify(s)); }
function loadAttempts(){
  try{ return JSON.parse(localStorage.getItem(VSA.attemptsKey)) || []; }catch{ return []; }
}
function saveAttempts(a){ localStorage.setItem(VSA.attemptsKey, JSON.stringify(a)); }

function calcScore(state){
  let correct = 0;
  QUESTIONS.forEach(q=>{
    const a = state.answers[q.id];
    if(Number.isInteger(a) && a === q.answer) correct++;
  });
  const pct = Math.round((correct / QUESTIONS.length) * 100);
  return {correct, total: QUESTIONS.length, pct};
}

/* ===== render ===== */
function renderExam(){
  const state = loadState();

  const nameInput = document.getElementById("candidateName");
  const list = document.getElementById("questionList");
  const answeredEl = document.getElementById("answeredCount");
  const scoreEl = document.getElementById("scoreBig");
  const statusEl = document.getElementById("statusBadge");

  if(nameInput){
    nameInput.value = state.name || "";
    nameInput.addEventListener("input", ()=>{
      const s = loadState();
      s.name = nameInput.value.trim();
      saveState(s);
      refreshMeta();
    });
  }

  list.innerHTML = QUESTIONS.map((q, idx)=>{
    const picked = state.answers[q.id];
    return `
      <div class="q fade-in" style="animation-delay:${Math.min(idx*18,220)}ms">
        <div class="qhead">
          <div>
            <div class="badge">${q.domain}</div>
            <p class="qtitle" style="margin-top:8px">Q${idx+1}. ${q.prompt}</p>
            <div class="qmeta">Select one answer. Your progress autosaves.</div>
          </div>
          <div class="badge ${Number.isInteger(picked) ? "good":"warn"}">
            ${Number.isInteger(picked) ? "Answered":"Pending"}
          </div>
        </div>
        <div class="choices">
          ${q.choices.map((c,i)=>`
            <label class="choice">
              <input type="radio" name="${q.id}" value="${i}" ${picked===i?"checked":""}/>
              <div>${c}</div>
            </label>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");

  // bind radios
  list.querySelectorAll("input[type=radio]").forEach(r=>{
    r.addEventListener("change", ()=>{
      const s = loadState();
      const qid = r.name;
      s.answers[qid] = Number(r.value);
      saveState(s);
      refreshMeta(true);
    });
  });

  function refreshMeta(light){
    const s = loadState();
    const answered = Object.keys(s.answers).filter(k => Number.isInteger(s.answers[k])).length;
    const {pct} = calcScore(s);

    answeredEl.textContent = `${answered} / ${QUESTIONS.length} answered`;
    scoreEl.textContent = `${pct}%`;

    const pass = pct >= VSA.passScore;
    statusEl.className = "badge " + (pass ? "good" : (answered === QUESTIONS.length ? "bad" : "warn"));
    statusEl.textContent = pass ? "On Track" : (answered === QUESTIONS.length ? "Below Pass" : "In Progress");

    if(light){
      // tiny “pulse” effect by toggling opacity quickly
      scoreEl.style.opacity = ".65";
      setTimeout(()=> scoreEl.style.opacity = "1", 120);
    }
  }

  refreshMeta(false);
}

/* ===== actions ===== */
function resetExam(){
  localStorage.removeItem(VSA.storageKey);
  renderExam();
}

function submitAttempt(){
  const s = loadState();
  const answered = Object.keys(s.answers).filter(k => Number.isInteger(s.answers[k])).length;

  if(!s.name){
    alert("Enter your name before submitting.");
    document.getElementById("candidateName")?.focus();
    return;
  }
  if(answered < QUESTIONS.length){
    alert("Finish all questions before submitting.");
    return;
  }

  const score = calcScore(s);
  const attempt = {
    id: crypto.randomUUID(),
    submittedAt: nowISO(),
    name: s.name,
    score: score.pct,
    correct: score.correct,
    total: score.total,
    answers: s.answers
  };

  const attempts = loadAttempts();
  attempts.unshift(attempt);
  saveAttempts(attempts);

  alert(`Submitted! Score: ${score.pct}% (${score.correct}/${score.total})`);
}

/* ===== admin ===== */
async function ensureAdminPassword(){
  const existing = localStorage.getItem(VSA.adminHashKey);
  if(existing) return true;

  const pw = prompt("Set admin password (only you should know).");
  if(!pw) return false;

  const hash = await sha256(pw);
  localStorage.setItem(VSA.adminHashKey, hash);
  alert("Admin password set. Keep it safe.");
  return true;
}

async function openAdmin(){
  // if no password set, set it
  const ok = await ensureAdminPassword();
  if(!ok) return;

  // verify
  const pw = prompt("Admin password:");
  if(!pw) return;

  const hash = await sha256(pw);
  const saved = localStorage.getItem(VSA.adminHashKey);
  if(hash !== saved){
    alert("Wrong password.");
    return;
  }

  const backdrop = document.getElementById("adminBackdrop");
  const modal = document.getElementById("adminModal");
  backdrop.style.display = "grid";
  modal.style.display = "block";

  renderAdmin("overview");
}

function closeAdmin(){
  document.getElementById("adminBackdrop").style.display = "none";
  document.getElementById("adminModal").style.display = "none";
}

function renderAdmin(tab){
  const attempts = loadAttempts();
  const state = loadState();

  // tabs
  document.querySelectorAll(".tab").forEach(t=>{
    t.classList.toggle("active", t.dataset.tab === tab);
  });

  const body = document.getElementById("adminBody");
  if(tab === "overview"){
    body.innerHTML = `
      <div class="grid">
        <div class="panel span-12">
          <h3>System Status</h3>
          <p>Local demo storage enabled. Attempts are stored on-device (localStorage). For server-backed storage, plug this into a database/API later.</p>
          <div class="panel-actions">
            <button class="btn" id="unlockBtn">Unlock / Reset Admin Password</button>
            <button class="btn danger" id="wipeAttemptsBtn">Wipe Attempts (Local)</button>
          </div>
        </div>

        <div class="panel span-5">
          <h3>Candidate (Current Device)</h3>
          <p><b>Name:</b> ${state.name || "—"}</p>
          <p><b>Answered:</b> ${Object.keys(state.answers||{}).length} / ${QUESTIONS.length}</p>
          <p><b>Score now:</b> ${calcScore(state).pct}%</p>
        </div>

        <div class="panel span-7">
          <h3>Attempts Summary</h3>
          <p><b>Total attempts saved:</b> ${attempts.length}</p>
          <p><b>Latest:</b> ${attempts[0] ? `${attempts[0].name} — ${attempts[0].score}%` : "—"}</p>
          <p><b>Pass threshold:</b> ${VSA.passScore}%</p>
        </div>
      </div>
    `;
    document.getElementById("unlockBtn").onclick = ()=>{
      localStorage.removeItem(VSA.adminHashKey);
      alert("Admin password cleared. Re-open Admin to set a new one.");
      closeAdmin();
    };
    document.getElementById("wipeAttemptsBtn").onclick = ()=>{
      if(confirm("Wipe all local attempts on THIS device?")){
        localStorage.removeItem(VSA.attemptsKey);
        alert("Wiped.");
        renderAdmin("overview");
      }
    };
  }

  if(tab === "attempts"){
    body.innerHTML = `
      <table class="table">
        <thead><tr>
          <th>Submitted</th><th>Name</th><th>Score</th><th>Correct</th><th>Attempt ID</th>
        </tr></thead>
        <tbody>
          ${attempts.map(a=>`
            <tr>
              <td>${new Date(a.submittedAt).toLocaleString()}</td>
              <td>${a.name}</td>
              <td>${a.score}%</td>
              <td>${a.correct}/${a.total}</td>
              <td><span style="font-family:var(--mono)">${a.id.slice(0,8)}…</span></td>
            </tr>
          `).join("") || `<tr><td colspan="5">No attempts yet.</td></tr>`}
        </tbody>
      </table>
    `;
  }

  if(tab === "answers"){
    // who answered: show the last attempt per name
    const latestByName = new Map();
    for(const a of attempts){
      if(!latestByName.has(a.name)) latestByName.set(a.name, a);
    }
    const rows = [...latestByName.values()].map(a=>{
      const answered = Object.keys(a.answers||{}).length;
      return `<tr>
        <td>${a.name}</td>
        <td>${a.score}%</td>
        <td>${answered}/${QUESTIONS.length}</td>
        <td>${new Date(a.submittedAt).toLocaleString()}</td>
      </tr>`;
    });

    body.innerHTML = `
      <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:10px">
        <span class="badge">Unique candidates: ${latestByName.size}</span>
        <span class="badge">Total attempts: ${attempts.length}</span>
      </div>

      <table class="table">
        <thead><tr><th>Candidate</th><th>Score</th><th>Answered</th><th>Last Submit</th></tr></thead>
        <tbody>
          ${rows.join("") || `<tr><td colspan="4">No answers yet.</td></tr>`}
        </tbody>
      </table>
    `;
  }

  if(tab === "questions"){
    body.innerHTML = `
      <table class="table">
        <thead><tr><th>#</th><th>Domain</th><th>Prompt</th><th>Correct</th></tr></thead>
        <tbody>
          ${QUESTIONS.map((q,i)=>`
            <tr>
              <td>${i+1}</td>
              <td>${q.domain}</td>
              <td>${q.prompt}</td>
              <td>${q.choices[q.answer]}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div class="hr"></div>
      <p style="color:rgba(238,240,255,.70);font-size:12.5px">
        To edit questions: open <span style="font-family:var(--mono)">assets/certification.js</span> and modify the <b>QUESTIONS</b> array.
      </p>
    `;
  }

  if(tab === "export"){
    const payload = {attempts, questions: QUESTIONS, exportedAt: nowISO()};
    body.innerHTML = `
      <p style="color:rgba(238,240,255,.75);margin:0 0 10px">
        Export attempts as JSON (copy/paste into a file). This is local-device export.
      </p>
      <textarea class="input" style="height:320px; font-family:var(--mono); font-size:12px; line-height:1.45">${JSON.stringify(payload, null, 2)}</textarea>
      <div class="hr"></div>
      <button class="btn primary" id="copyExport">Copy Export</button>
    `;
    document.getElementById("copyExport").onclick = async ()=>{
      const ta = body.querySelector("textarea");
      ta.select();
      await navigator.clipboard.writeText(ta.value);
      alert("Copied.");
    };
  }
}

/* ===== boot ===== */
window.addEventListener("DOMContentLoaded", ()=>{
  // render exam
  if(document.getElementById("questionList")) renderExam();

  // buttons
  document.getElementById("resetBtn")?.addEventListener("click", ()=>{
    if(confirm("Reset your answers on this device?")) resetExam();
  });
  document.getElementById("submitBtn")?.addEventListener("click", submitAttempt);

  // admin
  document.getElementById("adminBtn")?.addEventListener("click", openAdmin);
  document.getElementById("adminClose")?.addEventListener("click", closeAdmin);
  document.getElementById("adminBackdrop")?.addEventListener("click", (e)=>{ if(e.target.id==="adminBackdrop") closeAdmin(); });

  // admin tabs
  document.querySelectorAll(".tab").forEach(t=>{
    t.addEventListener("click", ()=> renderAdmin(t.dataset.tab));
  });
});
