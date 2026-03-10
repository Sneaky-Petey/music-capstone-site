// Footer year
document.querySelectorAll("#year").forEach((el) => {
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

  const type = musicType.value; // none / instrumental / lyrical
  const vol = Number(volume.value); // 0-100
  const t = task.value; // reading / writing / math / memorization

  if (volOut) volOut.textContent = vol;

  // Simple interactive model (not a scientific claim)
  let score = 70;

  if (type === "none") score += 5;
  if (type === "instrumental") score += 8;
  if (type === "lyrical") score -= 6;

  const languageHeavy = t === "reading" || t === "writing";
  if (languageHeavy && type === "lyrical") score -= 10;
  if (t === "math" && type === "instrumental") score += 4;
  if (t === "memorization" && type === "none") score += 3;

  if (vol > 65) score -= Math.round((vol - 65) * 0.6);
  if (vol < 25 && type !== "none") score += 2;

  score = Math.max(0, Math.min(100, score));
  scoreOut.textContent = String(score);

  let note = "Balanced choice.";
  if (score >= 85) note = "Likely helpful for focus (based on these settings).";
  if (score <= 60) note = "Higher chance of distraction. Consider changing type or volume.";
  if (languageHeavy && type === "lyrical") note = "Lyrics plus reading/writing can compete for attention.";
  if (type === "none") note = "Silence can be best for deep focus and complex tasks.";
  if (type === "instrumental" && vol <= 55) note = "Instrumental at moderate volume is a common focus combo.";

  noteOut.textContent = note;
}

[musicType, volume, task].forEach((el) => el && el.addEventListener("input", calcScore));
calcScore();

// Real data chart (runs only on Results page with Chart.js loaded)
const focusChartEl = document.getElementById("focusChart");
if (focusChartEl && typeof Chart !== "undefined") {
  let hasRenderedFocusChart = false;

  function renderFocusChart() {
    if (hasRenderedFocusChart) return;
    hasRenderedFocusChart = true;

    const rootStyles = getComputedStyle(document.documentElement);
    const textColor = rootStyles.getPropertyValue("--text").trim() || "#e8eefc";
    const mutedColor = rootStyles.getPropertyValue("--muted").trim() || "#a8b3cf";
    const gridColor = "rgba(255, 255, 255, 0.14)";

    new Chart(focusChartEl, {
      type: "bar",
      data: {
        labels: ["Silence", "Instrumental Music", "Lyrical Music"],
        datasets: [
          {
            label: "Average Focus Score",
            data: [78, 86, 64],
            borderRadius: 8,
            backgroundColor: [
              "rgba(122, 162, 255, 0.75)",
              "rgba(102, 240, 194, 0.75)",
              "rgba(255, 122, 162, 0.75)",
            ],
            borderColor: [
              "rgba(122, 162, 255, 1)",
              "rgba(102, 240, 194, 1)",
              "rgba(255, 122, 162, 1)",
            ],
            borderWidth: 1.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 3600,
          easing: "easeOutQuart",
        },
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: mutedColor },
            grid: { color: gridColor },
          },
          x: {
            ticks: { color: mutedColor },
            grid: { color: "rgba(255, 255, 255, 0.05)" },
          },
        },
      },
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            renderFocusChart();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(focusChartEl);
  } else {
    renderFocusChart();
  }
}

