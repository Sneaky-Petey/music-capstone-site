// Footer year
document.querySelectorAll("#year").forEach(el => {
  el.textContent = new Date().getFullYear();
});

// Results tool (runs only if elements exist)
const musicType = document.getElementById("musicType");
const volume = document.getElementById("volume");
const task = document.getElementById("task");
const scoreOut = document.getElementById("scoreOut");
const noteOut = document.getElementById("noteOut");
const volOut = document.getElementById("volOut");

function calcScore() {
  if (!musicType || !volume || !task || !scoreOut || !noteOut) return;

  const type = musicType.value;       // none / instrumental / lyrical
  const vol = Number(volume.value);   // 0-100
  const t = task.value;               // reading / writing / math / memorization

  if (volOut) volOut.textContent = vol;

  // Simple interactive model (NOT a scientific claim)
  let score = 70;

  if (type === "none") score += 5;
  if (type === "instrumental") score += 8;
  if (type === "lyrical") score -= 6;

  const languageHeavy = (t === "reading" || t === "writing");
  if (languageHeavy && type === "lyrical") score -= 10;
  if (t === "math" && type === "instrumental") score += 4;
  if (t === "memorization" && type === "none") score += 3;

  if (vol > 65) score -= Math.round((vol - 65) * 0.6);
  if (vol < 25 && type !== "none") score += 2;

  score = Math.max(0, Math.min(100, score));
  scoreOut.textContent = score;

  let note = "Balanced choice.";
  if (score >= 85) note = "Likely helpful for focus (based on the settings).";
  if (score <= 60) note = "Higher chance of distraction — consider changing type/volume.";
  if (languageHeavy && type === "lyrical") note = "Lyrics + reading/writing can compete for attention.";
  if (type === "none") note = "Silence can be best for deep focus and complex tasks.";
  if (type === "instrumental" && vol <= 55) note = "Instrumental at moderate volume is a common focus combo.";

  noteOut.textContent = note;
}

[musicType, volume, task].forEach(el => el && el.addEventListener("input", calcScore));
calcScore();
