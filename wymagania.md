# Wymagania – gra Memory (HTML + CSS + JavaScript)

## Jak wypełnić ten plik

- Przy pytaniach z listą zaznacz wybraną opcję, zmieniając `[ ]` na `[x]`. Możesz zaznaczyć kilka, jeśli pytanie na to pozwala.
- Przy pytaniach otwartych wpisz odpowiedź za **Odpowiedź:**.
- Jeśli zostawisz pytanie bez odpowiedzi, przyjmuję **propozycję domyślną** podaną przy pytaniu.
- Numery pytań (np. 3.2) służą do odwoływania się do nich w rozmowie.

**Co dalej:** wypełniony plik → plan implementacji do akceptacji → kod gry.

---

## 1. Cel i odbiorca

### 1.1 Po co jest ta gra?

- [x] Zabawa / rozrywka
- [ ] Trening pamięci
- [ ] Nauka (np. słówek, pojęć, flag)
- [x] Ćwiczenie programistyczne / demo
- [ ] Inne: …

> Propozycja domyślna: zabawa / rozrywka

**Odpowiedź:**

### 1.2 Kto będzie grać?

- [ ] Dzieci (ile lat?)
- [ ] Dorośli
- [x] Wszyscy

> Propozycja domyślna: wszyscy

**Odpowiedź:**

### 1.3 Na jakich urządzeniach gra ma działać?

- [x] Komputer (mysz)
- [x] Telefon (dotyk)
- [ ] Tablet
- [ ] Wszystkie powyższe

> Propozycja domyślna: komputer i telefon

**Odpowiedź:**

---

## 2. Technologia i struktura

### 2.1 Jak podzielić kod na pliki?

- [ ] Jeden plik `index.html` (HTML, CSS i JS razem)
- [x] Osobne pliki: `index.html`, `style.css`, `game.js`
- [ ] Osobne pliki + JS podzielony na moduły

> Propozycja domyślna: osobne pliki `index.html`, `style.css`, `game.js`

**Odpowiedź:**

### 2.2 Czy gra ma działać po dwukliku w plik `index.html`, bez uruchamiania serwera?

- [x] Tak
- [ ] Nie, może wymagać lokalnego serwera

> Propozycja domyślna: tak

**Odpowiedź:**

### 2.3 Czy wolno używać zewnętrznych bibliotek (np. do animacji, konfetti)?

- [x] Nie, tylko czysty JavaScript
- [ ] Tak, jeśli ułatwią pracę

> Propozycja domyślna: nie, tylko czysty JavaScript

**Odpowiedź:**

### 2.4 Które przeglądarki muszą być obsługiwane?

- [x] Chrome / Edge
- [x] Firefox
- [x] Safari (w tym iPhone)

> Propozycja domyślna: aktualne wersje Chrome, Edge, Firefox i Safari

**Odpowiedź:**

---

## 3. Zasady gry

### 3.1 Ile kart gracz odkrywa w jednej turze?

- [x] 2 (klasyczne pary)
- [ ] 3 (trójki)

> Propozycja domyślna: 2

**Odpowiedź:**

### 3.2 Co się dzieje, gdy odkryte karty nie są parą?

- [x] Zakrywają się automatycznie po chwili (ile sekund?)
- [ ] Zakrywają się po kolejnym kliknięciu gracza
- [ ] Inne: …

> Propozycja domyślna: zakrywają się automatycznie po 1 sekundzie

**Odpowiedź:** 1 sekunda

### 3.3 Co się dzieje z odnalezioną parą?

- [ ] Zostaje odkryta na planszy
- [x] Znika z planszy (zostaje puste miejsce)
- [ ] Zostaje odkryta i jest wyszarzona / wyróżniona

> Propozycja domyślna: zostaje odkryta i jest wyróżniona

**Odpowiedź:** Po odkryciu para jest na chwilę wyróżniona, a potem znika z planszy. W jej miejscu zostaje puste pole, więc pozostałe karty nie zmieniają położenia.

### 3.4 Czy w trakcie odwracania / zakrywania kart kliknięcia mają być zablokowane?

- [x] Tak, nie da się kliknąć kolejnej karty, dopóki poprzednie się nie zakryją
- [ ] Nie, kliknięcie trzeciej karty od razu zakrywa dwie poprzednie

> Propozycja domyślna: tak, kliknięcia są zablokowane

**Odpowiedź:**

### 3.5 Kiedy gracz wygrywa?

- [x] Gdy odkryje wszystkie pary
- [ ] Inne: …

> Propozycja domyślna: gdy odkryje wszystkie pary

**Odpowiedź:**

### 3.6 Czy można przegrać?

- [x] Nie, gra trwa do znalezienia wszystkich par
- [ ] Tak, po przekroczeniu limitu ruchów (ile?)
- [ ] Tak, po przekroczeniu limitu czasu (ile?)

