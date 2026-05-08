/* ═══════════════════════════════════════════
   CARTON — Landing Page Script
   1. Intro sequence controller
   2. IntersectionObserver scroll reveals
═══════════════════════════════════════════ */

// ─── INTRO SEQUENCE ───────────────────────

const intro        = document.getElementById('intro');
const main         = document.getElementById('main');

const stageClosed  = document.getElementById('stage-closed');
const stageNoTape  = document.getElementById('stage-notape');
const stageOpen    = document.getElementById('stage-open');
const stageLogo    = document.getElementById('stage-logo');

const btnOpen      = document.getElementById('btn-open');
const btnEnter     = document.getElementById('btn-enter');

// Switch helper: hides current stage, shows next after optional delay
function switchStage(from, to, delay = 0) {
  setTimeout(() => {
    from.classList.add('hidden');
    to.classList.remove('hidden');
    // re-trigger animations by forcing reflow
    void to.offsetWidth;
  }, delay);
}

btnOpen.addEventListener('click', () => {
  // Disable button immediately
  btnOpen.disabled = true;

  // 1 → show box without tape
  switchStage(stageClosed, stageNoTape, 0);

  // 2 → show open box with floating items
  switchStage(stageNoTape, stageOpen, 1200);

  // 3 → show logo lockup
  switchStage(stageOpen, stageLogo, 2800);
});

btnEnter.addEventListener('click', () => {
  // Reveal main page immediately underneath
  main.classList.add('visible');
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Slide intro up and off screen
  intro.classList.add('slide-up');

  // After animation completes, fully hide and kick off scroll observer
  setTimeout(() => {
    intro.classList.add('gone');
    observeRevealElements();
  }, 800);
});

// ─── SCROLL REVEAL ────────────────────────

function observeRevealElements() {
  const targets = document.querySelectorAll('.reveal, .reveal-section, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');

        // Stagger children of reveal-section
        if (entry.target.classList.contains('reveal-section')) {
          const children = entry.target.querySelectorAll('.problem-card');
          children.forEach((child, i) => {
            child.style.transitionDelay = `${(i + 1) * 0.12}s`;
            child.classList.add('in');
          });
        }
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  targets.forEach(el => observer.observe(el));
}

// Also handle reveals if user somehow skips intro
if (getComputedStyle(main).visibility !== 'hidden') {
  observeRevealElements();
}