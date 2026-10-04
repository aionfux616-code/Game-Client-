const player = document.getElementById("player");
const healthText = document.getElementById("health");
const scoreText = document.getElementById("score");
const connectionText = document.getElementById("connection");

const SERVER_URL = "https://game-server-vcpl.onrender.com";

let x = 50;
let y = 50;
let health = 100;
let score = 0;

const speed = 5;

function updatePlayer() {
    player.style.left = `${x}%`;
    player.style.top = `${y}%`;
}

function movePlayer(direction) {
    if (direction === "up") y -= speed;
    if (direction === "down") y += speed;
    if (direction === "left") x -= speed;
    if (direction === "right") x += speed;

    // Keep player inside the game area
    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));

    score++;
    scoreText.textContent = score;

    updatePlayer();
}

// Button controls
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

// Connect to the Render game server
async function connectToServer() {
    try {
        const response = await fetch(SERVER_URL);

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();

        if (data.status === "online") {
            connectionText.textContent = "🟢 Game server connected";
        } else {
            connectionText.textContent = "🟡 Server responded";
        }

    } catch (error) {
        connectionText.textContent = "🔴 Cannot connect to game server";
        console.error(error);
    }
}

updatePlayer();
connectToServer();