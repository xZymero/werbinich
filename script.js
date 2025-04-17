let isHost = false;
let lobbyCode = "";
let players = [];
let assignments = {};
let characters = {};
let rank = 1;
let currentPlayerName = "";

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function createLobby() {
  isHost = true;
  lobbyCode = generateCode();
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("name-color-menu").classList.remove("hidden");
}

function showJoinMenu() {
  isHost = false;
  lobbyCode = prompt("Gib den Lobby-Code ein:");
  if (lobbyCode && lobbyCode.length === 4) {
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("name-color-menu").classList.remove("hidden");
  } else {
    alert("Ungültiger Code.");
  }
}

function joinLobby() {
  const name = document.getElementById("player-name").value.trim();
  const color = document.getElementById("player-color").value;

  if (!name) return alert("Bitte gib einen Namen ein.");
  if (players.some(p => p.name.toLowerCase() === name.toLowerCase()))
    return alert("Name bereits vergeben.");
  if (players.some(p => p.color === color))
    return alert("Farbe bereits vergeben.");

  players.push({ name, color });
  currentPlayerName = name;

  document.getElementById("name-color-menu").classList.add("hidden");
  document.getElementById("lobby").classList.remove("hidden");
  document.getElementById("lobby-code-display").textContent = lobbyCode;

  renderPlayers();

  if (isHost) {
    document.getElementById("start-btn").classList.remove("hidden");
  }
}

function renderPlayers() {
  const list = document.getElementById("player-list");
  list.innerHTML = "";
  players.forEach(player => {
    const div = document.createElement("div");
    div.classList.add("player");
    div.textContent = player.name;
    div.style.color = player.color;
    list.appendChild(div);
  });
}

function startGame() {
  if (players.length < 2) {
    alert("Mindestens 2 Spieler benötigt.");
    return;
  }

  const names = players.map(p => p.name);
  const shuffled = [...names];

  do {
    shuffled.sort(() => Math.random() - 0.5);
  } while (shuffled.some((name, i) => name === names[i]));

  assignments = {};
  names.forEach((name, i) => {
    assignments[name] = shuffled[i];
  });

  document.getElementById("lobby").classList.add("hidden");
  document.getElementById("assignment-screen").classList.remove("hidden");

  const target = assignments[currentPlayerName];
  document.getElementById("assigned-player-name").textContent = target;
}

function submitCharacter() {
  const character = document.getElementById("character-input").value.trim();
  if (!character) return alert("Bitte gib eine Figur ein.");

  characters[currentPlayerName] = character;

  document.getElementById("assignment-screen").classList.add("hidden");
  showGuessingScreen();
}

function showGuessingScreen() {
  document.getElementById("guessing-screen").classList.remove("hidden");

  const container = document.getElementById("characters-to-guess");
  container.innerHTML = "<h3>Diese Figuren wurden anderen zugewiesen:</h3><ul>";

  for (let [player, character] of Object.entries(characters)) {
    if (assignments[currentPlayerName] !== player) {
      container.innerHTML += `<li><strong>${player}</strong>: "${character}"</li>`;
    }
  }

  container.innerHTML += "</ul>";
}

function submitGuess() {
  const guess = prompt("Welche Figur denkst du bist du?");
  if (!guess) return;

  alert(`Du denkst, dass du: ${guess} bist.`);

  // Weiteren Code hinzufügen für die Bestätigung, ob die Antwort korrekt ist.
}

function giveUp() {
  alert("Du hast aufgegeben.");
  // Weiteren Code für Aufgeben und Rückkehr in die Lobby hinzufügen.
}

function resetGame() {
  players = [];
  assignments = {};
  characters = {};
  rank = 1;
  currentPlayerName = "";
  isHost = false;

  document.getElementById("results-screen").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
}
