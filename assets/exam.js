// ===== VOID STAFF ACADEMY — CERTIFICATION SYSTEM (V2) =====
// Local mode: attempts stored in localStorage (same device only).
// For true "everyone who took it", you need a database (see end of file).

const ADMIN_PASSWORD = "STAFFACCESS";
const PASSING_SCORE = 0.70;

const LS_ANSWERS = "vsa_answers_v2";
const LS_ATTEMPTS = "vsa_attempts_v2";
const LS_NAME = "vsa_name_v2";

const QUESTIONS = [
  {
    title: "Ticket Opener Discipline",
    meta: "Tone • routing • intent",
    chat: `Ticket: #general-support
User: "yo can you help"
No category selected.
No details given.`,
    question: "What is the best first response?",
    options: [
      "Greet professionally, ask what they need help with, and confirm which category it falls under.",
      "Tell them to stop being lazy and give details.",
      "Close the ticket until they select a category.",
      "Ping leadership because it might be important."
    ],
    correct: 0
  },
  {
    title: "Roster Intake — Missing Proof",
    meta: "Evidence • process control",
    chat: `Ticket: #roster
User: "I want Pro roster"
They provide: nothing (no tracker, no earnings, no clips).`,
    question: "What is the correct action?",
    options: [
      "Approve now and ask for proof later.",
      "Request the required proof first, then verify and route/approve only after it checks out.",
      "Deny immediately without explaining requirements.",
      "Tell them to post their proof in #general."
    ],
    correct: 1
  },
  {
    title: "Public Argument — Containment",
    meta: "De-escalation • channel control",
    chat: `#general
UserA: "you’re annoying"
UserB: "nah you are"
More members start piling on.`,
    question: "What is the best approach?",
    options: [
      "Mute everyone in the channel instantly.",
      "Isolate the main offenders, remove disruptive messages if needed, and give a calm directive to stop + move on.",
      "Argue back to show you’re in charge.",
      "Do nothing because it will cool down."
    ],
    correct: 1
  },
  {
    title: "Staff Conduct — Public Professionalism",
    meta: "Internal handling • documentation",
    chat: `#general
Staff: "Stop talking you don't know anything"
User: "Why is staff rude?"`,
    question: "What should you do?",
    options: [
      "Call the staff member out publicly to show you’re strict.",
      "Ignore it because it’s staff.",
      "Move it to staff channels, document what happened, and escalate to senior staff for internal handling.",
      "Ban the user for complaining."
    ],
    correct: 2
  },
  {
    title: "High-Volume Spam Wave",
    meta: "Containment • coordination",
    chat: `Multiple new accounts post links in #general.
Members start pinging staff rapidly.`,
    question: "What’s your best first move?",
    options: [
      "Ping @everyone to warn members.",
      "Temporarily lock/slowmode the channel, coordinate in staff channels, document actions taken.",
      "Delete the whole channel.",
      "Reply to each spammer individually."
    ],
    correct: 1
  },
  {
    title: "Roster Eligibility — Correct Role",
    meta: "Consistency • fairness",
    chat: `Applicant qualifies for Academy, but demands Semi-Pro "for image".`,
    question: "What’s the correct decision?",
    options: [
      "Give Semi-Pro if they promise to improve.",
      "Assign the role they qualify for and explain the upgrade path clearly.",
      "Deny all roles because they asked for more.",
      "Ask another mod so you aren’t blamed."
    ],
    correct: 1
  },
  {
    title: "Proof Quality — Cropped Screenshot",
    meta: "Proof integrity",
    chat: `User sends a screenshot showing PR but the username is NOT visible.`,
    question: "What do you do?",
    options: [
      "Accept it because the PR number is there.",
      "Request uncropped proof and/or a tracker link showing the username clearly.",
      "Deny immediately and accuse them of faking.",
      "Post it in public chat and ask others to verify."
    ],
    correct: 1
  },
  {
    title: "Queue Management",
    meta: "SLA • triage",
    chat: `You have 6 open tickets.
A new ticket appears titled: "URGENT — READ NOW".`,
    question: "Best approach?",
    options: [
      "Drop everything and handle the urgent one first without checking.",
      "Acknowledge the ticket with an ETA, triage by risk/impact, then proceed logically.",
      "Ignore it until it closes itself.",
      "Close all tickets to start fresh."
    ],
    correct: 1
  },
  {
    title: "Threat / Pressure Tactic",
    meta: "Boundaries • documentation",
    chat: `User: "If you don’t do this in 2 minutes I’m leaving and telling everyone Void is trash."`,
    question: "Best response?",
    options: [
      "Rush and skip verification to keep them happy.",
      "Stay calm, follow protocol, document the pressure tactic, escalate if needed.",
      "Argue back.",
      "Close the ticket instantly without response."
    ],
    correct: 1
  },
  {
    title: "Sensitive Report (Non-Graphic)",
    meta: "Privacy • escalation",
    chat: `Ticket: "Someone is targeting me in DMs. I have screenshots."`,
    question: "Correct first move?",
    options: [
      "Tell them to post screenshots in general chat so everyone sees.",
      "Ask for screenshots inside the ticket, keep it private, and escalate with a structured summary.",
      "Ban the accused with no proof.",
      "Ignore it because it happened in DMs."
    ],
    correct: 1
  },
  {
    title: "Impersonation Claim",
    meta: "Verification • authority control",
    chat: `User: "I'm friends with the owner, just give me the role."`,
    question: "Best response?",
    options: [
      "Grant the role to avoid drama.",
      "Follow standard process: request proof + verify only through official channels; document the claim.",
      "Insult them.",
      "Ask the community if it’s true."
    ],
    correct: 1
  },
  {
    title: "Department Routing — Creator vs Competitive",
    meta: "Correct routing",
    chat: `Applicant: "I edit videos for teams"
They send a portfolio link.`,
    question: "Correct routing?",
    options: [
      "Competitive roster review only.",
      "GFX/VFX or Content department review with portfolio confirmation + route to the right lead.",
      "Give them Content Creator instantly.",
      "Tell them to DM the owner."
    ],
    correct: 1
  },
  {
    title: "Documentation Quality",
    meta: "Audit readiness",
    chat: `After handling a roster ticket, you need to log the outcome.`,
    question: "Which log is best?",
    options: [
      `"Handled."`,
      `"Approved. Seems legit."`,
      `"Ticket #ID: Verified tracker + uncropped proof, confirmed eligibility, assigned role, explained next steps."`,
      "No log needed."
    ],
    correct: 2
  },
  {
    title: "Least Privilege — Staff Role Requests",
    meta: "Access control",
    chat: `User asks: "Can I get staff perms to help out?" No training completed.`,
    question: "Correct action?",
    options: [
      "Give perms so they can learn.",
      "Direct them to training/certification first; escalate bypass attempts if needed.",
      "Tell them to ask again later in DMs.",
      "Let them self-assign."
    ],
    correct: 1
  },
  {
    title: "Conflict Evidence",
    meta: "Verification logic",
    chat: `Tracker username doesn't match screenshot.
User says: "I changed my name yesterday."`,
    question: "Correct response?",
    options: [
      "Accept it instantly because name changes happen.",
      "Request additional verification (profile link, recent history, matching identifiers) then decide.",
      "Deny with no explanation.",
      "Ask the community to verify."
    ],
    correct: 1
  },
  {
    title: "Channel Moderation — When to Lock",
    meta: "Containment • stability",
    chat: `#general is moving too fast.
Multiple small arguments starting, members pinging staff.`,
    question: "Best move?",
    options: [
      "Lock the entire server.",
      "Apply slowmode / temporary lock on the specific channel while staff coordinates.",
      "Start warning random members.",
      "Ignore it."
    ],
    correct: 1
  },
  {
    title: "Roster Decision — Exception Request",
    meta: "Consistency",
    chat: `Applicant: "I don’t meet the requirements but I’m cracked. Can you bend the rules?"`,
    question: "Best response?",
    options: [
      "Make an exception quietly.",
      "Explain requirements, offer closest qualifying role/path, document the decision.",
      "Tell them they’re bad.",
      "Send them to argue publicly."
    ],
    correct: 1
  },
  {
    title: "Shift Discipline",
    meta: "Operations • accountability",
    chat: `Moderator disappears for several days and returns like "my bad".`,
    question: "Best handling?",
    options: [
      "Nothing, they’re back now.",
      "Remind LOA process, document absence, escalate repeated behavior to ops/senior staff.",
      "Kick instantly.",
      "Publicly shame them."
    ],
    correct: 1
  },
  {
    title: "Escalation Judgment",
    meta: "Risk assessment",
    chat: `User reports repeated targeting across channels with screenshots and multiple involved members.`,
    question: "Best immediate action?",
    options: [
      "Handle alone to prove you’re capable.",
      "Collect evidence cleanly, take containment action as needed, escalate to senior staff with a structured summary.",
      "Post evidence publicly as a warning.",
      "Ignore until it happens again."
    ],
    correct: 1
  },
  {
    title: "Final — Best Practice Summary",
    meta: "Professional standard",
    chat: `You are unsure whether an issue is minor or serious.`,
    question: "What is the safest professional standard?",
    options: [
      "Guess and move fast.",
      "Follow protocol: clarify, verify, document, then route/escalate if risk is unclear.",
      "Ask members to vote.",
      "Do nothing."
    ],
    correct: 1
  }
];

