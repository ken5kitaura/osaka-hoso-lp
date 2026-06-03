/* 大阪放送株式会社 — 事業ページ（AI経理BPO）固有の挙動
   ※ヘッダー・ナビ・スクロールリビール・フォームは main.js が担当 */
(function () {
  'use strict';

  /* ---- FAQ アコーディオン ---- */
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

  /* ---- 追従の「無料相談」ボタン ---- */
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
     補助金シミュレーター（仕様：simulator_spec.md 準拠）
     A=システム導入（詳細①） / B=AI研修（詳細②）
     状態保存なし（localStorage等は使わない）
     ============================================================ */
  var yen = function (n) { return '¥' + Math.round(n).toLocaleString('ja-JP'); };
  var num = function (n) { return Math.round(n).toLocaleString('ja-JP'); };

  /* タブ切り替え（将来用：単一パネル運用なら無効） */
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
     ① システム導入（デジタル化・AI導入補助金 通常枠）
     対象経費 = 選択金額（500/800万）
     補助率   = 1/2（最低賃金近傍チェック時 = 2/3）
     補助額   = min(対象経費 × 補助率, 4,500,000)   ※上限450万円
     実質負担 = 対象経費 − 補助額
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
     ② AI研修（人材開発支援助成金 事業展開等リスキリング支援コース）
     単価テーブル（税込・1名）：
       1〜5名   : 対面 400,000 / オンライン 380,000
       6〜10名  : 対面 360,000 / オンライン 340,000
       11名以上 : 要問い合わせ
     研修費   = 単価 × 人数
     経費助成 = 研修費 × 助成率（中小 0.75 / 大企業 0.60）
     賃金助成 = 11 × 1,000 × 人数（中小のみ、大企業は0）
     合計助成 = 経費助成 + 賃金助成
     実質負担 = 研修費 − 合計助成
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

    /* 11名以上：要問い合わせ表示 */
    if (count >= 11) {
      if (s2yen) s2yen.style.visibility = 'hidden';
      document.getElementById('sim2-net').textContent = '要問い合わせ';
      setBreak('sim2-gross', '—');
      setBreak('sim2-grant-exp', '—');
      setBreak('sim2-grant-wage', '—');
      setBreak('sim2-grant-sum', '—');
      setBreak('sim2-per', '—');
      setBreak('sim2-rate', '—');
      return;
    }
    if (s2yen) s2yen.style.visibility = '';

    /* 単価決定 */
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
    document.getElementById('sim2-per').textContent       = yen(perNet) + ' / 人';
    document.getElementById('sim2-rate').textContent      = (Math.round(actualR * 1000) / 10) + '%';
  }
  [s2size, s2mode, s2cnt].forEach(function (el) {
    if (!el) return;
    el.addEventListener('change', calcTraining);
    el.addEventListener('input', calcTraining);
  });
  calcTraining();
})();
