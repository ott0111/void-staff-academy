/**
 * success.js (local-only)
 * Reads the last result from localStorage and renders it on success.html.
 */
(() => {
  "use strict";
  const CFG = window.CONFIG || { STORAGE_KEY: "void_mod_test_v1" };

  function readLast() {
    try {
      const data = JSON.parse(localStorage.getItem(CFG.STORAGE_KEY) || "{}");
      return data.lastResult || null;
    } catch {
      return null;
    }
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const last = readLast();

    const username = last?.username || "Candidate";
    const score = last ? `${last.score}/${last.totalQuestions}` : "0/0";
    const passed = last?.passed === true;
    const date = last?.completedAt ? new Date(last.completedAt).toLocaleString() : new Date().toLocaleString();

    setText("username", username);
    setText("scoreDisplay", score);
    setText("date", date);

    const titleEl = document.getElementById("title");
    const msgEl = document.getElementById("message");
    const iconEl = document.querySelector(".success-icon");
    const scoreEl = document.getElementById("scoreDisplay");

    if (last) {
      if (passed) {
        if (titleEl) titleEl.textContent = "Test Passed!";
        if (msgEl) msgEl.textContent = "Congratulations! You passed. Your result is saved on this device.";
        if (iconEl) iconEl.innerHTML = '<i class="fas fa-trophy"></i>';
        if (iconEl) iconEl.style.color = "#3ba55c";
        if (scoreEl) scoreEl.style.color = "#3ba55c";
      } else {
        if (titleEl) titleEl.textContent = "Test Failed";
        if (msgEl) msgEl.textContent = "You did not pass this time. Review the training material and try again.";
        if (iconEl) iconEl.innerHTML = '<i class="fas fa-times-circle"></i>';
        if (iconEl) iconEl.style.color = "#ed4245";
        if (scoreEl) scoreEl.style.color = "#ed4245";
      }
    } else {
      if (titleEl) titleEl.textContent = "No Saved Result";
      if (msgEl) msgEl.textContent = "No local test result was found on this device yet.";
    }

    // Optional transcript download button if you have #downloadTranscriptBtn
    const dl = document.getElementById("downloadTranscriptBtn");
    if (dl && last?.transcript) {
      dl.style.display = "inline-flex";
      dl.addEventListener("click", () => {
        const blob = new Blob([last.transcript], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Void-Test-Transcript-${username.replace(/\s+/g, "_")}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });
    }
  });
})();
