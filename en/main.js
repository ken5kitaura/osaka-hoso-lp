/* Osaka Hoso Co., Ltd. — interactions (EN)
   Mirrors /main.js with English form messages. */
(function () {
  'use strict';

  /* ---- header: transparent over hero, solid after scroll ---- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('solid');
    else header.classList.remove('solid');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile nav ---- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  function closeNav() {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });

  /* ---- scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- contact form (demo submission) ---- */
  var form = document.getElementById('contactForm');
  var msg = document.getElementById('formMsg');
  if (form) {
    form.addEventListener('submit', function (e) {
      var name = form.querySelector('#f-name');
      var email = form.querySelector('#f-email');
      var message = form.querySelector('#f-msg');
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        e.preventDefault();
        msg.style.color = 'var(--orange)';
        msg.textContent = 'Please fill in the required fields (Name, Email, and Message).';
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        e.preventDefault();
        msg.style.color = 'var(--orange)';
        msg.textContent = 'Please check your email address format.';
        return;
      }
      var action = form.getAttribute('action');
      if (action && action.trim()) {
        msg.style.color = 'var(--gold)';
        msg.textContent = 'Sending…';
        return;
      }
      e.preventDefault();
      msg.style.color = 'var(--gold)';
      msg.textContent = 'Thanks — we received your message. We will get back to you shortly. (Demo: live submission is not yet wired up.)';
      form.reset();
    });
  }
})();
