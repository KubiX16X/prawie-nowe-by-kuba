/* Prawie Nowe by Kuba – logika sklepu. Dane rzeczy są w produkty.js. */
(function () {
  'use strict';

  var S = window.SKLEP || {};
  var P = (window.PRODUKTY || []).slice();
  var IG = 'https://www.instagram.com/' + (S.instagram || '') + '/';
  var IG_DM = 'https://ig.me/m/' + encodeURIComponent(S.instagram || '');
  // WhatsApp otwiera czat z gotową wiadomością – klient klika tylko „Wyślij”
  function waLink(text) { return 'https://wa.me/' + (S.whatsapp || '') + '?text=' + encodeURIComponent(text); }
  var WA_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4.5 19.5l1.1-3.6A8 8 0 1 1 8.4 18.6z"/><path d="M9.2 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .5-.1.6l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.1.4-.2.6-.1l1.4.6c.3.1.4.3.4.5v.5c0 .3 0 .6-.5.8-1.6.8-6.9-2.5-6.9-6.9z" fill="currentColor" stroke="none"/></svg>';
  var TT = 'https://www.tiktok.com/@' + (S.tiktok || '');

  /* ---------- narzędzia ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' zł'; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function byKod(k) { return P.filter(function (p) { return p.kod === k; })[0]; }
  function img(p, n) { return 'img/' + p.folder + '/' + (typeof n === 'string' ? n : pad(n)) + '.jpg'; }
  // Galeria: najpierw zdjęcia wycięte z tła (w01, w02...), potem wszystkie oryginalne
  function photos(p) {
    var list = [], i;
    for (i = 1; i <= (p.wyciete || 0); i++) list.push('w' + pad(i));
    for (i = 1; i <= p.zdjecia; i++) list.push(pad(i));
    return list;
  }
  function num(p) { return parseInt(String(p.kod).replace(/\D/g, ''), 10) || 0; }
  function plural(n, a, b, c) { return n === 1 ? a : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? b : c); }
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }
  var toastT;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 3400);
  }
  function copyText(text, fallbackEl) {
    function select() {
      if (!fallbackEl) return;
      var r = document.createRange(); r.selectNodeContents(fallbackEl);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    }
    try {
      navigator.clipboard.writeText(text).then(function () { toast('Wiadomość skopiowana. Wklej ją na Instagramie.'); }, select);
    } catch (e) { select(); }
  }

  /* ---------- linki stałe ---------- */
  $$('[data-ig]').forEach(function (a) { a.href = IG; });
  $$('[data-tt]').forEach(function (a) { a.href = TT; });
  $$('[data-wa]').forEach(function (a) { a.href = 'https://wa.me/' + S.whatsapp; });
  $$('[data-mail]').forEach(function (a) { a.href = 'mailto:' + S.email; a.textContent = S.email; });
  $('#year').textContent = new Date().getFullYear();

  var available = P.filter(function (p) { return !p.sprzedane; });
  $('#factCount').textContent = available.length;
  var CATS = (window.KATEGORIE || []).slice(), BRANDS = [];
  P.forEach(function (p) {
    if (CATS.indexOf(p.kategoria) < 0) CATS.push(p.kategoria);
    if (BRANDS.indexOf(p.marka) < 0) BRANDS.push(p.marka);
  });
  BRANDS.sort(function (a, b) { return a.localeCompare(b, 'pl'); });
  // Dodatkowa kategoria na początku: wszystkie rzeczy w stanie „Nowy z metką”
  var NOWE = 'Nowe z metką';
  if (CATS.indexOf(NOWE) < 0) CATS.unshift(NOWE);
  function inCat(p, c) { return c === NOWE ? p.stan === 'Nowy z metką' : p.kategoria === c; }

  var state = {
    cat: 'Wszystkie', brand: 'Wszystkie', sort: 'new',
    cart: (store('pn_cart') || []).filter(function (k) { var p = byKod(k); return p && !p.sprzedane; })
  };

  /* ---------- karta ---------- */
  function cardHTML(p, i) {
    var badge = p.sprzedane ? '<span class="badge badge--dark">Sprzedane</span>'
      : (p.stan === 'Nowy z metką' ? '<span class="badge badge--terra">Nowy z metką</span>' : '');
    return '<article class="card' + (p.sprzedane ? ' is-sold' : '') + '" style="animation-delay:' + (i * 60) + 'ms">' +
      '<div class="card__img" data-open="' + esc(p.kod) + '" role="button" tabindex="0" aria-label="Szczegóły: ' + esc(p.marka + ' ' + p.tytul) + '">' +
        badge + '<img src="' + img(p, 'thumb') + '" alt="' + esc(p.marka + ' ' + p.tytul) + '" loading="lazy" width="525" height="700">' +
        '<span class="code">' + esc(p.kod) + '</span><span class="quick">Zobacz szczegóły</span></div>' +
      '<div class="card__info"><span class="card__brand">' + esc(p.marka) + ' · rozm. ' + esc(p.rozmiar) + '</span>' +
        '<span class="card__name" data-open="' + esc(p.kod) + '">' + esc(p.tytul) + '</span>' +
        '<div class="card__meta"><span class="card__price">' + money(p.cena) + '</span><span class="card__cond">' + esc(p.stan) + '</span></div></div>' +
      '</article>';
  }
  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]');
    if (o) openModal(o.getAttribute('data-open'));
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('.card__img[data-open]')) {
      e.preventDefault(); openModal(e.target.closest('.card__img').getAttribute('data-open'));
    }
  });

  /* ---------- strona główna ---------- */
  // Kolejność sklepu: najpierw „Nowy z metką”, potem po kolei według kodu (PN001, PN002, PN003...)
  function isNew(p) { return p.stan === 'Nowy z metką' ? 0 : 1; }
  function newest(list) { return list.slice().sort(function (a, b) { return isNew(a) - isNew(b) || num(a) - num(b); }); }
  function renderHome() {
    $('#newGrid').innerHTML = newest(available).slice(0, 4).map(cardHTML).join('');
    $('#catGrid').style.setProperty('--cats', Math.min(Math.max(CATS.length, 4), 6));
    $('#catGrid').innerHTML = CATS.map(function (c) {
      // kafelek z samym napisem: wieszak z metką, nazwa kategorii kursywą, liczba rzeczy
      var n = P.filter(function (p) { return inCat(p, c) && !p.sprzedane; }).length;
      return '<a class="cat" href="#/kolekcja/kat/' + encodeURIComponent(c) + '"><div class="cat__tile">' +
        '<img class="cat__tag" src="img/brand/wieszak.png" alt="" width="52" height="42">' +
        '<span class="cat__name">' + esc(c) + '</span>' +
        '<small class="cat__count">' + (n ? n + ' ' + plural(n, 'rzecz', 'rzeczy', 'rzeczy') : 'Wkrótce') + '</small></div></a>';
    }).join('');
    // pasek marek – powtórzony, żeby wypełnił szerokość
    var row = '';
    for (var r = 0; r < 4; r++) BRANDS.forEach(function (b) { row += '<span>' + esc(b) + '</span><i></i>'; });
    $('#brandsTrack').innerHTML = '<div class="brands__row">' + row + '</div><div class="brands__row" aria-hidden="true">' + row + '</div>';
  }

  /* ---------- hero: pokaz zdjęć albo film ---------- */
  var REEL = newest(available).slice(0, 5);
  var reel = $('#reel'), stage = $('#stage'), dots = $('#heroDots'), cap = $('#heroCap');
  var REEL_MS = 4800, reelI = -1, reelT = null, reelPaused = false;
  REEL.forEach(function (p, i) {
    var d = document.createElement('div'); d.className = 'slide';
    d.innerHTML = '<img src="' + img(p, 1) + '" alt="' + esc(p.marka + ' ' + p.tytul) + '"' + (i ? ' loading="lazy"' : '') + '>';
    reel.insertBefore(d, $('#heroVideo'));
  });
  dots.innerHTML = REEL.map(function () { return '<i></i>'; }).join('');
  dots.style.setProperty('--dur', REEL_MS + 'ms');
  function showSlide(i) {
    if (!REEL.length) return;
    reelI = (i + REEL.length) % REEL.length;
    $$('.slide', reel).forEach(function (s, k) { s.classList.toggle('on', k === reelI); });
    $$('i', dots).forEach(function (d, k) {
      d.classList.remove('on', 'done'); void d.offsetWidth;
      if (k < reelI) d.classList.add('done'); if (k === reelI) d.classList.add('on');
    });
    var p = REEL[reelI];
    cap.setAttribute('data-open', p.kod);
    cap.innerHTML = '<small>' + esc(p.marka) + ' · ' + esc(p.kod) + '</small><strong>' + esc(p.tytul) + '</strong><em>' + money(p.cena) + ' · rozm. ' + esc(p.rozmiar) + '</em>';
  }
  function reelStart() { clearInterval(reelT); reelT = setInterval(function () { if (!reelPaused && !document.hidden) showSlide(reelI + 1); }, REEL_MS); }
  showSlide(0); reelStart();
  $('#heroPause').addEventListener('click', function (e) {
    reelPaused = !reelPaused;
    e.currentTarget.setAttribute('aria-pressed', reelPaused);
    e.currentTarget.setAttribute('aria-label', reelPaused ? 'Wznów pokaz' : 'Wstrzymaj pokaz');
    stage.classList.toggle('paused', reelPaused);
  });
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { reelPaused = true; stage.classList.add('paused'); }
  var vid = $('#heroVideo');
  if (vid) {
    vid.addEventListener('canplay', function () {
      stage.classList.add('has-video'); clearInterval(reelT);
      var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {});
    });
  }

  /* ---------- kolekcja ---------- */
  function filtered() {
    var list = P.filter(function (p) {
      if (state.cat !== 'Wszystkie' && !inCat(p, state.cat)) return false;
      if (state.brand !== 'Wszystkie' && p.marka !== state.brand) return false;
      return true;
    });
    if (state.sort === 'asc') list.sort(function (a, b) { return a.cena - b.cena; });
    else if (state.sort === 'desc') list.sort(function (a, b) { return b.cena - a.cena; });
    else list = newest(list);
    list.sort(function (a, b) { return (a.sprzedane ? 1 : 0) - (b.sprzedane ? 1 : 0); });
    return list;
  }
  function renderColl() {
    var title = 'Kolekcja', lead = 'Wszystkie rzeczy dostępne w sklepie. Każda w jednym egzemplarzu.', crumb = '';
    if (state.brand !== 'Wszystkie') { title = state.brand; lead = 'Rzeczy marki ' + state.brand + '.'; crumb = title; }
    else if (state.cat === NOWE) { title = NOWE; lead = 'Nowe rzeczy z oryginalną metką sklepową.'; crumb = title; }
    else if (state.cat !== 'Wszystkie') { title = state.cat; lead = 'Rzeczy w kategorii „' + state.cat + '”.'; crumb = title; }
    $('#collTitle').textContent = title; $('#collLead').textContent = lead;
    $('#crumbNow').textContent = crumb; $('#crumbSep').hidden = !crumb;
    $('#chips').innerHTML = ['Wszystkie'].concat(CATS).map(function (c) {
      return '<button class="chip" aria-pressed="' + (c === state.cat) + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
    }).join('');
    $('#brandSel').innerHTML = ['Wszystkie'].concat(BRANDS).map(function (b) {
      return '<option' + (b === state.brand ? ' selected' : '') + '>' + esc(b) + '</option>';
    }).join('');
    $('#sort').value = state.sort;
    var list = filtered(), n = list.filter(function (p) { return !p.sprzedane; }).length;
    $('#resultCount').textContent = n + ' ' + plural(n, 'rzecz dostępna', 'rzeczy dostępne', 'rzeczy dostępnych');
    $('#grid').innerHTML = list.map(cardHTML).join('');
    $('#emptyState').hidden = list.length > 0; $('#grid').hidden = !list.length;
    $('#resultCount').hidden = !list.length;
    if (!list.length) {
      var nowe = state.cat === NOWE;
      $('#emptyTitle').textContent = 'Na razie pusto';
      $('#emptyMsg').textContent = nowe
        ? 'Chwilowo nie mam rzeczy nowych z metką. Nowe dostawy pokazuję najpierw na Instagramie i TikToku.'
        : (state.cat !== 'Wszystkie' ? 'W kategorii „' + state.cat + '” chwilowo nic nie ma. Nowe rzeczy pokazuję najpierw na Instagramie i TikToku.' : 'Spróbuj zmienić filtry.');
    }
  }
  $('#chips').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    state.cat = b.getAttribute('data-cat'); renderColl();
  });
  $('#brandSel').addEventListener('change', function (e) { state.brand = e.target.value; renderColl(); });
  $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; renderColl(); });

  /* ---------- adresy (#/kolekcja, #PN004, #faq) ---------- */
  var first = true;
  function route() {
    var h = location.hash || '#/';
    closeNav();
    var kod = h.slice(1);
    if (/^PN\d+$/i.test(kod) && byKod(kod.toUpperCase())) {
      if (first) showHome();
      openModal(kod.toUpperCase(), true);
      first = false; return;
    }
    closeModal(true);
    if (h.indexOf('#/kolekcja') === 0) {
      var parts = h.split('/'), val = parts.slice(3).join('/');
      try { val = decodeURIComponent(val); } catch (e) {}
      state.cat = 'Wszystkie'; state.brand = 'Wszystkie';
      if (parts[2] === 'kat' && CATS.indexOf(val) > -1) state.cat = val;
      else if (parts[2] === 'marka' && BRANDS.indexOf(val) > -1) state.brand = val;
      $('#homeView').hidden = true; $('#collView').hidden = false;
      renderColl(); window.scrollTo(0, 0);
    } else {
      var wasColl = !$('#collView').hidden;
      showHome();
      var el = h.length > 1 && h.charAt(1) !== '/' ? document.getElementById(h.slice(1)) : null;
      if (el) setTimeout(function () { el.scrollIntoView({ behavior: wasColl ? 'auto' : 'smooth', block: 'start' }); }, 0);
      else if (wasColl || !first) window.scrollTo(0, 0);
    }
    first = false;
  }
  function showHome() { $('#collView').hidden = true; $('#homeView').hidden = false; }
  window.addEventListener('hashchange', route);

  /* ---------- koszyk ---------- */
  function saveCart() { store('pn_cart', state.cart); updateCount(); }
  function updateCount() { var c = $('#cartCount'); c.textContent = state.cart.length; c.hidden = !state.cart.length; }
  function addToCart(kod) {
    var p = byKod(kod); if (!p) return;
    if (p.sprzedane) { toast('Ta rzecz jest już sprzedana'); return; }
    if (state.cart.indexOf(kod) > -1) { toast('Ta rzecz jest już w koszyku'); openDrawer(); return; }
    state.cart.push(kod); saveCart(); closeModal(); openDrawer();
  }
  function removeFromCart(kod) { state.cart = state.cart.filter(function (k) { return k !== kod; }); saveCart(); renderCart(); }
  function orderMessage(list) {
    var sum = 0;
    var lines = list.map(function (p) { sum += p.cena; return p.kod + ': ' + p.marka + ' ' + p.tytul + ', rozm. ' + p.rozmiar + ', ' + p.cena + ' zł'; });
    return 'Dzień dobry, chcę zamówić:\n' + lines.join('\n') + (list.length > 1 ? '\nRazem: ' + sum + ' zł' : '');
  }
  function renderCart() {
    var body = $('#drawerBody'), foot = $('#drawerFoot');
    if (!state.cart.length) {
      body.innerHTML = '<div class="empty"><h4>Koszyk jest pusty</h4><p>Każda rzecz jest w jednym egzemplarzu, więc warto nie zwlekać.</p></div>';
      foot.innerHTML = '<a href="#/kolekcja" class="btn btn--dark btn--full" data-close>Zobacz kolekcję</a>';
      return;
    }
    var list = state.cart.map(byKod), sum = 0;
    body.innerHTML = list.map(function (p) {
      sum += p.cena;
      return '<div class="line"><div class="line__img"><img src="' + img(p, 'thumb') + '" alt=""></div>' +
        '<div><div class="line__brand">' + esc(p.marka) + '</div><div class="line__name">' + esc(p.tytul) + '</div>' +
        '<div class="line__meta">' + esc(p.kod) + ' · rozm. ' + esc(p.rozmiar) + '</div><button class="line__rm" data-rm="' + esc(p.kod) + '">Usuń</button></div>' +
        '<div class="line__price">' + money(p.cena) + '</div></div>';
    }).join('');
    var msg = orderMessage(list);
    foot.innerHTML = '<div class="total"><span>Razem</span><strong>' + money(sum) + '</strong></div>' +
      (S.whatsapp ? '<a class="btn btn--dark btn--full" href="' + esc(waLink(msg)) + '" target="_blank" rel="noopener">' + WA_ICON + 'Zamów przez WhatsApp</a>' +
        '<small>Otworzy się czat z gotową wiadomością z kodami. Wystarczy kliknąć „Wyślij”.</small>' : '') +
      '<a class="btn btn--line btn--full" id="cartOrder" href="' + IG_DM + '" target="_blank" rel="noopener">Zamów przez Instagram</a>' +
      '<small id="cartIgHelp" hidden>Wiadomość jest skopiowana: wklej ją w czacie @' + esc(S.instagram) + '. Jeśli się nie skopiowała, przepisz:</small>' +
      '<div class="msg" id="cartMsg" hidden>' + esc(msg) + '</div>' +
      '<small>Koszt wysyłki podam w odpowiedzi.</small>';
    $('#cartOrder').addEventListener('click', function () { $('#cartIgHelp').hidden = false; $('#cartMsg').hidden = false; copyText(msg, $('#cartMsg')); });
  }
  $('#drawerBody').addEventListener('click', function (e) { var r = e.target.closest('[data-rm]'); if (r) removeFromCart(r.getAttribute('data-rm')); });
  $('#drawerFoot').addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeDrawer(); });

  var overlay = $('#overlay'), drawer = $('#drawer'), modal = $('#modal');
  function openDrawer() { renderCart(); drawer.classList.add('on'); overlay.classList.add('on'); drawer.setAttribute('aria-hidden', 'false'); }
  function closeDrawer() { drawer.classList.remove('on'); if (!modal.classList.contains('on')) overlay.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); }
  $('#cartBtn').addEventListener('click', openDrawer);
  $('#drawerClose').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', function () { closeDrawer(); closeModal(); });

  /* ---------- okno rzeczy ---------- */
  var openKod = null;
  function openModal(kod, fromRoute) {
    var p = byKod(kod); if (!p) return;
    openKod = kod;
    var ph = photos(p), slides = '';
    ph.forEach(function (n, k) { slides += '<img src="' + img(p, n) + '" alt="' + esc(p.marka + ' ' + p.tytul + ', zdjęcie ' + (k + 1)) + '"' + (k > 1 ? ' loading="lazy"' : '') + '>'; });
    var meas = (p.wymiary || []).length
      ? '<ul>' + p.wymiary.map(function (w) { return '<li>' + esc(w[0]) + ': <b>' + esc(w[1]) + '</b></li>'; }).join('') + '</ul>'
      : 'zapytaj w wiadomości';
    var msg = orderMessage([p]);
    $('#modalBox').innerHTML =
      '<button class="x" id="modalClose" aria-label="Zamknij">×</button>' +
      '<div class="gallery"><div class="slides" id="slides">' + slides + '</div>' +
        '<button class="arrow prev" aria-label="Poprzednie zdjęcie">‹</button><button class="arrow next" aria-label="Następne zdjęcie">›</button>' +
        '<span class="gcount" id="gcount">1 / ' + ph.length + '</span></div>' +
      '<div class="modal__body"><span class="card__brand">' + esc(p.marka) + '</span><h3>' + esc(p.tytul) + '</h3>' +
        '<div class="modal__price"><strong>' + money(p.cena) + '</strong><span>KOD ' + esc(p.kod) + '</span></div>' +
        '<p class="modal__lead">' + esc(p.opis) + '</p>' +
        '<dl class="specs">' +
          '<div><dt>Rozmiar</dt><dd><b>' + esc(p.rozmiar) + '</b> (metka: ' + esc(p.rozmiarMetka) + ')</dd></div>' +
          '<div><dt>Stan</dt><dd>' + esc(p.stan) + '</dd></div>' +
          (p.wady ? '<div class="warn"><dt>Wady</dt><dd>' + esc(p.wady) + '</dd></div>' : '') +
          '<div><dt>Wymiary</dt><dd>' + meas + '</dd></div>' +
          '<div><dt>Materiał</dt><dd>' + esc(p.material) + '</dd></div>' +
          '<div><dt>Kolor</dt><dd>' + esc(p.kolor) + '</dd></div>' +
          '<div><dt>Wysyłka</dt><dd>' + esc(S.wysylka) + '</dd></div>' +
        '</dl>' +
        '<div class="modal__cta">' +
          (p.sprzedane
            ? '<button class="btn btn--line btn--full" disabled>Sprzedane</button>'
            : '<button class="btn btn--dark btn--full" data-add="' + esc(p.kod) + '">Dodaj do koszyka</button>' +
              (S.whatsapp ? '<a class="btn btn--line btn--full" href="' + esc(waLink(msg)) + '" target="_blank" rel="noopener">' + WA_ICON + 'Zamów przez WhatsApp</a>' : '') +
              '<a class="btn btn--line btn--full" id="buyNow" href="' + IG_DM + '" target="_blank" rel="noopener">Zamów przez Instagram</a>' +
              '<div class="msg" id="buyMsg" hidden>' + esc(msg) + '</div>') +
        '</div>' +
        '<p class="modal__note">' + (p.wyciete ? 'Zdjęcia 1–' + p.wyciete + ': ta rzecz wycięta z tła. Pozostałe bez obróbki.' : 'Na zdjęciach jest dokładnie ten egzemplarz.') + ' Wymiary na płasko.</p></div>';
    var sl = $('#slides'), gc = $('#gcount');
    sl.addEventListener('scroll', function () { gc.textContent = (Math.round(sl.scrollLeft / sl.clientWidth) + 1) + ' / ' + ph.length; }, { passive: true });
    $('.arrow.prev', modal).onclick = function () { sl.scrollBy({ left: -sl.clientWidth, behavior: 'smooth' }); };
    $('.arrow.next', modal).onclick = function () { sl.scrollBy({ left: sl.clientWidth, behavior: 'smooth' }); };
    var bn = $('#buyNow');
    if (bn) bn.addEventListener('click', function () { var m = $('#buyMsg'); m.hidden = false; copyText(msg, m); });
    modal.classList.add('on'); overlay.classList.add('on'); modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#modalBox').scrollTop = 0;
    var c = $('#modalClose'); if (c) c.focus({ preventScroll: true });
    if (!fromRoute && location.hash !== '#' + kod) { try { history.pushState(null, '', '#' + kod); } catch (e) {} }
  }
  function closeModal(fromRoute) {
    if (!modal.classList.contains('on')) return;
    modal.classList.remove('on'); modal.setAttribute('aria-hidden', 'true');
    if (!drawer.classList.contains('on')) overlay.classList.remove('on');
    document.body.style.overflow = '';
    if (!fromRoute && openKod && location.hash === '#' + openKod) {
      try { history.replaceState(null, '', location.pathname + location.search + (!$('#collView').hidden ? '#/kolekcja' : '')); } catch (e) {}
    }
    openKod = null;
  }
  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.closest('#modalClose')) { closeModal(); return; }
    var a = e.target.closest('[data-add]'); if (a) addToCart(a.getAttribute('data-add'));
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeModal(); closeDrawer(); closeNav(); } });

  /* ---------- menu na telefonie ---------- */
  var burger = $('#burger'), nav = $('#nav');
  function closeNav() { nav.classList.remove('on'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () { var on = nav.classList.toggle('on'); burger.setAttribute('aria-expanded', on); });
  $$('.nav a').forEach(function (a) { a.addEventListener('click', closeNav); });

  renderHome(); updateCount(); route();
})();
