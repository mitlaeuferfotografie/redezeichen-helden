import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkles, Star, Award, ArrowRight, RotateCcw, BookOpen, Crown, Zap, HelpCircle, Lock, Settings, Key, Copy, Check, Highlighter, Radar, MessageCircle, Wand2, Search, Puzzle, Brain, Megaphone, CloudRain, Repeat, PenTool, Trophy, Flame, Footprints, Eraser, Eye } from 'lucide-react';

// ==========================================
// CUSTOM CSS FÜR COMIC-THEMA & ANIMATIONEN
// ==========================================
const comicStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Bangers&display=swap');

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  @keyframes shake-short {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px) rotate(-2deg); }
    40%, 80% { transform: translateX(6px) rotate(2deg); }
  }
  @keyframes pop-in {
    0% { transform: scale(0.8) translateY(15px); opacity: 0; }
    70% { transform: scale(1.05) translateY(0); opacity: 1; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
  @keyframes sparkle-twinkle {
    0%, 100% { opacity: 0.4; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2) rotate(15deg); }
  }
  @keyframes hud-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); filter: brightness(1.5); }
    100% { transform: scale(1); }
  }
  @keyframes chest-bounce {
    0%, 100% { transform: scale(1); }
    30% { transform: scale(1.15) translateY(-15px) rotate(2deg); }
    50% { transform: scale(0.95) translateY(5px) rotate(-2deg); }
    70% { transform: scale(1.05) translateY(-5px); }
  }
  @keyframes burst-out {
    0% { transform: translate(0, 0) scale(0); opacity: 1; filter: brightness(1.5); }
    20% { opacity: 1; }
    60% { transform: translate(calc(var(--tx) * 0.8), calc(var(--ty) * 0.8)) scale(1.2) rotate(calc(var(--rot) * 0.6)); opacity: 1; filter: brightness(1.1); }
    100% { transform: translate(var(--tx), var(--ty)) scale(0.5) rotate(var(--rot)); opacity: 0; filter: brightness(1); }
  }
  @keyframes word-suck {
    0% { transform: translateX(-50%) scale(1); opacity: 1; }
    100% { transform: translateX(-50%) translateY(140px) scale(0.3); opacity: 0; }
  }
  @keyframes gate-glow {
    0%, 100% { transform: scale(1.05); }
    50% { transform: scale(1.1); }
  }
  @keyframes fire-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(249,115,22,0.5); }
    50% { box-shadow: 0 0 45px rgba(249,115,22,0.95); }
  }
  @keyframes comic-wiggle {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }

  .anim-burst { animation: burst-out 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  .anim-float { animation: float 4s ease-in-out infinite; }
  .anim-shake { animation: shake-short 0.4s ease-in-out; }
  .anim-pop { animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  .anim-twinkle { animation: sparkle-twinkle 2s ease-in-out infinite; }
  .anim-hud { animation: hud-pulse 0.6s ease-out; }
  .anim-chest-bounce { animation: chest-bounce 0.6s ease-out forwards; }
  .anim-word-suck { animation: word-suck 0.5s ease-in forwards; }
  .anim-gate { animation: gate-glow 0.5s ease-in-out; }
  .anim-fire-glow { animation: fire-glow 1s ease-in-out infinite; }
  .anim-wiggle { animation: comic-wiggle 2.5s ease-in-out infinite; }

  body { font-family: 'Fredoka', sans-serif; }
  .font-comic { font-family: 'Bangers', 'Fredoka', cursive; letter-spacing: 0.05em; }
  .comic-dots { background-image: radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.5px); background-size: 18px 18px; }

  .custom-scrollbar::-webkit-scrollbar { width: 8px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: rgba(30, 27, 75, 0.5); border-radius: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(250, 204, 21, 0.5); border-radius: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(250, 204, 21, 0.8); }

  /* Comic-Sprechblase */
  .bubble { position: relative; background: #fff; color: #1e1b4b; border: 4px solid #1e1b4b; border-radius: 2rem; box-shadow: 6px 6px 0 rgba(0,0,0,0.35); }
  .bubble::before { content: ''; position: absolute; left: -24px; top: 50%; transform: translateY(-50%); border-width: 12px 24px 12px 0; border-style: solid; border-color: transparent #1e1b4b transparent transparent; }
  .bubble::after { content: ''; position: absolute; left: -15px; top: 50%; transform: translateY(-50%); border-width: 8px 16px 8px 0; border-style: solid; border-color: transparent #fff transparent transparent; }

  /* Memory-Karten */
  .flip-card { perspective: 1000px; }
  .flip-inner { position: relative; width: 100%; height: 100%; transition: transform 0.5s; transform-style: preserve-3d; }
  .flip-card.is-flipped .flip-inner { transform: rotateY(180deg); }
  .flip-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
  .flip-back { transform: rotateY(180deg); }
`;

// ==========================================
// DATENBANKEN (Wörtliche Rede, Klasse 4)
// ==========================================

// Grund-Sätze: Daraus werden Sätze mit Begleitsatz VORNE oder HINTEN automatisch gebaut.
// who = Sprecher (klein geschrieben, wenn Artikel), verb = Redeverb, say = Sprechblase (endet auf . ? !)
const redeData = [
  { who: "Tom", verb: "ruft", say: "Ich bin schon da!", e: "👦" },
  { who: "Mama", verb: "fragt", say: "Hast du Hunger?", e: "👩" },
  { who: "der Busfahrer", verb: "sagt", say: "Bitte alle einsteigen.", e: "🧔" },
  { who: "Lea", verb: "jubelt", say: "Wir haben gewonnen!", e: "👧" },
  { who: "Oma", verb: "erzählt", say: "Früher gab es kein Handy.", e: "👵" },
  { who: "Paul", verb: "fragt", say: "Spielst du mit mir?", e: "👦" },
  { who: "die Lehrerin", verb: "sagt", say: "Packt eure Hefte aus.", e: "👩‍🏫" },
  { who: "Ben", verb: "stöhnt", say: "Mein Bauch tut weh.", e: "🤕" },
  { who: "Tim", verb: "gähnt", say: "Ich bin so müde.", e: "🥱" },
  { who: "Lisa", verb: "fragt", say: "Wo ist die Katze?", e: "👧" },
  { who: "Papa", verb: "warnt", say: "Vorsicht, die Suppe ist heiß!", e: "👨" },
  { who: "Emma", verb: "sagt", say: "Das Buch ist spannend.", e: "👧" },
  { who: "Noah", verb: "erzählt", say: "Ich kann schon schwimmen.", e: "👦" },
  { who: "Opa", verb: "fragt", say: "Wie spät ist es?", e: "👴" },
  { who: "Mama", verb: "flüstert", say: "Das Baby schläft.", e: "👩" },
  { who: "Jonas", verb: "fragt", say: "Wer hat meinen Stift?", e: "👦" },
  { who: "der Kapitän", verb: "ruft", say: "Land in Sicht!", e: "🧑‍✈️" },
  { who: "Mia", verb: "bittet", say: "Hilfst du mir bitte?", e: "👧" },
  { who: "der Trainer", verb: "brüllt", say: "Lauft schneller!", e: "🧔" },
  { who: "Frau Klein", verb: "erklärt", say: "Morgen schreiben wir ein Diktat.", e: "👩‍🏫" },
  { who: "Ella", verb: "kichert", say: "Das kitzelt!", e: "😆" },
  { who: "der Zauberer", verb: "murmelt", say: "Gleich verschwindet das Kaninchen.", e: "🧙" },
  { who: "Leon", verb: "fragt", say: "Kommst du mit ins Kino?", e: "👦" },
  { who: "Oma", verb: "sagt", say: "Der Kuchen ist fertig.", e: "👵" },
  { who: "Max", verb: "schreit", say: "Hilfe, eine Spinne!", e: "😱" },
  { who: "Anna", verb: "antwortet", say: "Ich komme gleich.", e: "👧" },
  { who: "die Ärztin", verb: "fragt", say: "Wo tut es dir weh?", e: "👩‍⚕️" },
  { who: "Sara", verb: "erzählt", say: "Mein Hamster heißt Krümel.", e: "👧" },
  { who: "Papa", verb: "ruft", say: "Das Essen ist fertig!", e: "👨" },
  { who: "Lina", verb: "seufzt", say: "Es regnet schon wieder.", e: "😔" }
];

// Profi-Stufe: Begleitsatz in der MITTE (a = erster Redeteil, b = zweiter Redeteil)
const mitteData = [
  { who: "Papa", verb: "sagt", a: "Morgen", b: "fahren wir ans Meer.", e: "👨" },
  { who: "Lina", verb: "flüstert", a: "Ich glaube", b: "da ist jemand.", e: "👧" },
  { who: "der Trainer", verb: "ruft", a: "Kommt schnell", b: "das Spiel beginnt!", e: "🧔" },
  { who: "Oma", verb: "erzählt", a: "Heute", b: "backen wir Kekse.", e: "👵" },
  { who: "Mama", verb: "sagt", a: "Wenn es regnet", b: "bleiben wir drinnen.", e: "👩" },
  { who: "Tim", verb: "erklärt", a: "Mein Hund", b: "kann schon Pfötchen geben.", e: "👦" },
  { who: "Mia", verb: "fragt", a: "Weißt du", b: "wo mein Schal ist?", e: "👧" },
  { who: "die Lehrerin", verb: "erklärt", a: "Zuerst", b: "lesen wir den Text.", e: "👩‍🏫" },
  { who: "Opa", verb: "sagt", a: "Früher", b: "gab es hier einen Bauernhof.", e: "👴" },
  { who: "Ben", verb: "ruft", a: "Schau mal", b: "da oben fliegt ein Adler!", e: "👦" }
];

const fehlerData = [
  // Richtig geschrieben
  { s: "Anna sagt: „Ich komme gleich.“", ok: true, why: "Begleitsatz vorne → Doppelpunkt. Der Punkt der Rede steht vor dem “." },
  { s: "„Wo ist mein Heft?“, fragt Luis.", ok: true, why: "Begleitsatz hinten → Komma nach dem “. Das Fragezeichen bleibt stehen." },
  { s: "„Das ist lecker“, sagt Opa.", ok: true, why: "Begleitsatz hinten → Der Punkt der Rede fällt weg, dafür kommt ein Komma." },
  { s: "Papa ruft: „Das Essen ist fertig!“", ok: true, why: "Doppelpunkt nach dem Begleitsatz, Ausrufezeichen vor dem “." },
  { s: "„Morgen“, sagt Mama, „gehen wir schwimmen.“", ok: true, why: "Begleitsatz in der Mitte → Komma davor und Komma dahinter." },
  { s: "Leon fragt: „Kommst du mit?“", ok: true, why: "Doppelpunkt, Anführungszeichen unten und oben – alles perfekt!" },
  { s: "„Ich habe gewonnen!“, jubelt Ella.", ok: true, why: "Das Ausrufezeichen bleibt, danach kommen “ und das Komma." },
  { s: "Oma erzählt: „Früher war alles anders.“", ok: true, why: "Die Rede beginnt groß, der Punkt steht vor dem “." },
  // Mit Fehler
  { s: "Anna sagt „Ich komme gleich.“", ok: false, fix: "Anna sagt: „Ich komme gleich.“", why: "Der Doppelpunkt nach dem Begleitsatz fehlt." },
  { s: "„Das ist lecker.“, sagt Opa.", ok: false, fix: "„Das ist lecker“, sagt Opa.", why: "Steht der Begleitsatz hinten, fällt der Punkt der Rede weg." },
  { s: "„Wo ist mein Heft?“ fragt Luis.", ok: false, fix: "„Wo ist mein Heft?“, fragt Luis.", why: "Nach dem Schluss-Anführungszeichen fehlt das Komma." },
  { s: "Papa ruft: „Das Essen ist fertig“!", ok: false, fix: "Papa ruft: „Das Essen ist fertig!“", why: "Das Ausrufezeichen gehört zur Rede – es steht vor dem “." },
  { s: "„Ich bin müde“, Gähnt Tim.", ok: false, fix: "„Ich bin müde“, gähnt Tim.", why: "Der Begleitsatz hinten beginnt mit einem kleinen Buchstaben." },
  { s: "Leon fragt: Kommst du mit?", ok: false, fix: "Leon fragt: „Kommst du mit?“", why: "Die Anführungszeichen fehlen." },
  { s: "Mia flüstert: „Ich habe ein Geheimnis.", ok: false, fix: "Mia flüstert: „Ich habe ein Geheimnis.“", why: "Das Schluss-Anführungszeichen oben fehlt." },
  { s: "„Hilfe!“, ruft Ben", ok: false, fix: "„Hilfe!“, ruft Ben.", why: "Am Ende des Begleitsatzes fehlt der Punkt." },
  { s: "„Heute“ sagt Oma „backen wir Kuchen.“", ok: false, fix: "„Heute“, sagt Oma, „backen wir Kuchen.“", why: "Um den Begleitsatz in der Mitte fehlen die Kommas." },
  { s: "Lisa fragt, „Spielst du mit?“", ok: false, fix: "Lisa fragt: „Spielst du mit?“", why: "Nach dem Begleitsatz vorne steht ein Doppelpunkt, kein Komma." },
  { s: "Opa erzählt: „früher war alles anders.“", ok: false, fix: "Opa erzählt: „Früher war alles anders.“", why: "Die wörtliche Rede beginnt mit einem großen Buchstaben." },
  { s: "„Ich komme gleich,“ sagt Anna.", ok: false, fix: "„Ich komme gleich“, sagt Anna.", why: "Das Komma steht erst nach dem Schluss-Anführungszeichen." },
  { s: "„Wie spät ist es“?, fragt Tim.", ok: false, fix: "„Wie spät ist es?“, fragt Tim.", why: "Das Fragezeichen gehört zur Rede – es steht vor dem “." },
  { s: "Paul ruft: “Komm her!„", ok: false, fix: "Paul ruft: „Komm her!“", why: "Am Anfang stehen die Anführungszeichen unten („), am Ende oben (“)." }
];

const redeverbData = [
  { s: "„Pssst, das Baby schläft“, ___ Papa.", correct: "flüstert", options: ["flüstert", "brüllt", "jubelt"] },
  { s: "„Wie spät ist es?“, ___ Lea.", correct: "fragt", options: ["fragt", "antwortet", "schimpft"] },
  { s: "„Es ist schon drei Uhr“, ___ Tom auf Leas Frage.", correct: "antwortet", options: ["antwortet", "fragt", "kichert"] },
  { s: "„Tor! Wir haben gewonnen!“, ___ die Fans.", correct: "jubeln", options: ["jubeln", "flüstern", "fragen"] },
  { s: "„Du hast schon wieder nicht aufgeräumt!“, ___ Mama wütend.", correct: "schimpft", options: ["schimpft", "kichert", "fragt"] },
  { s: "„Hilfe, ich stecke fest!“, ___ der Junge laut.", correct: "schreit", options: ["schreit", "murmelt", "fragt"] },
  { s: "„Hihi, das kitzelt!“, ___ Mia.", correct: "kichert", options: ["kichert", "schimpft", "fragt"] },
  { s: "„Wo habe ich nur meinen Schlüssel?“, ___ Opa leise vor sich hin.", correct: "murmelt", options: ["murmelt", "jubelt", "brüllt"] },
  { s: "„Zuerst verrührt man die Eier mit dem Mehl“, ___ der Bäcker.", correct: "erklärt", options: ["erklärt", "fragt", "jubelt"] },
  { s: "„Oh nein, es regnet schon wieder“, ___ Lisa.", correct: "jammert", options: ["jammert", "jubelt", "fragt"] },
  { s: "„Alle Mann an Deck!“, ___ der Kapitän über das ganze Schiff.", correct: "brüllt", options: ["brüllt", "flüstert", "fragt"] },
  { s: "„Es war einmal ein kleiner Drache“, ___ Oma.", correct: "erzählt", options: ["erzählt", "fragt", "schimpft"] },
  { s: "„Ich w-w-weiß es n-nicht“, ___ Paul aufgeregt.", correct: "stottert", options: ["stottert", "jubelt", "erklärt"] },
  { s: "„Gib mir bitte das Salz“, ___ Ben höflich.", correct: "bittet", options: ["bittet", "schimpft", "jubelt"] },
  { s: "„Ich war das nicht!“, ___ Max, obwohl ihn alle gesehen haben.", correct: "behauptet", options: ["behauptet", "fragt", "kichert"] }
];

const memoryPairs = [
  { id: 1, sit: "ganz leise sprechen", emo: "🤫", verb: "flüstern" },
  { id: 2, sit: "sehr laut und wütend rufen", emo: "📢", verb: "brüllen" },
  { id: 3, sit: "etwas wissen wollen", emo: "❓", verb: "fragen" },
  { id: 4, sit: "auf eine Frage reagieren", emo: "💡", verb: "antworten" },
  { id: 5, sit: "undeutlich vor sich hin reden", emo: "😶", verb: "murmeln" },
  { id: 6, sit: "sich laut freuen", emo: "🥳", verb: "jubeln" },
  { id: 7, sit: "mit jemandem böse sein", emo: "😠", verb: "schimpfen" },
  { id: 8, sit: "eine Geschichte weitergeben", emo: "📖", verb: "erzählen" },
  { id: 9, sit: "leise und albern lachen", emo: "🤭", verb: "kichern" },
  { id: 10, sit: "traurig klagen", emo: "😢", verb: "jammern" },
  { id: 11, sit: "zeigen, wie etwas geht", emo: "🧑‍🏫", verb: "erklären" },
  { id: 12, sit: "höflich um etwas fragen", emo: "🙏", verb: "bitten" }
];

const regenWords = [
  // Wortfeld „sagen“
  { word: "flüstert", say: true }, { word: "ruft", say: true }, { word: "fragt", say: true },
  { word: "antwortet", say: true }, { word: "schreit", say: true }, { word: "murmelt", say: true },
  { word: "jubelt", say: true }, { word: "schimpft", say: true }, { word: "erklärt", say: true },
  { word: "erzählt", say: true }, { word: "bittet", say: true }, { word: "brüllt", say: true },
  { word: "stottert", say: true }, { word: "jammert", say: true }, { word: "meckert", say: true },
  { word: "behauptet", say: true }, { word: "befiehlt", say: true },
  // Keine Redeverben
  { word: "rennt", say: false }, { word: "springt", say: false }, { word: "schläft", say: false },
  { word: "isst", say: false }, { word: "malt", say: false }, { word: "schwimmt", say: false },
  { word: "klettert", say: false }, { word: "backt", say: false }, { word: "tanzt", say: false },
  { word: "wirft", say: false }, { word: "sitzt", say: false }, { word: "putzt", say: false },
  { word: "kocht", say: false }, { word: "reitet", say: false }, { word: "baut", say: false },
  { word: "fliegt", say: false }, { word: "turnt", say: false }
];

// Comic-Finale: {x} = Kästchen für ein Satzzeichen
const storyData = [
  {
    title: "Der verschwundene Hamster", e: "🐹",
    text: "Am Morgen ist der Käfig leer. Lea ruft{:} {„}Krümel ist weg{!}{“} Mama fragt{:} {„}Hast du die Tür offen gelassen{?}{“} {„}Nein{“}{,} sagt Lea traurig{.} Da hört Papa ein Rascheln. {„}Pssst{“}{,} flüstert er{,} {„}ich glaube, er ist unter dem Sofa{.}{“} Lea jubelt{:} {„}Da ist er ja{!}{“}"
  },
  {
    title: "Das große Fußballspiel", e: "⚽",
    text: "Heute ist das große Spiel. Der Trainer ruft{:} {„}Alle auf den Platz{!}{“} {„}Wo ist mein Trikot{?}{“}{,} fragt Ben{.} Emma lacht{:} {„}Du hast es doch schon an{.}{“} Nach dem Spiel jubeln alle. {„}Wir haben gewonnen{!}{“}{,} ruft die Mannschaft{.} {„}Morgen{“}{,} sagt der Trainer{,} {„}feiern wir eine Party{.}{“}"
  },
  {
    title: "Der Ausflug in den Zoo", e: "🐒",
    text: "Die Klasse 4b fährt in den Zoo. Frau Klein sagt{:} {„}Bleibt bitte zusammen{.}{“} {„}Dürfen wir zu den Affen{?}{“}{,} fragt Noah{.} {„}Na klar{“}{,} antwortet Frau Klein{.} Vor dem Gehege kichert Mia{:} {„}Der kleine Affe winkt uns zu{!}{“} {„}Schaut mal{“}{,} ruft Paul{,} {„}er klaut dem Tierpfleger die Mütze{!}{“}"
  },
  {
    title: "Die Geburtstagsüberraschung", e: "🎂",
    text: "Oma hat heute Geburtstag. Tim flüstert{:} {„}Seid ganz leise{.}{“} {„}Wann kommt Oma endlich{?}{“}{,} fragt Lina{.} Da geht die Tür auf. {„}Überraschung{!}{“}{,} rufen alle{.} Oma staunt{:} {„}Ihr seid die Besten{!}{“} {„}Und jetzt{“}{,} sagt Papa{,} {„}gibt es Kuchen{.}{“}"
  }
];

// ==========================================
// HILFSFUNKTIONEN
// ==========================================
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const splitEnd = (s) => ({ body: s.slice(0, -1), end: s.slice(-1) });

const SIGNS = ['„', '“', ':', ',', '.', '?', '!'];
const SIGN_NAMES = { '„': 'Anführungszeichen unten', '“': 'Anführungszeichen oben', ':': 'Doppelpunkt', ',': 'Komma', '.': 'Punkt', '?': 'Fragezeichen', '!': 'Ausrufezeichen' };
const NO_SPACE_BEFORE = [':', ',', '.', '?', '!', '“'];
const needsSpace = (prev, cur) => prev !== '„' && !NO_SPACE_BEFORE.includes(cur);

// Baut einen Satz als Bausteine. k: 'b' = Begleitsatz, 'r' = Rede, 's' = Zeichen, 'e' = Schlusszeichen der Rede
function buildTokens(item, mode) {
  if (mode === 'mitte') {
    const second = splitEnd(item.b);
    return [
      { t: '„', k: 's' }, { t: item.a, k: 'r' }, { t: '“', k: 's' }, { t: ',', k: 's' },
      { t: `${item.verb} ${item.who}`, k: 'b' }, { t: ',', k: 's' },
      { t: '„', k: 's' }, { t: second.body, k: 'r' }, { t: second.end, k: 'e' }, { t: '“', k: 's' }
    ];
  }
  const { body, end } = splitEnd(item.say);
  if (mode === 'vorne') {
    return [
      { t: `${cap(item.who)} ${item.verb}`, k: 'b' }, { t: ':', k: 's' },
      { t: '„', k: 's' }, { t: body, k: 'r' }, { t: end, k: 'e' }, { t: '“', k: 's' }
    ];
  }
  const toks = [{ t: '„', k: 's' }, { t: body, k: 'r' }];
  if (end !== '.') toks.push({ t: end, k: 'e' });
  toks.push({ t: '“', k: 's' }, { t: ',', k: 's' }, { t: `${item.verb} ${item.who}`, k: 'b' }, { t: '.', k: 's' });
  return toks;
}

function joinTokens(tokens) {
  let out = '';
  tokens.forEach((tok, i) => {
    if (i > 0 && needsSpace(tokens[i - 1].t, tok.t)) out += ' ';
    out += tok.t;
  });
  return out;
}

// Zerlegt einen Satz in Wörter und merkt sich, ob ein Wort zur Rede oder zum Begleitsatz gehört
function buildWords(tokens) {
  let text = '';
  const kinds = [];
  tokens.forEach((tok, i) => {
    if (i > 0 && needsSpace(tokens[i - 1].t, tok.t)) { text += ' '; kinds.push(null); }
    for (const ch of tok.t) { text += ch; kinds.push(tok.k === 'r' || tok.k === 'b' ? tok.k : null); }
  });
  const chars = [...text];
  const words = [];
  let cur = null;
  chars.forEach((ch, i) => {
    if (ch === ' ') { cur = null; return; }
    if (!cur) { cur = { text: '', kind: null }; words.push(cur); }
    cur.text += ch;
    if (!cur.kind && kinds[i]) cur.kind = kinds[i];
  });
  return words;
}

// Kästchen-Sätze (Zeichen-Werkstatt & Comic-Finale)
function finalizeSeq(seq) {
  const slots = seq.filter(p => p.type === 'slot');
  slots.forEach((s, i) => {
    s.idx = i;
    const next = slots[i + 1]?.answer;
    const after = slots[i + 2]?.answer;
    s.accept = [s.answer];
    // Am Ende einer Rede (Begleitsatz vorne/Mitte) passen Punkt und Ausrufezeichen beide.
    if ((s.answer === '.' || s.answer === '!') && next === '“' && after !== ',') s.accept = ['.', '!'];
  });
  return seq;
}

function tokensToSeq(tokens) {
  const seq = [];
  tokens.forEach((tok, i) => {
    if (i > 0 && needsSpace(tokens[i - 1].t, tok.t)) seq.push({ type: 'text', t: ' ' });
    if (tok.k === 's' || tok.k === 'e') seq.push({ type: 'slot', answer: tok.t });
    else seq.push({ type: 'text', t: tok.t });
  });
  return finalizeSeq(seq);
}

function markupToSeq(str) {
  const seq = [];
  const re = /\{(.)\}/g;
  let last = 0;
  let m;
  while ((m = re.exec(str))) {
    if (m.index > last) seq.push({ type: 'text', t: str.slice(last, m.index) });
    seq.push({ type: 'slot', answer: m[1] });
    last = re.lastIndex;
  }
  if (last < str.length) seq.push({ type: 'text', t: str.slice(last) });
  return finalizeSeq(seq);
}

// Mischt Grund-Sätze in Begleitsatz vorne / hinten / Mitte
const makeRedeItems = (nVorne, nHinten, nMitte) => {
  const base = shuffleArray(redeData);
  const list = [
    ...base.slice(0, nVorne).map(d => ({ ...d, mode: 'vorne' })),
    ...base.slice(nVorne, nVorne + nHinten).map(d => ({ ...d, mode: 'hinten' })),
    ...shuffleArray(mitteData).slice(0, nMitte).map(d => ({ ...d, mode: 'mitte' }))
  ];
  return shuffleArray(list).map(it => ({ ...it, tokens: buildTokens(it, it.mode) }));
};

const MODE_LABEL = { vorne: 'VORNE', hinten: 'HINTEN', mitte: 'IN DER MITTE' };
const MODE_EXPLAIN = {
  vorne: "Begleitsatz vorne → Doppelpunkt! Das Satzzeichen der Rede steht vor dem “.",
  hinten: "Begleitsatz hinten → Komma nach dem “ und Punkt am Ende. Der Punkt der Rede fällt weg – ? und ! bleiben.",
  mitte: "Begleitsatz in der Mitte → ein Komma davor und eins dahinter."
};

// Antwort vergleichen: „ = Anfang, “ = Ende, gerade " werden abwechselnd gedeutet. Leerzeichen um Zeichen sind egal.
function normalizeAnswer(s) {
  let out = '';
  let q = 0;
  for (const ch of s.trim()) {
    if (ch === '„' || ch === '‚' || ch === '«') { out += '<'; q++; }
    else if (ch === '“' || ch === '”' || ch === '»' || ch === '‘' || ch === '’') { out += '>'; q++; }
    else if (ch === '"' || ch === "'") { out += q % 2 === 0 ? '<' : '>'; q++; }
    else out += ch;
  }
  return out.replace(/\s+/g, ' ').replace(/\s*([<>:,.?!])\s*/g, '$1');
}

function diagnoseAnswer(user, solution, mode) {
  const u = normalizeAnswer(user);
  const s = normalizeAnswer(solution);
  const letters = (x) => x.replace(/[^A-Za-zÄÖÜäöüß]/g, '').toLowerCase();
  if (letters(u) !== letters(s)) return "Schau genau: Stimmen alle Wörter? Vergleiche mit der Sprechblase und dem Begleitsatz! 🔍";
  if (!u.includes('<') || !u.includes('>')) return "Die Anführungszeichen fehlen: unten „ am Anfang, oben “ am Ende.";
  if (u.indexOf('<') > u.indexOf('>')) return "Achtung: Am Anfang stehen die Anführungszeichen unten „, am Ende oben “.";
  if (mode === 'vorne') {
    if (!u.includes(':<')) return "Nach dem Begleitsatz vorne kommt ein Doppelpunkt – direkt vor dem „.";
    if (!/[.?!]>$/.test(u)) return "Das Satzzeichen der Rede steht vor dem Schluss-Anführungszeichen “.";
  }
  if (mode === 'hinten') {
    if (/\.>/.test(u)) return "Steht der Begleitsatz hinten, fällt der Punkt der Rede weg!";
    if (!u.includes('>,')) return "Nach dem Schluss-Anführungszeichen “ kommt ein Komma.";
    if (!u.endsWith('.')) return "Am Ende des Begleitsatzes steht ein Punkt.";
  }
  if (u.toLowerCase() === s.toLowerCase()) return "Fast! Achte auf die Groß- und Kleinschreibung.";
  return "Fast! Vergleiche jedes Satzzeichen noch einmal ganz genau.";
}

const getRandomErrorFeedback = () => {
  const msgs = ["Fast richtig! Probier es noch mal! 💪", "Nicht ganz! Versuch es gleich nochmal! 💬", "Knapp daneben! Du schaffst das! 🦸", "Das war es nicht ganz, gleich hast du es! ✨", "Ups! Schau noch mal genau hin! 🔍"];
  return msgs[Math.floor(Math.random() * msgs.length)];
};

const getRandomSuccessFeedback = () => {
  const msgs = ["Super! 🌟", "Richtig! 🎉", "Klasse gemacht! 🚀", "Stark! 💪", "Genau so! ✨", "Perfekt! 🏆", "Heldenhaft! 🦸", "ZACK! Richtig! 💥"];
  return msgs[Math.floor(Math.random() * msgs.length)];
};

const triggerHaptic = (isError = true) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(isError ? [50, 50, 50] : [50]);
  }
};

// ==========================================
// FEEDBACK HOOKS (Sicheres Timer-Management)
// ==========================================
function useFeedback() {
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("error");
  const timerRef = useRef(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const showFeedback = (newMsg, newType = "error", duration = 4000) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMsg(newMsg);
    setType(newType);
    if (duration > 0) {
      timerRef.current = setTimeout(() => setMsg(""), duration);
    }
  };

  const clearFeedback = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMsg("");
  };

  return { msg, type, showFeedback, clearFeedback };
}

// Richtig/Falsch-Rückmeldung + Tipp nach 3 Fehlern in Folge
function useGameFeedback(onShowTip) {
  const { msg, type, showFeedback, clearFeedback } = useFeedback();
  const consec = useRef(0);

  const good = (text, duration = 2500) => {
    triggerHaptic(false);
    consec.current = 0;
    showFeedback(text || getRandomSuccessFeedback(), "success", duration);
  };

  const bad = (tip, text) => {
    triggerHaptic(true);
    consec.current += 1;
    if (consec.current >= 3 && tip && onShowTip) {
      consec.current = 0;
      clearFeedback();
      onShowTip(tip);
    } else {
      showFeedback(text || getRandomErrorFeedback(), "error", 4000);
    }
  };

  const info = (text) => showFeedback(text, "error", 3000);

  return { msg, type, good, bad, info, clear: clearFeedback };
}

// ==========================================
// GEMEINSAME BAUSTEINE
// ==========================================
function SuccessSparkles({ size = 1 }) {
  const colors = ['text-yellow-300', 'text-pink-400', 'text-cyan-300', 'text-lime-300'];
  const icons = [Star, MessageCircle, Sparkles, Zap];
  const [parts] = useState(() => [...Array(12)].map((_, i) => {
    const angle = (i * 30 + Math.random() * 15) * (Math.PI / 180);
    const dist = 50 + Math.random() * 50;
    return { tx: Math.cos(angle) * dist + 'px', ty: Math.sin(angle) * dist + 'px', rot: (Math.random() * 720 - 360) + 'deg' };
  }));

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50" style={{ transform: `scale(${size})` }}>
      {parts.map((p, i) => {
        const Icon = icons[i % icons.length];
        return (
          <Icon
            key={i}
            className={`absolute ${colors[i % colors.length]} w-6 h-6 md:w-8 md:h-8 anim-burst drop-shadow-lg ${Icon !== Sparkles ? 'fill-current' : ''}`}
            style={{ '--tx': p.tx, '--ty': p.ty, '--rot': p.rot }}
          />
        );
      })}
    </div>
  );
}

function ImmediateFeedback({ msg, type = 'error' }) {
  const isError = type === 'error';
  const bgClass = isError
    ? "bg-amber-900/95 text-amber-200 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
    : "bg-lime-900/95 text-lime-200 border-lime-500/50 shadow-[0_0_20px_rgba(132,204,22,0.4)]";

  return (
    <div className={`min-h-[3.5rem] flex items-center justify-center w-full transition-all duration-300 ${msg ? 'mt-2 mb-4' : ''}`}>
      {msg ? <span key={msg + type} className={`font-bold px-6 py-3 rounded-full border-2 anim-pop text-lg md:text-xl z-50 flex items-center gap-2 text-center ${bgClass}`}>{msg}</span> : null}
    </div>
  );
}

function GameTitle({ icon: Icon, color, title, children }) {
  return (
    <>
      <h2 className={`text-3xl ${color} font-black mb-2 flex items-center justify-center gap-3`}><Icon className="w-8 h-8 anim-float" /> {title}</h2>
      <p className="text-slate-300 text-lg mb-4">{children}</p>
    </>
  );
}

function RoundInfo({ current, total }) {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {[...Array(total)].map((_, i) => (
        <div key={i} className={`h-3 rounded-full transition-all duration-500 ${i < current ? 'w-8 bg-yellow-400' : i === current ? 'w-12 bg-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.8)]' : 'w-8 bg-slate-700'}`} />
      ))}
    </div>
  );
}

function NextButton({ onClick, children = "Weiter" }) {
  return (
    <button onClick={onClick} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-12 rounded-xl text-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] anim-pop active:scale-95 transition-all inline-flex items-center gap-2">
      {children} <ArrowRight className="w-5 h-5" />
    </button>
  );
}

function CheckButton({ onClick, disabled, color = "bg-pink-600 hover:bg-pink-500", children = "Prüfen" }) {
  return (
    <button onClick={onClick} disabled={disabled} className={`${color} disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 px-12 rounded-xl text-xl shadow-lg transition-all active:scale-95`}>{children}</button>
  );
}

// Comic-Panel mit Figur und Sprechblase
function SpeechBubble({ emoji, name, text }) {
  return (
    <div className="flex items-center justify-center gap-6 md:gap-10 my-4">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 border-4 border-indigo-950 flex items-center justify-center text-5xl md:text-6xl shadow-[4px_4px_0_rgba(0,0,0,0.4)]">{emoji}</div>
        <span className="mt-2 bg-indigo-950 text-yellow-300 font-black text-sm md:text-base px-3 py-1 rounded-full border-2 border-yellow-400/50">{cap(name)}</span>
      </div>
      <div className="bubble px-6 py-4 md:px-8 md:py-6 max-w-md">
        <p className="text-2xl md:text-3xl font-bold leading-snug">{text}</p>
      </div>
    </div>
  );
}

// Kleiner Bauplan: B = Begleitsatz, R = Rede
function Blueprint({ mode, small = false }) {
  const B = <span className={`inline-block ${small ? 'w-6 h-4' : 'w-10 h-6'} rounded-md bg-cyan-400 align-middle`} />;
  const R = <span className={`inline-block ${small ? 'w-8 h-4' : 'w-14 h-6'} rounded-md bg-yellow-300 align-middle`} />;
  const S = ({ c }) => <span className={`font-serif font-black text-pink-300 ${small ? 'text-lg' : 'text-2xl'} mx-0.5 align-middle`}>{c}</span>;
  return (
    <span className="inline-flex items-center gap-0.5 whitespace-nowrap">
      {mode === 'vorne' && <>{B}<S c=":" /><S c="„" />{R}<S c="“" /></>}
      {mode === 'hinten' && <><S c="„" />{R}<S c="“" /><S c="," />{B}<S c="." /></>}
      {mode === 'mitte' && <><S c="„" />{R}<S c="“" /><S c="," />{B}<S c="," /><S c="„" />{R}<S c="“" /></>}
    </span>
  );
}

// Satz mit farbig markierter Rede und Begleitsatz (Regeln)
function ColoredSentence({ tokens }) {
  return (
    <span className="font-serif">
      {tokens.map((tok, i) => (
        <React.Fragment key={i}>
          {i > 0 && needsSpace(tokens[i - 1].t, tok.t) ? ' ' : ''}
          <span className={tok.k === 'b' ? 'text-cyan-300 font-bold' : tok.k === 'r' ? 'text-yellow-200' : 'text-pink-400 font-black text-[1.2em]'}>{tok.t}</span>
        </React.Fragment>
      ))}
    </span>
  );
}

// Satzzeichen-Leiste
function SignToolbar({ onSign, onErase, disabled }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3 my-4">
      {SIGNS.map(s => (
        <button key={s} title={SIGN_NAMES[s]} onClick={() => onSign(s)} disabled={disabled} className="w-14 h-16 md:w-16 md:h-[4.5rem] rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-indigo-950 font-black text-4xl font-serif shadow-[0_5px_0_rgba(161,98,7,1)] active:translate-y-1 active:shadow-none disabled:opacity-40 transition-all">
          {s}
        </button>
      ))}
      {onErase && (
        <button title="Löschen" onClick={onErase} disabled={disabled} className="w-14 h-16 md:w-16 md:h-[4.5rem] rounded-2xl bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center shadow-[0_5px_0_rgba(30,41,59,1)] active:translate-y-1 active:shadow-none disabled:opacity-40 transition-all">
          <Eraser className="w-7 h-7" />
        </button>
      )}
    </div>
  );
}

// Kästchen-Logik
function useSlots(seq) {
  const slots = useMemo(() => seq.filter(p => p.type === 'slot'), [seq]);
  const count = slots.length;
  const [filled, setFilled] = useState(() => Array(count).fill(''));
  const [status, setStatus] = useState(() => Array(count).fill(null));
  const [selected, setSelected] = useState(0);

  const isLocked = (i) => status[i] === 'correct';

  const selectSlot = (i) => { if (!isLocked(i)) setSelected(i); };

  const placeSign = (sign) => {
    if (selected === null || isLocked(selected)) return;
    const nf = [...filled];
    nf[selected] = sign;
    setFilled(nf);
    setStatus(st => { const n = [...st]; n[selected] = null; return n; });
    let next = null;
    for (let k = 1; k <= count; k++) {
      const j = (selected + k) % count;
      if (!nf[j] && status[j] !== 'correct') { next = j; break; }
    }
    if (next !== null) setSelected(next);
  };

  const erase = () => {
    if (selected === null || isLocked(selected)) return;
    setFilled(f => { const n = [...f]; n[selected] = ''; return n; });
    setStatus(st => { const n = [...st]; n[selected] = null; return n; });
  };

  // Gibt die Anzahl falscher Kästchen zurück (-1 = noch nicht alle ausgefüllt)
  const check = () => {
    if (filled.some(f => !f)) return -1;
    const newStatus = slots.map(s => (s.accept.includes(filled[s.idx]) ? 'correct' : 'wrong'));
    setStatus(newStatus);
    const firstWrong = newStatus.indexOf('wrong');
    setSelected(firstWrong >= 0 ? firstWrong : null);
    return newStatus.filter(x => x === 'wrong').length;
  };

  return { filled, status, selected, selectSlot, placeSign, erase, check, count, filledCount: filled.filter(Boolean).length };
}

function SlotSentence({ seq, filled, status, selected, onSlotClick, solved }) {
  return (
    <div className={`relative bg-slate-900/70 p-6 md:p-10 rounded-3xl border-4 shadow-inner text-left text-2xl md:text-3xl font-serif text-slate-100 leading-[3.6rem] md:leading-[4.2rem] whitespace-pre-wrap select-none transition-all ${solved ? 'border-lime-500/60 shadow-[0_0_30px_rgba(132,204,22,0.3)]' : 'border-indigo-500/30'}`}>
      {seq.map((part, i) => {
        if (part.type === 'text') return <span key={i}>{part.t}</span>;
        const st = status[part.idx];
        const isSel = selected === part.idx && !solved;
        let cls = 'border-slate-500 bg-slate-800 text-yellow-300 hover:border-yellow-300';
        if (st === 'correct') cls = 'border-lime-400 bg-lime-900/60 text-lime-200';
        else if (st === 'wrong') cls = 'border-rose-500 bg-rose-900/60 text-rose-200 anim-shake';
        else if (isSel) cls = 'border-yellow-300 bg-indigo-800 text-yellow-200 shadow-[0_0_18px_rgba(250,204,21,0.7)] scale-110';
        return (
          <button key={i} onClick={() => onSlotClick(part.idx)} className={`inline-flex items-center justify-center align-middle w-10 h-12 md:w-12 md:h-14 mx-0.5 -my-2 rounded-xl border-4 border-dashed font-black text-3xl md:text-4xl leading-none transition-all ${cls}`}>
            {filled[part.idx] || ''}
          </button>
        );
      })}
    </div>
  );
}

// Baustein-Brett (Satz-Puzzle & Umstell-Maschine)
function TokenBoard({ pool, answer, onPick, onRemove, wrong, solved }) {
  const chip = (tok, onClick, inAnswer) => {
    const isSign = SIGNS.includes(tok.t);
    return (
      <button key={tok.id} onClick={onClick} disabled={solved} className={`relative px-4 py-3 rounded-2xl border-b-4 font-bold transition-all active:scale-95 ${isSign ? 'bg-pink-500 border-pink-800 text-white font-serif text-3xl min-w-[3.2rem]' : 'bg-slate-100 border-slate-400 text-indigo-950 text-xl md:text-2xl'} ${inAnswer && solved ? 'ring-4 ring-lime-400' : ''}`}>
        {tok.t}
      </button>
    );
  };
  return (
    <div className="flex flex-col gap-6">
      <div className={`min-h-[6rem] flex flex-wrap items-center justify-center gap-2 p-4 rounded-3xl border-4 border-dashed transition-all ${solved ? 'border-lime-400 bg-lime-900/20' : wrong ? 'border-rose-500 bg-rose-900/20 anim-shake' : 'border-indigo-400/50 bg-slate-900/60'}`}>
        {answer.length === 0 && <span className="text-slate-500 italic">Tippe die Bausteine unten in der richtigen Reihenfolge an …</span>}
        {answer.map(tok => chip(tok, () => onRemove(tok.id), true))}
        {solved && <SuccessSparkles size={1.5} />}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 min-h-[4rem]">
        {pool.map(tok => chip(tok, () => onPick(tok.id), false))}
      </div>
    </div>
  );
}

// ==========================================
// MODALS & HILFEN
// ==========================================
function RulesModal({ onClose }) {
  const ex = { who: "Tim", verb: "sagt", say: "Ich habe Hunger." };
  const exQ = { who: "Tim", verb: "fragt", say: "Hast du Hunger?" };
  const exM = { who: "Tim", verb: "sagt", a: "Heute", b: "habe ich großen Hunger." };
  const heroes = [
    { sign: ':', name: 'Dora Doppelpunkt', text: 'Ich stehe hinter dem Begleitsatz, wenn er VORNE steht. Ich rufe: Achtung, gleich spricht jemand!', color: 'border-cyan-400 text-cyan-300' },
    { sign: '„ “', name: 'Anton Anführungszeichen', text: 'Ich umarme alles, was gesprochen wird: unten „ am Anfang, oben “ am Ende.', color: 'border-yellow-400 text-yellow-300' },
    { sign: ',', name: 'Kalle Komma', text: 'Steht der Begleitsatz HINTEN oder in der MITTE, trenne ich ihn von der Rede.', color: 'border-pink-400 text-pink-300' }
  ];
  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[150] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="bg-indigo-950 border-4 border-yellow-400 rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-[0_0_50px_rgba(250,204,21,0.3)] anim-pop relative flex flex-col max-h-[92vh]">
        <h3 className="text-3xl md:text-5xl font-comic text-yellow-300 mb-4 text-center flex justify-center items-center gap-3 drop-shadow-md">
          <BookOpen className="w-8 h-8 flex-shrink-0 anim-float" /> Die Heldenregeln
        </h3>
        <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar flex flex-col gap-4 mb-6">
          <div className="bg-indigo-900/60 p-4 rounded-2xl border-l-8 border-yellow-400">
            <p className="text-indigo-100 text-lg"><b className="text-yellow-300">Wörtliche Rede</b> ist genau das, was jemand sagt – wie in einer Sprechblase. <b className="text-cyan-300">Der Begleitsatz</b> verrät, <i>wer</i> spricht und <i>wie</i>.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {heroes.map(h => (
              <div key={h.name} className={`bg-slate-900/70 p-3 rounded-2xl border-2 ${h.color} text-center`}>
                <div className="text-4xl font-serif font-black mb-1">{h.sign}</div>
                <div className="font-black text-sm mb-1">{h.name}</div>
                <p className="text-slate-300 text-xs leading-snug">{h.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-indigo-900/60 p-4 rounded-2xl border-l-8 border-cyan-400">
            <h4 className="text-cyan-300 font-bold text-xl flex items-center gap-2 flex-wrap">1. Begleitsatz VORNE <Blueprint mode="vorne" small /></h4>
            <p className="text-2xl mt-2 bg-slate-950/50 p-3 rounded-xl"><ColoredSentence tokens={buildTokens(ex, 'vorne')} /></p>
            <p className="text-indigo-100 mt-2">Nach dem Begleitsatz steht ein <b>Doppelpunkt</b>. Das Satzzeichen der Rede steht <b>vor</b> dem “.</p>
          </div>

          <div className="bg-indigo-900/60 p-4 rounded-2xl border-l-8 border-pink-400">
            <h4 className="text-pink-300 font-bold text-xl flex items-center gap-2 flex-wrap">2. Begleitsatz HINTEN <Blueprint mode="hinten" small /></h4>
            <p className="text-2xl mt-2 bg-slate-950/50 p-3 rounded-xl"><ColoredSentence tokens={buildTokens(ex, 'hinten')} /></p>
            <p className="text-2xl mt-2 bg-slate-950/50 p-3 rounded-xl"><ColoredSentence tokens={buildTokens(exQ, 'hinten')} /></p>
            <ul className="text-indigo-100 mt-2 list-disc pl-6 space-y-1">
              <li>Nach dem “ kommt ein <b>Komma</b>, am Ende ein <b>Punkt</b>.</li>
              <li>Der <b>Punkt</b> der Rede <b>fällt weg</b>. <b>?</b> und <b>!</b> bleiben stehen.</li>
              <li>Der Begleitsatz beginnt <b>klein</b>.</li>
            </ul>
          </div>

          <div className="bg-indigo-900/60 p-4 rounded-2xl border-l-8 border-lime-400">
            <h4 className="text-lime-300 font-bold text-xl flex items-center gap-2 flex-wrap">3. Begleitsatz in der MITTE <span className="text-xs bg-lime-400 text-lime-950 px-2 py-0.5 rounded-full">Profi</span> <Blueprint mode="mitte" small /></h4>
            <p className="text-2xl mt-2 bg-slate-950/50 p-3 rounded-xl"><ColoredSentence tokens={buildTokens(exM, 'mitte')} /></p>
            <p className="text-indigo-100 mt-2">Der Begleitsatz wird von <b>zwei Kommas</b> eingerahmt. Die Rede geht danach <b>klein</b> weiter.</p>
          </div>

          <div className="bg-yellow-400/10 border-2 border-yellow-400/40 p-3 rounded-2xl text-center text-yellow-200 font-bold">
            Merksatz: Begleitsatz vorne → Doppelpunkt. Begleitsatz hinten → Komma!
          </div>
        </div>
        <button onClick={onClose} className="w-full bg-yellow-400 hover:bg-yellow-300 text-indigo-950 font-black text-lg py-4 rounded-xl shadow-[0_4px_0_rgba(161,98,7,1)] active:translate-y-1 uppercase tracking-wider">Alles klar!</button>
      </div>
    </div>
  );
}

function ContextTipModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
      <div className="bg-indigo-950 border-4 border-pink-400 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-[0_0_40px_rgba(244,114,182,0.3)] anim-pop relative text-center">
        <div className="bg-pink-400/20 p-4 rounded-full inline-block mb-4"><MessageCircle className="w-10 h-10 text-pink-300 anim-twinkle" /></div>
        <h3 className="text-2xl md:text-3xl font-black text-pink-300 mb-4">Tipp von Kalle Komma!</h3>
        <p className="text-indigo-50 text-lg md:text-xl mb-8 leading-relaxed">{message}</p>
        <button onClick={onClose} className="w-full bg-pink-500 hover:bg-pink-400 text-white font-black py-4 rounded-xl shadow-[0_4px_0_rgba(157,23,77,1)] active:translate-y-1 uppercase tracking-wider">Weiter geht's!</button>
      </div>
    </div>
  );
}

function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[150] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border-4 border-cyan-400 rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-[0_0_50px_rgba(34,211,238,0.3)] anim-pop relative flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl md:text-4xl font-black text-cyan-300 flex items-center gap-3 drop-shadow-md">
            <HelpCircle className="w-8 h-8 flex-shrink-0 anim-float" /> Helden-Hilfe
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2 transition-colors">✕</button>
        </div>
        <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GAMES.map((game, i) => (
              <div key={game.id} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex gap-4 items-start">
                <game.icon className="w-8 h-8 text-yellow-300 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-200 mb-1">{i + 1}. {game.title}</h4>
                  <p className="text-sm text-slate-400 leading-snug">{game.help}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-sm mt-6 text-center">In jedem Spiel kannst du 10 Sterne sammeln. Mit 9 Sternen schaltest du das nächste Spiel im Pfad frei. Mit 10 Sternen bekommst du ein Helden-Abzeichen!</p>
        </div>
      </div>
    </div>
  );
}

// Abzeichen-Sammlung (Schatzkammer)
function TreasureModal({ onClose, gameProgress }) {
  const totalUnlocked = GAMES.filter(g => (gameProgress[g.id]?.score || 0) >= 10).length;

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[150] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border-4 border-yellow-400 rounded-3xl max-w-5xl w-full p-6 md:p-8 shadow-[0_0_60px_rgba(250,204,21,0.2)] anim-pop relative flex flex-col max-h-[95vh]">
        <div className="flex justify-between items-center mb-6 border-b-2 border-slate-800 pb-4">
          <h3 className="text-3xl md:text-5xl font-comic text-yellow-300 flex items-center gap-4 drop-shadow-md">
            <Trophy className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 anim-float" /> Helden-Abzeichen
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-3 transition-colors">✕</button>
        </div>

        <p className="text-slate-300 text-lg md:text-xl mb-6 text-center font-bold">
          Sammle <span className="text-yellow-300">volle 10 Sterne</span> in einem Spiel, um sein Abzeichen zu bekommen! <br />
          <span className="text-sm opacity-70">Gesammelte Abzeichen: {totalUnlocked} / {GAMES.length}</span>
        </p>

        <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {GAMES.map((game, i) => {
              const isUnlocked = (gameProgress[game.id]?.score || 0) >= 10;
              const b = game.badge;
              return (
                <div key={game.id} className={`relative flex flex-col items-center p-4 rounded-2xl border-4 transition-all duration-500 ${isUnlocked ? `${b.bg} ${b.border} shadow-[0_0_20px_rgba(0,0,0,0.5)] transform hover:scale-105 hover:z-10` : 'bg-slate-950/80 border-slate-800'}`}>
                  <div className="h-20 w-20 flex items-center justify-center relative mb-3">
                    {isUnlocked ? (
                      <>
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-xl anim-hud"></div>
                        <b.icon className={`w-14 h-14 ${b.color} drop-shadow-lg anim-float`} />
                        <SuccessSparkles size={0.5} />
                      </>
                    ) : (
                      <>
                        <b.icon className="w-12 h-12 text-slate-800" />
                        <Lock className="w-8 h-8 text-slate-500 absolute drop-shadow-md" />
                      </>
                    )}
                  </div>
                  <h4 className={`font-black text-center text-sm md:text-base leading-tight mb-1 min-h-[2.5rem] flex items-center justify-center ${isUnlocked ? b.color : 'text-slate-600'}`}>
                    {isUnlocked ? b.name : '???'}
                  </h4>
                  <div className={`w-full text-center text-[10px] md:text-xs font-bold py-1 px-2 rounded-lg mt-auto ${isUnlocked ? 'bg-yellow-500/20 text-yellow-200' : 'bg-slate-800 text-slate-500'}`}>
                    {isUnlocked ? 'Freigeschaltet!' : `Fehlt in: ${i + 1}. ${game.title}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {totalUnlocked === GAMES.length && (
          <div className="mt-6 p-4 bg-yellow-900/40 border-2 border-yellow-400 rounded-xl text-center anim-pop">
            <h4 className="text-yellow-300 font-black text-xl flex items-center justify-center gap-2"><Star className="w-6 h-6 fill-yellow-300" /> Superheld der wörtlichen Rede! <Star className="w-6 h-6 fill-yellow-300" /></h4>
            <p className="text-yellow-100/80 mt-1">Du hast alle Abzeichen gesammelt. Comic-Stadt ist gerettet!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// THEMATISCHE MINISPIELE (10 STERNE MAX PRO SPIEL)
// ==========================================

// 1. Stimmen-Marker: Rede gelb, Begleitsatz blau markieren
function MarkerGame({ onFinish, onShowTip }) {
  const [items] = useState(() => makeRedeItems(2, 2, 1));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const fb = useGameFeedback(onShowTip);

  const next = (stars) => {
    fb.clear();
    const s = score + stars;
    if (idx + 1 < items.length) { setScore(s); setIdx(idx + 1); } else onFinish(s, 10);
  };

  return (
    <div className="w-full text-center">
      <GameTitle icon={Highlighter} color="text-yellow-300" title="Stimmen-Marker">
        Markiere die <strong className="text-yellow-300">wörtliche Rede gelb</strong> und den <strong className="text-cyan-300">Begleitsatz blau</strong>.<br />
        <span className="text-sm opacity-70">(Tipp: Du kannst auch mit dem Finger über mehrere Wörter wischen!)</span>
      </GameTitle>
      <RoundInfo current={idx} total={items.length} />
      <MarkerRound key={idx} item={items[idx]} fb={fb} onNext={next} />
      <ImmediateFeedback msg={fb.msg} type={fb.type} />
    </div>
  );
}

function MarkerRound({ item, fb, onNext }) {
  const words = useMemo(() => buildWords(item.tokens), [item]);
  const [marks, setMarks] = useState(() => words.map(() => null));
  const [active, setActive] = useState('r');
  const [solved, setSolved] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [wrongFlash, setWrongFlash] = useState([]);
  const painting = useRef(false);

  useEffect(() => {
    const stop = () => { painting.current = false; };
    window.addEventListener('pointerup', stop);
    return () => window.removeEventListener('pointerup', stop);
  }, []);

  const paint = (i, toggle = false) => {
    if (solved) return;
    setMarks(m => {
      const n = [...m];
      n[i] = toggle && m[i] === active ? null : active;
      return n;
    });
  };

  const handleDown = (e, i) => {
    if (e.target.releasePointerCapture) { try { e.target.releasePointerCapture(e.pointerId); } catch (err) { /* egal */ } }
    painting.current = true;
    paint(i, true);
  };

  const handleMove = (e) => {
    if (!painting.current) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const w = el && el.closest('[data-w]');
    if (w) {
      const i = parseInt(w.getAttribute('data-w'), 10);
      if (marks[i] !== active) paint(i);
    }
  };

  const check = () => {
    if (marks.some(m => !m)) { fb.info("Markiere zuerst alle Wörter! 🖍️"); return; }
    const wrong = words.map((w, i) => (marks[i] !== w.kind ? i : null)).filter(x => x !== null);
    if (wrong.length === 0) {
      fb.good();
      setSolved(true);
    } else {
      fb.bad("Die wörtliche Rede steht zwischen den Anführungszeichen „ … “. Alles andere gehört zum Begleitsatz – er verrät, WER spricht und WIE.");
      setMistakes(m => m + 1);
      setWrongFlash(wrong);
      setTimeout(() => setWrongFlash([]), 1200);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8 mb-8">
        <button onClick={() => setActive('r')} className={`flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-black text-xl transition-all duration-300 ${active === 'r' ? 'bg-yellow-300 text-yellow-950 shadow-[0_0_30px_rgba(250,204,21,0.6)] scale-110 -translate-y-1' : 'bg-slate-800 text-yellow-300 border-2 border-slate-700 hover:border-yellow-300/50'}`}>
          <Highlighter className={active === 'r' ? 'animate-bounce' : ''} /> Rede-Marker
        </button>
        <button onClick={() => setActive('b')} className={`flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-black text-xl transition-all duration-300 ${active === 'b' ? 'bg-cyan-400 text-cyan-950 shadow-[0_0_30px_rgba(34,211,238,0.6)] scale-110 -translate-y-1' : 'bg-slate-800 text-cyan-300 border-2 border-slate-700 hover:border-cyan-300/50'}`}>
          <Highlighter className={active === 'b' ? 'animate-bounce' : ''} /> Begleitsatz-Marker
        </button>
      </div>

      <div onPointerMove={handleMove} className={`relative flex flex-wrap justify-center gap-x-1 gap-y-3 bg-slate-900/70 p-6 md:p-10 rounded-3xl border-4 mb-6 shadow-inner text-2xl md:text-4xl font-serif select-none touch-none ${solved ? 'border-lime-500/60 shadow-[0_0_30px_rgba(132,204,22,0.3)]' : 'border-slate-700/50'}`}>
        {solved && <SuccessSparkles size={2} />}
        {words.map((w, i) => {
          let cls = 'text-slate-200 hover:bg-slate-700/60';
          if (marks[i] === 'r') cls = 'bg-yellow-300 text-yellow-950 font-bold';
          if (marks[i] === 'b') cls = 'bg-cyan-400 text-cyan-950 font-bold';
          if (wrongFlash.includes(i)) cls += ' ring-4 ring-rose-500 anim-shake';
          return (
            <span key={i} data-w={i} onPointerDown={(e) => handleDown(e, i)} className={`px-2 py-1 rounded-xl cursor-pointer transition-colors duration-150 ${cls}`}>{w.text}</span>
          );
        })}
      </div>

      {!solved ? (
        <CheckButton onClick={check} color="bg-yellow-500 hover:bg-yellow-400 !text-yellow-950" />
      ) : (
        <div className="anim-pop flex flex-col items-center gap-4">
          <div className="bg-indigo-950/80 p-4 rounded-xl text-cyan-200 flex items-center gap-3 flex-wrap justify-center">
            Der Begleitsatz steht hier <b className="text-yellow-300">{MODE_LABEL[item.mode]}</b>: <Blueprint mode={item.mode} small />
          </div>
          <NextButton onClick={() => onNext(mistakes === 0 ? 2 : 0)} />
        </div>
      )}
    </div>
  );
}

// 2. Begleitsatz-Radar: Wo steht der Begleitsatz?
function SortGame({ onFinish, onShowTip }) {
  const [items] = useState(() => makeRedeItems(4, 4, 2).map(it => ({ text: joinTokens(it.tokens), mode: it.mode })));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [solved, setSolved] = useState(false);
  const fb = useGameFeedback(onShowTip);
  const item = items[idx];

  const handleSort = (mode) => {
    if (solved || wrongGuesses.includes(mode)) return;
    if (mode === item.mode) {
      fb.good(null, 1500);
      const s = score + (wrongGuesses.length === 0 ? 1 : 0);
      setScore(s);
      setSolved(true);
      setTimeout(() => {
        if (idx + 1 < items.length) { setIdx(idx + 1); setSolved(false); setWrongGuesses([]); fb.clear(); }
        else onFinish(s, 10);
      }, 1600);
    } else {
      fb.bad("Suche zuerst die Anführungszeichen „ … “. Was davor oder dahinter steht, ist der Begleitsatz. Steht er zwischen zwei Redeteilen, ist er in der Mitte!");
      setWrongGuesses(g => [...g, mode]);
    }
  };

  const gates = [
    { mode: 'vorne', label: 'Begleitsatz VORNE' },
    { mode: 'hinten', label: 'Begleitsatz HINTEN' },
    { mode: 'mitte', label: 'IN DER MITTE', profi: true }
  ];

  return (
    <div className="w-full text-center">
      <GameTitle icon={Radar} color="text-cyan-300" title="Begleitsatz-Radar">Wo steht der Begleitsatz? Wähle das richtige Tor!</GameTitle>
      <RoundInfo current={idx} total={items.length} />

      <div className="flex justify-center mb-10 min-h-[8rem] items-center">
        <div key={idx} className={`text-2xl md:text-4xl font-serif bg-slate-900 border-4 py-6 px-8 md:px-12 rounded-3xl transition-all ${solved ? 'border-cyan-300 text-cyan-200 scale-90 opacity-0 translate-y-16 duration-700' : wrongGuesses.length > 0 ? 'border-rose-800 text-rose-200 anim-shake' : 'border-slate-600 text-slate-100 anim-pop'}`}>
          {item.text}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        {gates.map(g => {
          const isRight = solved && g.mode === item.mode;
          const isWrong = wrongGuesses.includes(g.mode);
          return (
            <button key={g.mode} onClick={() => handleSort(g.mode)} disabled={solved} className={`relative flex flex-col justify-center items-center gap-3 p-5 rounded-t-[3rem] rounded-b-2xl border-4 h-[150px] transition-all ${isRight ? 'anim-chest-bounce border-yellow-300 bg-cyan-800 z-10 shadow-[0_0_30px_rgba(34,211,238,0.5)]' : isWrong ? 'border-slate-800 bg-slate-900 opacity-50 anim-shake' : 'border-cyan-700 bg-cyan-950/70 hover:bg-cyan-900'}`}>
              <span className="text-xl md:text-2xl font-black text-cyan-200">{g.label}</span>
              <Blueprint mode={g.mode} />
              {g.profi && <span className="absolute top-3 right-4 text-[10px] bg-lime-400 text-lime-950 font-black px-2 py-0.5 rounded-full">PROFI</span>}
              {isRight && <SuccessSparkles size={1.5} />}
            </button>
          );
        })}
      </div>
      <ImmediateFeedback msg={fb.msg} type={fb.type} />
    </div>
  );
}

// 3. Comic-Check: Welche Schreibweise ist richtig?
function comicOptions(item, mode) {
  const correct = joinTokens(buildTokens(item, mode));
  const { body, end } = splitEnd(item.say);
  const front = `${cap(item.who)} ${item.verb}`;
  const back = `${item.verb} ${item.who}`;
  let wrongs;
  let must = null;
  if (mode === 'vorne') {
    wrongs = [
      `${front} „${body}${end}“`,
      `${front}: „${body}“${end}`,
      `${front}, „${body}${end}“`,
      `${front}: ${body}${end}`
    ];
  } else {
    const e2 = end === '.' ? '' : end;
    wrongs = [
      `„${body}${e2}“ ${back}.`,
      `„${body}${e2}“, ${cap(back)}.`,
      `„${body}${e2},“ ${back}.`,
      `„${body}${e2}“: ${back}.`
    ];
    if (end === '.') must = `„${body}.“, ${back}.`;
  }
  const picked = must ? [must, shuffleArray(wrongs)[0]] : shuffleArray(wrongs).slice(0, 2);
  return shuffleArray([{ text: correct, ok: true }, ...picked.map(t => ({ text: t, ok: false }))]);
}

function ComicGame({ onFinish, onShowTip }) {
  const [items] = useState(() => shuffleArray(redeData).slice(0, 5).map(d => {
    const mode = Math.random() < 0.5 ? 'vorne' : 'hinten';
    return { ...d, mode, options: comicOptions(d, mode) };
  }));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongPicks, setWrongPicks] = useState([]);
  const [solved, setSolved] = useState(false);
  const fb = useGameFeedback(onShowTip);
  const item = items[idx];

  const pick = (i) => {
    if (solved || wrongPicks.includes(i)) return;
    if (item.options[i].ok) {
      fb.good();
      setSolved(true);
      if (wrongPicks.length === 0) setScore(s => s + 2);
    } else {
      fb.bad("Prüfe der Reihe nach: Anführungszeichen unten und oben? Doppelpunkt (vorne) oder Komma (hinten)? Steht das Satzzeichen der Rede vor dem “?");
      setWrongPicks(w => [...w, i]);
    }
  };

  const next = () => {
    fb.clear();
    if (idx + 1 < items.length) { setIdx(idx + 1); setWrongPicks([]); setSolved(false); }
    else onFinish(score, 10);
  };

  return (
    <div className="w-full text-center">
      <GameTitle icon={MessageCircle} color="text-sky-300" title="Comic-Check">Aus der Sprechblase wird wörtliche Rede. Welcher Satz ist <b className="text-sky-300">richtig</b> geschrieben?</GameTitle>
      <RoundInfo current={idx} total={items.length} />

      <div key={idx} className="bg-sky-950/40 border-4 border-indigo-950 rounded-3xl p-4 md:p-6 mb-6 comic-dots anim-pop">
        <SpeechBubble emoji={item.e} name={item.who} text={item.say} />
      </div>

      <div className="flex flex-col gap-3 max-w-3xl mx-auto mb-4">
        {item.options.map((opt, i) => {
          const isWrong = wrongPicks.includes(i);
          const isRight = solved && opt.ok;
          return (
            <button key={i} onClick={() => pick(i)} disabled={solved && !opt.ok} className={`relative text-left px-5 py-4 rounded-2xl border-4 font-serif text-xl md:text-2xl transition-all ${isRight ? 'border-lime-400 bg-lime-900/50 text-lime-100 scale-105 shadow-[0_0_25px_rgba(132,204,22,0.5)]' : isWrong ? 'border-rose-800 bg-rose-950/40 text-rose-300 line-through decoration-rose-500 opacity-70 anim-shake' : solved ? 'border-slate-800 bg-slate-900/50 text-slate-500' : 'border-sky-700 bg-slate-900/80 text-slate-100 hover:border-sky-300 hover:bg-slate-800 active:scale-95'}`}>
              <span className="inline-block w-9 h-9 mr-3 rounded-full bg-sky-600 text-white font-sans font-black text-center leading-9 not-italic no-underline">{String.fromCharCode(65 + i)}</span>
              {opt.text}
              {isRight && <SuccessSparkles size={1.2} />}
            </button>
          );
        })}
      </div>

      <ImmediateFeedback msg={fb.msg} type={fb.type} />

      {solved && (
        <div className="anim-pop flex flex-col items-center gap-4">
          <div className="bg-indigo-950/80 p-4 rounded-xl text-sky-200 max-w-2xl">{MODE_EXPLAIN[item.mode]}</div>
          <NextButton onClick={next} />
        </div>
      )}
    </div>
  );
}

// 4. Zeichen-Werkstatt: Satzzeichen in Kästchen setzen
function ZeichenGame({ onFinish, onShowTip }) {
  const [items] = useState(() => makeRedeItems(2, 2, 1).map(it => ({ ...it, seq: tokensToSeq(it.tokens) })));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const fb = useGameFeedback(onShowTip);

  const next = (stars) => {
    fb.clear();
    const s = score + stars;
    if (idx + 1 < items.length) { setScore(s); setIdx(idx + 1); } else onFinish(s, 10);
  };

  return (
    <div className="w-full text-center">
      <GameTitle icon={Wand2} color="text-amber-300" title="Zeichen-Werkstatt">
        Tippe ein Kästchen an und wähle das passende Satzzeichen.
      </GameTitle>
      <RoundInfo current={idx} total={items.length} />
      <ZeichenRound key={idx} item={items[idx]} fb={fb} onNext={next} />
      <ImmediateFeedback msg={fb.msg} type={fb.type} />
    </div>
  );
}

function ZeichenRound({ item, fb, onNext }) {
  const slots = useSlots(item.seq);
  const [mistakes, setMistakes] = useState(0);
  const [solved, setSolved] = useState(false);

  const check = () => {
    const wrong = slots.check();
    if (wrong < 0) { fb.info("Fülle zuerst alle Kästchen aus! ✏️"); return; }
    if (wrong === 0) { fb.good(); setSolved(true); }
    else {
      fb.bad("Vorne: Doppelpunkt. Hinten: Komma nach dem “ und Punkt am Ende. Das Satzzeichen der Rede (. ? !) steht immer vor dem “.", `${wrong} ${wrong === 1 ? 'Zeichen ist' : 'Zeichen sind'} noch falsch – schau auf die roten Kästchen!`);
      setMistakes(m => m + 1);
    }
  };

  return (
    <div>
      <div className="flex justify-center mb-4">
        <span className="bg-amber-900/40 border-2 border-amber-500/40 text-amber-200 font-bold px-4 py-2 rounded-full flex items-center gap-3 flex-wrap justify-center">Bauplan: <Blueprint mode={item.mode} small /></span>
      </div>
      <SlotSentence seq={item.seq} filled={slots.filled} status={slots.status} selected={slots.selected} onSlotClick={slots.selectSlot} solved={solved} />
      {!solved ? (
        <>
          <SignToolbar onSign={slots.placeSign} onErase={slots.erase} />
          <CheckButton onClick={check} color="bg-amber-500 hover:bg-amber-400" />
        </>
      ) : (
        <div className="anim-pop mt-6 flex flex-col items-center gap-4">
          <div className="bg-indigo-950/80 p-4 rounded-xl text-amber-200 max-w-2xl">{MODE_EXPLAIN[item.mode]}</div>
          <NextButton onClick={() => onNext(mistakes === 0 ? 2 : 0)} />
        </div>
      )}
    </div>
  );
}

// 5. Fehler-Detektiv: Richtig oder falsch?
function FehlerGame({ onFinish, onShowTip }) {
  const [items] = useState(() => shuffleArray([
    ...shuffleArray(fehlerData.filter(f => f.ok)).slice(0, 4),
    ...shuffleArray(fehlerData.filter(f => !f.ok)).slice(0, 6)
  ]));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState(null);
  const fb = useGameFeedback(onShowTip);
  const item = items[idx];

  const choose = (saysOk) => {
    if (answer !== null) return;
    const right = saysOk === item.ok;
    setAnswer(right);
    if (right) { fb.good(); setScore(s => s + 1); }
    else fb.bad("Gehe wie ein Detektiv vor: 1. Anführungszeichen unten und oben? 2. Doppelpunkt oder Komma? 3. Satzzeichen der Rede vor dem “? 4. Groß- und Kleinschreibung?");
  };

  const next = () => {
    fb.clear();
    if (idx + 1 < items.length) { setIdx(idx + 1); setAnswer(null); }
    else onFinish(score, 10);
  };

  return (
    <div className="w-full text-center">
      <GameTitle icon={Search} color="text-rose-300" title="Fehler-Detektiv">Ist der Satz richtig geschrieben oder hat sich ein Fehler versteckt?</GameTitle>
      <RoundInfo current={idx} total={items.length} />

      <div key={idx} className={`relative bg-slate-900/70 p-8 md:p-12 rounded-3xl border-4 mb-8 shadow-inner anim-pop ${answer === null ? 'border-rose-800/50' : answer ? 'border-lime-500/60' : 'border-amber-500/60'}`}>
        <Search className="absolute top-4 left-4 w-8 h-8 text-rose-400/40" />
        <p className="text-3xl md:text-4xl font-serif text-slate-100 leading-relaxed">{item.s}</p>
        {answer === true && <SuccessSparkles size={2} />}
      </div>

      {answer === null ? (
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8 mb-4">
          <button onClick={() => choose(true)} className="flex-1 max-w-xs mx-auto sm:mx-0 w-full bg-lime-700 hover:bg-lime-600 text-white font-black text-2xl py-6 rounded-2xl shadow-[0_6px_0_rgba(54,83,20,1)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-3"><Check className="w-8 h-8" /> Richtig</button>
          <button onClick={() => choose(false)} className="flex-1 max-w-xs mx-auto sm:mx-0 w-full bg-rose-700 hover:bg-rose-600 text-white font-black text-2xl py-6 rounded-2xl shadow-[0_6px_0_rgba(136,19,55,1)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-3"><Search className="w-8 h-8" /> Fehler!</button>
        </div>
      ) : (
        <div className="anim-pop flex flex-col items-center gap-4">
          <div className="bg-indigo-950/80 p-5 rounded-2xl max-w-2xl text-left">
            <p className="text-lg font-black mb-2 text-center">{item.ok ? <span className="text-lime-300">Dieser Satz ist richtig!</span> : <span className="text-amber-300">Hier war ein Fehler versteckt!</span>}</p>
            {!item.ok && <p className="text-2xl font-serif text-lime-200 text-center mb-2">{item.fix}</p>}
            <p className="text-indigo-200 text-center">{item.why}</p>
          </div>
          <NextButton onClick={next} />
        </div>
      )}
      <ImmediateFeedback msg={fb.msg} type={fb.type} />
    </div>
  );
}

// 6. Satz-Puzzle: Bausteine in die richtige Reihenfolge bringen
function PuzzleGame({ onFinish, onShowTip }) {
  const [items] = useState(() => makeRedeItems(2, 2, 1));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const fb = useGameFeedback(onShowTip);

  const next = (stars) => {
    fb.clear();
    const s = score + stars;
    if (idx + 1 < items.length) { setScore(s); setIdx(idx + 1); } else onFinish(s, 10);
  };

  return (
    <div className="w-full text-center">
      <GameTitle icon={Puzzle} color="text-orange-300" title="Satz-Puzzle">Baue den Satz mit wörtlicher Rede zusammen. Tippe die Bausteine in der richtigen Reihenfolge an!</GameTitle>
      <RoundInfo current={idx} total={items.length} />
      <BuildRound
        key={idx}
        target={items[idx].tokens}
        extra={[]}
        header={<div className="flex justify-center mb-6"><span className="bg-orange-900/40 border-2 border-orange-500/40 text-orange-200 font-bold px-4 py-2 rounded-full flex items-center gap-3 flex-wrap justify-center">Begleitsatz {MODE_LABEL[items[idx].mode]}: <Blueprint mode={items[idx].mode} small /></span></div>}
        tip="Schau auf den Bauplan! Die Rede wird von „ und “ eingerahmt. Das Satzzeichen der Rede steht vor dem “."
        explain={MODE_EXPLAIN[items[idx].mode]}
        fb={fb}
        onNext={next}
      />
      <ImmediateFeedback msg={fb.msg} type={fb.type} />
    </div>
  );
}

function BuildRound({ target, extra, header, tip, explain, fb, onNext, color = "bg-orange-500 hover:bg-orange-400" }) {
  const [pool, setPool] = useState(() => shuffleArray([...target, ...extra].map((t, i) => ({ id: i, t: t.t }))));
  const [answer, setAnswer] = useState([]);
  const [wrong, setWrong] = useState(false);
  const [solved, setSolved] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const pickTok = (id) => {
    if (solved) return;
    const tok = pool.find(p => p.id === id);
    setPool(p => p.filter(x => x.id !== id));
    setAnswer(a => [...a, tok]);
    setWrong(false);
  };
  const removeTok = (id) => {
    if (solved) return;
    const tok = answer.find(p => p.id === id);
    setAnswer(a => a.filter(x => x.id !== id));
    setPool(p => [...p, tok]);
    setWrong(false);
  };

  const check = () => {
    const ok = answer.length === target.length && answer.every((tok, i) => tok.t === target[i].t);
    if (ok) { fb.good(); setSolved(true); }
    else {
      fb.bad(tip);
      setMistakes(m => m + 1);
      setWrong(true);
    }
  };

  const canCheck = extra.length === 0 ? pool.length === 0 : answer.length > 0;

  return (
    <div>
      {header}
      <TokenBoard pool={pool} answer={answer} onPick={pickTok} onRemove={removeTok} wrong={wrong} solved={solved} />
      <div className="mt-6">
        {!solved ? (
          <div className="flex justify-center gap-3 flex-wrap">
            <button onClick={() => { setPool(p => shuffleArray([...p, ...answer])); setAnswer([]); setWrong(false); }} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl flex items-center gap-2 active:scale-95"><RotateCcw className="w-5 h-5" /> Neu</button>
            <CheckButton onClick={check} disabled={!canCheck} color={color} />
          </div>
        ) : (
          <div className="anim-pop flex flex-col items-center gap-4">
            <div className="bg-indigo-950/80 p-4 rounded-xl text-orange-100 max-w-2xl">{explain}</div>
            <NextButton onClick={() => onNext(mistakes === 0 ? 2 : 0)} />
          </div>
        )}
      </div>
    </div>
  );
}

// 7. Stimmen-Memory: Wortfeld „sagen“
function MemoryGame({ onFinish, onShowTip }) {
  const [cards] = useState(() => {
    const pairs = shuffleArray(memoryPairs).slice(0, 6);
    return shuffleArray(pairs.flatMap(p => [
      { key: `s${p.id}`, pair: p.id, kind: 'sit', text: p.sit, emo: p.emo },
      { key: `v${p.id}`, pair: p.id, kind: 'verb', text: p.verb }
    ]));
  });
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  const [misses, setMisses] = useState(0);
  const [busy, setBusy] = useState(false);
  const [justMatched, setJustMatched] = useState(null);
  const [done, setDone] = useState(false);
  const fb = useGameFeedback(onShowTip);

  const flip = (i) => {
    if (busy || done || open.includes(i) || matched.includes(cards[i].pair)) return;
    const nextOpen = [...open, i];
    setOpen(nextOpen);
    if (nextOpen.length === 2) {
      const [a, b] = nextOpen;
      setBusy(true);
      if (cards[a].pair === cards[b].pair) {
        fb.good(null, 1500);
        const nm = [...matched, cards[a].pair];
        setMatched(nm);
        setJustMatched(cards[a].pair);
        setTimeout(() => {
          setOpen([]); setBusy(false); setJustMatched(null);
          if (nm.length === 6) setDone(true);
        }, 900);
      } else {
        setMisses(m => m + 1);
        fb.bad("Lies die Beschreibung genau: Wie spricht die Person? Leise, laut, fröhlich, wütend? Dazu passt ein ganz bestimmtes Verb!", "Kein Paar – merk dir die Karten! 🧠");
        setTimeout(() => { setOpen([]); setBusy(false); }, 1400);
      }
    }
  };

  const stars = misses <= 5 ? 10 : Math.max(4, 10 - Math.ceil((misses - 5) / 2));

  return (
    <div className="w-full text-center">
      <GameTitle icon={Brain} color="text-pink-300" title="Stimmen-Memory">Finde die Paare: Welches Redeverb passt zur Beschreibung?</GameTitle>
      <div className="flex justify-center gap-4 mb-6">
        <span className="bg-slate-900/80 border-2 border-pink-500/40 rounded-full px-4 py-2 font-bold text-pink-200">Paare: {matched.length} / 6</span>
        <span className="bg-slate-900/80 border-2 border-slate-600 rounded-full px-4 py-2 font-bold text-slate-300">Fehlversuche: <span className="text-rose-300">{misses}</span></span>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto mb-6">
        {cards.map((c, i) => {
          const isOpen = open.includes(i) || matched.includes(c.pair);
          const isMatched = matched.includes(c.pair);
          return (
            <button key={c.key} onClick={() => flip(i)} className={`flip-card h-28 md:h-36 ${isOpen ? 'is-flipped' : ''}`}>
              <div className="flip-inner">
                <div className="flip-face rounded-2xl border-4 border-pink-400/60 bg-gradient-to-br from-fuchsia-700 to-indigo-800 comic-dots flex items-center justify-center shadow-lg hover:border-yellow-300 transition-colors">
                  <MessageCircle className="w-10 h-10 md:w-12 md:h-12 text-yellow-300 fill-yellow-300/30" />
                </div>
                <div className={`flip-face flip-back rounded-2xl border-4 flex flex-col items-center justify-center p-2 shadow-lg ${isMatched ? 'border-lime-400 bg-lime-900/70' : c.kind === 'verb' ? 'border-yellow-300 bg-yellow-300' : 'border-cyan-300 bg-slate-100'}`}>
                  {c.kind === 'sit' ? (
                    <>
                      <span className="text-3xl md:text-4xl">{c.emo}</span>
                      <span className={`text-sm md:text-base font-bold leading-tight mt-1 ${isMatched ? 'text-lime-100' : 'text-indigo-950'}`}>{c.text}</span>
                    </>
                  ) : (
                    <span className={`text-xl md:text-3xl font-black ${isMatched ? 'text-lime-100' : 'text-indigo-950'}`}>{c.text}</span>
                  )}
                  {justMatched === c.pair && <SuccessSparkles size={0.8} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <ImmediateFeedback msg={fb.msg} type={fb.type} />

      {done && (
        <div className="anim-pop flex flex-col items-center gap-4">
          <p className="text-pink-300 font-bold text-2xl flex items-center gap-2"><Check className="w-8 h-8" /> Alle Paare gefunden!</p>
          <NextButton onClick={() => onFinish(stars, 10)}>Super, weiter!</NextButton>
        </div>
      )}
    </div>
  );
}

// 8. Das treffende Wort: passendes Redeverb wählen
function RedeverbGame({ onFinish, onShowTip }) {
  const [items] = useState(() => shuffleArray(redeverbData).slice(0, 10).map(d => ({ ...d, options: shuffleArray(d.options) })));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongPicks, setWrongPicks] = useState([]);
  const [solved, setSolved] = useState(false);
  const fb = useGameFeedback(onShowTip);
  const item = items[idx];
  const [before, after] = item.s.split('___');

  const pick = (opt) => {
    if (solved || wrongPicks.includes(opt)) return;
    if (opt === item.correct) {
      fb.good(null, 1500);
      setSolved(true);
      if (wrongPicks.length === 0) setScore(s => s + 1);
    } else {
      fb.bad("Lies die Rede laut und mit Gefühl vor! Ist es eine Frage? Wird geflüstert, gejubelt oder geschimpft? Die Satzzeichen und Wörter wie „leise“ oder „wütend“ verraten es dir.");
      setWrongPicks(w => [...w, opt]);
    }
  };

  const next = () => {
    fb.clear();
    if (idx + 1 < items.length) { setIdx(idx + 1); setWrongPicks([]); setSolved(false); }
    else onFinish(score, 10);
  };

  return (
    <div className="w-full text-center">
      <GameTitle icon={Megaphone} color="text-fuchsia-300" title="Das treffende Wort">Nicht immer nur „sagt“! Welches Redeverb passt am besten?</GameTitle>
      <RoundInfo current={idx} total={items.length} />

      <div key={idx} className="bg-slate-900/70 p-6 md:p-10 rounded-3xl border-4 border-fuchsia-700/40 mb-8 shadow-inner anim-pop">
        <p className="text-2xl md:text-4xl font-serif text-slate-100 leading-relaxed">
          {before}
          {solved ? (
            <span className="relative inline-block px-3 border-b-4 border-fuchsia-400 text-fuchsia-200 font-black anim-pop">{item.correct}<SuccessSparkles size={1.2} /></span>
          ) : (
            <span className="inline-block w-32 md:w-40 h-10 md:h-12 align-middle bg-fuchsia-900/40 border-b-4 border-dashed border-fuchsia-400/70 rounded-t-lg mx-1" />
          )}
          {after}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
        {item.options.map(opt => {
          const isWrong = wrongPicks.includes(opt);
          const isRight = solved && opt === item.correct;
          return (
            <button key={opt} onClick={() => pick(opt)} disabled={solved} className={`px-8 py-5 rounded-2xl border-4 font-black text-2xl transition-all ${isRight ? 'border-lime-400 bg-lime-800 text-white scale-110' : isWrong ? 'border-slate-800 bg-slate-900 text-slate-600 line-through anim-shake' : solved ? 'border-slate-800 bg-slate-900/60 text-slate-500' : 'border-fuchsia-500 bg-fuchsia-900/60 text-fuchsia-100 hover:bg-fuchsia-800 active:scale-95'}`}>
              {opt}
            </button>
          );
        })}
      </div>

      <ImmediateFeedback msg={fb.msg} type={fb.type} />
      {solved && <NextButton onClick={next} />}
    </div>
  );
}

// 9. Wörter-Regen: Schnell-Sortier-Spiel (Wortfeld sagen)
function RegenGame({ onFinish }) {
  const [words] = useState(() => shuffleArray([
    ...shuffleArray(regenWords.filter(w => w.say)).slice(0, 10),
    ...shuffleArray(regenWords.filter(w => !w.say)).slice(0, 10)
  ]));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [drop, setDrop] = useState(0);
  const [phase, setPhase] = useState('intro');
  const [gateAnim, setGateAnim] = useState(null);
  const scoreRef = useRef(0);
  const dropRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  const advance = () => {
    dropRef.current = 0;
    setDrop(0);
    setGateAnim(null);
    if (idx + 1 < words.length) { setIdx(i => i + 1); setPhase('playing'); }
    else onFinish(Math.ceil(scoreRef.current / 2), 10);
  };

  const resolve = (gate) => {
    setPhase('paused');
    const isCorrect = gate !== 'none' && (gate === 'say') === words[idx].say;
    if (isCorrect) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      setCombo(c => c + 1);
      triggerHaptic(false);
      setGateAnim({ type: 'success', gate });
    } else {
      setCombo(0);
      triggerHaptic(true);
      setGateAnim({ type: 'error', gate });
    }
    timeoutRef.current = setTimeout(advance, isCorrect ? 600 : 1100);
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    const step = 0.45 * (1.1 + idx * 0.07);
    const timer = setInterval(() => {
      dropRef.current = Math.min(95, dropRef.current + step);
      setDrop(dropRef.current);
      if (dropRef.current >= 95) { clearInterval(timer); resolve('none'); }
    }, 30);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, idx]);

  const isFire = combo >= 6;
  const isWarm = combo >= 3;
  const comboClass = isFire ? "text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,1)] scale-125" : isWarm ? "text-yellow-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] scale-110" : "text-slate-400";

  const gateClass = (g) => {
    const base = "relative flex-1 flex flex-col items-center justify-end p-4 md:p-6 rounded-t-full border-x-8 border-t-8 border-b-0 h-[150px] md:h-[170px] transition-all origin-bottom overflow-hidden ";
    if (gateAnim?.type === 'success' && gateAnim.gate === g) return base + "border-lime-400 bg-lime-900 shadow-[0_0_50px_rgba(163,230,53,0.8)] anim-gate z-10";
    if (gateAnim?.type === 'error') return base + (gateAnim.gate === g ? "border-rose-600 bg-rose-950 opacity-60" : "border-slate-800 bg-slate-900 opacity-50");
    if (isFire) return base + "border-orange-500 bg-slate-800/90 anim-fire-glow";
    if (isWarm) return base + "border-yellow-400 bg-slate-800/80 shadow-[0_0_20px_rgba(234,179,8,0.4)]";
    return base + "border-violet-500 bg-violet-950/60 hover:bg-violet-900 active:scale-95";
  };

  const current = words[idx];

  return (
    <div className="w-full text-center text-slate-200 flex flex-col h-[600px] select-none">
      <div className="mb-2 flex justify-between items-center px-2 md:px-4 gap-2">
        <h2 className="text-2xl md:text-3xl text-violet-300 font-black flex items-center gap-3"><CloudRain className="w-8 h-8" /> Wörter-Regen</h2>
        <div className="flex items-center gap-4">
          <span className="font-bold text-slate-400 hidden sm:inline">{Math.min(idx + 1, words.length)} / {words.length}</span>
          <div key={`combo-${combo}`} className={`font-black text-xl md:text-3xl transition-all duration-300 flex items-center gap-2 ${comboClass}`}>
            {isFire && <Flame className="w-7 h-7 text-orange-400" />} COMBO: {combo}
          </div>
        </div>
      </div>

      {phase === 'intro' ? (
        <div className="flex-1 flex flex-col items-center justify-center anim-pop">
          <CloudRain className="w-20 h-20 text-violet-300 mb-4 anim-float" />
          <p className="text-slate-200 text-xl mb-8 max-w-lg">Verben regnen vom Himmel! Gehört das Wort zum <b className="text-yellow-300">Wortfeld „sagen“</b> – kann man damit also beschreiben, <i>wie jemand spricht</i>? Tippe blitzschnell auf das richtige Tor!</p>
          <button onClick={() => setPhase('playing')} className="bg-violet-600 hover:bg-violet-500 text-white font-black text-2xl py-4 px-12 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.6)] active:scale-95 transition-all">Start!</button>
        </div>
      ) : (
        <div className="flex-1 relative border-4 border-violet-800/50 rounded-2xl bg-slate-950/60 comic-dots overflow-hidden flex flex-col justify-between mt-4">
          <div className="absolute top-0 left-0 w-full h-[calc(100%-170px)] pointer-events-none">
            <div
              className={`absolute left-1/2 -translate-x-1/2 text-3xl md:text-4xl font-black py-4 px-8 rounded-2xl shadow-2xl border-4 whitespace-nowrap ${gateAnim?.type === 'success' ? 'anim-word-suck bg-lime-500 border-lime-200 text-white' : gateAnim?.type === 'error' ? 'bg-rose-800 border-rose-400 text-rose-100' : isFire ? 'bg-orange-600 border-yellow-300 text-white shadow-[0_0_30px_rgba(234,88,12,0.8)]' : 'bg-slate-100 border-indigo-950 text-indigo-950'}`}
              style={{ top: `${drop}%` }}
            >
              {current.word}
              {gateAnim?.type === 'error' && <div className="text-sm font-bold mt-1">{current.say ? '→ Wortfeld „sagen“' : '→ kein Redeverb'}</div>}
            </div>
          </div>
          <div className="flex-1"></div>
          <div className={`flex justify-center gap-3 md:gap-4 px-2 md:px-4 z-10 ${gateAnim?.type === 'error' ? 'anim-shake' : ''}`}>
            <button onPointerDown={() => phase === 'playing' && resolve('say')} disabled={phase !== 'playing'} className={gateClass('say')}>
              <Megaphone className="w-9 h-9 mb-2 text-yellow-300" />
              <span className="text-lg md:text-xl font-black text-white">Wortfeld „sagen“</span>
              <span className="text-xs opacity-70">So spricht jemand</span>
            </button>
            <button onPointerDown={() => phase === 'playing' && resolve('other')} disabled={phase !== 'playing'} className={gateClass('other')}>
              <Footprints className="w-9 h-9 mb-2 text-cyan-300" />
              <span className="text-lg md:text-xl font-black text-white">Kein Redeverb</span>
              <span className="text-xs opacity-70">Etwas anderes tun</span>
            </button>
          </div>
          {gateAnim?.type === 'error' && gateAnim.gate === 'none' && <div className="absolute inset-0 bg-rose-600/30 pointer-events-none mix-blend-screen"></div>}
        </div>
      )}
      <div className="mt-3 text-slate-400 font-bold">Treffer: <span className="text-lime-300">{score}</span></div>
    </div>
  );
}

// 10. Umstell-Maschine: Begleitsatz von vorne nach hinten (und zurück)
function UmstellGame({ onFinish, onShowTip }) {
  const [items] = useState(() => shuffleArray(redeData).slice(0, 5).map((d, i) => {
    const to = i % 2 === 0 ? 'hinten' : 'vorne';
    const from = to === 'hinten' ? 'vorne' : 'hinten';
    const extra = to === 'hinten'
      ? [{ t: '.' }, { t: ':' }, { t: cap(`${d.verb} ${d.who}`) }]
      : [{ t: ',' }, { t: '.' }];
    return { ...d, from, to, source: joinTokens(buildTokens(d, from)), target: buildTokens(d, to), extra };
  }));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const fb = useGameFeedback(onShowTip);
  const item = items[idx];

  const next = (stars) => {
    fb.clear();
    const s = score + stars;
    if (idx + 1 < items.length) { setScore(s); setIdx(idx + 1); } else onFinish(s, 10);
  };

  return (
    <div className="w-full text-center">
      <GameTitle icon={Repeat} color="text-lime-300" title="Umstell-Maschine">Stelle den Begleitsatz um! Achtung: Nicht alle Bausteine werden gebraucht.</GameTitle>
      <RoundInfo current={idx} total={items.length} />
      <BuildRound
        key={idx}
        target={item.target}
        extra={item.extra}
        color="bg-lime-600 hover:bg-lime-500"
        header={(
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="bg-slate-900/80 border-4 border-slate-700 rounded-2xl px-6 py-4 text-2xl md:text-3xl font-serif text-slate-100">{item.source}</div>
            <Repeat className="w-10 h-10 text-lime-300 anim-float" />
            <div className="bg-lime-900/40 border-2 border-lime-400/50 text-lime-200 font-black px-5 py-2 rounded-full flex items-center gap-3 flex-wrap justify-center">
              Stelle den Begleitsatz nach {item.to === 'hinten' ? 'HINTEN' : 'VORNE'}! <Blueprint mode={item.to} small />
            </div>
          </div>
        )}
        tip={item.to === 'hinten' ? "Begleitsatz hinten: Der Punkt der Rede fällt weg, nach dem “ kommt ein Komma, und der Begleitsatz beginnt klein. Am Ende steht ein Punkt." : "Begleitsatz vorne: Danach kommt ein Doppelpunkt. Die Rede bekommt ihr Satzzeichen (. ? !) vor dem “ zurück."}
        explain={MODE_EXPLAIN[item.to]}
        fb={fb}
        onNext={next}
      />
      <ImmediateFeedback msg={fb.msg} type={fb.type} />
    </div>
  );
}

// 11. Sprechblasen-Schreiber: Sprechblase als wörtliche Rede aufschreiben
function SchreibGame({ onFinish, onShowTip }) {
  const [items] = useState(() => shuffleArray(redeData).slice(0, 5).map((d, i) => {
    const mode = i % 2 === 0 ? 'vorne' : 'hinten';
    return { ...d, mode, solution: joinTokens(buildTokens(d, mode)), begleit: mode === 'vorne' ? `${cap(d.who)} ${d.verb}` : `${d.verb} ${d.who}` };
  }));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const fb = useGameFeedback(onShowTip);

  const next = (stars) => {
    fb.clear();
    const s = score + stars;
    if (idx + 1 < items.length) { setScore(s); setIdx(idx + 1); } else onFinish(s, 10);
  };

  return (
    <div className="w-full text-center">
      <GameTitle icon={PenTool} color="text-emerald-300" title="Sprechblasen-Schreiber">Schreibe die Sprechblase als wörtliche Rede auf – mit allen Zeichen!</GameTitle>
      <RoundInfo current={idx} total={items.length} />
      <SchreibRound key={idx} item={items[idx]} fb={fb} onNext={next} />
      <ImmediateFeedback msg={fb.msg} type={fb.type} />
    </div>
  );
}

function SchreibRound({ item, fb, onNext }) {
  const [text, setText] = useState('');
  const [tries, setTries] = useState(0);
  const [solved, setSolved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const inputRef = useRef(null);

  // Gerade Anführungszeichen automatisch in „ und “ verwandeln
  const smartQuotes = (value) => {
    let out = '';
    for (const ch of value) {
      if (ch === '"') {
        const prev = out.slice(-1);
        out += (!prev || /[\s:(]/.test(prev)) ? '„' : '“';
      } else out += ch;
    }
    return out;
  };

  const insert = (sign) => {
    const el = inputRef.current;
    const start = el ? el.selectionStart : text.length;
    const end = el ? el.selectionEnd : text.length;
    const nt = text.slice(0, start) + sign + text.slice(end);
    setText(nt);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      el.setSelectionRange(start + sign.length, start + sign.length);
    });
  };

  const check = () => {
    if (solved || !text.trim()) return;
    if (normalizeAnswer(text) === normalizeAnswer(item.solution)) {
      fb.good();
      setSolved(true);
    } else {
      setTries(t => t + 1);
      fb.bad("Schreibe Schritt für Schritt: Begleitsatz – Zeichen – „ – Rede – Satzzeichen – “. Schau in die Heldenregeln, wenn du unsicher bist!", diagnoseAnswer(text, item.solution, item.mode));
    }
  };

  const stars = revealed ? 0 : tries === 0 ? 2 : tries === 1 ? 1 : 0;

  return (
    <div>
      <div className="bg-emerald-950/40 border-4 border-indigo-950 rounded-3xl p-4 md:p-6 mb-4 comic-dots">
        <SpeechBubble emoji={item.e} name={item.who} text={item.say} />
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-4">
        <span className="bg-emerald-900/50 border-2 border-emerald-400/50 text-emerald-100 font-bold px-4 py-2 rounded-full flex items-center gap-2 flex-wrap justify-center">Begleitsatz <b className="text-yellow-300">{MODE_LABEL[item.mode]}</b>: <Blueprint mode={item.mode} small /></span>
        <span className="bg-cyan-900/50 border-2 border-cyan-400/50 text-cyan-100 font-bold px-4 py-2 rounded-full">Benutze: <b className="text-cyan-300">{item.begleit}</b></span>
      </div>

      {!solved && !revealed ? (
        <>
          <input
            ref={inputRef}
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            value={text}
            onChange={e => setText(smartQuotes(e.target.value))}
            onKeyDown={e => e.key === 'Enter' && check()}
            placeholder="Schreibe hier …"
            className="w-full max-w-3xl bg-slate-950/80 border-4 border-emerald-600/60 focus:border-emerald-300 rounded-2xl px-5 py-4 text-2xl md:text-3xl font-serif text-white outline-none text-center"
          />
          <p className="text-slate-400 text-sm mt-3">Die Zeichen-Knöpfe fügen das Zeichen dort ein, wo dein Cursor blinkt.</p>
          <SignToolbar onSign={insert} />
          <div className="flex justify-center gap-3 flex-wrap">
            {tries >= 3 && (
              <button onClick={() => { setRevealed(true); fb.clear(); }} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl flex items-center gap-2 active:scale-95"><Eye className="w-5 h-5" /> Lösung zeigen</button>
            )}
            <CheckButton onClick={check} disabled={!text.trim()} color="bg-emerald-600 hover:bg-emerald-500" />
          </div>
        </>
      ) : (
        <div className="anim-pop flex flex-col items-center gap-4">
          <div className={`relative px-6 py-4 rounded-2xl border-4 text-2xl md:text-3xl font-serif ${solved ? 'border-lime-400 bg-lime-900/40 text-lime-100' : 'border-amber-400 bg-amber-900/30 text-amber-100'}`}>
            {item.solution}
            {solved && <SuccessSparkles size={1.5} />}
          </div>
          {revealed && <p className="text-amber-200">So wäre es richtig. Schau dir die Zeichen genau an!</p>}
          <NextButton onClick={() => onNext(stars)} />
        </div>
      )}
    </div>
  );
}

// 12. Comic-Finale: Eine ganze Geschichte mit Zeichen versehen
function FinaleGame({ onFinish, onShowTip }) {
  const [story] = useState(() => {
    const s = shuffleArray(storyData)[0];
    return { ...s, seq: markupToSeq(s.text) };
  });
  const slots = useSlots(story.seq);
  const [mistakes, setMistakes] = useState(0);
  const [solved, setSolved] = useState(false);
  const fb = useGameFeedback(onShowTip);

  const check = () => {
    const wrong = slots.check();
    if (wrong < 0) { fb.info("Fülle zuerst alle Kästchen aus! ✏️"); return; }
    if (wrong === 0) { fb.good(null, 3000); setSolved(true); }
    else {
      fb.bad("Nimm dir Satz für Satz vor: Wo steht der Begleitsatz – vorne, hinten oder in der Mitte? Dann weißt du, ob Doppelpunkt oder Komma kommt.", `${wrong} ${wrong === 1 ? 'Zeichen ist' : 'Zeichen sind'} noch falsch – die grünen bleiben stehen!`);
      setMistakes(m => m + 1);
    }
  };

  return (
    <div className="w-full text-center">
      <GameTitle icon={Crown} color="text-teal-300" title="Comic-Finale">Setze alle Zeichen der wörtlichen Rede in die Geschichte ein!</GameTitle>
      <div className="flex justify-center items-center gap-3 mb-6">
        <span className="text-5xl anim-wiggle">{story.e}</span>
        <h3 className="font-comic text-3xl md:text-4xl text-yellow-300">{story.title}</h3>
      </div>

      <SlotSentence seq={story.seq} filled={slots.filled} status={slots.status} selected={slots.selected} onSlotClick={slots.selectSlot} solved={solved} />

      <div className="flex justify-between items-center max-w-md mx-auto bg-slate-900 p-4 rounded-2xl border-2 border-slate-700 my-4">
        <span className="text-slate-400 font-bold">Kästchen: <span className="text-teal-300 text-2xl">{slots.filledCount} / {slots.count}</span></span>
        <span className="text-slate-400 font-bold">Fehlversuche: <span className="text-rose-400 text-xl">{mistakes}</span></span>
      </div>

      <ImmediateFeedback msg={fb.msg} type={fb.type} />

      {!solved ? (
        <div className="sticky bottom-2 z-20 bg-slate-950/85 backdrop-blur-md rounded-3xl p-2 border border-white/10">
          <SignToolbar onSign={slots.placeSign} onErase={slots.erase} />
          <CheckButton onClick={check} color="bg-teal-600 hover:bg-teal-500" />
        </div>
      ) : (
        <div className="anim-pop mt-2 flex flex-col items-center">
          <p className="text-teal-300 font-bold text-3xl mb-4 flex items-center gap-2"><Check className="w-8 h-8" /> Die Geschichte ist gerettet!</p>
          <NextButton onClick={() => onFinish(Math.max(2, 10 - mistakes), 10)}>Super, weiter!</NextButton>
        </div>
      )}
    </div>
  );
}

// ==========================================
// SPIELE-ÜBERSICHT & LERNPFADE
// ==========================================
const GAMES = [
  { id: 'marker', title: 'Stimmen-Marker', desc: 'Rede gelb, Begleitsatz blau!', icon: Highlighter, color: 'yellow', comp: MarkerGame, help: 'Markiere die wörtliche Rede gelb und den Begleitsatz blau.', badge: { name: 'Leucht-Marker', icon: Highlighter, color: 'text-yellow-300', bg: 'bg-yellow-900/40', border: 'border-yellow-400' } },
  { id: 'sortieren', title: 'Begleitsatz-Radar', desc: 'Vorne, hinten oder Mitte?', icon: Radar, color: 'cyan', comp: SortGame, help: 'Entscheide, wo der Begleitsatz steht: vorne, hinten oder in der Mitte.', badge: { name: 'Radar-Brille', icon: Radar, color: 'text-cyan-300', bg: 'bg-cyan-900/40', border: 'border-cyan-400' } },
  { id: 'comic', title: 'Comic-Check', desc: 'Welcher Satz ist richtig?', icon: MessageCircle, color: 'sky', comp: ComicGame, help: 'Aus der Sprechblase wird ein Satz. Wähle die richtige Schreibweise.', badge: { name: 'Goldene Sprechblase', icon: MessageCircle, color: 'text-amber-300', bg: 'bg-amber-900/40', border: 'border-amber-400' } },
  { id: 'zeichen', title: 'Zeichen-Werkstatt', desc: 'Setze die Satzzeichen ein.', icon: Wand2, color: 'amber', comp: ZeichenGame, help: 'Tippe ein Kästchen an und setze das richtige Satzzeichen ein.', badge: { name: 'Zeichen-Zauberstab', icon: Wand2, color: 'text-orange-300', bg: 'bg-orange-900/40', border: 'border-orange-400' } },
  { id: 'fehler', title: 'Fehler-Detektiv', desc: 'Richtig oder Fehler?', icon: Search, color: 'rose', comp: FehlerGame, help: 'Ist der Satz richtig geschrieben? Oder hat sich ein Fehler versteckt?', badge: { name: 'Detektiv-Lupe', icon: Search, color: 'text-rose-300', bg: 'bg-rose-900/40', border: 'border-rose-400' } },
  { id: 'puzzle', title: 'Satz-Puzzle', desc: 'Baue den Satz zusammen.', icon: Puzzle, color: 'orange', comp: PuzzleGame, help: 'Tippe die Bausteine in der richtigen Reihenfolge an.', badge: { name: 'Puzzle-Orden', icon: Puzzle, color: 'text-orange-200', bg: 'bg-orange-800/40', border: 'border-orange-300' } },
  { id: 'memory', title: 'Stimmen-Memory', desc: 'Finde die Paare.', icon: Brain, color: 'pink', comp: MemoryGame, help: 'Decke Karten auf und finde das Redeverb, das zur Beschreibung passt.', badge: { name: 'Gedächtnis-Kristall', icon: Brain, color: 'text-pink-300', bg: 'bg-pink-900/40', border: 'border-pink-400' } },
  { id: 'redeverb', title: 'Das treffende Wort', desc: 'Nicht immer nur „sagt“!', icon: Megaphone, color: 'fuchsia', comp: RedeverbGame, help: 'Wähle das Redeverb, das am besten in den Begleitsatz passt.', badge: { name: 'Stimmen-Megafon', icon: Megaphone, color: 'text-fuchsia-300', bg: 'bg-fuchsia-900/40', border: 'border-fuchsia-400' } },
  { id: 'regen', title: 'Wörter-Regen', desc: 'Sortiere blitzschnell!', icon: CloudRain, color: 'violet', comp: RegenGame, help: 'Die Wörter fallen! Gehören sie zum Wortfeld „sagen“ oder nicht?', badge: { name: 'Blitz-Medaille', icon: Zap, color: 'text-violet-300', bg: 'bg-violet-900/40', border: 'border-violet-400' } },
  { id: 'umstellen', title: 'Umstell-Maschine', desc: 'Begleitsatz umstellen.', icon: Repeat, color: 'lime', comp: UmstellGame, help: 'Stelle den Begleitsatz von vorne nach hinten – oder umgekehrt.', badge: { name: 'Umstell-Magnet', icon: Repeat, color: 'text-lime-300', bg: 'bg-lime-900/40', border: 'border-lime-400' } },
  { id: 'sprechblase', title: 'Sprechblasen-Schreiber', desc: 'Schreibe selbst!', icon: PenTool, color: 'emerald', comp: SchreibGame, help: 'Schreibe die Sprechblase als wörtliche Rede auf – mit allen Zeichen.', badge: { name: 'Goldene Feder', icon: PenTool, color: 'text-emerald-300', bg: 'bg-emerald-900/40', border: 'border-emerald-400' } },
  { id: 'finale', title: 'Comic-Finale', desc: 'Rette die Geschichte!', icon: Crown, color: 'teal', comp: FinaleGame, help: 'Setze in einer ganzen Geschichte alle Zeichen der wörtlichen Rede ein.', badge: { name: 'Heldenkrone', icon: Crown, color: 'text-yellow-300', bg: 'bg-yellow-900/50', border: 'border-yellow-300' } }
];

const gameOrder = GAMES.map(g => g.id);
const gameById = (id) => GAMES.find(g => g.id === id);

const PATHS = [
  { title: 'Pfad 1: Rede erkennen', icon: Search, color: 'text-cyan-300', box: 'bg-cyan-900/20 border-cyan-500/30', arrow: 'text-cyan-500/50', games: ['marker', 'sortieren', 'comic'] },
  { title: 'Pfad 2: Zeichen setzen', icon: Wand2, color: 'text-amber-300', box: 'bg-amber-900/20 border-amber-500/30', arrow: 'text-amber-500/50', games: ['zeichen', 'fehler', 'puzzle'] },
  { title: 'Pfad 3: Wortfeld „sagen“', icon: Megaphone, color: 'text-pink-300', box: 'bg-pink-900/20 border-pink-500/30', arrow: 'text-pink-500/50', games: ['memory', 'redeverb', 'regen'] },
  { title: 'Pfad 4: Umbauen & Schreiben', icon: PenTool, color: 'text-lime-300', box: 'bg-lime-900/20 border-lime-500/30', arrow: 'text-lime-500/50', games: ['umstellen', 'sprechblase', 'finale'] }
];

// Welches Spiel muss vorher mit 9 Sternen geschafft sein?
const UNLOCK_REQ = { sortieren: 'marker', comic: 'sortieren', fehler: 'zeichen', puzzle: 'fehler', redeverb: 'memory', regen: 'redeverb', umstellen: 'zeichen', sprechblase: 'umstellen', finale: 'sprechblase' };
const BASICS = ['marker', 'zeichen', 'memory'];
const totalMaxScore = GAMES.length * 10;
const ADMIN_PASSWORD = "Rede123";

// ==========================================
// SPEICHERN & LADEN (Helden-Code)
// ==========================================
const CODE_LETTERS = 'BCDEFGHJKLMNPQRSTUVWXYZ';

const codeChecksum = (scoreChars) => {
  let sum = 0;
  for (let i = 0; i < scoreChars.length; i++) {
    const v = scoreChars[i] === 'A' ? 10 : parseInt(scoreChars[i], 10);
    sum += v * (i + 3);
  }
  return CODE_LETTERS[sum % CODE_LETTERS.length];
};

const generateCode = (gameProgress) => {
  let scoreChars = '';
  for (const g of gameOrder) {
    const score = Math.min(10, Math.max(0, gameProgress[g]?.score || 0));
    scoreChars += score === 10 ? 'A' : score.toString();
  }
  let code = scoreChars + codeChecksum(scoreChars);
  while (code.length < 16) code += CODE_LETTERS[Math.floor(Math.random() * CODE_LETTERS.length)];
  return code.match(/.{1,4}/g).join('-');
};

const parseCode = (input) => {
  const clean = input.toUpperCase().replace(/O/g, '0').replace(/I/g, '1').replace(/[^0-9A-Z]/g, '');
  if (clean.length !== 16) return null;
  const scoreChars = clean.slice(0, gameOrder.length);
  if (!/^[0-9A]+$/.test(scoreChars)) return null;
  if (clean[gameOrder.length] !== codeChecksum(scoreChars)) return null;
  const progress = {};
  let total = 0;
  gameOrder.forEach((g, i) => {
    const val = scoreChars[i] === 'A' ? 10 : parseInt(scoreChars[i], 10);
    if (val > 0) { progress[g] = { status: 'completed', score: val, max: 10 }; total += val; }
  });
  return { progress, total };
};

function SaveLoadModal({ onClose, gameProgress, setGameProgress, setGlobalScore }) {
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentCode] = useState(() => generateCode(gameProgress));

  const handleLoad = () => {
    const result = parseCode(inputCode);
    if (!result) { setError(true); setTimeout(() => setError(false), 1500); return; }
    setGameProgress(result.progress);
    setGlobalScore(result.total);
    setSuccess(true);
    setTimeout(() => onClose(), 1500);
  };

  const handleCopy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(currentCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-slate-900 border-4 border-yellow-400 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-[0_0_40px_rgba(250,204,21,0.3)] relative anim-pop">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
        <div className="flex flex-col items-center mb-6">
          <div className="bg-yellow-900/40 p-4 rounded-full mb-4 border border-yellow-400/30"><Key className="w-8 h-8 text-yellow-300" /></div>
          <h3 className="text-2xl font-black text-white text-center">Dein Helden-Code</h3>
          <p className="text-slate-400 text-center text-sm mt-2">Schreibe dir diesen Code auf, um später genau hier weiterzuspielen!</p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border-2 border-yellow-400/50 flex justify-between items-center gap-2 mb-8 shadow-inner">
          <div className="font-mono text-xl md:text-2xl font-bold tracking-wider text-yellow-300">{currentCode}</div>
          <button onClick={handleCopy} className="p-2 rounded-lg bg-yellow-900/40 hover:bg-yellow-700/60 text-yellow-300 transition-colors" title="Code kopieren">
            {copied ? <Check className="w-6 h-6 text-lime-400" /> : <Copy className="w-6 h-6" />}
          </button>
        </div>

        <div className="border-t border-slate-700 pt-6">
          <p className="text-slate-400 text-center text-sm mb-4">Hast du schon einen Code?</p>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className={`w-full bg-slate-950 border-2 rounded-xl p-4 text-white text-center font-mono text-xl focus:outline-none transition-colors ${error ? 'border-red-500 anim-shake' : success ? 'border-lime-500 text-lime-300' : 'border-slate-700 focus:border-yellow-400'}`}
            />
            {error && <p className="text-red-400 text-center text-sm font-bold">Dieser Code stimmt nicht. Prüfe jedes Zeichen!</p>}
            <button onClick={handleLoad} disabled={!inputCode.trim() || success} className={`w-full font-bold py-4 rounded-xl active:scale-95 transition-all uppercase tracking-wider ${success ? 'bg-lime-600 text-white' : 'bg-yellow-500 hover:bg-yellow-400 text-indigo-950 disabled:opacity-50'}`}>
              {success ? "Erfolgreich geladen!" : "Code laden"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminAuthModal({ onLogin, onClose }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (pwd === ADMIN_PASSWORD) onLogin();
    else { setError(true); setTimeout(() => setError(false), 500); setPwd(""); }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-slate-900 border-4 border-cyan-500 rounded-3xl p-8 max-w-sm w-full text-center relative anim-pop">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
        <Settings className="w-12 h-12 text-cyan-400 mx-auto mb-4 anim-float" />
        <h3 className="text-2xl font-black text-white mb-6">Lehrer-Bereich</h3>
        <input
          type="password"
          autoFocus
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Passwort"
          className={`w-full bg-slate-950 border-2 rounded-xl p-4 text-white text-center text-xl mb-4 outline-none transition-colors ${error ? 'border-red-500 anim-shake' : 'border-slate-700 focus:border-cyan-500'}`}
        />
        <button onClick={handleLogin} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all">Einloggen</button>
      </div>
    </div>
  );
}

function AdminControlModal({ onClose, gameProgress, setGameProgress, setGlobalScore }) {
  const sumScores = (p) => Object.values(p).reduce((acc, x) => acc + (x?.score || 0), 0);
  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-slate-900 border-4 border-slate-600 p-8 rounded-3xl max-w-sm w-full text-center anim-pop relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
        <h3 className="text-2xl font-black text-white mb-6">Admin-Steuerung</h3>
        <button onClick={() => {
          const updates = {};
          gameOrder.forEach(g => { updates[g] = { status: 'completed', score: 10, max: 10 }; });
          setGameProgress(updates); setGlobalScore(totalMaxScore); onClose();
        }} className="bg-amber-600 hover:bg-amber-500 text-white p-4 rounded-xl mb-4 w-full font-bold">Alles freischalten</button>
        <button onClick={() => {
          const updates = { ...gameProgress };
          BASICS.forEach(g => { updates[g] = { status: 'completed', score: 10, max: 10 }; });
          setGameProgress(updates); setGlobalScore(sumScores(updates)); onClose();
        }} className="bg-teal-600 hover:bg-teal-500 text-white p-4 rounded-xl mb-4 w-full font-bold">Grundlagen abschließen</button>
        <button onClick={() => { setGameProgress({}); setGlobalScore(0); onClose(); }} className="bg-red-600 hover:bg-red-500 text-white p-4 rounded-xl w-full font-bold">Fortschritt löschen</button>
      </div>
    </div>
  );
}

// ==========================================
// HAUPT-APP (Menü-Steuerung)
// ==========================================
export default function App() {
  const [gameState, setGameState] = useState('menu');
  const [activeGame, setActiveGame] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [newBadge, setNewBadge] = useState(null);
  const [runId, setRunId] = useState(0);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showTreasureModal, setShowTreasureModal] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [showAdminControl, setShowAdminControl] = useState(false);
  const [tipMessage, setTipMessage] = useState(null);

  const [globalScore, setGlobalScore] = useState(0);
  const [gameProgress, setGameProgress] = useState({});
  const [hudAnim, setHudAnim] = useState(false);

  const getLockState = (gameMode) => {
    const req = UNLOCK_REQ[gameMode];
    if (!req) return false;
    return (gameProgress[req]?.score || 0) >= 9 ? false : `Braucht 9 Sterne in „${gameById(req).title}“`;
  };

  const startGame = (gameMode) => {
    if (getLockState(gameMode)) return;
    setActiveGame(gameMode);
    setRunId(r => r + 1);
    setGameState('playing');
    window.scrollTo(0, 0);
    setGameProgress(prev => ({ ...prev, [gameMode]: { ...prev[gameMode], status: prev[gameMode]?.status === 'completed' ? 'completed' : 'started' } }));
  };

  const handleFinish = (earnedStars, maxPossible) => {
    const prevStars = gameProgress[activeGame]?.score || 0;
    const newStars = Math.max(prevStars, earnedStars);
    const diff = newStars - prevStars;
    if (diff > 0) { setGlobalScore(prev => prev + diff); setHudAnim(true); }
    setNewBadge(earnedStars >= 10 && prevStars < 10 ? activeGame : null);
    setFinalScore(earnedStars);
    setMaxScore(maxPossible);
    setGameState('finished');
    window.scrollTo(0, 0);
    setGameProgress(prev => ({ ...prev, [activeGame]: { status: 'completed', score: newStars, max: maxPossible } }));
  };

  const replay = () => { setRunId(r => r + 1); setGameState('playing'); window.scrollTo(0, 0); };

  const getBackgroundClass = () => {
    const bg = {
      marker: 'from-yellow-900/60 via-indigo-950 to-black',
      sortieren: 'from-cyan-900 via-slate-950 to-black',
      comic: 'from-sky-900 via-indigo-950 to-black',
      zeichen: 'from-amber-900/70 via-slate-950 to-black',
      fehler: 'from-rose-900/70 via-slate-950 to-black',
      puzzle: 'from-orange-900/70 via-slate-950 to-black',
      memory: 'from-pink-900/70 via-indigo-950 to-black',
      redeverb: 'from-fuchsia-900 via-slate-950 to-black',
      regen: 'from-violet-900 via-indigo-950 to-black',
      umstellen: 'from-lime-900/60 via-slate-950 to-black',
      sprechblase: 'from-emerald-900/70 via-slate-950 to-black',
      finale: 'from-teal-900 via-indigo-950 to-black'
    };
    if (gameState !== 'playing') return 'bg-indigo-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900 via-indigo-950 to-slate-950';
    return `bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${bg[activeGame] || 'from-indigo-900 via-slate-950 to-black'}`;
  };

  const ActiveComp = activeGame ? gameById(activeGame).comp : null;
  const badgeGame = newBadge ? gameById(newBadge) : null;

  return (
    <>
      <style>{comicStyles}</style>

      {showRulesModal && <RulesModal onClose={() => setShowRulesModal(false)} />}
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
      {showSaveModal && <SaveLoadModal onClose={() => setShowSaveModal(false)} gameProgress={gameProgress} setGameProgress={setGameProgress} setGlobalScore={setGlobalScore} />}
      {showTreasureModal && <TreasureModal onClose={() => setShowTreasureModal(false)} gameProgress={gameProgress} />}
      {showAdminAuth && <AdminAuthModal onClose={() => setShowAdminAuth(false)} onLogin={() => { setShowAdminAuth(false); setShowAdminControl(true); }} />}
      {showAdminControl && <AdminControlModal onClose={() => setShowAdminControl(false)} gameProgress={gameProgress} setGameProgress={setGameProgress} setGlobalScore={setGlobalScore} />}

      {/* HEADER */}
      <div className="fixed top-2 md:top-4 left-2 right-2 md:left-4 md:right-4 z-[100] flex justify-between items-start pointer-events-none gap-1 md:gap-2">
        <div className="flex justify-start pointer-events-auto">
          <button onClick={() => setShowRulesModal(true)} className="flex items-center gap-1 md:gap-2 bg-slate-900/90 text-yellow-300 font-bold py-2 px-3 md:px-4 rounded-full border-2 border-yellow-500/50 shadow-md whitespace-nowrap"><BookOpen className="w-5 h-5" /><span className="hidden lg:inline uppercase text-sm md:text-base">Heldenregeln</span></button>
        </div>
        <div className="flex-1 flex justify-center gap-1 md:gap-2 pointer-events-auto items-center flex-nowrap">
          <button onClick={() => setShowTreasureModal(true)} className="flex items-center gap-1 md:gap-2 bg-slate-900/90 text-yellow-300 font-bold py-2 px-3 md:px-4 rounded-full border-2 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:scale-105 transition-transform whitespace-nowrap"><Trophy className="w-5 h-5" /><span className="hidden lg:inline uppercase text-sm md:text-base">Abzeichen</span></button>
          <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 md:gap-2 bg-slate-900/90 text-cyan-300 font-bold py-2 px-3 md:px-4 rounded-full border-2 border-cyan-500/50 shadow-md whitespace-nowrap"><HelpCircle className="w-5 h-5" /><span className="hidden md:inline uppercase text-sm md:text-base">Hilfe</span></button>
          <button onClick={() => setShowSaveModal(true)} className="flex items-center gap-1 md:gap-2 bg-slate-900/90 text-pink-300 font-bold py-2 px-3 md:px-4 rounded-full border-2 border-pink-500/50 shadow-md whitespace-nowrap"><Key className="w-5 h-5" /><span className="hidden md:inline uppercase text-sm md:text-base">Code</span></button>
          <button onClick={() => setShowAdminAuth(true)} className="opacity-30 hover:opacity-100 p-2 md:ml-1 transition-opacity"><Settings className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="flex justify-end pointer-events-auto">
          <div onAnimationEnd={() => setHudAnim(false)} className={`bg-slate-900/90 border-2 border-yellow-400 py-2 px-3 md:px-4 rounded-full flex items-center gap-1 md:gap-2 shadow-md whitespace-nowrap ${hudAnim ? 'anim-hud' : ''}`}>
            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <span className="text-white font-black text-lg md:text-xl">{globalScore} <span className="text-yellow-300/70 text-xs md:text-sm">/ {totalMaxScore}</span></span>
          </div>
        </div>
      </div>

      {/* MENÜ */}
      {gameState === 'menu' && (
        <div className={`min-h-screen overflow-x-hidden ${getBackgroundClass()} text-indigo-50`}>
          <div className="min-h-screen comic-dots p-4 flex flex-col items-center pt-24 pb-12">
            <div className="bg-indigo-900/40 backdrop-blur-md rounded-[3rem] p-6 md:p-10 text-center border-4 border-yellow-400/40 mb-10 max-w-4xl w-full shadow-2xl relative overflow-hidden">
              <div className="flex justify-center gap-4 md:gap-6 mb-4">
                {[{ s: ':', c: 'from-cyan-400 to-blue-500' }, { s: '„ “', c: 'from-yellow-300 to-orange-400' }, { s: ',', c: 'from-pink-400 to-fuchsia-500' }].map((h, i) => (
                  <div key={i} className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${h.c} border-4 border-indigo-950 flex items-center justify-center text-3xl md:text-4xl font-serif font-black text-indigo-950 shadow-[4px_4px_0_rgba(0,0,0,0.4)] anim-float`} style={{ animationDelay: `${i * 0.4}s` }}>{h.s}</div>
                ))}
              </div>
              <h1 className="text-5xl md:text-7xl font-comic mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 drop-shadow-lg pb-1">Die Redezeichen-Helden</h1>
              <p className="text-indigo-100 font-bold text-lg md:text-xl">In Comic-Stadt sind alle Satzzeichen durcheinander! Hilf Dora Doppelpunkt, Anton Anführungszeichen und Kalle Komma, die wörtliche Rede zu retten.</p>
              <div className="mt-6 max-w-md mx-auto">
                <div className="h-4 bg-slate-900/80 rounded-full overflow-hidden border-2 border-yellow-400/40">
                  <div className="h-full bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 transition-all duration-1000" style={{ width: `${(globalScore / totalMaxScore) * 100}%` }} />
                </div>
                <p className="text-sm text-indigo-200 mt-2 font-bold">{globalScore} von {totalMaxScore} Sternen gesammelt</p>
              </div>
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 xl:grid-cols-2 gap-6">
              {PATHS.map(path => (
                <div key={path.title} className={`${path.box} border-2 rounded-3xl p-4 md:p-6 backdrop-blur-sm`}>
                  <h2 className={`${path.color} font-black text-lg md:text-xl uppercase tracking-widest mb-4 flex items-center justify-center gap-3`}><path.icon className="w-6 h-6" /> {path.title}</h2>
                  <div className="flex flex-col md:flex-row items-stretch justify-center gap-3">
                    {path.games.map((id, i) => {
                      const g = gameById(id);
                      return (
                        <React.Fragment key={id}>
                          {i > 0 && <ArrowRight className={`w-8 h-8 ${path.arrow} rotate-90 md:rotate-0 flex-shrink-0 self-center`} />}
                          <MenuButton number={gameOrder.indexOf(id) + 1} progress={gameProgress[id]} lockState={getLockState(id)} icon={g.icon} color={g.color} title={g.title} desc={g.desc} onClick={() => startGame(id)} />
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GESCHAFFT */}
      {gameState === 'finished' && (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900 via-slate-900 to-indigo-950 flex items-center justify-center p-4 pt-24 overflow-x-hidden text-indigo-50">
          <div className="bg-slate-900/80 backdrop-blur-md max-w-lg w-full rounded-[3rem] shadow-2xl border-4 border-yellow-400/50 p-8 text-center anim-pop relative">
            <Award className="w-24 h-24 mx-auto mb-4 text-yellow-300 anim-float" />
            <h2 className="text-5xl font-comic text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 mb-4">Level geschafft!</h2>
            <div className="flex justify-center flex-wrap gap-1 mb-4">
              {[...Array(maxScore)].map((_, i) => (
                <Star key={i} className={`w-7 h-7 ${i < finalScore ? 'text-yellow-300 fill-yellow-300 anim-pop' : 'text-slate-700'}`} style={{ animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
            <p className="text-2xl text-slate-300 mb-6 font-bold">Du hast <span className="bg-yellow-300 text-yellow-950 px-4 py-2 rounded-xl mx-1">{finalScore} von {maxScore}</span> Sternen!</p>
            {finalScore < 9 && Object.values(UNLOCK_REQ).includes(activeGame) && (
              <p className="text-pink-200 mb-6">Mit 9 Sternen schaltest du das nächste Spiel frei. Du schaffst das!</p>
            )}
            {badgeGame && (
              <div className={`relative mb-6 p-4 rounded-2xl border-4 ${badgeGame.badge.border} ${badgeGame.badge.bg} anim-pop`}>
                <SuccessSparkles size={1.5} />
                <badgeGame.badge.icon className={`w-14 h-14 mx-auto ${badgeGame.badge.color} anim-float`} />
                <p className="font-black text-xl mt-2">Neues Abzeichen: <span className={badgeGame.badge.color}>{badgeGame.badge.name}</span>!</p>
              </div>
            )}
            <div className="flex flex-col gap-4">
              <button onClick={replay} className="flex items-center justify-center gap-3 bg-pink-600 hover:bg-pink-500 text-white font-black text-xl py-4 rounded-2xl active:scale-95"><RotateCcw className="w-6 h-6" /> Nochmal spielen</button>
              <button onClick={() => setGameState('menu')} className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-lg py-4 rounded-2xl active:scale-95">Zurück zu Comic-Stadt</button>
            </div>
          </div>
        </div>
      )}

      {/* SPIELEN */}
      {gameState === 'playing' && ActiveComp && (
        <div className={`min-h-screen transition-colors duration-1000 ${getBackgroundClass()} pt-24 pb-8 px-4 flex flex-col items-center relative w-full overflow-x-hidden text-indigo-50`}>
          {tipMessage && <ContextTipModal message={tipMessage} onClose={() => setTipMessage(null)} />}
          <div className="max-w-5xl w-full">
            <div className="grid grid-cols-3 items-center mb-6 bg-black/40 backdrop-blur-md p-4 px-6 rounded-[2rem] shadow-lg border border-white/10 text-white/80">
              <div className="flex justify-start">
                <button onClick={() => setGameState('menu')} className="font-bold flex items-center gap-2 bg-slate-800/60 hover:bg-slate-700 px-4 py-2 rounded-xl active:scale-95"><ArrowRight className="w-4 h-4 rotate-180" /> <span className="hidden sm:inline">Zurück</span></button>
              </div>
              <div className="font-black tracking-widest uppercase text-xs md:text-base text-center opacity-80">{gameById(activeGame).title}</div>
              <div className="flex justify-end">
                {gameProgress[activeGame]?.score > 0 && <span className="text-yellow-300 font-bold text-sm flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-300" /> Rekord: {gameProgress[activeGame].score}</span>}
              </div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm w-full rounded-[3rem] shadow-2xl border-2 border-white/10 p-5 md:p-10 min-h-[400px]">
              <ActiveComp key={runId} onFinish={handleFinish} onShowTip={setTipMessage} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MenuButton({ number, icon: Icon, color, title, desc, progress, lockState, onClick }) {
  const colorMap = {
    yellow: 'text-yellow-300 border-yellow-400/30 hover:border-yellow-300',
    cyan: 'text-cyan-300 border-cyan-400/30 hover:border-cyan-300',
    sky: 'text-sky-300 border-sky-400/30 hover:border-sky-300',
    amber: 'text-amber-300 border-amber-400/30 hover:border-amber-300',
    rose: 'text-rose-300 border-rose-400/30 hover:border-rose-300',
    orange: 'text-orange-300 border-orange-400/30 hover:border-orange-300',
    pink: 'text-pink-300 border-pink-400/30 hover:border-pink-300',
    fuchsia: 'text-fuchsia-300 border-fuchsia-400/30 hover:border-fuchsia-300',
    violet: 'text-violet-300 border-violet-400/30 hover:border-violet-300',
    lime: 'text-lime-300 border-lime-400/30 hover:border-lime-300',
    emerald: 'text-emerald-300 border-emerald-400/30 hover:border-emerald-300',
    teal: 'text-teal-300 border-teal-400/30 hover:border-teal-300'
  };
  const isCompleted = progress?.status === 'completed';
  const isStarted = progress?.status === 'started';
  const isLocked = !!lockState;
  const isPerfect = (progress?.score || 0) >= 10;

  let cardStyle = `bg-slate-900/80 hover:bg-slate-800 border-4 ${colorMap[color]}`;
  if (isLocked) cardStyle = "bg-slate-900/60 border-4 border-slate-800 cursor-not-allowed opacity-60";
  else if (isCompleted) cardStyle = `bg-violet-900/40 border-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)] ${colorMap[color].split(' ')[0]}`;
  else if (isStarted) cardStyle = `bg-indigo-900/40 border-4 border-pink-400 ${colorMap[color].split(' ')[0]}`;

  return (
    <button onClick={onClick} disabled={isLocked} className={`relative flex-1 w-full md:w-auto flex flex-col items-center justify-center p-4 rounded-3xl transition-all group ${cardStyle} ${!isLocked ? 'active:scale-95 hover:scale-105' : ''}`}>
      <span className="absolute top-2 left-3 text-xs font-black opacity-50">{number}</span>
      {isLocked && <div className="absolute top-2 right-2"><Lock className="w-4 h-4 text-slate-500" /></div>}
      {isCompleted && !isLocked && (
        <div className={`absolute -top-2 -right-2 ${isPerfect ? 'bg-yellow-300 text-yellow-950' : 'bg-pink-400 text-pink-950'} text-xs font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-md`}>
          <Star className="w-3 h-3 fill-current" />{progress.score}
        </div>
      )}
      <Icon className={`w-9 h-9 mb-2 ${isLocked ? 'text-slate-600' : ''}`} />
      <h3 className={`text-sm md:text-base text-center font-black leading-tight ${isLocked ? 'text-slate-600' : 'text-slate-100'}`}>{title}</h3>
      <p className={`text-xs text-center mt-1 ${isLocked ? 'text-slate-600' : 'text-slate-400'}`}>{isLocked ? lockState : desc}</p>
    </button>
  );
}