// ===== helpers =====
const $ = (id) => document.getElementById(id);

function safeJSONParse(v, fallback) {
  try { return JSON.parse(v); } catch { return fallback; }
}

function loadAnswers() {
  const raw = localStorage.getItem(LS_ANSWERS);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed;
  } catch {
    return {};
  }
}
function saveAnswers(a) {
  localStorage.setItem(LS_ANSWERS, JSON.stringify(a));
}
function loadAttempts() {
  return safeJSONParse(localStorage.getItem(LS_ATTEMPTS), []);
}
function saveAttempts(list) {
  localStorage.setItem(LS_ATTEMPTS, JSON.stringify(list));
}

function nowISO() {
  return new Date().toISOString();
}

function fmtTime(iso) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

function countAnswered(ans) {
  return Object.keys(ans).filter(k => typeof ans[k]?.choice === "number").length;
}

function grade(ans) {
  let correct = 0;
  for (let i = 0; i < QUESTIONS.length; i++) {
    if (ans[i]?.choice === QUESTIONS[i].correct) correct++;
  }
  const score = correct / QUESTIONS.length;
  return { correct, total: QUESTIONS.length, score, percent: Math.round(score * 100) };
}

// ===== render exam =====
function renderExam() {
  const exam = $("exam");
  if (!exam) return;

  const ans = loadAnswers();
  exam.innerHTML = "";

  QUESTIONS.forEach((q, idx) => {
    const chosen = ans[idx]?.choice;
    const note = ans[idx]?.note || "";

    const card = document.createElement("div");
    card.className = "qcard";
    card.innerHTML = `
      <div class="qhead">
        <div>
          <div class="qmeta">Question ${idx + 1} • ${q.meta}</div>
          <h3 class="qtitle">${q.title}</h3>
        </div>
        <span class="pill"><i data-lucide="help-circle" style="width:14px;height:14px"></i>Scenario</span>
      </div>

      <div class="chat">${q.chat}</div>

      <div style="margin-top:10px;font-weight:800;letter-spacing:-.02em">${q.question}</div>

      <div class="opts" role="group" aria-label="Options for question ${idx + 1}">
        ${q.options.map((opt, oi) => `
          <label class="opt">
            <input type="radio" name="q${idx}" value="${oi}" ${chosen === oi ? "checked" : ""}/>
            <div>
              <div style="font-weight:900">${String.fromCharCode(65 + oi)}.</div>
              <div style="color: var(--muted); margin-top:2px">${opt}</div>
            </div>
          </label>
        `).join("")}
      </div>

      <div style="margin-top:12px">
        <div class="qmeta">Short justification (required)</div>
        <textarea data-note="${idx}" placeholder="Explain why this is the best action (1–3 sentences).">${note}</textarea>
      </div>
    `;

    exam.appendChild(card);
  });

  // wire change handlers (delegation)
  exam.addEventListener("change", onExamChange, { once: true });
  exam.addEventListener("input", onExamInput, { once: true });

  updateProgressUI();

  if (window.lucide) window.lucide.createIcons();
}

