'use strict';

(function () {
  // ===== Konfiguracja =====

  const LEVELS = {
    easy:   { label: 'Łatwy',  rows: 4, cols: 4 },
    medium: { label: 'Średni', rows: 4, cols: 6 },
    hard:   { label: 'Trudny', rows: 6, cols: 6 },
  };

  const THEMES = {
    animals: [
      ['🐶', 'pies'], ['🐱', 'kot'], ['🐭', 'mysz'], ['🐹', 'chomik'], ['🐰', 'królik'], ['🦊', 'lis'],
      ['🐻', 'niedźwiedź'], ['🐼', 'panda'], ['🐨', 'koala'], ['🐯', 'tygrys'], ['🦁', 'lew'], ['🐮', 'krowa'],
      ['🐷', 'świnia'], ['🐸', 'żaba'], ['🐵', 'małpa'], ['🐔', 'kura'], ['🐧', 'pingwin'], ['🐙', 'ośmiornica'],
    ],
    fruits: [
      ['🍎', 'czerwone jabłko'], ['🍏', 'zielone jabłko'], ['🍐', 'gruszka'], ['🍊', 'pomarańcza'], ['🍋', 'cytryna'], ['🍌', 'banan'],
      ['🍉', 'arbuz'], ['🍇', 'winogrona'], ['🍓', 'truskawka'], ['🫐', 'borówki'], ['🍈', 'melon'], ['🍒', 'wiśnie'],
      ['🍑', 'brzoskwinia'], ['🥭', 'mango'], ['🍍', 'ananas'], ['🥥', 'kokos'], ['🥝', 'kiwi'], ['🥑', 'awokado'],
    ],
    vehicles: [
      ['🚗', 'samochód'], ['🚕', 'taksówka'], ['🚙', 'terenówka'], ['🚌', 'autobus'], ['🚎', 'trolejbus'], ['🚓', 'radiowóz'],
      ['🚑', 'karetka'], ['🚒', 'wóz strażacki'], ['🚐', 'minibus'], ['🛻', 'pikap'], ['🚚', 'ciężarówka'], ['🚜', 'traktor'],
      ['🚲', 'rower'], ['🛴', 'hulajnoga'], ['🚂', 'lokomotywa'], ['🚁', 'helikopter'], ['🚀', 'rakieta'], ['🚢', 'statek'],
    ],
  };

  const MISMATCH_MS = 1000; // czas pokazania niepasujących kart (3.2)
  const MAX_CARD_PX = 140;

  const STORAGE_SETTINGS = 'memory.settings';
  const STORAGE_RECORDS = 'memory.records';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const timing = () => reducedMotion.matches
    ? { flip: 0, bounce: 400, fade: 0 }
    : { flip: 400, bounce: 600, fade: 300 };

  // ===== Elementy DOM =====

  const $ = (id) => document.getElementById(id);
  const screens = { start: $('screen-start'), game: $('screen-game'), end: $('screen-end') };
  const startForm = $('start-form');
  const board = $('board');
  const boardWrap = $('board-wrap');
  const hudMoves = $('hud-moves');
  const hudTime = $('hud-time');
  const hudPairs = $('hud-pairs');
  const muteBtn = $('mute-btn');
  const clearRecordsBtn = $('clear-records-btn');
  const confirmDialog = $('confirm-dialog');
  const announcer = $('announcer');

  // ===== Stan =====

  const settings = loadSettings();
  let records = loadRecords();

  const game = {
    deck: [],
    flipped: [],
    locked: false,
    moves: 0,
    pairsFound: 0,
    totalPairs: 0,
    started: false,
    finished: false,
    cols: 4,
    elapsedMs: 0,
    runningSince: null,
    tickId: null,
    timeouts: new Set(),
  };

  // ===== Pamięć przeglądarki =====

  function readJson(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // brak dostępu do localStorage (np. tryb prywatny) – gra działa dalej bez zapisu
    }
  }

  function loadSettings() {
    const s = readJson(STORAGE_SETTINGS) || {};
    return {
      level: LEVELS[s.level] ? s.level : 'easy',
      theme: THEMES[s.theme] ? s.theme : 'animals',
      muted: s.muted === true,
    };
  }

  function saveSettings() {
    writeJson(STORAGE_SETTINGS, settings);
  }

  function loadRecords() {
    const r = readJson(STORAGE_RECORDS);
    const result = {};
    if (r && typeof r === 'object') {
      Object.keys(LEVELS).forEach((level) => {
        const rec = r[level];
        if (rec && Number.isFinite(rec.moves) && Number.isFinite(rec.timeMs)) {
          result[level] = { moves: rec.moves, timeMs: rec.timeMs };
        }
      });
    }
    return result;
  }

  function isBetter(result, record) {
    return !record
      || result.moves < record.moves
      || (result.moves === record.moves && result.timeMs < record.timeMs);
  }

  // ===== Pomocnicze =====

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function formatTime(ms) {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return m + ':' + String(s).padStart(2, '0');
  }

  function plural(n, one, few, many) {
    if (n === 1) return one;
    const d = n % 10;
    const dd = n % 100;
    return d >= 2 && d <= 4 && (dd < 12 || dd > 14) ? few : many;
  }

  function movesText(n) {
    return n + ' ' + plural(n, 'ruch', 'ruchy', 'ruchów');
  }

  function later(fn, ms) {
    const id = setTimeout(() => {
      game.timeouts.delete(id);
      fn();
    }, ms);
    game.timeouts.add(id);
  }

  function clearLater() {
    game.timeouts.forEach(clearTimeout);
    game.timeouts.clear();
  }

  function announce(text) {
    announcer.textContent = '';
    // krótka przerwa, żeby czytnik ekranu odczytał także powtórzony tekst
    setTimeout(() => { announcer.textContent = text; }, 50);
  }

  function starsFor(moves, pairs) {
    if (moves <= Math.round(pairs * 1.75)) return 3;
    if (moves <= Math.round(pairs * 2.5)) return 2;
    return 1;
  }

  // ===== Ekrany =====

  function currentScreen() {
    return Object.keys(screens).find((name) => !screens[name].hidden);
  }

  function showScreen(name) {
    Object.keys(screens).forEach((key) => {
      screens[key].hidden = key !== name;
    });
  }

  function renderRecords() {
    Object.keys(LEVELS).forEach((level) => {
      const rec = records[level];
      $('record-' + level).textContent = rec
        ? 'Rekord: ' + movesText(rec.moves) + ', ' + formatTime(rec.timeMs)
        : 'Brak rekordu';
    });
    clearRecordsBtn.disabled = Object.keys(records).length === 0;
  }

  function showStart() {
    resetGame();
    startForm.elements.level.value = settings.level;
    startForm.elements.theme.value = settings.theme;
    renderRecords();
    showScreen('start');
    $('start-title').focus();
  }

  // ===== Stoper =====

  function elapsed() {
    return game.elapsedMs + (game.runningSince !== null ? performance.now() - game.runningSince : 0);
  }

  function updateTime() {
    hudTime.textContent = formatTime(elapsed());
  }

  function startTimer() {
    if (game.runningSince !== null) return;
    game.runningSince = performance.now();
    game.tickId = setInterval(updateTime, 250);
  }

  function pauseTimer() {
    if (game.runningSince === null) return;
    game.elapsedMs += performance.now() - game.runningSince;
    game.runningSince = null;
    clearInterval(game.tickId);
    game.tickId = null;
    updateTime();
  }

  function resumeTimerIfPlaying() {
    if (game.started && !game.finished && currentScreen() === 'game'
        && !confirmDialog.open && document.visibilityState === 'visible') {
      startTimer();
    }
  }

  // ===== Gra =====

  function resetGame() {
    clearLater();
    pauseTimer();
    Object.assign(game, {
      deck: [],
      flipped: [],
      locked: false,
      moves: 0,
      pairsFound: 0,
      totalPairs: 0,
      started: false,
      finished: false,
      elapsedMs: 0,
      runningSince: null,
    });
    board.textContent = '';
  }

  function isInProgress() {
    return game.started && !game.finished;
  }

  function startGame() {
    resetGame();
    const level = LEVELS[settings.level];
    game.totalPairs = (level.rows * level.cols) / 2;

    const picked = shuffle(THEMES[settings.theme].slice()).slice(0, game.totalPairs);
    const cards = [];
    picked.forEach(([emoji, name], pairId) => {
      cards.push({ pairId, emoji, name }, { pairId, emoji, name });
    });
    shuffle(cards);

    const frag = document.createDocumentFragment();
    game.deck = cards.map((c, index) => {
      const card = Object.assign({ index, status: 'hidden', el: createCardElement(c, index) }, c);
      frag.appendChild(card.el);
      updateCardLabel(card);
      return card;
    });
    board.appendChild(frag);

    updateHud();
    updateTime();
    showScreen('game');
    layoutBoard();
    game.deck[0].el.focus();
  }

  function createCardElement(card, index) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card';
    btn.dataset.index = String(index);
    btn.style.setProperty('--hue', String(Math.round((card.pairId * 137.5) % 360)));

    const inner = document.createElement('span');
    inner.className = 'card-inner';

    const back = document.createElement('span');
    back.className = 'card-face card-back';
    back.setAttribute('aria-hidden', 'true');
    back.textContent = '?';

    const front = document.createElement('span');
    front.className = 'card-face card-front';
    front.setAttribute('aria-hidden', 'true');
    front.textContent = card.emoji;

    inner.append(back, front);
    btn.appendChild(inner);
    return btn;
  }

  function updateCardLabel(card) {
    const n = 'Karta ' + (card.index + 1);
    let label;
    if (card.status === 'hidden') label = n + ', zakryta';
    else if (card.status === 'shown') label = n + ', ' + card.name;
    else label = n + ', ' + card.name + ', para znaleziona';
    card.el.setAttribute('aria-label', label);
  }

  function setStatus(card, status) {
    card.status = status;
    card.el.classList.toggle('is-flipped', status !== 'hidden');
    card.el.classList.toggle('is-matched', status === 'matched' || status === 'gone');
    updateCardLabel(card);
  }

  function updateHud() {
    hudMoves.textContent = String(game.moves);
    hudPairs.textContent = game.pairsFound + ' / ' + game.totalPairs;
  }

  function onCardActivate(card) {
    if (game.locked || game.finished || card.status !== 'hidden') return;

    unlockAudio();
    if (!game.started) {
      game.started = true;
      startTimer();
    }

    setStatus(card, 'shown');
    game.flipped.push(card);
    if (game.flipped.length < 2) return;

    const [a, b] = game.flipped;
    game.flipped = [];
    game.moves++;
    game.locked = true;
    updateHud();

    const t = timing();
    if (a.pairId === b.pairId) {
      later(() => onMatch(a, b), t.flip);
    } else {
      later(() => {
        playSound('miss');
        announce('Nie pasują: ' + a.name + ' i ' + b.name + '.');
      }, t.flip);
      later(() => {
        setStatus(a, 'hidden');
        setStatus(b, 'hidden');
        later(() => { game.locked = false; }, t.flip);
      }, t.flip + MISMATCH_MS);
    }
  }

  function onMatch(a, b) {
    const t = timing();
    setStatus(a, 'matched');
    setStatus(b, 'matched');
    game.pairsFound++;
    updateHud();

    const won = game.pairsFound === game.totalPairs;
    if (won) {
      game.finished = true;
      pauseTimer();
      announce('Para: ' + a.name + '. Znaleziono wszystkie pary!');
    } else {
      playSound('match');
      announce('Para: ' + a.name + '. Znaleziono ' + game.pairsFound + ' z ' + game.totalPairs + '.');
    }
    game.locked = false;

    // para „podskakuje”, a potem znika, zostawiając puste miejsce (3.3)
    later(() => {
      removeCard(a);
      removeCard(b);
      if (won) later(finishGame, t.fade);
    }, t.bounce);
  }

  function removeCard(card) {
    const hadFocus = document.activeElement === card.el;
    card.status = 'gone';
    card.el.classList.add('is-gone');
    card.el.tabIndex = -1;
    card.el.setAttribute('aria-hidden', 'true');
    if (hadFocus) focusNearest(card.index);
  }

  function focusNearest(fromIndex) {
    const deck = game.deck;
    for (let dist = 1; dist < deck.length; dist++) {
      const candidates = [deck[fromIndex + dist], deck[fromIndex - dist]];
      const target = candidates.find((c) => c && c.status !== 'gone');
      if (target) {
        target.el.focus();
        return;
      }
    }
  }

  function finishGame() {
    const result = { moves: game.moves, timeMs: Math.round(game.elapsedMs) };
    const stars = starsFor(result.moves, game.totalPairs);
    const previous = records[settings.level];
    const newRecord = isBetter(result, previous);
    if (newRecord) {
      records[settings.level] = result;
      writeJson(STORAGE_RECORDS, records);
    }

    const starsEl = $('end-stars');
    starsEl.textContent = '';
    for (let i = 1; i <= 3; i++) {
      const s = document.createElement('span');
      s.className = i <= stars ? 'star-on' : 'star-off';
      s.textContent = '★';
      starsEl.appendChild(s);
    }
    starsEl.setAttribute('aria-label', 'Ocena: ' + stars + ' z 3 gwiazdek');

    $('end-moves').textContent = String(result.moves);
    $('end-time').textContent = formatTime(result.timeMs);
    $('end-level').textContent = LEVELS[settings.level].label;

    const recordEl = $('end-record');
    recordEl.classList.toggle('is-new', newRecord);
    recordEl.textContent = newRecord
      ? 'Nowy rekord!'
      : 'Rekord: ' + movesText(previous.moves) + ', ' + formatTime(previous.timeMs);

    showScreen('end');
    $('end-title').focus();
    playSound('win');
    launchConfetti();
  }

  // ===== Układ planszy =====

  function layoutBoard() {
    if (!game.deck.length) return;
    const W = boardWrap.clientWidth;
    const H = boardWrap.clientHeight;
    if (!W || !H) return;

    const level = LEVELS[settings.level];
    const gap = Math.min(W, H) < 500 ? 6 : 10;
    const fit = (cols, rows) => Math.min((W - gap * (cols - 1)) / cols, (H - gap * (rows - 1)) / rows);

    // plansza prostokątna może się obrócić, jeśli dzięki temu karty będą większe (np. telefon w pionie)
    let cols = level.cols;
    let rows = level.rows;
    if (cols !== rows && fit(rows, cols) > fit(cols, rows)) {
      [cols, rows] = [rows, cols];
    }

    const size = Math.max(24, Math.floor(Math.min(fit(cols, rows), MAX_CARD_PX)));
    game.cols = cols;
    board.style.setProperty('--cols', String(cols));
    board.style.setProperty('--gap', gap + 'px');
    board.style.setProperty('--card-size', size + 'px');
  }

  function moveFocus(card, dx, dy) {
    const cols = game.cols;
    const rows = game.deck.length / cols;
    let x = card.index % cols;
    let y = Math.floor(card.index / cols);
    for (;;) {
      x += dx;
      y += dy;
      if (x < 0 || x >= cols || y < 0 || y >= rows) return;
      const target = game.deck[y * cols + x];
      if (target.status !== 'gone') {
        target.el.focus();
        return;
      }
    }
  }

  // ===== Potwierdzenie =====

  function confirmAction(message, okLabel) {
    return new Promise((resolve) => {
      $('confirm-msg').textContent = message;
      $('confirm-ok').textContent = okLabel;
      confirmDialog.returnValue = '';
      pauseTimer();
      confirmDialog.addEventListener('close', () => {
        const ok = confirmDialog.returnValue === 'ok';
        if (!ok) resumeTimerIfPlaying();
        resolve(ok);
      }, { once: true });
      confirmDialog.showModal();
    });
  }

  async function confirmAbortIfPlaying() {
    return !isInProgress() || confirmAction('Czy na pewno przerwać grę? Obecny postęp zostanie utracony.', 'Przerwij');
  }

  // ===== Dźwięk (Web Audio, bez plików) =====

  let audioCtx = null;

  function unlockAudio() {
    if (settings.muted) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }

  function tone(freq, start, duration, type, volume) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const t0 = audioCtx.currentTime + start;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  function playSound(kind) {
    if (settings.muted || !audioCtx) return;
    if (kind === 'match') {
      tone(660, 0, 0.12, 'triangle', 0.2);
      tone(990, 0.1, 0.18, 'triangle', 0.2);
    } else if (kind === 'miss') {
      tone(220, 0, 0.14, 'square', 0.06);
      tone(165, 0.12, 0.2, 'square', 0.06);
    } else if (kind === 'win') {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, 'triangle', 0.2));
    }
  }

  function renderMute() {
    muteBtn.setAttribute('aria-pressed', String(settings.muted));
    const label = settings.muted ? 'Włącz dźwięk' : 'Wycisz dźwięk';
    muteBtn.title = label;
    muteBtn.setAttribute('aria-label', label);
    muteBtn.querySelector('.mute-icon').textContent = settings.muted ? '🔇' : '🔊';
  }

  // ===== Konfetti =====

  const confettiCanvas = $('confetti');
  let confettiFrame = null;

  function launchConfetti() {
    if (reducedMotion.matches) return;
    const ctx = confettiCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    confettiCanvas.width = w * dpr;
    confettiCanvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];
    const pieces = Array.from({ length: 160 }, () => ({
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.5,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 3,
      size: 6 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const DURATION = 3500;
    const start = performance.now();
    cancelAnimationFrame(confettiFrame);

    function frame(now) {
      const t = now - start;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = t > DURATION - 700 ? Math.max(0, (DURATION - t) / 700) : 1;
      pieces.forEach((p) => {
        p.vy += 0.05;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
      if (t < DURATION) {
        confettiFrame = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, w, h);
        confettiFrame = null;
      }
    }
    confettiFrame = requestAnimationFrame(frame);
  }

  // ===== Zdarzenia =====

  startForm.addEventListener('change', () => {
    settings.level = startForm.elements.level.value;
    settings.theme = startForm.elements.theme.value;
    saveSettings();
  });

  startForm.addEventListener('submit', (e) => {
    e.preventDefault();
    unlockAudio();
    startGame();
  });

  clearRecordsBtn.addEventListener('click', async () => {
    if (await confirmAction('Usunąć rekordy ze wszystkich poziomów?', 'Usuń')) {
      records = {};
      writeJson(STORAGE_RECORDS, records);
      renderRecords();
    }
    clearRecordsBtn.focus();
  });

  board.addEventListener('click', (e) => {
    const el = e.target.closest('.card');
    if (el) onCardActivate(game.deck[Number(el.dataset.index)]);
  });

  board.addEventListener('keydown', (e) => {
    const dirs = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const dir = dirs[e.key];
    const el = e.target.closest('.card');
    if (!dir || !el) return;
    e.preventDefault();
    moveFocus(game.deck[Number(el.dataset.index)], dir[0], dir[1]);
  });

  $('restart-btn').addEventListener('click', async () => {
    if (await confirmAbortIfPlaying()) startGame();
  });

  $('menu-btn').addEventListener('click', async () => {
    if (await confirmAbortIfPlaying()) showStart();
  });

  $('again-btn').addEventListener('click', () => {
    unlockAudio();
    startGame();
  });

  $('end-menu-btn').addEventListener('click', showStart);

  muteBtn.addEventListener('click', () => {
    settings.muted = !settings.muted;
    saveSettings();
    renderMute();
    unlockAudio();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') pauseTimer();
    else resumeTimerIfPlaying();
  });

  if (window.ResizeObserver) {
    new ResizeObserver(layoutBoard).observe(boardWrap);
  } else {
    window.addEventListener('resize', layoutBoard);
  }

  // ===== Start =====

  renderMute();
  showStart();
})();
