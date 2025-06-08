const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game objects
const paddleWidth = 15, paddleHeight = 100;
const ballSize = 16;
const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#00bfff"
};
const ai = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#ff5555"
};
const ball = {
    x: canvas.width / 2 - ballSize / 2,
    y: canvas.height / 2 - ballSize / 2,
    size: ballSize,
    speed: 5,
    dx: 5 * (Math.random() > 0.5 ? 1 : -1),
    dy: 3 * (Math.random() > 0.5 ? 1 : -1),
    color: "#fff"
};

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
}

function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Net
    ctx.setLineDash([6, 8]);
    ctx.strokeStyle = "#444";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddles and ball
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawBall(ball.x, ball.y, ball.size, ball.color);
}

function resetBall() {
    ball.x = canvas.width / 2 - ball.size / 2;
    ball.y = canvas.height / 2 - ball.size / 2;
    ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = (Math.random() * 4 - 2) || 2;
}

function update() {
    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom wall collision
    if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
        ball.dy *= -1;
    }

    // Left paddle collision
    if (
        ball.x <= player.x + player.width &&
        ball.x >= player.x &&
        ball.y + ball.size >= player.y &&
        ball.y <= player.y + player.height
    ) {
        ball.dx = Math.abs(ball.dx);
        // Optional: add some spin
        let collidePoint = (ball.y + ball.size / 2) - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);
        ball.dy = ball.speed * collidePoint;
    }

    // Right paddle collision
    if (
        ball.x + ball.size >= ai.x &&
        ball.x + ball.size <= ai.x + ai.width &&
        ball.y + ball.size >= ai.y &&
        ball.y <= ai.y + ai.height
    ) {
        ball.dx = -Math.abs(ball.dx);
        // Optional: add some spin
        let collidePoint = (ball.y + ball.size / 2) - (ai.y + ai.height / 2);
        collidePoint = collidePoint / (ai.height / 2);
        ball.dy = ball.speed * collidePoint;
    }

    // Scoring (reset ball)
    if (ball.x < 0 || ball.x > canvas.width) {
        resetBall();
    }

    // AI movement (simple tracking)
    let aiCenter = ai.y + ai.height / 2;
    if (aiCenter < ball.y + ball.size / 2 - 10) {
        ai.y += 4;
    } else if (aiCenter > ball.y + ball.size / 2 + 10) {
        ai.y -= 4;
    }
    // Clamp AI paddle to canvas
    ai.y = Math.max(0, Math.min(canvas.height - ai.height, ai.y));
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Mouse movement for player paddle
canvas.addEventListener("mousemove", function (evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Clamp
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
});

draw();
gameLoop();
