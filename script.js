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

// ─── EASTER EGG: wpisz "carton" gdziekolwiek ──

(function () {
  const SECRET = 'carton';
  let buffer = '';
  let cooldown = false;

  // Overlay element
  const egg = document.createElement('div');
  egg.id = 'easter-egg';
  egg.innerHTML = `
    <img src="src/xd.gif" alt="" />
    <button id="egg-close" aria-label="Zamknij">✕</button>
  `;
  egg.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #000;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `;
  const eggImg = egg.querySelector('img');
  eggImg.style.cssText = `
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  `;
  const eggClose = egg.querySelector('#egg-close');
  eggClose.style.cssText = `
    position: absolute;
    top: 1.25rem;
    right: 1.5rem;
    background: rgba(255,255,255,0.15);
    border: none;
    color: #fff;
    font-size: 1.5rem;
    line-height: 1;
    padding: 0.4rem 0.7rem;
    border-radius: 8px;
    cursor: pointer;
  `;
  document.body.appendChild(egg);

  function showEgg() {
    egg.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function hideEgg() {
    egg.style.display = 'none';
    document.body.style.overflow = '';
    cooldown = true;
    setTimeout(() => { cooldown = false; }, 2000);
  }

  eggClose.addEventListener('click', (e) => {
    e.stopPropagation();
    hideEgg();
  });
  egg.addEventListener('click', hideEgg);

  document.addEventListener('keydown', (e) => {
    // Ignore keypresses inside inputs/textareas
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
    if (cooldown) return;

    buffer += e.key.toLowerCase();
    // Keep only last N chars
    if (buffer.length > SECRET.length) buffer = buffer.slice(-SECRET.length);

    if (buffer === SECRET) {
      buffer = '';
      showEgg();
    }
  });
})();
