/* ================================================================
   PRAWIE NOWE BY KUBA – dane sklepu
   To jedyny plik, który edytujesz przy dodawaniu i sprzedawaniu rzeczy.

   Sprzedane:   zmień  sprzedane: false  na  sprzedane: true
   Nowa rzecz:  skopiuj cały blok { ... } jednej rzeczy, zmień dane,
                wrzuć zdjęcia do img/p6/ (01.jpg = przód, thumb.jpg = miniatura)
   ================================================================ */

window.SKLEP = {
  nazwa: "Prawie Nowe",
  dopisek: "by Kuba",
  instagram: "prawienowebykuba",   // nazwa konta na Instagramie (bez @)
  tiktok: "prawienowebykuba",
  wysylka: "Wysyłka w 1–2 dni robocze od zaksięgowania wpłaty, starannie zapakowane.",
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
    cena: 139,
    sprzedane: false,
    opis: "Gruba, miękka dzianina z wełną, szeroki golf i rękawy typu raglan. Ciepły solo albo pod płaszcz. Cena z metki sklepowej: 199 zł.",
    wady: null,
    wymiary: [
      ["Długość (z golfem)", "77 cm"],
      ["Rękaw (raglan, od golfu)", "64 cm"],
    ],
    material: "72% wełna, 28% poliamid",
    kolor: "beżowy",
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
    cena: 69,
    sprzedane: false,
    opis: "Asymetryczny krój: ukośny zamek, wstawki z innej dzianiny, surowe krawędzie, boczny zamek przy dole i mały haft na piersi. Wyrazisty streetwear.",
    wady: "Strzępienie przy lewym mankiecie, wystrzępione miejsce przy dolnej części zamka i przetarte krawędzie kieszeni. Surowe krawędzie to element projektu.",
    wymiary: [
      ["Pod pachami", "ok. 49 cm"],
      ["Rękaw", "ok. 54 cm"],
    ],
    material: "Tkanina główna: 46% bawełna, 46% poliester, 8% wiskoza. Tkanina dodatkowa: 100% bawełna.",
    kolor: "czarny",
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
    cena: 89,
    sprzedane: false,
    opis: "Dwuguzikowa marynarka z miękkiej, teksturowanej dzianiny w niebieskim melanżu. Kieszeń na piersi i dwie boczne, guziki przy mankietach z czerwoną nitką. Elegancka, a wygodna: do jeansów, chinosów i koszuli.",
    wady: null,
    wymiary: [
      ["Długość (od kołnierza)", "ok. 75 cm"],
    ],
    material: "84% poliester, 16% bawełna. Podszewka: 100% poliester.",
    kolor: "niebieski melanż",
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
    cena: 159,
    sprzedane: false,
    opis: "Elastyczna kurtka z linii Cold.RDY, rozpinana na całej długości, z kapturem. W środku polar w korpusie i kapturze. Kieszenie na zamek z odblaskowymi detalami, ściągacze z napisem COLD.RDY.",
    wady: "Drobne jasne smugi na przodzie (zdjęcie 7) i lekko zbity polar przy mankiecie (zdjęcie 5).",
    wymiary: [
      ["Pod pachami", "ok. 52 cm"],
      ["Długość (od kołnierza)", "ok. 70 cm"],
      ["Rękaw", "ok. 65 cm"],
    ],
    material: "Materiał główny: 92% poliester z recyklingu, 8% elastan.",
    kolor: "czarny",
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
    cena: 69,
    sprzedane: false,
    opis: "Luźny, pikowany bezrękawnik ze stójką i odpinanym kapturem (zamek i napy). Zamek przykryty listwą na napy, dwie kieszenie boczne. Ciepła warstwa na jesień.",
    wady: "Jasne plamy na kapturze od zewnątrz i ciemniejsze zabrudzenia wewnątrz kaptura przy zamku (zdjęcia 5 i 6). Kaptur można odpiąć.",
    wymiary: [
      ["Długość (od góry stójki)", "ok. 77 cm"],
    ],
    material: "Wierzch: 100% poliester. Podszewka: 100% poliester.",
    kolor: "czarny",
    zdjecia: 12,
    folder: "p5",
    // DO SPRAWDZENIA: szerokość pod pachami, wypełnienie (brak na metce)
  },
];
