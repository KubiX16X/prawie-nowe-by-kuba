# Strona sklepu „Prawie Nowe by Kuba"

Statyczna strona-katalog w folderze `strona/`, hostowana na Cloudflare Pages
(gałąź produkcyjna: `sklep`, katalog wyjściowy: `strona`, bez komendy budowania).
Każdy push na gałąź `sklep` publikuje stronę automatycznie.

- Rzeczy, ceny i statusy: `strona/produkty.js` (sprzedane: `sprzedane: true`).
- Zdjęcia: `strona/img/pN/` – `01.jpg` przód, kolejne numery, `thumb.jpg` miniatura (max 1400 px, bez EXIF/GPS).
- Zamówienia przez Instagram @prawienowebykuba (przycisk kopiuje wiadomość z kodem PNxxx).
- Regulamin i polityka prywatności: `strona/regulamin.html`, `strona/prywatnosc.html`.
- Przy każdej rzeczy w `produkty.js` komentarz „DO SPRAWDZENIA” = dane niepotwierdzone, nie pokazywać ich na stronie jako pewnych.
