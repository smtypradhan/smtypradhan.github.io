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
let collabCur = 0;
const collabTotal = 3;
function goCollab(n) {
  collabCur = n;
  document.getElementById('collab-track').style.transform = 'translateX(-' + (collabCur * 100) + '%)';
  document.querySelectorAll('#collab-dots .c-dot').forEach((d,i) => d.classList.toggle('active', i === collabCur));
}
function nextCollab() { goCollab((collabCur + 1) % collabTotal); }
function prevCollab() { goCollab((collabCur - 1 + collabTotal) % collabTotal); }
setInterval(nextCollab, 4000);


/* RECOMMENDATIONS HIGHLIGHT */
function highlightRec(n) {
  document.querySelectorAll('.rec-row').forEach((r, i) => {
    r.classList.toggle('active', i === n);
  });
}
// Highlight first on load
document.addEventListener('DOMContentLoaded', () => { highlightRec(0); });