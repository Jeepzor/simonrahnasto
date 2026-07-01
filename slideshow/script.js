const slides = Array.from(document.querySelectorAll(".slide"));
const counter = document.querySelector("#counter");
const progress = document.querySelector("#progress-bar");
const previousButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");

let current = 0;
let currentStep = 0;

function stepItems(slide) {
  const items = Array.from(slide.querySelectorAll("[data-step]"));

  if (!items.some((item) => item.dataset.stepOrder)) {
    return items;
  }

  return items
    .map((item, index) => ({
      item,
      index,
      order: item.dataset.stepOrder ? Number(item.dataset.stepOrder) : index + 1,
    }))
    .sort((a, b) => a.order - b.order || a.index - b.index)
    .map(({ item }) => item);
}

function maxStepFor(slide) {
  return stepItems(slide).length;
}

function applySteps(slide, step) {
  stepItems(slide).forEach((item, index) => {
    const isRevealed = index < step;
    item.classList.toggle("revealed", isRevealed);
    item.setAttribute("aria-hidden", String(!isRevealed));
  });
}

function showSlide(index, step = 0) {
  current = (index + slides.length) % slides.length;
  currentStep = Math.max(0, Math.min(step, maxStepFor(slides[current])));

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === current);
    slide.setAttribute("aria-hidden", String(slideIndex !== current));
    applySteps(slide, slideIndex === current ? currentStep : 0);
  });

  const maxStep = maxStepFor(slides[current]);
  const stepText = maxStep > 0 ? ` · ${currentStep} / ${maxStep}` : "";
  counter.textContent = `${current + 1} / ${slides.length}${stepText}`;
  progress.style.width = `${((current + 1) / slides.length) * 100}%`;
  window.location.hash = `slide-${current + 1}`;
}

function move(delta) {
  if (delta > 0) {
    const maxStep = maxStepFor(slides[current]);
    if (currentStep < maxStep) {
      showSlide(current, currentStep + 1);
      return;
    }

    showSlide(current + 1, 0);
    return;
  }

  if (currentStep > 0) {
    showSlide(current, currentStep - 1);
    return;
  }

  const previousIndex = (current - 1 + slides.length) % slides.length;
  showSlide(previousIndex, maxStepFor(slides[previousIndex]));
}

previousButton.addEventListener("click", () => move(-1));
nextButton.addEventListener("click", () => move(1));

document.querySelector(".deck").addEventListener("click", () => move(1));

document.addEventListener("keydown", (event) => {
  const forwardKeys = ["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"];
  const backwardKeys = ["ArrowLeft", "ArrowUp", "PageUp", "Backspace"];

  if (forwardKeys.includes(event.key)) {
    event.preventDefault();
    move(1);
  }

  if (backwardKeys.includes(event.key)) {
    event.preventDefault();
    move(-1);
  }

  if (event.key === "Home") {
    event.preventDefault();
    showSlide(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    showSlide(slides.length - 1);
  }
});

const hashMatch = window.location.hash.match(/slide-(\d+)/);
const initialSlide = hashMatch ? Number(hashMatch[1]) - 1 : 0;
showSlide(Number.isFinite(initialSlide) ? initialSlide : 0);
