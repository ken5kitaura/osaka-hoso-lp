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

  /* ---- overflow nav (»): brand と nav が干渉した瞬間だけ overflow メニュー化 ----
     - レイアウトは一切変えない（nav の flex/min-width など触らない）
     - brand 右端と nav の最初の項目の左端の距離を測り、安全幅(MIN_GAP)を切ったら
       後ろから順に » メニューへ退避
     - CTA(無料相談) と 言語切替(JP|EN) は常に右端固定
     - 1200px 以下は既存ハンバーガーに任せる
  ---------------------------------------------------------------------------- */
  (function () {
    if (!nav) return;
    var brand = document.querySelector('.brand');
    if (!brand) return;

    var cta  = nav.querySelector('.nav-cta');
    var lang = nav.querySelector('.nav-lang');
    var MIN_GAP = 28; // brand と nav 最左との最低余白(px)

    // More ラッパー作成
    var moreWrap = document.createElement('div');
    moreWrap.className = 'nav__more-wrap';
    moreWrap.hidden = true;
    var moreBtn = document.createElement('button');
    moreBtn.type = 'button';
    moreBtn.className = 'nav__more-btn';
    moreBtn.setAttribute('aria-haspopup', 'true');
    moreBtn.setAttribute('aria-expanded', 'false');
    moreBtn.setAttribute('aria-label', 'More');
    moreBtn.innerHTML = '<span aria-hidden="true">»</span>';
    var moreMenu = document.createElement('div');
    moreMenu.className = 'nav__more-menu';
    moreWrap.appendChild(moreBtn);
    moreWrap.appendChild(moreMenu);
    if (cta) nav.insertBefore(moreWrap, cta);
    else if (lang) nav.insertBefore(moreWrap, lang);
    else nav.appendChild(moreWrap);

    moreBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = moreWrap.classList.toggle('open');
      moreBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!moreWrap.contains(e.target)) {
        moreWrap.classList.remove('open');
        moreBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        moreWrap.classList.remove('open');
        moreBtn.setAttribute('aria-expanded', 'false');
      }
    });

    function returnAllToNav() {
      while (moreMenu.firstChild) {
        nav.insertBefore(moreMenu.firstChild, moreWrap);
      }
    }
    // nav 内の "最初に見える要素" の左端 - brand 右端 を返す（正なら隙間あり）
    function getGap() {
      var brandRect = brand.getBoundingClientRect();
      var first = nav.firstElementChild;
      // moreWrap が最初に来ているケースは隙間 = moreWrap.left - brand.right
      while (first && first.hidden) first = first.nextElementSibling;
      if (!first) return Infinity;
      var firstRect = first.getBoundingClientRect();
      return firstRect.left - brandRect.right;
    }

    function fit() {
      // モバイル幅: ハンバーガーに任せる
      if (window.innerWidth <= 1200) {
        returnAllToNav();
        moreWrap.hidden = true;
        return;
      }
      // まず全部戻す
      returnAllToNav();
      moreWrap.hidden = true;

      // 隙間 OK ならこのまま
      if (getGap() >= MIN_GAP) return;

      // 干渉している: » を出して、後ろから順に退避
      moreWrap.hidden = false;
      var movable = Array.prototype.slice.call(nav.children).filter(function (el) {
        return el !== cta && el !== lang && el !== moreWrap;
      });
      for (var i = movable.length - 1; i >= 0; i--) {
        moreMenu.insertBefore(movable[i], moreMenu.firstChild);
        if (getGap() >= MIN_GAP) break;
      }
      // 全部退避しても駄目な場合は moreWrap が最左に。これ以上は縮められない
      if (moreMenu.children.length === 0) moreWrap.hidden = true;
    }

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(fit, 60);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit);
    }
    window.addEventListener('load', fit);
    fit();
  })();

  /* ---- contact form (fetch → /contact.php) ---- */
  var form = document.getElementById('contactForm');
  var msg = document.getElementById('formMsg');
  if (form) {
    var isEN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
    var T = isEN ? {
      requiredMissing: 'Please fill in the required fields (Name, Email, Message).',
      invalidEmail:    'Please check the email format.',
      sending:         'Sending…',
      success:         'Thank you. We have received your inquiry and will reply within a few business days.',
      networkFail:     'A network error occurred. Please try again, or contact us by phone.',
      serverFail:      'Something went wrong. Please try again later.'
    } : {
      requiredMissing: '必須項目（お名前・メール・お問い合わせ内容）をご入力ください。',
      invalidEmail:    'メールアドレスの形式をご確認ください。',
      sending:         '送信しています…',
      success:         'お問い合わせを受け付けました。数営業日以内に担当よりご返信いたします。',
      networkFail:     '通信エラーが発生しました。再度お試しいただくか、お電話でもご連絡可能です。',
      serverFail:      '送信に失敗しました。時間をおいて再度お試しください。'
    };
    var setMsg = function (color, text) {
      msg.style.color = color;
      msg.textContent = text;
    };
    // 非 AJAX 経路（古いJSキャッシュ時のフォールバック）から戻ってきた場合の表示
    try {
      var qs = new URLSearchParams(location.search);
      if (qs.get('sent') === '1') {
        setMsg('var(--gold)', T.success);
        qs.delete('sent'); qs.delete('err');
        var q = qs.toString();
        history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + '#contact');
      } else if (qs.get('sent') === '0') {
        setMsg('var(--orange)', T.serverFail);
        qs.delete('sent'); qs.delete('err');
        var q2 = qs.toString();
        history.replaceState(null, '', location.pathname + (q2 ? '?' + q2 : '') + '#contact');
      }
    } catch (_) {}

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name    = form.querySelector('#f-name');
      var email   = form.querySelector('#f-email');
      var message = form.querySelector('#f-msg');
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        setMsg('var(--orange)', T.requiredMissing); return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        setMsg('var(--orange)', T.invalidEmail); return;
      }
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; }
      setMsg('var(--gold)', T.sending);

      var fd = new FormData(form);
      fd.append('lang', isEN ? 'en' : 'ja');
      fd.append('source_page', location.pathname + location.search);
      fd.append('data_form', form.dataset.form || '');

      fetch('/contact.php', {
        method: 'POST',
        body: fd,
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }
      })
        .then(function (r) { return r.json().then(function (j) { return { status: r.status, body: j }; }); })
        .then(function (res) {
          if (res.status === 200 && res.body && res.body.ok) {
            setMsg('var(--gold)', T.success);
            form.reset();
          } else {
            setMsg('var(--orange)', T.serverFail);
          }
        })
        .catch(function () {
          setMsg('var(--orange)', T.networkFail);
        })
        .then(function () {
          if (submitBtn) { submitBtn.disabled = false; }
        });
    });
  }
})();
