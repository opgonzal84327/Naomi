import { initializeApp } from "https://gstatic.com";
import { getDatabase, ref, set, get, update, onValue, onDisconnect } from "https://gstatic.com";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDZA3z3Uelvgs-Jil9-ubudr_3dCjZnL3o",
  authDomain: "loteria-educativa.firebaseapp.com",
  databaseURL: "https://loteria-educativa-default-rtdb.firebaseio.com",
  projectId: "loteria-educativa",
  storageBucket: "loteria-educativa.firebasestorage.app",
  messagingSenderId: "738351388841",
  appId: "1:738351388841:web:634d2c8c23fb02cb1c31b8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Estado local del jugador
let myId = "p_" + Math.random().toString(36).substring(2, 9);
let myName = "";
let roomCode = "";
let isHost = false;
let myBoard = [];
let markedCells = new Set();
let roomData = null;
let callerTimer = null;
let lastSpokenIndex = -1;
let audioUnlocked = false;

// Utilidad para mezclar arreglos (Fisher-Yates)
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generar código de sala corto (4 letras/números)
function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// Construir mazo respetando las cartas obligatorias
function buildDeck(themeKey, deckSize) {
  const allCards = TEMAS[themeKey].cartas;
  const required = allCards.filter(c => c.required);
  const optional = shuffle(allCards.filter(c => !c.required));
  const needed = Math.max(0, deckSize - required.length);
  const selected = [...required, ...optional.slice(0, needed)];
  return shuffle(selected).map(c => c.id);
}

// Desbloquear y usar voz (compatible con iPad/Safari)
function speakText(text, lang, rate = 0.9) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = parseFloat(rate);
  window.speechSynthesis.speak(utterance);
}

document.getElementById("btn-audio-toggle").addEventListener("click", () => {
  audioUnlocked = true;
  const lang = roomData ? TEMAS[roomData.theme].lang : "es-MX";
  const rate = roomData ? roomData.voiceRate : 0.9;
  speakText(lang === "en-US" ? "Audio ready!" : "Audio activado", lang, rate);
});

// Renderizar visual (Imagen con respaldo automático a Emoji)
function createVisualElement(card) {
  const container = document.createElement("div");
  container.className = "visual";

  if (card.img && card.img.trim() !== "") {
    const img = document.createElement("img");
    img.src = card.img;
    img.alt = card.frontText;
    img.onerror = () => {
      container.innerHTML = card.emoji || "";
    };
    container.appendChild(img);
  } else if (card.emoji) {
    container.textContent = card.emoji;
  }
  return container;
}

// Dibujar tablero del jugador
function renderBoard(boardIds, themeKey, boardSize, mode) {
  const boardEl = document.getElementById("player-board");
  boardEl.innerHTML = "";
  boardEl.className = `board board-${boardSize}`;

  const allCards = TEMAS[themeKey].cartas;

  boardIds.forEach((cardId, idx) => {
    const card = allCards.find(c => c.id === cardId);
    const cell = document.createElement("div");
    cell.className = "cell" + (markedCells.has(idx) ? " marked" : "");

    if (mode === "asociacion") {
      // En modo asociación: si tiene imagen o emoji, muestra solo eso; si no (multiplicaciones), muestra el resultado
      if ((card.img && card.img.trim() !== "") || card.emoji) {
        cell.appendChild(createVisualElement(card));
      } else {
        const txt = document.createElement("div");
        txt.className = "cell-text";
        txt.style.fontSize = "clamp(1.4rem, 4vw, 2.2rem)";
        txt.textContent = card.boardText;
        cell.appendChild(txt);
      }
    } else {
      // Modo clásico: muestra visual + texto
      if ((card.img && card.img.trim() !== "") || card.emoji) {
        cell.appendChild(createVisualElement(card));
      }
      const txt = document.createElement("div");
      txt.className = "cell-text";
      txt.textContent = card.boardText;
      cell.appendChild(txt);
    }

    cell.addEventListener("click", () => {
      if (markedCells.has(idx)) {
        markedCells.delete(idx);
        cell.classList.remove("marked");
      } else {
        markedCells.add(idx);
        cell.classList.add("marked");
      }
    });

    boardEl.appendChild(cell);
  });
}

