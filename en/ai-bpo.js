/* Osaka Hoso Co., Ltd. — Business page (AI Accounting BPO) page-specific behavior (EN)
   ※ header / nav / scroll reveal / form is handled by main.js */
(function () {
  'use strict';

  /* ---- FAQ accordion ---- */
  var items = document.querySelectorAll('.faq__item');
  items.forEach(function (item) {
    var q = item.querySelector('.faq__q');
    var a = item.querySelector('.faq__a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? (a.scrollHeight + 'px') : '0px';
    });
  });
  window.addEventListener('resize', function () {
    document.querySelectorAll('.faq__item.open .faq__a').forEach(function (a) {
      a.style.maxHeight = a.scrollHeight + 'px';
    });
  });

  /* ---- Sticky "Free consult" floating button ---- */
  var fab = document.getElementById('callfab');
  var contact = document.getElementById('contact');
  if (fab) {
    function onScroll() {
      var past = window.scrollY > window.innerHeight * 0.7;
      var atContact = false;
      if (contact) {
        var r = contact.getBoundingClientRect();
        atContact = r.top < window.innerHeight && r.bottom > 0;
      }
      fab.classList.toggle('show', past && !atContact);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