> Propozycja domyślna: nie, nie można przegrać

**Odpowiedź:**

### 3.7 Czy przed startem karty mają się na chwilę pokazać (podgląd do zapamiętania)?

- [x] Nie
- [ ] Tak, na kilka sekund (ile?)

> Propozycja domyślna: nie

**Odpowiedź:**

---

## 4. Plansza i poziomy trudności

### 4.1 Jakie rozmiary plansz mają być dostępne?

- [x] 4×4 (8 par)
- [ ] 4×5 (10 par)
- [x] 4×6 (12 par)
- [x] 6×6 (18 par)
- [ ] Inne: …

> Propozycja domyślna: 4×4 (łatwy), 4×6 (średni), 6×6 (trudny)

**Odpowiedź:** 4×4 – łatwy, 4×6 – średni, 6×6 – trudny

### 4.2 Jak gracz wybiera poziom?

- [x] Wybiera dowolny poziom przed grą
- [ ] Poziomy odblokowują się po kolei (po wygraniu poprzedniego)
- [ ] Jest tylko jeden poziom

> Propozycja domyślna: wybiera dowolny poziom przed grą

**Odpowiedź:**

### 4.3 Czy karty mają być tasowane losowo przy każdej nowej grze?

- [x] Tak
- [ ] Nie, stały układ (np. do testów)

> Propozycja domyślna: tak

**Odpowiedź:**

### 4.4 Czy poziomy mają się różnić czymś poza rozmiarem planszy (np. krótszy czas pokazania kart, limit czasu)?

> Propozycja domyślna: różnią się tylko rozmiarem planszy

**Odpowiedź:** Nie, poziomy różnią się tylko rozmiarem planszy

---

## 5. Karty i motywy

### 5.1 Co jest na awersie (przodzie) kart?

- [x] Emoji
- [ ] Własne obrazki (PNG/SVG – kto je dostarczy?)
- [ ] Litery / cyfry
- [ ] Słowo i jego tłumaczenie (tryb nauki)
- [ ] Inne: …

> Propozycja domyślna: emoji

**Odpowiedź:**

### 5.2 Ile motywów kart ma być dostępnych?

- [ ] Jeden motyw
- [x] Kilka motywów do wyboru przed grą (jakich? np. zwierzęta, owoce, pojazdy, flagi)

> Propozycja domyślna: 3 motywy do wyboru: zwierzęta, owoce, pojazdy

**Odpowiedź:** 3 motywy: zwierzęta, owoce, pojazdy

### 5.3 Czy pary to dwie identyczne karty?

- [x] Tak, dwie takie same karty
- [ ] Nie, karty „pasują do siebie” (np. obrazek + nazwa, słowo + tłumaczenie)

> Propozycja domyślna: tak, dwie identyczne karty

**Odpowiedź:**

### 5.4 Jak ma wyglądać rewers (tył) karty?

- [ ] Jednolity kolor
- [x] Wzór / gradient
- [x] Znak zapytania lub logo
- [ ] Inne: …

> Propozycja domyślna: gradient ze znakiem zapytania

**Odpowiedź:** Gradient ze znakiem zapytania

---

## 6. Tryb gry

### 6.1 Jakie tryby gry mają być dostępne?

- [x] Jeden gracz
- [ ] Dwóch graczy na zmianę na jednym urządzeniu
- [ ] Tryb na czas (jak najszybciej)

> Propozycja domyślna: tylko jeden gracz

**Odpowiedź:**

### 6.2 (Jeśli jest tryb dla 2 graczy) Czy po znalezieniu pary gracz ma dodatkowy ruch?

- [ ] Tak
- [ ] Nie, tura zawsze przechodzi na przeciwnika

> Propozycja domyślna: tak

**Odpowiedź:** Nie dotyczy – w pierwszej wersji jest tylko tryb dla jednego gracza (6.1)

### 6.3 (Jeśli jest tryb dla 2 graczy) Czy gracze wpisują swoje imiona?

- [ ] Tak
- [ ] Nie, „Gracz 1” i „Gracz 2”

> Propozycja domyślna: nie, „Gracz 1” i „Gracz 2”

**Odpowiedź:** Nie dotyczy – w pierwszej wersji jest tylko tryb dla jednego gracza (6.1)

---

## 7. Punktacja, statystyki i rekordy

### 7.1 Co ma być widoczne podczas gry?

- [x] Liczba ruchów (1 ruch = odkrycie 2 kart)
- [x] Stoper
- [x] Liczba znalezionych par (np. 3 / 8)
- [ ] Punkty

> Propozycja domyślna: liczba ruchów, stoper i znalezione pary

**Odpowiedź:**

### 7.2 Czy gra liczy punkty? Jeśli tak – za co gracz je dostaje i traci?

