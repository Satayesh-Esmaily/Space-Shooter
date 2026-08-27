const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;


// Player object
const player = {
    x: 370,
    y: 520,
    width: 60,
    height: 40,
    speed: 5
};

const bullets = [];

// Draw player
function drawPlayer() {

    ctx.fillStyle = "cyan";

   
    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );


  
    ctx.beginPath();

    ctx.moveTo(
        player.x + player.width / 2,
        player.y - 20
    );

    ctx.lineTo(
        player.x,
        player.y
    );

    ctx.lineTo(
        player.x + player.width,
        player.y
    );

    ctx.closePath();

    ctx.fill();
}


// Move player
const keys = {};

window.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});


window.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});


function updatePlayer() {

    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
    }


    if (
        keys["ArrowRight"] &&
        player.x + player.width < canvas.width
    ) {
        player.x += player.speed;
    }
}

function shoot() {

    bullets.push({

        x: player.x + player.width / 2 - 2,

        y: player.y,

        width: 5,

        height: 15,

        speed: 8
    });
}

// Game loop
function gameLoop() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    updatePlayer();
    drawPlayer();


    requestAnimationFrame(gameLoop);
}


gameLoop();