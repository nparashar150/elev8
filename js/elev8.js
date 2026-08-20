const preload = document.querySelector(".preload");
const nav = document.querySelector(".nav");
const stage = document.querySelector(".el-stage");
const poses = [...document.querySelectorAll(".el-pose")];
const poseLabel = document.querySelector(".el-pose-label");
const pin = document.querySelector(".elevate-pin");
const track = document.querySelector(".elevate-track");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function finishPreload() {
  preload?.classList.add("is-done");
}

if (reduceMotion || new URLSearchParams(location.search).has("shot")) {
  document.documentElement.style.scrollBehavior = "auto";
  finishPreload();
} else {
  window.setTimeout(finishPreload, 1750);
}

function setPose(index) {
  poses.forEach((pose, i) => pose.classList.toggle("is-active", i === index));
  if (poseLabel && poses[index]) poseLabel.textContent = poses[index].dataset.pose;
}

let cycling = false;
function startPoseCycle() {
  if (cycling || !poses.length || reduceMotion) return;
  cycling = true;
  let index = 0;
  window.setInterval(() => {
    index = (index + 1) % poses.length;
    setPose(index);
  }, 2400);
}

if (stage && "IntersectionObserver" in window) {
  const intro = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      stage.classList.add("is-in");
      startPoseCycle();
      intro.disconnect();
    });
  }, { threshold: 0.4 });
  intro.observe(stage);
} else {
  stage?.classList.add("is-in");
  startPoseCycle();
}

function layoutPin() {
  if (!pin || !track) return;
  const chapters = [...track.querySelectorAll(".chapter")];
  const width = window.innerWidth;
  chapters.forEach((chapter) => {
    chapter.style.width = `${width}px`;
    chapter.style.minWidth = `${width}px`;
  });
  if (window.matchMedia("(max-width: 900px)").matches) {
    pin.style.height = "auto";
    track.style.transform = "none";
    return;
  }
  const extra = Math.max(width * Math.max(chapters.length - 1, 0), 0);
  pin.style.height = `${window.innerHeight + extra}px`;
}

function updatePin() {
  if (!pin || !track || window.matchMedia("(max-width: 900px)").matches) return;
  const chapters = track.querySelectorAll(".chapter").length;
  const extra = Math.max(window.innerWidth * Math.max(chapters - 1, 0), 0);
  const rect = pin.getBoundingClientRect();
  const progress = extra ? Math.min(Math.max(-rect.top / extra, 0), 1) : 0;
  track.style.transform = `translate3d(${-progress * extra}px, 0, 0)`;
}

layoutPin();
updatePin();
window.addEventListener("load", () => {
  layoutPin();
  updatePin();
});
window.addEventListener("resize", () => {
  layoutPin();
  updatePin();
});
window.addEventListener("scroll", () => {
  updatePin();
  updateNav();
}, { passive: true });

function updateNav() {
  const overDark = [...document.querySelectorAll(".chapter:not(.ink), .close")].some((zone) => {
    const rect = zone.getBoundingClientRect();
    return rect.top < 72 && rect.bottom > 72;
  });
  document.body.classList.toggle("on-dark", overDark);
}

updateNav();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("draw-in");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll("[data-draw]").forEach((node) => observer.observe(node));