> Propozycja domyślna: bez punktów; wynikiem jest liczba ruchów i czas

**Odpowiedź:** Nie, bez punktów; wynikiem jest liczba ruchów i czas

### 7.3 Czy na koniec gry ma być ocena (np. 1–3 gwiazdki zależnie od liczby ruchów)?

- [x] Tak
- [ ] Nie

> Propozycja domyślna: tak, 1–3 gwiazdki

**Odpowiedź:** 1–3 gwiazdki zależnie od liczby ruchów

### 7.4 Czy zapisywać najlepszy wynik (rekord)?

- [ ] Nie
- [x] Tak, jeden rekord na każdy poziom
- [ ] Tak, tabela najlepszych wyników (ile pozycji?)

> Propozycja domyślna: jeden rekord na każdy poziom, zapisany w przeglądarce (`localStorage`)

**Odpowiedź:** Zapisany w przeglądarce (`localStorage`)

### 7.5 (Jeśli jest tabela wyników) Czy gracz wpisuje swój nick po wygranej?

- [ ] Tak
- [ ] Nie

> Propozycja domyślna: tak

**Odpowiedź:** Nie dotyczy – zamiast tabeli wyników jest jeden rekord na poziom (7.4)

### 7.6 Czy ma być przycisk do wyczyszczenia rekordów?

- [x] Tak
- [ ] Nie

> Propozycja domyślna: tak, w ustawieniach

**Odpowiedź:** Na ekranie startowym (ekranu ustawień nie ma – 9.1)

---

## 8. Sterowanie

### 8.1 Jak gracz odkrywa kartę?

- [x] Kliknięcie myszą
- [x] Dotknięcie na ekranie dotykowym
- [x] Klawiatura (Tab / strzałki + Enter / Spacja)

> Propozycja domyślna: wszystkie trzy

**Odpowiedź:**

### 8.2 Jakie przyciski mają być dostępne w trakcie gry?

- [x] Nowa gra / Restart
- [ ] Pauza
- [x] Powrót do menu
- [x] Wyciszenie dźwięku

> Propozycja domyślna: Restart, Powrót do menu, Wyciszenie

**Odpowiedź:**

### 8.3 Co się dzieje, gdy gracz chce zmienić poziom lub motyw w trakcie gry?

- [ ] Gra od razu zaczyna się od nowa
- [x] Pojawia się pytanie „Czy na pewno przerwać grę?”

> Propozycja domyślna: pojawia się pytanie z potwierdzeniem

**Odpowiedź:**

### 8.4 Czy stoper ma się zatrzymywać, gdy gracz przełączy kartę przeglądarki?

- [x] Tak
- [ ] Nie

> Propozycja domyślna: tak

**Odpowiedź:**

---

## 9. Ekrany i przebieg gry

### 9.1 Jakie ekrany mają być w grze?

- [x] Ekran startowy (wybór poziomu / motywu / trybu)
- [x] Ekran gry
- [ ] Ekran pauzy
- [x] Ekran końca gry (wynik, rekord, „Zagraj ponownie”)
- [ ] Ekran ustawień
- [ ] Ekran z zasadami gry

> Propozycja domyślna: startowy, gra, koniec gry

**Odpowiedź:**

### 9.2 Kiedy startuje stoper?

- [x] Po kliknięciu pierwszej karty
- [ ] Od razu po wyświetleniu planszy

> Propozycja domyślna: po kliknięciu pierwszej karty

**Odpowiedź:**

### 9.3 Co ma być na ekranie końca gry?

> Propozycja domyślna: gratulacje, liczba ruchów, czas, gwiazdki, informacja „Nowy rekord!” (jeśli jest), przyciski „Zagraj ponownie” i „Menu”

**Odpowiedź:** Gratulacje, liczba ruchów, czas, gwiazdki, informacja „Nowy rekord!” (jeśli jest), przyciski „Zagraj ponownie” i „Menu”

### 9.4 Czy niedokończona gra ma zostać po odświeżeniu strony?

- [ ] Tak, gra wznawia się w tym samym miejscu
- [x] Nie, odświeżenie zaczyna od nowa

> Propozycja domyślna: nie

**Odpowiedź:**

### 9.5 Czy ustawienia (poziom, motyw, wyciszenie) mają być zapamiętywane między wizytami?

- [x] Tak
- [ ] Nie

> Propozycja domyślna: tak

**Odpowiedź:**

---

## 10. Wygląd i animacje

### 10.1 Jaki styl graficzny?

- [ ] Kolorowy, dziecięcy
- [x] Minimalistyczny
- [ ] Elegancki / ciemny
- [ ] Retro / pikselowy
- [ ] Inne (opisz lub podaj przykład): …

> Propozycja domyślna: minimalistyczny, z kolorowymi kartami

**Odpowiedź:** Minimalistyczny, z kolorowymi kartami

