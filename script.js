let players = [];
let gameHistory = [];

let game = {
    score: { teamA: 0, teamB: 0 },
    teams: { teamA: "Team A", teamB: "Team B" },
    state: "pregame"
};

// DOM
const nameInput = document.getElementById("playerName");
const numberInput = document.getElementById("playerNumber");
const teamInput = document.getElementById("playerTeam");
const playersContainer = document.getElementById("players-container");
const scoreAText = document.getElementById("score-a");
const scoreBText = document.getElementById("score-b");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const endBtn = document.getElementById("end-btn");
const resetBtn = document.getElementById("reset-btn");

const teamAInput = document.getElementById("team-a-name");
const teamBInput = document.getElementById("team-b-name");

// ---------------- TEAM NAMES ----------------
const teamNameBtn = document.getElementById("set-team-names");
teamNameBtn.addEventListener("click", () => {
    if (teamAInput.value) game.teams.teamA = teamAInput.value;
    if (teamBInput.value) game.teams.teamB = teamBInput.value;

    teamInput.innerHTML = `
        <option value="teamA">${game.teams.teamA}</option>
        <option value="teamB">${game.teams.teamB}</option>
    `;
    
    updateScore();
    teamAInput.style.display = "none";
    teamBInput.style.display = "none";
    teamNameBtn.style.display = "none";
    document.getElementById("team-a-1").textContent = `${game.teams.teamA} +1`;
    document.getElementById("team-a-2").textContent = `${game.teams.teamA} +2`;
    document.getElementById("team-a-3").textContent = `${game.teams.teamA} +3`;
    document.getElementById("team-b-1").textContent = `${game.teams.teamB} +1`;
    document.getElementById("team-b-2").textContent = `${game.teams.teamB} +2`;
    document.getElementById("team-b-3").textContent = `${game.teams.teamB} +3`;
});

// ---------------- SCORE ----------------
const updateScore = () => {
    scoreAText.textContent = `${game.teams.teamA}: ${game.score.teamA}`;
    scoreBText.textContent = `${game.teams.teamB}: ${game.score.teamB}`;
};

const addTeamPoint = (teamKey, amount) => {
    if (game.state !== "in-progress") return;
    game.score[teamKey] += amount;
    updateScore();
};

document.getElementById("team-a-1").onclick = () => addTeamPoint("teamA", 1);
document.getElementById("team-b-1").onclick = () => addTeamPoint("teamB", 1);
document.getElementById("team-a-2").onclick = () => addTeamPoint("teamA", 2);
document.getElementById("team-b-2").onclick = () => addTeamPoint("teamB", 2);
document.getElementById("team-a-3").onclick = () => addTeamPoint("teamA", 3);
document.getElementById("team-b-3").onclick = () => addTeamPoint("teamB", 3);

// ---------------- GAME STATE ----------------
startBtn.onclick = () => {
    game.state = "in-progress";
    startBtn.style.display = "none";
    document.getElementById("add-players").style.display = "none";
};

pauseBtn.onclick = () => {
    if (game.state === "in-progress") game.state = "paused";
    else if (game.state === "paused") game.state = "in-progress";
};

endBtn.onclick = () => {
    saveGameToHistory();
    game.state = "ended";

    renderPostGame();
    document.getElementById("post-game").style.display = "block";
    resetBtn.style.display = "block";

    document.getElementById("team-score").style.display = "none";
    document.getElementById("player-stats").style.display = "none";
};

// ---------------- RESET ----------------
resetBtn.onclick = () => {
    

    players = [];
    document.getElementById("team-a-container").innerHTML = `<h3>${game.teams.teamA}</h3>`;
    document.getElementById("team-b-container").innerHTML = `<h3>${game.teams.teamB}</h3>`;

    game.score.teamA = 0;
    game.score.teamB = 0;
    game.state = "pregame";
    game.teams = { teamA: "Team A", teamB: "Team B" };

    teamAInput.value = "";
    teamBInput.value = "";

    updateScore();
    teamAInput.style.display = "inline-block";
    teamBInput.style.display = "inline-block";
    teamNameBtn.style.display = "block";

    startBtn.style.display = "block";
    document.getElementById("team-score").style.display = "block";
    document.getElementById("player-stats").style.display = "block";
    document.getElementById("add-players").style.display = "block";
    document.getElementById("post-game").style.display = "none";
    resetBtn.style.display = "none";

    document.getElementById("team-a-1").textContent = "Team A +1";
    document.getElementById("team-a-2").textContent = "Team A +2";
    document.getElementById("team-a-3").textContent = "Team A +3";
    document.getElementById("team-b-1").textContent = "Team B +1";
    document.getElementById("team-b-2").textContent = "Team B +2";
    document.getElementById("team-b-3").textContent = "Team B +3";
};

