const preload = document.querySelector(".preload");
const nav = document.querySelector(".nav");
const tiles = document.querySelectorAll(".tile");
const compare = document.querySelector(".compare");
const compareRange = document.querySelector(".compare-range");
const viewport = document.querySelector(".el-viewport");
const poses = [...document.querySelectorAll(".el-pose")];
const poseLabel = document.querySelector(".el-pose-label");

function finishPreload() {
  preload?.classList.add("is-done");
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  finishPreload();
} else {
  window.setTimeout(finishPreload, 1650);
}

window.addEventListener("scroll", () => {
  nav?.classList.toggle("is-scrolled", window.scrollY > 8);
}, { passive: true });

function setPose(index) {
  poses.forEach((pose, i) => pose.classList.toggle("is-active", i === index));
  if (poseLabel && poses[index]) {
    poseLabel.textContent = poses[index].dataset.pose;
  }
}

let cycling = false;

function startPoseCycle() {
  if (cycling || !poses.length || reduceMotion) return;
  cycling = true;
  window.setTimeout(() => {
    let index = 0;
    window.setInterval(() => {
      index = (index + 1) % poses.length;
      setPose(index);
    }, 2400);
  }, 1200);
}

if (viewport && "IntersectionObserver" in window) {
  const intro = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      viewport.classList.add("is-in");
      startPoseCycle();
      intro.disconnect();
    });
  }, { threshold: 0.45 });
  intro.observe(viewport);
} else {
  viewport?.classList.add("is-in");
  startPoseCycle();
}

tiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    tile.classList.toggle("is-open");
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
