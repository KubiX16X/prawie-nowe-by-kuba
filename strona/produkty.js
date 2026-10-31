/* ================================================================
   PRAWIE NOWE BY KUBA – dane sklepu
   To jedyny plik, który zmieniasz przy dodawaniu i sprzedawaniu rzeczy.

   Sprzedane:  zmień  sprzedane: false  na  sprzedane: true
   Nowa rzecz: skopiuj cały blok { ... } jednej rzeczy, nadaj kolejny kod
               (PN006, PN007...), zdjęcia wrzuć do img/p6/
               (01.jpg = przód, kolejne numery, thumb.jpg = miniatura,
               w01.jpg, w02.jpg = przód i tył wycięte z tła)
   ================================================================ */

window.SKLEP = {
  instagram: "prawienowebykuba",          // nazwa konta na Instagramie (bez @)
  tiktok: "prawienowebykuba",
  email: "prawienowebykuba@gmail.com",
  wysylka: "Wysyłka w 1–2 dni robocze od zaksięgowania wpłaty, starannie zapakowane.",
};

/* Zdjęcia kategorii na stronie głównej – darmowe zdjęcia z Pexels (licencja Pexels, bez wymogu podpisu).
   Nowa kategoria bez wpisu tutaj pokaże zdjęcie pierwszej rzeczy z tej kategorii. */
window.KATEGORIE = {
  "Nowe z metką": { zdjecie: "https://images.pexels.com/photos/3812433/pexels-photo-3812433.jpeg?auto=compress&cs=tinysrgb&w=700", zrodlo: "https://www.pexels.com/photo/clothes-on-hangers-hanging-on-clothing-racks-3812433/" },
  "Swetry": { zdjecie: "https://images.pexels.com/photos/5464589/pexels-photo-5464589.jpeg?auto=compress&cs=tinysrgb&w=700", zrodlo: "https://www.pexels.com/photo/folded-knitted-sweaters-5464589/" },
  "Bluzy": { zdjecie: "https://images.pexels.com/photos/9594679/pexels-photo-9594679.jpeg?auto=compress&cs=tinysrgb&w=700", zrodlo: "https://www.pexels.com/photo/hoodie-sweaters-hanged-on-a-clothes-rack-9594679/" },
  "Marynarki": { zdjecie: "https://images.pexels.com/photos/7778886/pexels-photo-7778886.jpeg?auto=compress&cs=tinysrgb&w=700", zrodlo: "https://www.pexels.com/photo/striped-blazer-on-a-clothes-rack-7778886/" },
  "Kurtki": { zdjecie: "https://images.pexels.com/photos/6045058/pexels-photo-6045058.jpeg?auto=compress&cs=tinysrgb&w=700", zrodlo: "https://www.pexels.com/photo/black-coat-hanging-on-silver-rack-6045058/" },
  "Kamizelki": { zdjecie: "https://images.pexels.com/photos/16170/pexels-photo-16170.jpeg?auto=compress&cs=tinysrgb&w=700", zrodlo: "https://www.pexels.com/photo/assorted-color-bubble-jackets-hanged-16170/" },
};