// CREAR SALA (ANFITRIÓN)
document.getElementById("btn-create").addEventListener("click", async () => {
  myName = document.getElementById("player-name").value.trim() || "Anfitrión";
  const theme = document.getElementById("cfg-theme").value;
  const mode = document.getElementById("cfg-mode").value;
  const boardSize = parseInt(document.getElementById("cfg-board").value);
  const deckSize = parseInt(document.getElementById("cfg-deck").value);
  const speed = parseInt(document.getElementById("cfg-speed").value);
  const voiceRate = parseFloat(document.getElementById("cfg-voice").value);

  // Desbloquear audio desde el toque del usuario (clave en iPad)
  speakText("", TEMAS[theme].lang, voiceRate);
  audioUnlocked = true;

  roomCode = generateRoomCode();
  isHost = true;

  const deck = buildDeck(theme, deckSize);
  const totalCells = boardSize * boardSize;
  myBoard = shuffle(deck).slice(0, totalCells);

  const initialRoom = {
    hostId: myId,
    theme,
    mode,
    boardSize,
    deckSize,
    speed,
    voiceRate,
    deck,
    currentIndex: -1,
    status: "waiting", // waiting, playing, paused, finished
    winner: "",
    players: {
      [myId]: { name: myName }
    }
  };

  await set(ref(db, `rooms/${roomCode}`), initialRoom);
  enterRoom();
});

// UNIRSE A SALA (JUGADOR)
document.getElementById("btn-join").addEventListener("click", async () => {
  myName = document.getElementById("player-name").value.trim() || "Jugador";
  const inputCode = document.getElementById("join-code").value.trim().toUpperCase();
  if (!inputCode) return alert("Escribe el código de la sala.");

  const snap = await get(ref(db, `rooms/${inputCode}`));
  if (!snap.exists()) return alert("No se encontró esa sala. Revisa el código.");

  const data = snap.val();
  roomCode = inputCode;
  isHost = (data.hostId === myId);

  // Desbloquear audio al entrar
  speakText("", TEMAS[data.theme].lang, data.voiceRate);
  audioUnlocked = true;

  const totalCells = data.boardSize * data.boardSize;
  myBoard = shuffle(data.deck).slice(0, totalCells);

  await set(ref(db, `rooms/${roomCode}/players/${myId}`), { name: myName });
  enterRoom();
});

// ENTRAR Y ESCUCHAR CAMBIOS EN TIEMPO REAL
function enterRoom() {
  document.getElementById("screen-home").classList.add("hidden");
  document.getElementById("screen-game").classList.remove("hidden");
  document.getElementById("display-room-code").textContent = roomCode;

  if (isHost) {
    document.getElementById("host-controls").classList.remove("hidden");
  }

  // Eliminar jugador si cierra pestaña
  onDisconnect(ref(db, `rooms/${roomCode}/players/${myId}`)).remove();

  onValue(ref(db, `rooms/${roomCode}`), (snapshot) => {
    if (!snapshot.exists()) return;
    const data = snapshot.val();
    const firstLoad = !roomData;
    roomData = data;

    document.getElementById("display-theme-name").textContent = TEMAS[data.theme].nombre;

    // Lista de jugadores
    const playersObj = data.players || {};
    const names = Object.values(playersObj).map(p => p.name);
    document.getElementById("players-bar").textContent = `Jugadores (${names.length}): ${names.join(", ")}`;

    // Dibujar tablero la primera vez
    if (firstLoad) {
      renderBoard(myBoard, data.theme, data.boardSize, data.mode);
    }

    // Actualizar contador y carta actual del gritón
    const idx = data.currentIndex;
    const total = data.deck.length;
    document.getElementById("card-counter").textContent = `Cartas: ${Math.max(0, idx + 1)} / ${total}`;

    const callerBox = document.getElementById("caller-card-display");
    if (idx >= 0 && idx < total) {
      const cardId = data.deck[idx];
      const card = TEMAS[data.theme].cartas.find(c => c.id === cardId);

      callerBox.innerHTML = "";
      if (data.mode === "clasico" && ((card.img && card.img.trim() !== "") || card.emoji)) {
        callerBox.appendChild(createVisualElement(card));
      }
      const lbl = document.createElement("div");
      lbl.className = "label-text";
      lbl.textContent = card.frontText;
      callerBox.appendChild(lbl);

      // Cantar carta en voz alta si es nueva
      if (idx !== lastSpokenIndex && data.status === "playing") {
        lastSpokenIndex = idx;
        const textToSpeak = card.speech || card.frontText;
        speakText(textToSpeak, TEMAS[data.theme].lang, data.voiceRate);
      }
    }

    // Botones del Anfitrión
    if (isHost) {
      const btnStart = document.getElementById("btn-start");
      const btnPause = document.getElementById("btn-pause");
      const btnNext = document.getElementById("btn-next");

      if (data.status === "waiting") {
        btnStart.classList.remove("hidden");
        btnPause.classList.add("hidden");
        btnNext.classList.add("hidden");
      } else if (data.status === "playing") {
        btnStart.classList.add("hidden");
        btnNext.classList.remove("hidden");
        if (data.speed > 0) {
          btnPause.classList.remove("hidden");
          btnPause.textContent = "⏸️ Pausar Gritón";
          btnPause.className = "btn-warning";
        }
      } else if (data.status === "paused") {
        btnStart.classList.add("hidden");
        btnPause.classList.remove("hidden");
        btnPause.textContent = "▶️ Reanudar Gritón";
        btnPause.className = "btn-success";
      } else if (data.status === "finished") {
        btnPause.classList.add("hidden");
        btnNext.classList.add("hidden");
        stopCallerLoop();
      }
    }

    // Mostrar Ganador
    const banner = document.getElementById("winner-banner");
    if (data.winner) {
      banner.classList.remove("hidden");
      banner.textContent = `🏆 ¡${data.winner} ha ganado la Lotería! 🏆`;
      stopCallerLoop();
    } else {
      banner.classList.add("hidden");
    }
  });
}

