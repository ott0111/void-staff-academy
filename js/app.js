/**
 * Void Training - Clean Local-Only Test System
 * - No Discord OAuth
 * - No backend
 * - Saves results locally (localStorage)
 *
 * Works with BOTH:
 * - Desktop Discord-style UI (elements like #testPage, #discordMessages, #discordMessageInput, #discordSendBtn, #discordScore, #discordProgress, #discordTicketCounter, #discordModal ...)
 * - Mobile Discord-style UI (elements like #mobileDiscord, #mobileMessagesContainer, #mobileMessageInput, #mobileSendBtn, #mobileScore, #mobileProgress, #mobileQuestionCounter, #mobileTestComplete ...)
 *
 * If some elements don't exist in your HTML, the app will gracefully fall back.
 */
(() => {
  "use strict";

  const CFG = window.CONFIG || { TOTAL_QUESTIONS: 8, PASSING_SCORE: 6, STORAGE_KEY: "void_mod_test_v1" };
  const QUESTIONS = Array.isArray(window.TEST_QUESTIONS) ? window.TEST_QUESTIONS.slice() : [];

  // ---------- Storage ----------
  const store = {
    key: CFG.STORAGE_KEY,
    read() {
      try { return JSON.parse(localStorage.getItem(this.key) || "{}"); } catch { return {}; }
    },
    write(obj) {
      localStorage.setItem(this.key, JSON.stringify(obj));
    },
    saveLastResult(result) {
      const data = this.read();
      data.lastResult = result;
      data.lastResultAt = new Date().toISOString();
      this.write(data);
    }
  };

  // ---------- Helpers ----------
  const $ = (sel) => document.querySelector(sel);
  const byId = (id) => document.getElementById(id);

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalize(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }

  function countKeywordMatches(userText, keywords) {
    const text = normalize(userText);
    if (!text) return { matchCount: 0, matched: [] };
    const matched = [];
    for (const k of (keywords || [])) {
      const key = normalize(k);
      if (!key) continue;
      // keyword can be phrase; just do includes on normalized
      if (text.includes(key)) matched.push(k);
    }
    // Unique
    const uniq = Array.from(new Set(matched));
    return { matchCount: uniq.length, matched: uniq };
  }

  function formatTranscript(result) {
    const sep = "══════════════════════════════════════════════════════════════════════════════";
    const total = result.totalQuestions;
    const passFail = result.passed ? "PASSED ✓" : "FAILED ✗";
    let log = "";
    log += sep + "\n";
    log += "VOID ESPORTS MODERATOR CERTIFICATION TEST - COMPLETE TRANSCRIPT\n";
    log += sep + "\n";
    log += `Candidate: ${result.username}\n`;
    log += `Date: ${new Date(result.completedAt).toLocaleString()}\n`;
    log += `Final Score: ${result.score}/${total}\n`;
    log += `Result: ${passFail}\n`;
    log += sep + "\n\n";
    result.questions.forEach((qa, idx) => {
      log += `┌──────────────────────────────────────────────────────────────────────────┐\n`;
      log += `│ QUESTION ${idx + 1} of ${total}${qa.correct ? " ✓ PASS" : " ✗ FAIL"}\n`;
      log += `├──────────────────────────────────────────────────────────────────────────┤\n`;
      log += `│ USER: ${qa.prompt}\n`;
      log += `├──────────────────────────────────────────────────────────────────────────┤\n`;
      log += `│ MOD RESPONSE:\n`;
      log += `│ ${qa.answer || "No answer provided"}\n`;
      log += `├──────────────────────────────────────────────────────────────────────────┤\n`;
      log += `│ EVALUATION:\n`;
      log += `│ Matches: ${qa.matchCount}/${qa.requiredMatches}\n`;
      log += `│ Keywords: ${(qa.matchedKeywords || []).join(", ") || "None"}\n`;
      log += `├──────────────────────────────────────────────────────────────────────────┤\n`;
      log += `│ CORRECT RESPONSE:\n`;
      log += `│ ${qa.feedback}\n`;
      log += `└──────────────────────────────────────────────────────────────────────────┘\n\n`;
    });
    log += sep + "\n";
    log += `END OF TRANSCRIPT - ${result.score}/${total} CORRECT\n`;
    log += sep + "\n";
    return log;
  }

  // ---------- UI Adapters ----------
  function makeDesktopUI() {
    const ui = {
      mode: "desktop",
      // Containers
      testPage: byId("testPage") || $(".test-page"),
      mainContainer: byId("mainContainer"),
      // Chat
      messages: byId("discordMessages"),
      input: byId("discordMessageInput"),
      sendBtn: byId("discordSendBtn"),
      typing: byId("discordTyping"),
      typingText: byId("discordTypingText"),
      // Score
      score: byId("discordScore"),
      progress: byId("discordProgress"),
      ticketCounter: byId("discordTicketCounter"),
      // User display
      userName: byId("discordUserName"),
      userTag: byId("discordUserTag"),
      userAvatar: byId("discordUserAvatar"),
      memberName: byId("discordMemberName"),
      // Modal
      modal: byId("discordModal"),
      modalIcon: byId("discordModalIcon"),
      modalTitle: byId("discordModalTitle"),
      modalScore: byId("discordModalScore"),
      modalMessage: byId("discordModalMessage"),
      modalStatus: byId("discordModalStatus"),
      reviewBtn: byId("discordReviewBtn"),
      backBtn: byId("discordBackBtn"),
    };

    ui.exists = () => !!(ui.messages && ui.input && ui.sendBtn);

    ui.show = () => {
      if (ui.testPage) {
        ui.testPage.style.display = "block";
        ui.testPage.classList.add("active");
      }
      if (ui.mainContainer) ui.mainContainer.style.display = "none";
    };

    ui.hide = () => {
      if (ui.testPage) {
        ui.testPage.style.display = "none";
        ui.testPage.classList.remove("active");
      }
      if (ui.mainContainer) ui.mainContainer.style.display = "block";
    };

    ui.clearMessages = () => { if (ui.messages) ui.messages.innerHTML = ""; };

    ui.addMessage = (author, content, color, isBot = false) => {
      if (!ui.messages) return;
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

      const avatarInitial = (author === "Void Bot")
        ? "V"
        : (author === "You" ? (state.user.username.charAt(0).toUpperCase() || "U") : (author.charAt(0).toUpperCase() || "U"));

      const group = document.createElement("div");
      group.className = "discord-message-group";
      group.innerHTML = `
        <div class="discord-message-avatar" style="background-color:${escapeHtml(color || "#5865f2")}">
          ${escapeHtml(avatarInitial)}
        </div>
        <div class="discord-message-content">
          <div class="discord-message-header">
            <span class="discord-message-author" style="color:${escapeHtml(color || "#ffffff")}">${escapeHtml(author)}</span>
            ${isBot ? '<span class="discord-bot-tag">BOT</span>' : ""}
            <span class="discord-message-timestamp">Today at ${escapeHtml(timeString)}</span>
          </div>
          <div class="discord-message-text">${escapeHtml(content)}</div>
        </div>
      `;
      ui.messages.appendChild(group);
      ui.messages.scrollTop = ui.messages.scrollHeight;
    };

    ui.showTyping = async (author, durationMs) => {
      if (!ui.typing || !ui.typingText) return;
      ui.typingText.textContent = `${author} is typing...`;
      ui.typing.style.display = "flex";
      await new Promise(r => setTimeout(r, durationMs));
      ui.typing.style.display = "none";
    };

    ui.disableInput = (disabled) => {
      if (ui.input) ui.input.disabled = !!disabled;
      if (ui.sendBtn) ui.sendBtn.disabled = !!disabled || !ui.input?.value?.trim();
      if (!disabled && ui.input) setTimeout(() => ui.input.focus(), 50);
    };

    ui.clearInput = () => {
      if (!ui.input) return;
      ui.input.value = "";
      ui.input.style.height = "auto";
      if (ui.sendBtn) ui.sendBtn.disabled = true;
    };

    ui.updateUser = () => {
      if (ui.userName) ui.userName.textContent = state.user.username;
      if (ui.userTag) ui.userTag.textContent = "#0000"; // keep UI vibe, but not a real ID
      if (ui.userAvatar) ui.userAvatar.textContent = (state.user.username.charAt(0).toUpperCase() || "U");
      if (ui.memberName) ui.memberName.textContent = state.user.username;
    };

    ui.updateScore = () => {
      const total = state.questions.length || 1;
      if (ui.score) ui.score.textContent = String(state.score);
      if (ui.progress) ui.progress.style.width = `${Math.round((state.score / total) * 100)}%`;
      if (ui.ticketCounter) ui.ticketCounter.textContent = `Ticket #${state.index + 1} of ${total}`;
    };

    ui.showModal = (passed) => {
      if (!ui.modal) return;
      const total = state.questions.length || 1;
      ui.modal.classList.add("active");
      if (ui.modalIcon) {
        ui.modalIcon.className = `discord-modal-icon ${passed ? "pass" : "fail"}`;
        ui.modalIcon.innerHTML = passed ? '<i class="fas fa-trophy"></i>' : '<i class="fas fa-times-circle"></i>';
      }
      if (ui.modalTitle) ui.modalTitle.textContent = passed ? "Test Passed!" : "Test Failed";
      if (ui.modalScore) ui.modalScore.textContent = `${state.score}/${total}`;
      if (ui.modalMessage) {
        ui.modalMessage.textContent = passed
          ? "Congratulations! You passed. Your results are saved on this device."
          : "You did not pass this time. Review training and try again.";
      }
      if (ui.modalStatus) ui.modalStatus.textContent = "Saved locally ✓";
    };

    ui.hideModal = () => { if (ui.modal) ui.modal.classList.remove("active"); };

    // Desktop listeners
    ui.bind = () => {
      if (ui.input) {
        ui.input.addEventListener("input", () => {
          ui.input.style.height = "auto";
          ui.input.style.height = Math.min(ui.input.scrollHeight, 144) + "px";
          if (ui.sendBtn) ui.sendBtn.disabled = !ui.input.value.trim() || !state.active;
        });
        ui.input.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (state.active) actions.send();
          }
        });
      }
      if (ui.sendBtn) ui.sendBtn.addEventListener("click", () => actions.send());
      if (ui.reviewBtn) ui.reviewBtn.addEventListener("click", () => { ui.hideModal(); actions.restart(); });
      if (ui.backBtn) ui.backBtn.addEventListener("click", () => { ui.hideModal(); actions.exit(); });
    };

    return ui;
  }

  function makeMobileUI() {
    const ui = {
      mode: "mobile",
      container: byId("mobileDiscord"),
      mainContainer: byId("mainContainer"),
      messages: byId("mobileMessagesContainer"),
      input: byId("mobileMessageInput"),
      sendBtn: byId("mobileSendBtn"),
      typing: byId("mobileTyping"),
      typingText: byId("mobileTypingText"),
      score: byId("mobileScore"),
      progress: byId("mobileProgress"),
      questionCounter: byId("mobileQuestionCounter"),
      channelName: byId("mobileChannelName"),
      sidebarUsername: byId("mobileSidebarUsername"),
      modal: byId("mobileTestComplete"),
      modalIcon: byId("mobileResultIcon"),
      modalTitle: byId("mobileResultTitle"),
      modalScore: byId("mobileResultScore"),
      modalMessage: byId("mobileResultMessage"),
      modalStatus: byId("mobileSubmissionStatus"),
      reviewBtn: byId("mobileReviewBtn"),
      backBtn: byId("mobileBackBtn"),
    };

    ui.exists = () => !!(ui.container && ui.messages && ui.input && ui.sendBtn);

    ui.show = () => {
      if (ui.container) ui.container.classList.add("active");
      if (ui.mainContainer) ui.mainContainer.style.display = "none";
    };

    ui.hide = () => {
      if (ui.container) ui.container.classList.remove("active");
      if (ui.mainContainer) ui.mainContainer.style.display = "block";
    };

    ui.clearMessages = () => { if (ui.messages) ui.messages.innerHTML = ""; };

    ui.addMessage = (author, content, color, isBot = false) => {
      if (!ui.messages) return;
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      let avatarInitial = author.charAt(0).toUpperCase();
      if (author === "Void Bot") avatarInitial = "V";
      if (author === "You") avatarInitial = (state.user.username.charAt(0).toUpperCase() || "U");

      const group = document.createElement("div");
      group.className = "mobile-message-group";
      group.innerHTML = `
        <div class="mobile-message-avatar" style="background-color:${escapeHtml(color || "#5865f2")}">
          ${escapeHtml(avatarInitial)}
        </div>
        <div class="mobile-message-content">
          <div class="mobile-message-header">
            <span class="mobile-message-author">${escapeHtml(author)}</span>
            ${isBot ? '<span class="mobile-bot-tag">BOT</span>' : ""}
            <span class="mobile-message-timestamp">Today at ${escapeHtml(timeString)}</span>
          </div>
          <div class="mobile-message-text">${escapeHtml(content)}</div>
        </div>
      `;
      ui.messages.appendChild(group);
      ui.messages.scrollTop = ui.messages.scrollHeight;
    };

    ui.showTyping = async (author, durationMs) => {
      if (!ui.typing || !ui.typingText) return;
      ui.typingText.textContent = `${author} is typing...`;
      ui.typing.style.display = "flex";
      await new Promise(r => setTimeout(r, durationMs));
      ui.typing.style.display = "none";
    };

    ui.disableInput = (disabled) => {
      if (ui.input) ui.input.disabled = !!disabled;
      if (ui.sendBtn) ui.sendBtn.disabled = !!disabled || !ui.input?.value?.trim();
      if (!disabled && ui.input) setTimeout(() => ui.input.focus(), 50);
    };

    ui.clearInput = () => {
      if (!ui.input) return;
      ui.input.value = "";
      ui.input.style.height = "auto";
      if (ui.sendBtn) ui.sendBtn.disabled = true;
    };

    ui.updateUser = () => {
      if (ui.sidebarUsername) ui.sidebarUsername.textContent = state.user.username;
    };

    ui.updateScore = () => {
      const total = state.questions.length || 1;
      if (ui.score) ui.score.textContent = String(state.score);
      if (ui.progress) ui.progress.style.width = `${Math.round((state.score / total) * 100)}%`;
      if (ui.questionCounter) ui.questionCounter.textContent = `Question ${state.index + 1} of ${total}`;
      if (ui.channelName) ui.channelName.textContent = `🎫・mod-tickets • Q${state.index + 1}/${total}`;
    };

    ui.showModal = (passed) => {
      if (!ui.modal) return;
      ui.modal.classList.add("active");
      const total = state.questions.length || 1;

      if (ui.modalIcon) {
        ui.modalIcon.className = `mobile-test-result-icon ${passed ? "pass" : "fail"}`;
        ui.modalIcon.innerHTML = passed ? '<i class="fas fa-trophy"></i>' : '<i class="fas fa-times-circle"></i>';
      }
      if (ui.modalTitle) ui.modalTitle.textContent = passed ? "Test Passed!" : "Test Failed";
      if (ui.modalScore) ui.modalScore.textContent = `${state.score}/${total}`;
      if (ui.modalMessage) ui.modalMessage.textContent = passed
        ? "Congratulations! Your results are saved on this device."
        : "You did not pass this time. Review training and try again.";
      if (ui.modalStatus) ui.modalStatus.textContent = "Saved locally ✓";
    };

    ui.hideModal = () => { if (ui.modal) ui.modal.classList.remove("active"); };

    ui.bind = () => {
      if (ui.input) {
        ui.input.addEventListener("input", () => {
          ui.input.style.height = "auto";
          ui.input.style.height = Math.min(ui.input.scrollHeight, 120) + "px";
          if (ui.sendBtn) ui.sendBtn.disabled = !ui.input.value.trim() || !state.active;
        });
        ui.input.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (state.active) actions.send();
          }
        });
      }
      if (ui.sendBtn) ui.sendBtn.addEventListener("click", () => actions.send());
      if (ui.reviewBtn) ui.reviewBtn.addEventListener("click", () => { ui.hideModal(); actions.restart(); });
      if (ui.backBtn) ui.backBtn.addEventListener("click", () => { ui.hideModal(); actions.exit(); });
    };

    return ui;
  }

  // ---------- App State ----------
  const state = {
    active: false,
    index: 0,
    score: 0,
    questions: QUESTIONS.slice(0, CFG.TOTAL_QUESTIONS),
    questionsWithAnswers: [],
    startedAt: null,
    user: { username: "Candidate" },
  };

  // ---------- Actions ----------
  let ui = null;

  const actions = {
    start() {
      // Choose UI
      const isMobile = window.innerWidth <= 768;
      const mobileUI = makeMobileUI();
      const desktopUI = makeDesktopUI();
      ui = (isMobile && mobileUI.exists()) ? mobileUI : (desktopUI.exists() ? desktopUI : (mobileUI.exists() ? mobileUI : null));

      if (!ui) {
        console.error("No compatible UI elements found. Check your HTML ids.");
        alert("UI missing: your HTML doesn't have the expected test elements.");
        return;
      }

      // Reset
      state.active = true;
      state.index = 0;
      state.score = 0;
      state.questionsWithAnswers = [];
      state.startedAt = new Date().toISOString();

      ui.bind();
      ui.show();
      ui.clearMessages();
      ui.updateUser();
      ui.updateScore();
      ui.disableInput(true);

      (async () => {
        await ui.showTyping("Void Bot", 700);
        ui.addMessage("Void Bot", "Welcome to the Void Esports Moderator Certification Test.", "#5865f2", true);

        await ui.showTyping("Void Bot", 650);
        ui.addMessage("Void Bot", `You'll be presented with ${state.questions.length} scenario${state.questions.length === 1 ? "" : "s"}.`, "#5865f2", true);

        await ui.showTyping("Void Bot", 650);
        ui.addMessage("Void Bot", "Respond as you would as a real moderator. Good luck!", "#5865f2", true);

        await new Promise(r => setTimeout(r, 500));
        actions.showNext();
      })();
    },

    showNext() {
      if (!ui) return;

      const total = state.questions.length || 0;
      if (state.index >= total) {
        actions.finish();
        return;
      }

      const q = state.questions[state.index];
      ui.disableInput(true);

      (async () => {
        await ui.showTyping(q.username, 900);
        ui.addMessage(q.username, q.message, q.avatarColor || "#5865f2", false);
        ui.disableInput(false);
        ui.updateScore();
      })();
    },

    send() {
      if (!ui || !state.active) return;
      const inputEl = ui.input;
      if (!inputEl) return;
      const msg = (inputEl.value || "").trim();
      if (!msg) return;

      // Show user's message
      ui.addMessage("You", msg, "#7289da", false);
      ui.clearInput();
      ui.disableInput(true);

      const q = state.questions[state.index];
      const { matchCount, matched } = countKeywordMatches(msg, q.keywords);
      const required = Number(q.required || 2);
      const correct = matchCount >= required;

      if (correct) state.score += 1;

      state.questionsWithAnswers.push({
        prompt: q.message,
        answer: msg,
        correct,
        matchCount,
        requiredMatches: required,
        matchedKeywords: matched,
        feedback: q.feedback || "Follow protocol"
      });

      (async () => {
        await ui.showTyping("Void Bot", 700);
        ui.addMessage(
          "Void Bot",
          correct ? "✅ Good response. Moving to the next scenario." : `⚠️ Not quite. Key points: ${q.feedback || "Follow protocol"}`,
          "#5865f2",
          true
        );

        state.index += 1;
        ui.updateScore();

        await new Promise(r => setTimeout(r, 450));
        actions.showNext();
      })();
    },

    finish() {
      if (!ui) return;

      state.active = false;
      ui.disableInput(true);

      const total = state.questions.length || 1;
      const passed = state.score >= CFG.PASSING_SCORE;

      const result = {
        username: state.user.username,
        score: state.score,
        totalQuestions: total,
        passed,
        completedAt: new Date().toISOString(),
        questions: state.questionsWithAnswers
      };

      result.transcript = formatTranscript(result);
      store.saveLastResult(result);

      // Modal + also push to success.html (optional)
      ui.showModal(passed);

      // If your design expects redirect, you can uncomment:
      // window.location.href = `success.html`;
    },

    restart() {
      // Start again
      actions.start();
    },

    exit() {
      // Leave test UI back to training page
      state.active = false;
      if (ui) ui.hide();
    },

    setUsernameFromInput() {
      const input = byId("candidateName") || byId("usernameInput");
      const name = (input?.value || "").trim();
      state.user.username = name || "Candidate";
    }
  };

  // ---------- Wire up main buttons ----------
  function bindStartButtons() {
    // Optional: if you have a name field, we read it before starting
    const takeBtn = byId("takeTestBtn");
    if (takeBtn) {
      takeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        actions.setUsernameFromInput();
        actions.start();
      });
    }

    // If you have a separate start button in quiz area
    const startBtn = byId("startTestBtn");
    if (startBtn) {
      startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        actions.setUsernameFromInput();
        actions.start();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Make sure questions exist
    if (!Array.isArray(QUESTIONS) || QUESTIONS.length === 0) {
      console.warn("No questions found: window.TEST_QUESTIONS is empty.");
    }
    bindStartButtons();
  });

  // Expose for debugging if needed
  window.VoidLocalTest = { actions, store };
})();