window.PRODUKTY = [
  {
    kod: "PN001",
    kategoria: "Swetry",
    marka: "Zara",
    tytul: "Sweter z golfem, wełniany, beżowy",
    rozmiar: "M",
    rozmiarMetka: "EUR M / USA M / MEX 40",
    stan: "Nowy z metką",
    cena: 170,
    sprzedane: false,
    opis: "Gruba, miękka dzianina z wełną, szeroki golf i rękawy typu raglan. Ciepły solo albo pod płaszcz. Cena z metki sklepowej: 199 zł.",
    wady: null,
    wymiary: [
      ["Długość (z golfem)", "77 cm"],
      ["Rękaw (raglan, od golfu)", "64 cm"],
    ],
    material: "72% wełna, 28% poliamid",
    kolor: "beżowy",
    wyciete: 2,     // zdjęcia w01.jpg, w02.jpg = rzecz wycięta z tła (pokazywane jako pierwsze)
    zdjecia: 7,
    folder: "p1",
    // DO SPRAWDZENIA: brak szerokości pod pachami; ciemniejsze miejsce pod golfem na plecach – światło czy plamka?
  },
  {
    kod: "PN002",
    kategoria: "Bluzy",
    marka: "Zara",
    tytul: "Bluza rozpinana z kapturem, asymetryczna, czarna",
    rozmiar: "S",
    rozmiarMetka: "EUR S / USA S",
    stan: "Dobry",
    cena: 59,
    sprzedane: false,
    opis: "Asymetryczny krój: ukośny zamek, wstawki z innej dzianiny, surowe krawędzie, boczny zamek przy dole i mały haft na piersi. Wyrazisty streetwear.",
    wady: "Strzępienie przy lewym mankiecie, wystrzępione miejsce przy dolnej części zamka i przetarte krawędzie kieszeni. Surowe krawędzie to element projektu.",
    wymiary: [
      ["Pod pachami", "ok. 49 cm"],
      ["Rękaw", "ok. 54 cm"],
    ],
    material: "Tkanina główna: 46% bawełna, 46% poliester, 8% wiskoza. Tkanina dodatkowa: 100% bawełna.",
    kolor: "czarny",
    wyciete: 2,     // zdjęcia w01.jpg, w02.jpg = rzecz wycięta z tła (pokazywane jako pierwsze)
    zdjecia: 9,
    folder: "p2",
    // DO SPRAWDZENIA: długość (brak pewnego pomiaru), miejsce pomiaru szerokości i rękawa
  },
  {
    kod: "PN003",
    kategoria: "Marynarki",
    marka: "Reserved",
    tytul: "Marynarka slim fit z dzianiny, niebieska",
    rozmiar: "M",
    rozmiarMetka: "M, slim fit",
    stan: "Bardzo dobry",
    cena: 79,
    sprzedane: false,
    opis: "Dwuguzikowa marynarka z miękkiej, teksturowanej dzianiny w niebieskim melanżu. Kieszeń na piersi i dwie boczne, guziki przy mankietach z czerwoną nitką. Elegancka, a wygodna: do jeansów, chinosów i koszuli.",
    wady: null,
    wymiary: [
      ["Długość (od kołnierza)", "ok. 75 cm"],
    ],
    material: "84% poliester, 16% bawełna. Podszewka: 100% poliester.",
    kolor: "niebieski melanż",
    wyciete: 2,     // zdjęcia w01.jpg, w02.jpg = rzecz wycięta z tła (pokazywane jako pierwsze)
    zdjecia: 10,
    folder: "p3",
    // DO SPRAWDZENIA: szerokość pod pachami, rękaw, ramiona; ciemniejsze miejsce na plecach, kropka na rękawie, plamka na podszewce
  },
  {
    kod: "PN004",
    kategoria: "Kurtki",
    marka: "Adidas",
    tytul: "Kurtka Cold.RDY z kapturem, ocieplana, czarna",
    rozmiar: "M",
    rozmiarMetka: "UK M / US M / EU M",
    stan: "Dobry",
    cena: 120,
    sprzedane: false,
    opis: "Elastyczna kurtka z linii Cold.RDY, rozpinana na całej długości, z kapturem. W środku polar w korpusie i kapturze. Kieszenie na zamek z odblaskowymi detalami, ściągacze z napisem COLD.RDY.",
    wady: "Drobne jasne smugi na przodzie (zdjęcie 9) i lekko zbity polar przy mankiecie (zdjęcie 7).",
    wymiary: [
      ["Pod pachami", "ok. 52 cm"],
      ["Długość (od kołnierza)", "ok. 70 cm"],
      ["Rękaw", "ok. 65 cm"],
    ],
    material: "Materiał główny: 92% poliester z recyklingu, 8% elastan.",
    kolor: "czarny",
    wyciete: 2,     // zdjęcia w01.jpg, w02.jpg = rzecz wycięta z tła (pokazywane jako pierwsze)
    zdjecia: 8,
    folder: "p4",
    // DO SPRAWDZENIA: skład podszewki; czy smugi schodzą w praniu (wtedy stan: Bardzo dobry)
  },
  {
    kod: "PN005",
    kategoria: "Kamizelki",
    marka: "Zara",
    tytul: "Bezrękawnik pikowany z odpinanym kapturem, czarny",
    rozmiar: "S-M",
    rozmiarMetka: "EUR/USA S-M, MEX 38-40",
    stan: "Dobry",
    cena: 49,
    sprzedane: false,
    opis: "Luźny, pikowany bezrękawnik ze stójką i odpinanym kapturem (zamek i napy). Zamek przykryty listwą na napy, dwie kieszenie boczne. Ciepła warstwa na jesień.",
    wady: "Jasne plamy na kapturze od zewnątrz i ciemniejsze zabrudzenia wewnątrz kaptura przy zamku (zdjęcia 7 i 8). Kaptur można odpiąć.",
    wymiary: [
      ["Długość (od góry stójki)", "ok. 77 cm"],
    ],
    material: "Wierzch: 100% poliester. Podszewka: 100% poliester.",
    kolor: "czarny",
    wyciete: 2,     // zdjęcia w01.jpg, w02.jpg = rzecz wycięta z tła (pokazywane jako pierwsze)
    zdjecia: 12,
    folder: "p5",
    // DO SPRAWDZENIA: szerokość pod pachami, wypełnienie (brak na metce)
  },
];
