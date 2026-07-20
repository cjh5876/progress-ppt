const slides = Array.from(document.querySelectorAll(".slide"));
const pager = document.getElementById("pager");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let activeIndex = 0;

function syncButtons() {
  prevBtn.disabled = activeIndex === 0;
  nextBtn.disabled = activeIndex === slides.length - 1;
}

function renderPager() {
  pager.innerHTML = "";
  slides.forEach((slide, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = index === activeIndex ? "is-active" : "";
    button.setAttribute("aria-label", slide.dataset.title || `第 ${index + 1} 页`);
    button.addEventListener("click", () => goTo(index));
    pager.appendChild(button);
  });
}

function goTo(index) {
  if (window.innerWidth <= 1100) {
    slides[index].scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  activeIndex = Math.max(0, Math.min(index, slides.length - 1));
  slides.forEach((slide, idx) => {
    slide.classList.toggle("is-active", idx === activeIndex);
  });
  renderPager();
  syncButtons();
}

function step(delta) {
  goTo(activeIndex + delta);
}

prevBtn.addEventListener("click", () => step(-1));
nextBtn.addEventListener("click", () => step(1));

window.addEventListener("keydown", (event) => {
  if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    step(1);
  }
  if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    step(-1);
  }
  if (event.key === "Home") {
    event.preventDefault();
    goTo(0);
  }
  if (event.key === "End") {
    event.preventDefault();
    goTo(slides.length - 1);
  }
});

let touchStartX = null;
window.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

window.addEventListener("touchend", (event) => {
  if (touchStartX === null || window.innerWidth <= 1100) return;
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 60) {
    step(delta < 0 ? 1 : -1);
  }
  touchStartX = null;
}, { passive: true });

goTo(0);
