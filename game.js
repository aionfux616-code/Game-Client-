const player = document.getElementById("player");
const healthText = document.getElementById("health");
const scoreText = document.getElementById("score");
const connectionText = document.getElementById("connection");

const SERVER_URL = "https://game-server-vcpl.onrender.com";

let playerId = null;
let x = 50;
let y = 50;
let health = 100;
let score = 0;

const speed = 5;

// Create a player on the server
async function createPlayer() {
    try {
        const response = await fetch(`${SERVER_URL}/players`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Could not create player");
        }

        const data = await response.json();

        playerId = data.id;
        x = data.x;
        y = data.y;
        health = data.health;
        score = data.score;

        updateScreen();

        connectionText.textContent = "🟢 Connected to game server";

        console.log("Player created:", data);

    } catch (error) {
        connectionText.textContent = "🔴 Server connection failed";
        console.error(error);
    }
}

// Update the screen
function updateScreen() {
    player.style.left = `${x}%`;
    player.style.top = `${y}%`;

    healthText.textContent = health;
    scoreText.textContent = score;
}

// Send player data to server
async function updateServer() {
    if (!playerId) return;

    try {
        await fetch(`${SERVER_URL}/players/${playerId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                x: x,
                y: y,
                health: health,
                score: score
            })
        });
    } catch (error) {
        console.error("Could not update server:", error);
    }
}

// Move player
function movePlayer(direction) {
    if (direction === "up") {
        y -= speed;
    }

    if (direction === "down") {
        y += speed;
    }

    if (direction === "left") {
        x -= speed;
    }

    if (direction === "right") {
        x += speed;
    }

    // Keep player inside the game
    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));

    score++;

    updateScreen();
    updateServer();
}

// Controls
document.getElementById("up").addEventListener("click", () => {
    movePlayer("up");
});

document.getElementById("down").addEventListener("click", () => {
    movePlayer("down");
});

document.getElementById("left").addEventListener("click", () => {
    movePlayer("left");
});

document.getElementById("right").addEventListener("click", () => {
    movePlayer("right");
});

// Start game
createPlayer();