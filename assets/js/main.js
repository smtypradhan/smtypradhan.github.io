/* CURSOR */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = -100, my = -100, rx = -100, ry = -100;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animCursor() {
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

const hoverEls = 'a, button, .project-card, .org-card, .c-dot, .ftab';
document.querySelectorAll(hoverEls).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* PROJECT FILTER */
function filterProjects(cat, btn) {
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? 'flex' : 'none';
  });
}

/* CAROUSEL */


/* COLLAB CAROUSEL */
const collabTrack = document.getElementById('collab-track');
const collabSlides = collabTrack ? [...collabTrack.querySelectorAll('.collab-slide')] : [];
const collabTotal = collabSlides.length;
const collabDotsEl = document.getElementById('collab-dots');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let collabCur = 0;
let collabTimer = null;

// One dot per slide, built from the markup so dots and slides can never disagree.
if (collabDotsEl) {
  collabDotsEl.innerHTML = collabSlides.map((_, i) =>
    `<button type="button" class="c-dot${i === 0 ? ' active' : ''}" aria-label="Show logo ${i + 1} of ${collabTotal}"></button>`
  ).join('');
  collabDotsEl.querySelectorAll('.c-dot').forEach((d, i) => {
    d.addEventListener('click', () => goCollab(i));
    d.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    d.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// Slides are stacked; the active one fades and drifts in while the previous one
// fades and drifts out in the direction of travel. No rewind when looping.
function goCollab(n, dir) {
  if (!collabTotal) return;
  const prev = collabCur;
  collabCur = (n + collabTotal) % collabTotal;
  collabTrack.dataset.dir = dir || (n < prev ? 'prev' : 'next');
  collabSlides.forEach((s, i) => {
    s.classList.toggle('is-active', i === collabCur);
    s.classList.toggle('is-leaving', i === prev && prev !== collabCur);
    s.setAttribute('aria-hidden', i === collabCur ? 'false' : 'true');
  });
  if (collabDotsEl) collabDotsEl.querySelectorAll('.c-dot').forEach((d, i) => {
    d.classList.toggle('active', i === collabCur);
    d.setAttribute('aria-current', i === collabCur ? 'true' : 'false');
  });
  restartCollabTimer(); // a manual move gets a full 3.5 s before the next auto-advance
}
function nextCollab() { goCollab(collabCur + 1, 'next'); }
function prevCollab() { goCollab(collabCur - 1, 'prev'); }

function stopCollabTimer() { clearInterval(collabTimer); collabTimer = null; }
function restartCollabTimer() {
  stopCollabTimer();
  if (!reduceMotion && collabTotal > 1) collabTimer = setInterval(nextCollab, 3500);
}

if (collabTotal) {
  // Pause while the visitor is hovering or using the keyboard inside the carousel.
  const wrap = collabTrack.closest('.collab-carousel-wrap');
  wrap.addEventListener('mouseenter', stopCollabTimer);
  wrap.addEventListener('mouseleave', restartCollabTimer);
  wrap.addEventListener('focusin', stopCollabTimer);
  wrap.addEventListener('focusout', restartCollabTimer);

  // Swipe left/right on touch screens.
  let touchX = null;
  collabTrack.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; stopCollabTimer(); }, { passive: true });
  collabTrack.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 40) (dx < 0 ? nextCollab : prevCollab)(); else restartCollabTimer();
  });

  goCollab(0, 'next');
}


/* RECOMMENDATIONS HIGHLIGHT */
function highlightRec(n) {
  document.querySelectorAll('.rec-row').forEach((r, i) => {
    r.classList.toggle('active', i === n);
  });
}
// Highlight first on load
document.addEventListener('DOMContentLoaded', () => { highlightRec(0); });