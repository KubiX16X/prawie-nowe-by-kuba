(function () {
  var S = window.SKLEP || {};
  var P = window.PRODUKTY || [];
  var grid = document.getElementById("grid");
  var chips = document.getElementById("chips");
  var dlg = document.getElementById("item");
  var current = "Wszystko";
  var openKod = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function zl(n) { return n + " zł"; }
  function igLink() { return "https://ig.me/m/" + encodeURIComponent(S.instagram || ""); }
  function find(kod) { for (var i = 0; i < P.length; i++) if (P[i].kod === kod) return P[i]; return null; }

  // Linki do Instagrama i TikToka w nagłówku i stopce
  document.querySelectorAll("[data-ig]").forEach(function (a) { a.href = "https://www.instagram.com/" + S.instagram + "/"; });
  document.querySelectorAll("[data-tt]").forEach(function (a) { a.href = "https://www.tiktok.com/@" + S.tiktok; });
  document.querySelectorAll("[data-ship]").forEach(function (el) { el.textContent = S.wysylka; });

  // Kategorie
  var cats = ["Wszystko"];
  P.forEach(function (p) { if (cats.indexOf(p.kategoria) < 0) cats.push(p.kategoria); });
  chips.innerHTML = cats.map(function (c) {
    return '<button type="button" class="chip" data-cat="' + esc(c) + '" aria-pressed="' + (c === current) + '">' + esc(c) + "</button>";
  }).join("");
  chips.addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    current = b.getAttribute("data-cat");
    chips.querySelectorAll(".chip").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    render();
  });

  // Siatka: dostępne najpierw, sprzedane na końcu
  function render() {
    var list = P.filter(function (p) { return current === "Wszystko" || p.kategoria === current; });
    list.sort(function (a, b) { return (a.sprzedane ? 1 : 0) - (b.sprzedane ? 1 : 0); });
    grid.innerHTML = list.map(function (p) {
      return '<button type="button" class="card' + (p.sprzedane ? " is-sold" : "") + '" data-kod="' + esc(p.kod) + '">' +
        '<div class="photo"><img src="img/' + esc(p.folder) + '/thumb.jpg" alt="' + esc(p.marka + " " + p.tytul) + '" loading="lazy" width="525" height="700">' +
        '<span class="tag"><span class="size">' + esc(p.rozmiar) + "</span><span>" + esc(p.kod) + "</span></span>" +
        (p.sprzedane ? '<span class="sold-badge">Sprzedane</span>' : "") + "</div>" +
        '<div class="meta"><span class="brandname">' + esc(p.marka) + '</span><span class="title">' + esc(p.tytul) + "</span>" +
        '<span class="row"><span class="cond">' + esc(p.stan) + '</span><span class="price">' + zl(p.cena) + "</span></span></div></button>";
    }).join("");
  }
  grid.addEventListener("click", function (e) {
    var c = e.target.closest(".card"); if (c) open(c.getAttribute("data-kod"));
  });

  // Okno produktu
  function open(kod) {
    var p = find(kod); if (!p) return;
    var imgs = "";
    for (var i = 1; i <= p.zdjecia; i++) {
      imgs += '<img src="img/' + esc(p.folder) + "/" + pad(i) + '.jpg" alt="' + esc(p.marka + " " + p.tytul + ", zdjęcie " + i) + '" loading="' + (i < 3 ? "eager" : "lazy") + '">';
    }
    var msg = "Dzień dobry, chcę zamówić " + p.kod + ": " + p.marka + " " + p.tytul + ", rozmiar " + p.rozmiar + ", " + zl(p.cena) + ".";
    var meas = p.wymiary && p.wymiary.length
      ? '<ul class="measures">' + p.wymiary.map(function (w) { return "<li>" + esc(w[0]) + ": <b>" + esc(w[1]) + "</b></li>"; }).join("") + "</ul>"
      : "zapytaj w wiadomości";
    var order = p.sprzedane
      ? '<p class="hint"><b>Ta rzecz jest już sprzedana.</b> Zobacz inne w katalogu.</p>'
      : '<div class="order">' +
          '<a class="btn" id="ig-order" href="' + igLink() + '" target="_blank" rel="noopener">Zamów przez Instagram</a>' +
          '<p class="toast" id="copied" hidden>Wiadomość skopiowana. Wklej ją na Instagramie.</p>' +
          '<p class="hint">Przycisk kopiuje gotową wiadomość z kodem rzeczy i otwiera czat na Instagramie (@' + esc(S.instagram) + "). Jeśli się nie skopiuje, przepisz ją:</p>" +
          '<div class="msg" id="order-msg">' + esc(msg) + "</div>" +
          '<button type="button" class="btn ghost" id="copy-msg">Kopiuj wiadomość</button>' +
        "</div>";

    dlg.innerHTML =
      '<button type="button" class="close" aria-label="Zamknij">×</button>' +
      '<div class="sheet">' +
        '<div class="gallery"><div class="slides" id="slides">' + imgs + "</div>" +
          '<button type="button" class="arrow prev" aria-label="Poprzednie zdjęcie">‹</button>' +
          '<button type="button" class="arrow next" aria-label="Następne zdjęcie">›</button>' +
          '<span class="counter" id="counter">1 / ' + p.zdjecia + "</span></div>" +
        '<div class="info">' +
          '<div><span class="brandname">' + esc(p.marka) + "</span><h2>" + esc(p.tytul) + "</h2></div>" +
          '<div class="priceline"><span class="price">' + zl(p.cena) + '</span><span class="code">' + esc(p.kod) + "</span></div>" +
          '<p class="lead">' + esc(p.opis) + "</p>" +
          '<dl class="facts">' +
            "<dt>Rozmiar</dt><dd><b>" + esc(p.rozmiar) + "</b> (metka: " + esc(p.rozmiarMetka) + ")</dd>" +
            "<dt>Stan</dt><dd>" + esc(p.stan) + "</dd>" +
            (p.wady ? '<dt>Wady</dt><dd class="warn">' + esc(p.wady) + "</dd>" : "") +
            "<dt>Wymiary</dt><dd>" + meas + "</dd>" +
            "<dt>Materiał</dt><dd>" + esc(p.material) + "</dd>" +
            "<dt>Kolor</dt><dd>" + esc(p.kolor) + "</dd>" +
            "<dt>Wysyłka</dt><dd>" + esc(S.wysylka) + "</dd>" +
          "</dl>" +
          '<p class="hint">Wymiary mierzone na płasko. Brakuje wymiaru? Napisz, zmierzymy.</p>' +
          order +
        "</div>" +
      "</div>";

    var slides = dlg.querySelector("#slides");
    var counter = dlg.querySelector("#counter");
    slides.addEventListener("scroll", function () {
      var i = Math.round(slides.scrollLeft / slides.clientWidth) + 1;
      counter.textContent = i + " / " + p.zdjecia;
    }, { passive: true });
    dlg.querySelector(".prev").onclick = function () { slides.scrollBy({ left: -slides.clientWidth, behavior: "smooth" }); };
    dlg.querySelector(".next").onclick = function () { slides.scrollBy({ left: slides.clientWidth, behavior: "smooth" }); };
    dlg.querySelector(".close").onclick = function () { dlg.close(); };

    function copy() {
      var ok = dlg.querySelector("#copied");
      try {
        navigator.clipboard.writeText(msg).then(function () { if (ok) ok.hidden = false; }, selectMsg);
      } catch (e) { selectMsg(); }
    }
    function selectMsg() {
      var el = dlg.querySelector("#order-msg"); if (!el) return;
      var r = document.createRange(); r.selectNodeContents(el);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    }
    var igBtn = dlg.querySelector("#ig-order"); if (igBtn) igBtn.addEventListener("click", copy);
    var cBtn = dlg.querySelector("#copy-msg"); if (cBtn) cBtn.addEventListener("click", copy);

    openKod = p.kod;
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
    if (location.hash !== "#" + p.kod) location.hash = p.kod;
  }

  dlg.addEventListener("close", function () {
    openKod = null;
    if (!location.hash) return;
    try { history.replaceState(null, "", location.pathname + location.search); }
    catch (e) { location.hash = ""; }
  });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  function fromHash() {
    var k = decodeURIComponent(location.hash.replace("#", ""));
    if (k && find(k)) { if (!(dlg.open && openKod === k)) open(k); }
    else if (!k && dlg.open) dlg.close();
  }
  window.addEventListener("hashchange", fromHash);

  render();
  fromHash();
})();
