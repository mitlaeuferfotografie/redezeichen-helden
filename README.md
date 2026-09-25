# Die Redezeichen-Helden

Interaktive Lern-App zur **wörtlichen Rede** für die Klasse 4 (Grundschule NRW).
In Comic-Stadt sind die Satzzeichen durcheinander – die Kinder helfen Dora Doppelpunkt, Anton Anführungszeichen und Kalle Komma, die wörtliche Rede zu retten.

**Live-Version:** https://mitlaeuferfotografie.github.io/redezeichen-helden/

Gehostet über **GitHub Pages**: Jede Änderung auf `main` wird automatisch gebaut und nach ca. 2 Minuten veröffentlicht (`.github/workflows/pages.yml`).

## Lehrplanbezug (Deutsch, Grundschule NRW)

- **Sprache und Sprachgebrauch untersuchen / Richtig schreiben:** Zeichen der wörtlichen Rede korrekt setzen
  - Begleitsatz vorne (Doppelpunkt) und hinten (Komma, Punkt der Rede entfällt)
  - Begleitsatz in der Mitte nur als freiwillige Profi-Aufgabe (Profi-Zone)
- **Schreiben / Texte überarbeiten:** treffende Wörter verwenden (Wortfeld „sagen“)

## 12 Spiele in 4 Lernpfaden (je 10 Sterne, 120 insgesamt)

| Pfad | Spiele |
|---|---|
| 1 · Rede erkennen | Stimmen-Marker · Begleitsatz-Radar · Comic-Check |
| 2 · Zeichen setzen | Zeichen-Werkstatt · Fehler-Detektiv · Satz-Puzzle |
| 3 · Wortfeld „sagen“ | Stimmen-Memory · Das treffende Wort · Wörter-Regen |
| 4 · Umbauen & Schreiben | Umstell-Maschine · Sprechblasen-Schreiber · Comic-Finale |

- **Profi-Zone (freiwillig):** Profi-Labor zum eingeschobenen Begleitsatz – Bonus-Sterne, zählen nicht zu den 120.
- **„Die 4 Regeln“** (oben links): Fachbegriffe (wörtliche Rede, Begleitsatz, Redeverb, Redezeichen) und die Regeln 1–4 plus Profi-Regel.
- Mit **9 Sternen** wird das nächste Spiel im Pfad freigeschaltet (Pfad 4 startet nach der Zeichen-Werkstatt).
- Mit **10 Sternen** gibt es ein **Helden-Abzeichen**.
- Nach 3 Fehlern in Folge erscheint ein Tipp. Im Memory zählen dafür nur vermeidbare Fehlversuche (die passende Karte war schon aufgedeckt) – zufällige Fehlversuche lösen nie einen Tipp aus.
- **Lehrer-Bereich** (Zahnrad oben): Passwort `Rede123` – alles freischalten, Grundlagen abschließen, Fortschritt löschen.

## Das kann ich schon

Über den Knopf **„Das kann ich schon:“** (🎯) sieht jedes Kind, welche Regeln es schon sicher beherrscht:

- **Oben in der Leiste:** alle 7 Bausteine, jeweils mit den Übungen, in denen sie trainiert werden (anklickbar, die empfohlene Übung ist hervorgehoben).
- **In einer Übung und auf dem Ergebnis-Bildschirm:** nur die Bausteine, die in dieser Übung abgefragt werden.

- 7 Können-Bausteine: Rede und Begleitsatz erkennen · Anführungszeichen · Begleitsatz vorne → Doppelpunkt · Begleitsatz hinten → Komma · Satzzeichen der Rede vor dem “ · Groß und klein · Treffende Redeverben
- Einstufung aus den letzten 10 Aufgaben je Baustein: 💪 Kann ich! (ab 90 %, also fehlerfrei – bei 10 Aufgaben 1 Fehler erlaubt) · 🙂 Fast! (ab 70 %) · 🎯 Übe ich noch · 🔍 Noch zu wenig Aufgaben (unter 4)
- Es zählt nur der **erste Versuch** pro Aufgabe. Memory und Profi-Labor werden nicht ausgewertet.
- In Zeichen-Werkstatt und Comic-Finale zählen die Anführungszeichen einer Rede zusammen als 1 Ergebnis (richtig nur, wenn „ und “ stimmen).
- Bei „Fast!“ und „Übe ich noch“ steht ein passendes Übungsspiel dabei; klein darunter die echte Zählung der Sitzung (Info für die Lehrkraft).

## Helden-Code

- **13 Zeichen** (`XXXX-XXXX-XXXXX`): Sterne aller 13 Spiele + Stufen der 7 Können-Bausteine + 1 Prüfzeichen gegen Tippfehler. Alphabet ohne I, L, O, U; O/I/L werden beim Eintippen als 0/1/1 gelesen.
- **Alte 16-stellige Codes** werden weiter gelesen (nur Sterne, Können startet dann neu). Ausnahme: Alte Codes, deren Prüfzeichen (14. Zeichen) ein L ist (ca. 4 %), lassen sich nicht mehr laden, weil L jetzt als 1 gelesen wird.
- Reihenfolge der Spiele und Bausteine ist Teil des Formats – neue Spiele oder Bausteine brauchen ein neues Code-Format.

## Was als richtig gilt

- Steht der Begleitsatz **vorne**, sind am Ende der Rede Punkt und Ausrufezeichen beide richtig – in allen Spielen gleich. Ein Fragezeichen bleibt ein Fragezeichen; bei Begleitsatz **hinten** zählt nur das Original.
- Sprechblasen-Schreiber: Leerzeichen um Satzzeichen sind egal; gerade `"` sowie `,,` und `''` werden als „ und “ erkannt (im Eingabefeld sofort umgewandelt). Wörter sowie Groß- und Kleinschreibung müssen stimmen.
