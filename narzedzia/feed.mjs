// Tworzy strona/feed.json – publiczną listę rzeczy w sprzedaży dla agentów AI (posty, social media).
// Uruchamia się samo (GitHub Actions) po każdej zmianie strona/produkty.js.
import fs from 'node:fs';
import vm from 'node:vm';
import { execSync } from 'node:child_process';

const URL = 'https://prawienowe.pages.dev';
const w = {};
vm.runInNewContext(fs.readFileSync('strona/produkty.js', 'utf8'), { window: w });
const S = w.SKLEP || {}, P = w.PRODUKTY || [];

const pad = n => (n < 10 ? '0' : '') + n;
const num = p => parseInt(String(p.kod).replace(/\D/g, ''), 10) || 0;
const promo = p => p.cenaPrzed > p.cena;
// Ta sama kolejność co w sklepie: najpierw „Nowy z metką”, potem według kodu
const order = (a, b) => (a.stan === 'Nowy z metką' ? 0 : 1) - (b.stan === 'Nowy z metką' ? 0 : 1) || num(a) - num(b);

let updated = null;
try { updated = execSync('git log -1 --format=%cI -- strona/produkty.js').toString().trim() || null; } catch (e) {}

const feed = {
  sklep: {
    nazwa: 'Prawie Nowe by Kuba',
    strona: URL + '/',
    instagram: S.instagram ? 'https://www.instagram.com/' + S.instagram + '/' : null,
    tiktok: S.tiktok ? 'https://www.tiktok.com/@' + S.tiktok : null,
    telefon_i_whatsapp: S.whatsapp ? '+48 ' + String(S.whatsapp).slice(-9).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') : null,
    whatsapp: S.whatsapp ? 'https://wa.me/' + S.whatsapp : null,
    email: S.email || null,
    wysylka: S.wysylka || null,
    miasto: 'Jelenia Góra',
  },
  zaktualizowano: updated,
  zasady_dla_agenta: [
    'Lista zawiera tylko rzeczy dostępne teraz. Rzeczy spoza listy są sprzedane – nie promuj ich.',
    'Używaj tylko zdjęć z pola zdjecia (prawdziwe zdjęcia tego egzemplarza). Nie generuj ani nie podmieniaj zdjęć produktu.',
    'Cena, rozmiar, stan, skład i wady tylko z tego pliku. Wady opisuj uczciwie, niczego nie dopisuj.',
    'Przy rabacie: cena_przed_obnizka to najniższa cena z 30 dni przed obniżką – można ją pokazać jako przekreśloną.',
    'Zawsze podawaj kod rzeczy (np. PN004) – po nim klienci zamawiają.',
    'Link do konkretnej rzeczy: pole link.',
  ],
  kody_rzeczy: [],
  liczba_rzeczy: 0,
  produkty: P.filter(p => !p.sprzedane).sort(order).map(p => {
    const zdj = [];
    for (let i = 1; i <= (p.zdjecia || 0); i++) zdj.push(`${URL}/img/${p.folder}/${pad(i)}.jpg`);
    return {
      kod: p.kod,
      marka: p.marka,
      tytul: p.tytul,
      kategoria: p.kategoria,
      rozmiar: p.rozmiar,
      rozmiar_na_metce: p.rozmiarMetka || null,
      stan: p.stan,
      cena: p.cena,
      cena_przed_obnizka: promo(p) ? p.cenaPrzed : null,
      rabat_procent: promo(p) ? Math.round((1 - p.cena / p.cenaPrzed) * 100) : null,
      waluta: 'PLN',
      opis: p.opis || null,
      wady: p.wady || null,
      wymiary_na_plasko: (p.wymiary || []).map(([nazwa, wartosc]) => ({ nazwa, wartosc })),
      material: p.material || null,
      kolor: p.kolor || null,
      link: `${URL}/#${p.kod}`,
      zdjecie_glowne: zdj[0] || null,
      miniatura: `${URL}/img/${p.folder}/thumb.jpg`,
      zdjecia: zdj,
    };
  }),
};
feed.liczba_rzeczy = feed.produkty.length;
feed.kody_rzeczy = feed.produkty.map(p => p.kod);
fs.writeFileSync('strona/feed.json', JSON.stringify(feed, null, 2) + '\n');
console.log('feed.json:', feed.liczba_rzeczy, 'rzeczy');
