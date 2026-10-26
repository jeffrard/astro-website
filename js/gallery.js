// Photo slider on the home page interior card: arrows, dots, and arrow keys over a scroll-snap strip.
document.querySelectorAll('[data-gallery]').forEach(function (g) {
  var track = g.querySelector('.gallery-track');
  var count = track.children.length;
  var dots = g.querySelectorAll('.gallery-dots span');
  var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var index = 0, settle;
  function mark() { dots.forEach(function (d, i) { d.classList.toggle('on', i === index); }); }
  function go(i) {
    index = (i + count) % count;
    track.scrollTo({ left: index * track.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
    mark();
  }
  g.querySelector('.prev').addEventListener('click', function () { go(index - 1); });
  g.querySelector('.next').addEventListener('click', function () { go(index + 1); });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
  });
  // Swipes: once scrolling stops, sync to whichever photo is showing.
  track.addEventListener('scroll', function () {
    clearTimeout(settle);
    settle = setTimeout(function () { index = Math.round(track.scrollLeft / track.clientWidth); mark(); }, 120);
  }, { passive: true });
  mark();
});