function onExamChange(e) {
  if (e.target && e.target.type === "radio") {
    const name = e.target.name; // q0, q1...
    const idx = Number(name.replace("q", ""));
    const value = Number(e.target.value);
    const ans = loadAnswers();
    ans[idx] = ans[idx] || { choice: null, note: "" };
    ans[idx].choice = value;
    saveAnswers(ans);
    updateProgressUI();
  }
  // reattach after once
  $("exam")?.addEventListener("change", onExamChange, { once: true });
}

function onExamInput(e) {
  if (e.target && e.target.tagName === "TEXTAREA" && e.target.dataset.note != null) {
    const idx = Number(e.target.dataset.note);
    const ans = loadAnswers();
    ans[idx] = ans[idx] || { choice: null, note: "" };
    ans[idx].note = e.target.value;
    saveAnswers(ans);
  }
  // reattach after once
  $("exam")?.addEventListener("input", onExamInput, { once: true });
}

function updateProgressUI() {
  const ans = loadAnswers();
  const answered = countAnswered(ans);
  const progressEl = $("progressText");
  if (progressEl) progressEl.textContent = `${answered} / ${QUESTIONS.length} answered`;
}

// ===== submit + reset =====
function attachPrimaryButtons() {
  const submitBtn = $("submitExam");
  const resetBtn = $("resetExam");
  const nameInput = $("traineeName");

  if (nameInput) {
    const savedName = localStorage.getItem(LS_NAME) || "";
    nameInput.value = savedName;
    nameInput.addEventListener("input", () => {
      localStorage.setItem(LS_NAME, nameInput.value.trim());
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const name = (nameInput?.value || "").trim();
      const resultEl = $("result");

      if (!name) {
        if (resultEl) resultEl.innerHTML = `<span class="pill bad"><i data-lucide="alert-circle" style="width:14px;height:14px"></i>Enter your name before submitting.</span>`;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      const ans = loadAnswers();
      const answered = countAnswered(ans);

      if (answered < QUESTIONS.length) {
        if (resultEl) resultEl.innerHTML = `<span class="pill warn"><i data-lucide="clipboard-list" style="width:14px;height:14px"></i>Please answer all questions (${answered}/${QUESTIONS.length}).</span>`;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      // require justifications
      let missing = 0;
      for (let i = 0; i < QUESTIONS.length; i++) {
        const note = (ans[i]?.note || "").trim();
        if (note.length < 15) missing++;
      }
      if (missing > 0) {
        if (resultEl) resultEl.innerHTML = `<span class="pill warn"><i data-lucide="message-square-warning" style="width:14px;height:14px"></i>${missing} question(s) need a longer justification (15+ chars).</span>`;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      const g = grade(ans);
      const passed = g.score >= PASSING_SCORE;

      // Save attempt (local mode)
      const attempts = loadAttempts();
      attempts.unshift({
        name,
        percent: g.percent,
        correct: g.correct,
        total: g.total,
        passed,
        ts: nowISO(),
        // Keep answers for admin review
        answers: ans
      });
      saveAttempts(attempts);

      if (resultEl) {
        resultEl.innerHTML = `
          <div class="card" style="grid-column: span 12">
            <div class="hd">
              <div class="left">
                <div class="iconbox" style="background:${passed ? "rgba(52,211,153,.12)" : "rgba(251,113,133,.12)"};border-color:${passed ? "rgba(52,211,153,.22)" : "rgba(251,113,133,.22)"}">
                  <i data-lucide="${passed ? "badge-check" : "shield-alert"}"></i>
                </div>
                <div>
                  <h3>${passed ? "Passed" : "Not passed"}</h3>
                  <p>${name} • ${g.percent}% (${g.correct}/${g.total})</p>
                </div>
              </div>
              <span class="pill ${passed ? "good" : "bad"}"><i data-lucide="${passed ? "check" : "x"}" style="width:14px;height:14px"></i>${passed ? "Certified" : "Retry required"}</span>
            </div>
            <p class="muted">Attempt saved for admin review (local device).</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      } else {
        alert(`${name}: ${g.percent}% (${g.correct}/${g.total}) — ${passed ? "PASSED" : "FAILED"}`);
      }

      // If admin panel is open, refresh it
      if (window.__VSA_ADMIN_UNLOCKED) renderAdmin();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      localStorage.removeItem(LS_ANSWERS);
      renderExam();
      const resultEl = $("result");
      if (resultEl) resultEl.innerHTML = `<span class="pill"><i data-lucide="rotate-ccw" style="width:14px;height:14px"></i>Answers cleared.</span>`;
      if (window.lucide) window.lucide.createIcons();
    });
  }
}

// ===== admin panel =====
// Uses modal elements that already exist in your certification.html:
// #adminModal, #openAdmin, #closeAdmin, #adminPass, #adminLogin, .tab[data-tab], #adminBody, #adminStatus

function setAdminStatus(text, icon, cls) {
  const el = $("adminStatus");
  if (!el) return;
  el.className = `pill ${cls || ""}`.trim();
  el.innerHTML = `<i data-lucide="${icon}" style="width:14px;height:14px"></i>${text}`;
  if (window.lucide) window.lucide.createIcons();
}

function openAdminModal() {
  const modal = $("adminModal");
  if (!modal) return;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  renderAdmin();
}

function closeAdminModal() {
  const modal = $("adminModal");
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function getActiveTab() {
  const active = document.querySelector(".tab.active");
  return active?.getAttribute("data-tab") || "attempts";
}

function renderAdmin() {
  const body = $("adminBody");
  if (!body) return;

  const unlocked = !!window.__VSA_ADMIN_UNLOCKED;
  const tab = getActiveTab();
  const attempts = loadAttempts();

  if (!unlocked) {
    body.innerHTML = `
      <div class="card" style="grid-column: span 12">
        <div class="hd">
          <div class="left">
            <div class="iconbox"><i data-lucide="lock"></i></div>
            <div>
              <h3>Locked</h3>
              <p>Enter the admin password to view attempts and exam insights.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  if (tab === "attempts") {
    body.innerHTML = `
      <div class="bar">
        <span class="pill"><i data-lucide="database" style="width:14px;height:14px"></i>${attempts.length} attempt(s)</span>
        <button class="btn" id="vsaClear"><i data-lucide="trash-2"></i>Clear Logs</button>
        <button class="btn" id="vsaRefresh"><i data-lucide="refresh-cw"></i>Refresh</button>
      </div>

      <div style="margin-top:12px; overflow:auto; border-radius:16px">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            ${
              attempts.length
                ? attempts
                    .map(
                      (a) => `
              <tr>
                <td style="color:rgba(238,240,255,.90);font-weight:900">${escapeHTML(a.name)}</td>
                <td>${a.percent}% (${a.correct}/${a.total})</td>
                <td>${
                  a.passed
                    ? `<span class="pill good"><i data-lucide="check" style="width:14px;height:14px"></i>Pass</span>`
                    : `<span class="pill bad"><i data-lucide="x" style="width:14px;height:14px"></i>Fail</span>`
                }</td>
                <td>${escapeHTML(fmtTime(a.ts))}</td>
              </tr>
            `
                    )
                    .join("")
                : `<tr><td colspan="4">No attempts saved on this device yet.</td></tr>`
            }
          </tbody>
        </table>
      </div>

      <div class="muted" style="margin-top:10px;font-size:12px">
        Local mode: this shows attempts saved on THIS device only.
        For “everyone in the server”, enable database mode (I’ll set it up for you next).
      </div>
    `;

    body.querySelector("#vsaClear")?.addEventListener("click", () => {
      localStorage.removeItem(LS_ATTEMPTS);
      renderAdmin();
    });
    body.querySelector("#vsaRefresh")?.addEventListener("click", () => renderAdmin());
  }

  if (tab === "questions") {
    body.innerHTML = `
      <div class="card" style="grid-column: span 12">
        <div class="hd">
          <div class="left">
            <div class="iconbox"><i data-lucide="list-checks"></i></div>
            <div>
              <h3>Question Bank</h3>
              <p>${QUESTIONS.length} scenario questions • designed to test real judgment.</p>
            </div>
          </div>
          <span class="pill"><i data-lucide="shield" style="width:14px;height:14px"></i>Hard but clear</span>
        </div>
        <div style="display:grid;gap:10px;margin-top:10px">
          ${QUESTIONS.map((q, i) => `
            <div style="padding:12px;border-radius:16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.10)">
              <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
                <div style="font-weight:900">${i + 1}. ${escapeHTML(q.title)}</div>
                <span class="pill"><i data-lucide="tag" style="width:14px;height:14px"></i>${escapeHTML(q.meta)}</span>
              </div>
              <div class="muted" style="margin-top:6px">${escapeHTML(q.question)}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  if (tab === "export") {
    body.innerHTML = `
      <div class="card" style="grid-column: span 12">
        <div class="hd">
          <div class="left">
            <div class="iconbox"><i data-lucide="download"></i></div>
            <div>
              <h3>Export Attempts (JSON)</h3>
              <p>Copy this if you want to archive logs elsewhere.</p>
            </div>
          </div>
        </div>
        <textarea readonly style="min-height:240px">${JSON.stringify(attempts, null, 2)}</textarea>
      </div>
    `;
  }

  if (window.lucide) window.lucide.createIcons();
}

function attachAdmin() {
  window.__VSA_ADMIN_UNLOCKED = false;

  const openBtn = $("openAdmin");
  const closeBtn = $("closeAdmin");
  const loginBtn = $("adminLogin");
  const passInput = $("adminPass");
  const modal = $("adminModal");

  if (openBtn) openBtn.addEventListener("click", openAdminModal);
  if (closeBtn) closeBtn.addEventListener("click", closeAdminModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeAdminModal();
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const pass = (passInput?.value || "").trim();
      if (pass === ADMIN_PASSWORD) {
        window.__VSA_ADMIN_UNLOCKED = true;
        setAdminStatus("Unlocked", "unlock", "good");
        renderAdmin();
      } else {
        window.__VSA_ADMIN_UNLOCKED = false;
        setAdminStatus("Wrong password", "shield-alert", "bad");
        renderAdmin();
      }
    });
  }

  // tabs
  document.querySelectorAll(".tab").forEach((t) => {
    t.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      renderAdmin();
    });
  });

  // Live refresh (local mode only) every 5 seconds while unlocked + modal open
  setInterval(() => {
    const modalOpen = $("adminModal")?.classList.contains("show");
    if (window.__VSA_ADMIN_UNLOCKED && modalOpen) renderAdmin();
  }, 5000);
}

function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ===== boot =====
document.addEventListener("DOMContentLoaded", () => {
  renderExam();
  attachPrimaryButtons();
  attachAdmin();
  updateProgressUI();
});
