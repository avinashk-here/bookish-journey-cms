// src/utils/sheetUtils.js
  const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzUCKp4MVJgBzqXWCxh0R9BTHjdXSSgNi0crXGKWO-rBn-2dpAvoZcIApUL3W9s_yusPA/exec";

export async function logSheet(payload) {
  const params = new URLSearchParams(payload);
  await fetch(`${SCRIPT_URL}?action=addItem&${params}`, { method: "POST" });
}