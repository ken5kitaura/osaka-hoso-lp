/* 大阪放送株式会社 — interactions
   控えめで上品な挙動のみ（派手な動き禁止） */
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

  /* ---- scroll reveal (ふわっと現れる) ---- */
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

  /* ---- contact form (デモ送信) ---- */
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
        msg.textContent = '必須項目（お名前・メール・お問い合わせ内容）をご入力ください。';
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        e.preventDefault();
        msg.style.color = 'var(--orange)';
        msg.textContent = 'メールアドレスの形式をご確認ください。';
        return;
      }
      // 送信先 action が設定されていれば実送信（宛先はフォームサービス側で設定）。
      // 未設定（プレビュー/デザイン段階）はデモ表示にとどめる。
      var action = form.getAttribute('action');
      if (action && action.trim()) {
        msg.style.color = 'var(--gold)';
        msg.textContent = '送信しています…';
        return; // ネイティブ送信を継続
      }
      e.preventDefault();
      msg.style.color = 'var(--gold)';
      msg.textContent = 'お問い合わせを受け付けました。担当より折り返しご連絡いたします。（※デモ表示：実送信は未接続）';
      form.reset();
    });
  }
})();
