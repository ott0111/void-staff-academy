// ===== VOID STAFF ACADEMY EXAM SYSTEM =====

const ADMIN_PASSWORD = "STAFFACCESS";
const PASSING_SCORE = 0.70;

const QUESTIONS = [
  {
    title: "Ticket Handling – Verification",
    chat: `Ticket: #general-support
User: "yo can u just fix this rq"

No context provided.`,
    question: "What is the BEST first response?",
    options: [
      "Ask them to clearly explain the issue and verify intent before proceeding.",
      "Tell them to speak properly.",
      "Close the ticket.",
      "Ping leadership immediately."
    ],
    correct: 0
  },
  {
    title: "Roster – Missing Proof",
    chat: `Ticket: #roster
User: "I want pro roster"

No PR link.
No earnings proof.`,
    question: "What is the correct action?",
    options: [
      "Approve temporarily.",
      "Request full proof before routing or approving.",
      "Deny without explanation.",
      "Ignore the ticket."
    ],
    correct: 1
  }
];

let answers = {};

function renderExam() {
  const container = document.getElementById("exam");
  container.innerHTML = "";

  QUESTIONS.forEach((q, index) => {
    const div = document.createElement("div");
    div.style.marginTop = "25px";
    div.style.padding = "20px";
    div.style.border = "1px solid rgba(255,255,255,0.1)";
    div.style.borderRadius = "16px";
    div.style.background = "rgba(255,255,255,0.05)";

    div.innerHTML = `
      <h3>${index + 1}. ${q.title}</h3>
      <pre style="background:rgba(0,0,0,0.4);padding:10px;border-radius:8px;">${q.chat}</pre>
      <p style="margin-top:10px;font-weight:600;">${q.question}</p>
      ${q.options.map((opt, i) => `
        <div style="margin-top:8px;">
          <input type="radio" name="q${index}" value="${i}" />
          ${opt}
        </div>
      `).join("")}
    `;

    container.appendChild(div);
  });

  updateProgress();
}

function updateProgress() {
  const progress = document.getElementById("progressText");
  const answered = Object.keys(answers).length;
  progress.textContent = `${answered} / ${QUESTIONS.length} answered`;
}

function setupListeners() {
  document.addEventListener("change", (e) => {
    if (e.target.type === "radio") {
      const name = e.target.name;
      const qIndex = name.replace("q", "");
      answers[qIndex] = parseInt(e.target.value);
      updateProgress();
    }
  });

  document.getElementById("submitExam").addEventListener("click", () => {
    let correct = 0;
    QUESTIONS.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });

    const score = correct / QUESTIONS.length;
    const passed = score >= PASSING_SCORE;

    alert(`Score: ${Math.round(score * 100)}%\n${passed ? "PASSED" : "FAILED"}`);
  });

  document.getElementById("resetExam").addEventListener("click", () => {
    answers = {};
    renderExam();
  });

  document.getElementById("openAdmin").addEventListener("click", () => {
    const pass = prompt("Enter Admin Password:");
    if (pass === ADMIN_PASSWORD) {
      alert("Admin Access Granted");
    } else {
      alert("Incorrect Password");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderExam();
  setupListeners();
});
