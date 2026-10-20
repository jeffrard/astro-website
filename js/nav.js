// Header: Services dropdown and mobile menu
(function () {
  var ddBtn = document.querySelector('.dd-btn');
  var dd = document.getElementById('svc-menu');
  var mBtn = document.querySelector('.menu-btn');
  var mm = document.getElementById('mobile-menu');

  function setDD(open) {
    if (!ddBtn) return;
    ddBtn.setAttribute('aria-expanded', open);
    dd.hidden = !open;
  }
  function setMM(open) {
    if (!mBtn) return;
    mBtn.setAttribute('aria-expanded', open);
    mBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mm.hidden = !open;
  }

  if (ddBtn) {
    ddBtn.addEventListener('click', function (e) { e.stopPropagation(); setDD(dd.hidden); });
    dd.addEventListener('click', function (e) { if (e.target.closest('a')) setDD(false); });
    document.addEventListener('click', function (e) { if (!dd.hidden && !dd.contains(e.target)) setDD(false); });
    ddBtn.parentNode.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !this.contains(e.relatedTarget)) setDD(false);
    });
  }
  if (mBtn) {
    mBtn.addEventListener('click', function () { setMM(mm.hidden); });
    mm.addEventListener('click', function (e) { if (e.target.closest('a')) setMM(false); });
    var wide = window.matchMedia('(min-width: 681px)');
    var onWide = function (e) { if (e.matches) setMM(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide); else wide.addListener(onWide);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (dd && !dd.hidden) { setDD(false); ddBtn.focus(); }
    if (mm && !mm.hidden) { setMM(false); mBtn.focus(); }
  });
})();