### 10.2 Czy są konkretne kolory lub czcionka, których mam użyć?

> Propozycja domyślna: dobiorę spójną paletę kolorów i czcionkę systemową

**Odpowiedź:** Brak wymagań – spójna paleta kolorów i czcionka systemowa

### 10.3 Motyw jasny / ciemny

- [ ] Tylko jasny
- [ ] Tylko ciemny
- [x] Automatycznie wg ustawień systemu
- [ ] Przełącznik w grze

> Propozycja domyślna: automatycznie wg ustawień systemu

**Odpowiedź:**

### 10.4 Jak ma wyglądać odwracanie karty?

- [x] Obrót 3D
- [ ] Płynne pojawianie się / zanikanie
- [ ] Bez animacji

> Propozycja domyślna: obrót 3D

**Odpowiedź:**

### 10.5 Jakie dodatkowe efekty?

- [x] Wyróżnienie / „podskok” trafionej pary
- [ ] Potrząśnięcie kartami przy pomyłce
- [x] Konfetti po wygranej
- [ ] Brak dodatkowych efektów

> Propozycja domyślna: wyróżnienie trafionej pary i konfetti po wygranej

**Odpowiedź:** Trafiona para „podskakuje” i dopiero potem znika z planszy (3.3)

### 10.6 Jak plansza ma się zachowywać na telefonie?

- [x] Karty się zmniejszają, cała plansza mieści się na ekranie bez przewijania
- [ ] Plansza może się przewijać

> Propozycja domyślna: cała plansza mieści się na ekranie bez przewijania

**Odpowiedź:**

---

## 11. Dźwięk

### 11.1 Czy gra ma mieć dźwięki?

- [ ] Nie
- [x] Tak, przy: odwróceniu karty / znalezieniu pary / pomyłce / wygranej (skreśl zbędne)
- [ ] Tak, plus muzyka w tle

> Propozycja domyślna: tak, krótkie dźwięki przy parze, pomyłce i wygranej (generowane w przeglądarce, bez plików audio)

**Odpowiedź:** Przy znalezieniu pary, pomyłce i wygranej (bez dźwięku odwrócenia karty); dźwięki generowane w przeglądarce, bez plików audio

### 11.2 Czy dźwięk ma być domyślnie włączony?

- [x] Tak
- [ ] Nie, gracz sam włącza

> Propozycja domyślna: tak, z przyciskiem wyciszenia

**Odpowiedź:** Z przyciskiem wyciszenia

---

## 12. Dostępność i język

### 12.1 W jakim języku ma być interfejs?

- [x] Polski
- [ ] Angielski
- [ ] Oba, z przełącznikiem

> Propozycja domyślna: polski

**Odpowiedź:**

### 12.2 Które elementy dostępności są wymagane?

- [x] Pełna obsługa klawiaturą (widoczny fokus na karcie)
- [x] Opisy kart dla czytników ekranu (np. „Karta 5, zakryta” / „Karta 5, kot”)
- [x] Wysoki kontrast kolorów
- [x] Ograniczenie animacji, gdy użytkownik ma to ustawione w systemie
- [ ] Duże karty / duża czcionka (np. dla dzieci)

> Propozycja domyślna: wszystkie poza dużymi kartami

**Odpowiedź:**

---

## 13. Poza zakresem pierwszej wersji

### 13.1 Czego świadomie NIE robimy w pierwszej wersji?

- [x] Gra przez internet / multiplayer online
- [x] Konta graczy i logowanie
- [x] Ranking na serwerze
- [x] Wgrywanie własnych zdjęć jako kart
- [ ] Inne: …

> Propozycja domyślna: wszystkie powyższe są poza zakresem

**Odpowiedź:**

---

## 14. Kryteria akceptacji

Gra jest gotowa, gdy spełnia poniższe punkty. Dopisz, usuń lub zmień punkty według potrzeb.

- [x] Gra uruchamia się po otwarciu `index.html` w przeglądarce.
- [x] Karty tasują się losowo przy każdej nowej grze.
- [x] W jednej turze da się odkryć najwyżej 2 karty.
- [x] Kliknięcie tej samej karty dwa razy nie liczy się jako para.
- [x] Niepasujące karty zakrywają się same, pasujące znikają z planszy (zostaje puste miejsce).
- [x] Liczba ruchów i czas liczą się poprawnie.
- [x] Po odkryciu wszystkich par pojawia się ekran końca gry z wynikiem.
- [x] Rekord zostaje po odświeżeniu strony.
- [x] Gra działa i mieści się na ekranie telefonu.
- [x] W konsoli przeglądarki nie ma błędów.
- [ ] Inne: …

---

## 15. Uwagi dodatkowe

Pomysły, przykłady gier, które Ci się podobają, zrzuty ekranu, wszystko, czego nie objęły pytania:

**Odpowiedź:**
