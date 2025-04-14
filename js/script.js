const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const player = {
    x: centerX,
    y: centerY,
    radius: 20,
    color: 'white',
    bullets: []
};

const enemies = [];
let score = 0;
let gameOver = false;
const bulletSpeed = 5;
const enemySpeed = 2;

// Function to draw a circle
function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// Function to spawn enemies
function spawnEnemy() {
    const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y;

    if (edge === 0) { // Top
        x = Math.random() * canvas.width;
        y = 0;
    } else if (edge === 1) { // Right
        x = canvas.width;
        y = Math.random() * canvas.height;
    } else if (edge === 2) { // Bottom
        x = Math.random() * canvas.width;
        y = canvas.height;
    } else { // Left
        x = 0;
        y = Math.random() * canvas.height;
    }

    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    enemies.push({ x, y, radius: 15, color });
}

// Function to update bullets
function updateBullets() {
    player.bullets.forEach((bullet, bulletIndex) => {
        bullet.x += bullet.dx * bulletSpeed;
        bullet.y += bullet.dy * bulletSpeed;

        // Remove bullets that go off-screen
        if (
            bullet.x < 0 || bullet.x > canvas.width ||
            bullet.y < 0 || bullet.y > canvas.height
        ) {
            player.bullets.splice(bulletIndex, 1);
        }

        // Check for collisions with enemies
        enemies.forEach((enemy, enemyIndex) => {
            const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
            if (dist < bullet.radius + enemy.radius) {
                // Remove enemy and bullet on collision
                enemies.splice(enemyIndex, 1);
                player.bullets.splice(bulletIndex, 1);
                score++;
            }
        });
    });
}

// Function to update enemies
function updateEnemies() {
    enemies.forEach((enemy, index) => {
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemy.x += Math.cos(angle) * enemySpeed;
        enemy.y += Math.sin(angle) * enemySpeed;

        // Check for collision with the player
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist < player.radius + enemy.radius) {
            gameOver = true;
        }
    });
}

// Function to handle shooting
function shoot(x, y) {
    const angle = Math.atan2(y - player.y, x - player.x);
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    player.bullets.push({ x: player.x, y: player.y, dx, dy, radius: 5, color: 'white' });
}

// Event listener for mouse clicks or screen taps
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    shoot(mouseX, mouseY);
});

// Function to display the scoreboard
function drawScore() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 20, 40);
}

// Function to display game over message
function drawGameOver() {
    ctx.font = '48px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
}

// Main game loop
function gameLoop() {
    if (gameOver) {
        drawGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    drawCircle(player.x, player.y, player.radius, player.color);

    // Draw bullets
    player.bullets.forEach((bullet) => {
        drawCircle(bullet.x, bullet.y, bullet.radius, bullet.color);
    });

    // Draw enemies
    enemies.forEach((enemy) => {
        drawCircle(enemy.x, enemy.y, enemy.radius, enemy.color);
    });

    // Draw score
    drawScore();

    // Update bullets and enemies
    updateBullets();
    updateEnemies();

    requestAnimationFrame(gameLoop);
}

// Spawn enemies periodically
setInterval(spawnEnemy, 1000);

// Start the game loop
gameLoop();