// LÓGICA DEL GRITÓN (SOLO ANFITRIÓN)
function advanceCard() {
  if (!isHost || !roomData || roomData.status !== "playing") return;
  const nextIdx = roomData.currentIndex + 1;
  if (nextIdx >= roomData.deck.length) {
    update(ref(db, `rooms/${roomCode}`), { status: "finished" });
    stopCallerLoop();
    return;
  }
  update(ref(db, `rooms/${roomCode}`), { currentIndex: nextIdx });
}

function startCallerLoop() {
  stopCallerLoop();
  if (!roomData || roomData.speed === 0) return;
  callerTimer = setInterval(() => {
    advanceCard();
  }, roomData.speed * 1000);
}

function stopCallerLoop() {
  if (callerTimer) {
    clearInterval(callerTimer);
    callerTimer = null;
  }
}

document.getElementById("btn-start").addEventListener("click", async () => {
  await update(ref(db, `rooms/${roomCode}`), { status: "playing", currentIndex: 0 });
  startCallerLoop();
});

document.getElementById("btn-pause").addEventListener("click", async () => {
  if (roomData.status === "playing") {
    stopCallerLoop();
    await update(ref(db, `rooms/${roomCode}`), { status: "paused" });
  } else if (roomData.status === "paused") {
    await update(ref(db, `rooms/${roomCode}`), { status: "playing" });
    startCallerLoop();
  }
});

document.getElementById("btn-next").addEventListener("click", () => {
  advanceCard();
  if (roomData.status === "playing" && roomData.speed > 0) {
    startCallerLoop(); // Reinicia el conteo del temporizador tras adelantar manualmente
  }
});

// VERIFICAR ¡LOTERÍA!
document.getElementById("btn-loteria").addEventListener("click", async () => {
  if (!roomData || roomData.status === "waiting" || roomData.winner) return;

  const totalCells = roomData.boardSize * roomData.boardSize;
  if (markedCells.size < totalCells) {
    return alert("¡Aún te faltan casillas por marcar en tu tablero!");
  }

  // Cartas que realmente ya salieron
  const calledCards = new Set(roomData.deck.slice(0, roomData.currentIndex + 1));
  const allValid = myBoard.every(cardId => calledCards.has(cardId));

  if (allValid) {
    await update(ref(db, `rooms/${roomCode}`), {
      status: "finished",
      winner: myName
    });
  } else {
    alert("❌ ¡Falsa alarma! Tienes marcada al menos una carta que todavía no ha salido.");
  }
});

// SALIR DE LA SALA
document.getElementById("btn-leave").addEventListener("click", () => {
  stopCallerLoop();
  location.reload();
});

