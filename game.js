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
const enemies = [];
let score = 0;
let health = 100;
let gameOver = false;


const stars = [];

for(let i = 0; i < 100; i++){

    stars.push({

        x: Math.random() * canvas.width,

        y: Math.random() * canvas.height,

        size: Math.random() * 3,

        speed: Math.random() * 2 + 1

    });

}

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


    if(event.code === "Space") {
        shoot();
    }

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
function gameLoop(){

    if(gameOver){
        return;
    }


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    updatePlayer();

    updateBullets();

    updateEnemies();

    checkCollisions();

    checkEnemyCollision();


    drawPlayer();

    drawBullets();

    drawEnemies();


    requestAnimationFrame(gameLoop);

}

function drawBullets() {

    ctx.fillStyle = "yellow";


    bullets.forEach((bullet)=>{

        ctx.fillRect(
            bullet.x,
            bullet.y,
            bullet.width,
            bullet.height
        );

    });

}

function updateBullets(){

    bullets.forEach((bullet)=>{

        bullet.y -= bullet.speed;

    });


    for(let i = bullets.length - 1; i >= 0; i--){

        if(bullets[i].y < 0){

            bullets.splice(i,1);

        }

    }

}

function createEnemy() {

    const enemy = {

        x: Math.random() * (canvas.width - 50),

        y: -50,

        width: 50,

        height: 40,

        speed: 2
    };


    enemies.push(enemy);
}

function drawEnemies(){

    ctx.fillStyle = "red";


    enemies.forEach((enemy)=>{

        ctx.fillRect(
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height
        );

    });

}

function updateEnemies(){

    enemies.forEach((enemy)=>{

        enemy.y += enemy.speed;

    });


    

    for(let i = enemies.length - 1; i >= 0; i--){

        if(enemies[i].y > canvas.height){

         enemies.splice(i,1);

         health -= 10;

       updateHealth();

}

    }

}

function checkCollisions(){

    for(let i = bullets.length - 1; i >= 0; i--){

        for(let j = enemies.length - 1; j >= 0; j--){


            const bullet = bullets[i];
            const enemy = enemies[j];


            if(

                bullet.x < enemy.x + enemy.width &&

                bullet.x + bullet.width > enemy.x &&

                bullet.y < enemy.y + enemy.height &&

                bullet.y + bullet.height > enemy.y

            ){

                
                bullets.splice(i,1);


                enemies.splice(j,1);


                
                score += 10;


                updateScore();

                break;

            }

        }

    }

}

function updateHealth(){

    document.getElementById("health").innerText =
        `Health: ${health}`;

}

function updateScore(){

    document.getElementById("score").innerText =
        `Score: ${score}`;

}

function checkEnemyCollision(){

    for(let i = enemies.length - 1; i >= 0; i--){

        const enemy = enemies[i];


        if(

            enemy.x < player.x + player.width &&

            enemy.x + enemy.width > player.x &&

            enemy.y < player.y + player.height &&

            enemy.y + enemy.height > player.y

        ){

            enemies.splice(i,1);

            health -= 20;

            updateHealth();

        }

    }

}


function endGame(){

    gameOver = true;


    document.getElementById("gameOver").style.display =
        "block";


    document.getElementById("restart").style.display =
        "inline-block";

}

function updateHealth(){

    document.getElementById("health").innerText =
        `Health: ${health}`;


    if(health <= 0){

        endGame();

    }

}


document
.getElementById("restart")
.addEventListener("click",()=>{

    location.reload();

});


setInterval(()=>{

    createEnemy();

},1000);

gameLoop();