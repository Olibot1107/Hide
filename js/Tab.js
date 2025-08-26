// JavaScript code extracted from Tab.html

const delayBox = document.getElementById("delay");
const delayText = document.getElementById("delayText");
const overlay = document.getElementById("overlay");
const homeBtn = document.getElementById("homeBtn");
const reloadBtn = document.getElementById("reloadBtn"); // Get the new reload button
const toggleBtn = document.getElementById("toggleBtn");
const themeBtn = document.getElementById("themeBtn");
const moonIcon = document.getElementById("moon");
const sunIcon = document.getElementById("sun");
const sunRays = document.getElementById("sunrays");

const TRIGGER_DELAY = 200;
const TRIGGER_SMOOTH = 6;

let tracking = true;
let darkTheme = true;
let ran = false;
let last = performance.now();
let delayAvg = 0;
let fpsAvg = 60;
let startTime = Date.now();

// Load saved state or default
const saved = localStorage.getItem("delayBoxState");
if (saved) {
  const state = JSON.parse(saved);
  if (state.left !== undefined && state.top !== undefined) {
    delayBox.style.left = state.left + "px";
    delayBox.style.top = state.top + "px";
  }
  if (typeof state.tracking === "boolean") tracking = state.tracking;
  if (typeof state.darkTheme === "boolean") darkTheme = state.darkTheme;
} else {
  delayBox.style.left = "20px";
  delayBox.style.top = "20px";
}

function saveState() {
  localStorage.setItem("delayBoxState", JSON.stringify({
    left: parseInt(delayBox.style.left),
    top: parseInt(delayBox.style.top),
    tracking,
    darkTheme,
  }));
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function updateText(diff, fps) {
  const timeOnline = formatTime(Date.now() - startTime);
  const status = tracking ? "🟢 Active" : "🟠 OFF";
  const delay = (diff / 1000).toFixed(3);
  const fpsText = `FPS: ${fps}\nDelay: ${delay}s\nTime: ${timeOnline}`;
  delayText.textContent = `${status}\n${fpsText}`;
  delayBox.classList.toggle("off", !tracking);
}

function forceRedirect(url) {
  if (ran) return;
  ran = true;
  const meta = document.createElement("meta");
  meta.httpEquiv = "refresh";
  meta.content = "0; url=" + url;
  document.head.appendChild(meta);
}

function sos() {
  overlay.style.display = "block";
}

function loop(now) {
  const diff = now - last;
  const fps = Math.round(1000 / diff);
  fpsAvg = Math.round(fpsAvg * 0.8 + fps * 0.2);
  delayAvg = delayAvg * (1 - 1 / TRIGGER_SMOOTH) + diff * (1 / TRIGGER_SMOOTH);

  updateText(delayAvg, fpsAvg);

  if (tracking && delayAvg > TRIGGER_DELAY) {
    delayText.style.color = "#ff5e5e";
    sos();
    forceRedirect("https://olibot1107.github.io/Hide/");
  } else {
    delayText.style.color = tracking
      ? (darkTheme ? "#00ff9c" : "#006633")
      : "#aaa";
  }

  last = now;
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

// Drag logic with snap to corners
let isDragging = false;
let start = { x: 0, y: 0, boxX: 0, boxY: 0 };

delayBox.addEventListener("mousedown", (e) => {
  if (e.target.tagName === "BUTTON") return;
  isDragging = true;
  start.x = e.clientX;
  start.y = e.clientY;
  start.boxX = parseInt(delayBox.style.left);
  start.boxY = parseInt(delayBox.style.top);
  delayBox.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const dx = e.clientX - start.x;
  const dy = e.clientY - start.y;
  delayBox.style.left = start.boxX + dx + "px";
  delayBox.style.top = start.boxY + dy + "px";
});

document.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  delayBox.style.cursor = "grab";

  // Snap to closest corner
  const margin = 10;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const rect = delayBox.getBoundingClientRect();

  const distances = [
    { x: margin, y: margin, dist: Math.hypot(rect.left - margin, rect.top - margin) },
    { x: vw - rect.width - margin, y: margin, dist: Math.hypot(rect.right - (vw - margin), rect.top - margin) },
    { x: margin, y: vh - rect.height - margin, dist: Math.hypot(rect.left - margin, rect.bottom - (vh - margin)) },
    { x: vw - rect.width - margin, y: vh - rect.height - margin, dist: Math.hypot(rect.right - (vw - margin), rect.bottom - (vh - margin)) },
  ];

  distances.sort((a, b) => a.dist - b.dist);
  const closest = distances[0];

  delayBox.style.left = closest.x + "px";
  delayBox.style.top = closest.y + "px";

  saveState();
});

// Buttons
homeBtn.onclick = () => window.location.href = "https://olibot1107.github.io/Hide/";

// New Reload Button functionality
reloadBtn.onclick = () => location.reload();

toggleBtn.onclick = () => {
  tracking = !tracking;
  saveState();
  updateText(delayAvg, fpsAvg);
};

themeBtn.onclick = () => {
  darkTheme = !darkTheme;
  if (darkTheme) {
    delayBox.classList.remove("light");
    delayBox.classList.add("dark");
    moonIcon.style.display = "";
    sunIcon.style.display = "none";
    sunRays.style.display = "none";
  } else {
    delayBox.classList.remove("dark");
    delayBox.classList.add("light");
    moonIcon.style.display = "none";
    sunIcon.style.display = "";
    sunRays.style.display = "";
  }
  saveState();
};

// Apply initial states
if (darkTheme) {
  delayBox.classList.add("dark");
  moonIcon.style.display = "";
  sunIcon.style.display = "none";
  sunRays.style.display = "none";
} else {
  delayBox.classList.add("light");
  moonIcon.style.display = "none";
  sunIcon.style.display = "";
  sunRays.style.display = "";
}