// ---------------- PLAYERS ----------------
const addPlayer = () => {
    const name = nameInput.value;
    const number = numberInput.value;
    const team = teamInput.value;

    if (!name || !number) return;

    const player = {
        name,
        number,
        team, // teamA / teamB
        stats: {
            points: 0,
            rebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            turnovers: 0,
            fouls: 0
        }
    };

    players.push(player);
    render();

    nameInput.value = "";
    numberInput.value = "";
};

document.getElementById("add-player-btn").onclick = addPlayer;

// ---------------- RENDER ----------------
const render = () => {
    document.getElementById("team-a-container").innerHTML = `<h3>${game.teams.teamA}</h3>`;
    document.getElementById("team-b-container").innerHTML = `<h3>${game.teams.teamB}</h3>`;

    players.forEach((player, index) => {
        const card = document.createElement("div");

        card.innerHTML = `
            <h3>${player.name} (#${player.number}) - ${game.teams[player.team]}</h3>
            <p>Points: ${player.stats.points}</p>
            <p>Rebounds: ${player.stats.rebounds}</p>
            <p>Assists: ${player.stats.assists}</p>
            <p>Steals: ${player.stats.steals}</p>
            <p>Blocks: ${player.stats.blocks}</p>
            <p>Turnovers: ${player.stats.turnovers}</p>
            
            <div class="stat-buttons">
            <button onclick="addStat(${index}, 'points')">+1 Point</button>
            <button onclick="addStat(${index}, 'rebounds')">+1 Rebound</button>
            <button onclick="addStat(${index}, 'assists')">+1 Assist</button>
            <button onclick="addStat(${index}, 'steals')">+1 Steal</button>
            <button onclick="addStat(${index}, 'blocks')">+1 Block</button>
            <button onclick="addStat(${index}, 'turnovers')">+1 Turnover</button>
            <button onclick="addStat(${index}, 'fouls')">+1 Foul</button>   
            </div>
        `;

        const container = player.team === "teamA"
            ? document.getElementById("team-a-container")
            : document.getElementById("team-b-container");
            container.appendChild(card);
    });
};

// ---------------- STATS ----------------
const addStat = (index, stat) => {
    if (game.state !== "in-progress") return;
    players[index].stats[stat]++;
    render();
};

// ---------------- POST GAME ----------------
const renderPostGame = () => {
    const container = document.getElementById("post-game-stats");
    container.innerHTML = "";

    players.forEach(player => {
        const card = document.createElement("div");

        card.innerHTML = `
            <h3>${player.name} (${game.teams[player.team]})</h3>
            <p>PTS: ${player.stats.points}</p>
            <p>REB: ${player.stats.rebounds}</p>
            <p>AST: ${player.stats.assists}</p> 
            <p>STL: ${player.stats.steals}</p>
            <p>BLK: ${player.stats.blocks}</p>
            <p>TO: ${player.stats.turnovers}</p>
            <p>FLS: ${player.stats.fouls}</p>
        `;

        container.appendChild(card);
    });
};

// ---------------- HISTORY ----------------
const saveGameToHistory = () => {
    const snapshot = {
        date: new Date().toLocaleString(),
        score: { ...game.score },
        teams: { ...game.teams },
        players: JSON.parse(JSON.stringify(players))
    };

    gameHistory.push(snapshot);
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));

    renderGameHistory();
};

const renderGameHistory = () => {
    const container = document.getElementById("history-container");
    container.innerHTML = "";

    gameHistory.forEach((g, i) => {
        const div = document.createElement("div");

        div.innerHTML = `
            <h3>Game ${i + 1}</h3>
            <p>${g.teams.teamA} ${g.score.teamA} - ${g.teams.teamB} ${g.score.teamB}</p>
        `;

        container.appendChild(div);
    });
};

// Load history
const loadHistory = () => {
    const data = localStorage.getItem("gameHistory");
    if (data) {
        gameHistory = JSON.parse(data);
        renderGameHistory();
    }
};

loadHistory();
updateScore();
// ---------------- CLEAR HISTORY----------------
document.getElementById("clear-history-btn").onclick = () => {
    if (confirm("Are you sure you want to clear the game history? This action cannot be undone.")) {
        gameHistory = [];
        localStorage.removeItem("gameHistory");
        renderGameHistory();
    }
};