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

  /* ============================================================
     Subsidy Simulators
     A = system implementation (detail page #1)
     B = AI training (detail page #2)
     No state persistence (no localStorage etc.)
     ============================================================ */
  var yen = function (n) { return '¥' + Math.round(n).toLocaleString('ja-JP'); };
  var num = function (n) { return Math.round(n).toLocaleString('ja-JP'); };

  /* tab switching (forward-compatible for tabbed sim) */
  var tabs = document.querySelectorAll('.sim__tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      document.querySelectorAll('.sim__panel').forEach(function (p) {
        var on = (p.id === tab.dataset.target);
        p.classList.toggle('is-active', on);
        if (on) { p.removeAttribute('hidden'); } else { p.setAttribute('hidden', ''); }
      });
    });
  });

  /* -----------------------------------------------------------
     A: System implementation (Digital / AI Adoption Subsidy)
     eligible cost = selected amount (¥5M / ¥8M)
     subsidy rate  = 1/2 (2/3 if near-minimum-wage employer)
     subsidy amount= min(eligible_cost × rate, ¥4,500,000)  ※cap
     net cost      = eligible_cost − subsidy
     ----------------------------------------------------------- */
  var s1scale   = document.getElementById('sim1-scale');
  var s1lowwage = document.getElementById('sim1-lowwage');
  function calcSystem() {
    if (!s1scale) return;
    var gross = parseInt(s1scale.value, 10) * 10000;
    var rate  = (s1lowwage && s1lowwage.checked) ? (2 / 3) : 0.5;
    var grant = Math.min(gross * rate, 4500000);
    var net   = gross - grant;
    var actualRate = grant / gross;
    document.getElementById('sim1-gross').textContent = yen(gross);
    document.getElementById('sim1-grant').textContent = '− ' + yen(grant);
    document.getElementById('sim1-net').textContent   = num(net);
    document.getElementById('sim1-rate').textContent  = Math.round(actualRate * 1000) / 10 + '%';
  }
  if (s1scale)   s1scale.addEventListener('change', calcSystem);
  if (s1lowwage) s1lowwage.addEventListener('change', calcSystem);
  calcSystem();

  /* -----------------------------------------------------------
     B: AI Training (Human Resources Development Subsidy / Reskilling Course)
     Unit price table (tax incl., per person):
       1–5  attendees: in-person ¥400,000 / online ¥380,000
       6–10 attendees: in-person ¥360,000 / online ¥340,000
       11+  attendees: contact us for a quote
     training cost = unit × count
     expense subsidy = training cost × rate (SME 0.75 / Large 0.60)
     wage subsidy    = 11 × 1,000 × count   (SME only; 0 for large)
     total subsidy   = expense + wage
     net cost        = training cost − total subsidy
     ----------------------------------------------------------- */
  var s2size  = document.getElementById('sim2-size');
  var s2mode  = document.getElementById('sim2-mode');
  var s2cnt   = document.getElementById('sim2-count');
  var s2yen   = document.getElementById('sim2-yen');
  function setBreak(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  function calcTraining() {
    if (!s2size || !s2mode || !s2cnt) return;
    var count = parseInt(s2cnt.value, 10);
    if (isNaN(count) || count < 1) count = 1;
    var mode = s2mode.value;
    var size = s2size.value;

    /* 11+: contact us for a quote */
    if (count >= 11) {
      if (s2yen) s2yen.style.visibility = 'hidden';
      document.getElementById('sim2-net').textContent = 'Contact us for a quote';
      setBreak('sim2-gross', '—');
      setBreak('sim2-grant-exp', '—');
      setBreak('sim2-grant-wage', '—');
      setBreak('sim2-grant-sum', '—');
      setBreak('sim2-per', '—');
      setBreak('sim2-rate', '—');
      return;
    }
    if (s2yen) s2yen.style.visibility = '';

    /* unit price */
    var price;
    if (mode === 'online') price = (count <= 5) ? 380000 : 340000;
    else                   price = (count <= 5) ? 400000 : 360000;

    var total    = price * count;
    var expRate  = (size === 'large') ? 0.60 : 0.75;
    var expGrant = total * expRate;
    var wageGrant= (size === 'sme')   ? 11 * 1000 * count : 0;
    var sumGrant = expGrant + wageGrant;
    var net      = total - sumGrant;
    var perNet   = net / count;
    var actualR  = sumGrant / total;

    document.getElementById('sim2-gross').textContent     = yen(total);
    document.getElementById('sim2-grant-exp').textContent = '− ' + yen(expGrant);
    document.getElementById('sim2-grant-wage').textContent= '− ' + yen(wageGrant);
    document.getElementById('sim2-grant-sum').textContent = '− ' + yen(sumGrant);
    document.getElementById('sim2-net').textContent       = num(net);
    document.getElementById('sim2-per').textContent       = yen(perNet) + ' / person';
    document.getElementById('sim2-rate').textContent      = (Math.round(actualR * 1000) / 10) + '%';
  }
  [s2size, s2mode, s2cnt].forEach(function (el) {
    if (!el) return;
    el.addEventListener('change', calcTraining);
    el.addEventListener('input', calcTraining);
  });
  calcTraining();
})();
