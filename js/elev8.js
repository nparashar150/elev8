const preload = document.querySelector(".preload");
const nav = document.querySelector(".nav");
const elFigure = document.getElementById("el-live");
const poseButtons = document.querySelectorAll("[data-pose]");
const tiles = document.querySelectorAll(".tile");
const compare = document.querySelector(".compare");
const compareRange = document.querySelector(".compare-range");

const poses = {
  Neutral: "assets/el-neutral.svg",
  Waiting: "assets/el-waiting.svg",
  Thinking: "assets/el-thinking.svg",
  Celebrating: "assets/el-thumbs.svg",
};

function finishPreload() {
  preload?.classList.add("is-done");
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  finishPreload();
} else {
  window.setTimeout(finishPreload, 1650);
}

window.addEventListener("scroll", () => {
  nav?.classList.toggle("is-scrolled", window.scrollY > 8);
}, { passive: true });

async function showPose(pose) {
  if (!elFigure || !poses[pose]) return;
  elFigure.alt = `El in ${pose.toLowerCase()} pose`;
  const response = await fetch(poses[pose]);
  const markup = await response.text();
  const wrapper = elFigure.parentElement;
  const existing = wrapper.querySelector("svg.el-live-svg");
  existing?.remove();
  const slot = document.createElement("div");
  slot.innerHTML = markup.trim();
  const svg = slot.querySelector("svg");
  if (svg) {
    svg.classList.add("el-live-svg");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", elFigure.alt);
    elFigure.hidden = true;
    wrapper.appendChild(svg);
  } else {
    elFigure.hidden = false;
    elFigure.src = poses[pose];
  }
}

poseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const pose = button.dataset.pose;
    poseButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    showPose(pose);
  });
});

tiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    const alreadyOpen = tile.classList.contains("is-open");
    if (alreadyOpen) {
      tile.classList.remove("is-open");
      return;
    }
    tile.classList.add("is-open");
  });
});

function updateCompare(value) {
  if (!compare) return;
  const percent = Number(value);
  const newCol = compare.querySelector(".compare-new");
  const handle = compare.querySelector(".compare-handle");
  if (newCol) newCol.style.clipPath = `inset(0 0 0 ${percent}%)`;
  if (handle) handle.style.left = `${percent}%`;
}

if (compareRange) {
  updateCompare(compareRange.value || 50);
  compareRange.addEventListener("input", (event) => updateCompare(event.target.value));
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("draw-in");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll("[data-draw]").forEach((node) => observer.observe(node));
