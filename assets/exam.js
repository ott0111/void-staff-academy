const QUESTIONS = [
  {
    title: "Ticket opener discipline",
    meta: "Tone • verification • routing",
    chat: `Ticket: #general-support
User: "yo can u just fix this for me rq"`,
    q: "What is the best first response?",
    opts: [
      "Ask them to explain the issue properly and verify intent.",
      "Tell them to be more formal.",
      "Close the ticket instantly.",
      "Ping leadership."
    ],
    correct: 0
  }
];

const examEl = document.getElementById("exam");

function renderExam() {
  examEl.innerHTML = "";

  QUESTIONS.forEach((q, idx) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <div style="padding:20px;border:1px solid white;margin-top:20px;">
        <h3>${q.title}</h3>
        <pre>${q.chat}</pre>
        <p>${q.q}</p>
        ${q.opts.map((opt,i)=>`
          <div>
            <input type="radio" name="q${idx}" />
            ${opt}
          </div>
        `).join("")}
      </div>
    `;
    examEl.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", renderExam);
