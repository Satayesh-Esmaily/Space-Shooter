import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180/build/three.module.js";
import { Player } from "./player.js";

const viewport = document.getElementById("viewport");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x090a15);
scene.fog = new THREE.FogExp2(0x090a15, 0.019);

const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
camera.position.set(0, 0, 14);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x090a15);
viewport.prepend(renderer.domElement);

scene.add(new THREE.AmbientLight(0x9da7d2, 1.8));
const keyLight = new THREE.PointLight(0xb7f274, 20, 20);
keyLight.position.set(-4, 4, 7);
scene.add(keyLight);
const rimLight = new THREE.PointLight(0x586bff, 24, 20);
rimLight.position.set(5, -2, 3);
scene.add(rimLight);

const player = new Player();
player.addTo(scene);

const starCount = 900;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 22;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
}
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({ color: 0xc3c8ea, size: 0.035, transparent: true, opacity: 0.8 })
);
scene.add(stars);

const enemies = [];
const projectiles = [];
const keys = new Set();
const enemyGeometry = new THREE.IcosahedronGeometry(0.42, 1);
const enemyMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x9a627c, emissive: 0x36101f, roughness: 0.75, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x967857, emissive: 0x291d0d, roughness: 0.8, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x77688f, emissive: 0x1b1037, roughness: 0.7, flatShading: true })
];
const projectileGeometry = new THREE.CapsuleGeometry(0.045, 0.4, 3, 6);
const projectileMaterial = new THREE.MeshBasicMaterial({ color: 0xc6f277 });
const scoreElement = document.getElementById("score");
const healthElement = document.getElementById("health");
const healthBar = document.getElementById("healthBar");
const threatCount = document.getElementById("threatCount");
const bestScoreElement = document.getElementById("bestScore");
const missionStatus = document.getElementById("missionStatus");
const gameOverlay = document.getElementById("gameOverlay");
const gameOverOverlay = document.getElementById("gameOver");
const gameOverEyebrow = document.getElementById("gameOverEyebrow");
const gameOverTitle = document.getElementById("gameOverTitle");
const gameOverDescription = document.getElementById("gameOverDescription");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

let gameStarted = false;
let score = 0;
let health = 100;
let bestScore = 0;
let spawnTimer = 0;
let shotTimer = 0;
let previousTime = 0;
let worldWidth = 14;
let worldHeight = 12;

function resize() {
    const bounds = viewport.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    renderer.setSize(bounds.width, bounds.height, false);
    camera.aspect = bounds.width / bounds.height;
    camera.updateProjectionMatrix();
    worldHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    worldWidth = worldHeight * camera.aspect;
    player.mesh.position.x = THREE.MathUtils.clamp(player.mesh.position.x, -worldWidth * 0.44, worldWidth * 0.44);
    player.mesh.position.y = THREE.MathUtils.clamp(player.mesh.position.y, -worldHeight * 0.41, worldHeight * 0.41);
}
new ResizeObserver(resize).observe(viewport);
resize();

function updateScore() {
    scoreElement.textContent = String(score).padStart(6, "0");
    if (score > bestScore) {
        bestScore = score;
        bestScoreElement.textContent = String(bestScore).padStart(6, "0");
    }
}

function updateHealth(amount) {
    health = Math.max(0, health - amount);
    healthElement.innerHTML = `${health}<span>%</span>`;
    healthBar.style.width = `${health}%`;
    healthBar.style.background = health <= 30 ? "#ff8f8f" : "";
    if (health === 0) endGame();
}

function createEnemy() {
    const mesh = new THREE.Mesh(enemyGeometry, enemyMaterials[Math.floor(Math.random() * enemyMaterials.length)]);
    mesh.position.set((Math.random() - 0.5) * worldWidth * 0.82, worldHeight / 2 + 0.65, -0.3);
    const scale = 0.72 + Math.random() * 0.68;
    mesh.scale.setScalar(scale);
    scene.add(mesh);
    enemies.push({ mesh, speed: 1.45 + Math.random() * 0.8 + score / 2400, spin: (Math.random() - 0.5) * 2 });
}

function shoot() {
    if (!gameStarted || shotTimer > 0) return;
    const mesh = new THREE.Mesh(projectileGeometry, projectileMaterial);
    mesh.position.copy(player.mesh.position);
    mesh.position.y += 0.8;
    scene.add(mesh);
    projectiles.push(mesh);
    shotTimer = 0.18;
}

function startGame() {
    score = 0;
    health = 100;
    spawnTimer = 0;
    shotTimer = 0;
    player.mesh.position.set(0, -worldHeight * 0.29, 0);
    for (const enemy of enemies) scene.remove(enemy.mesh);
    for (const projectile of projectiles) scene.remove(projectile);
    enemies.length = 0;
    projectiles.length = 0;
    gameStarted = true;
    gameOverlay.hidden = true;
    gameOverOverlay.hidden = true;
    missionStatus.textContent = "MISSION IN PROGRESS";
    healthElement.innerHTML = "100<span>%</span>";
    healthBar.style.width = "100%";
    healthBar.style.background = "";
    updateScore();
    threatCount.textContent = "00";
}

function endGame() {
    gameStarted = false;
    gameOverOverlay.hidden = false;
    missionStatus.textContent = "SIGNAL LOST";
    gameOverEyebrow.innerHTML = 'MISSION ENDED <span class="eyebrow-line"></span>';
    gameOverTitle.innerHTML = "Mission<br><span>complete.</span>";
    gameOverDescription.innerHTML = `Final score: ${String(score).padStart(6, "0")}<br>Ready to head back out?`;
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

window.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) event.preventDefault();
    keys.add(event.key.toLowerCase());
    if (event.code === "Space") shoot();
});
window.addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));
window.addEventListener("blur", () => keys.clear());

function updateGame(delta) {
    const moveX = Number(keys.has("arrowright") || keys.has("d")) - Number(keys.has("arrowleft") || keys.has("a"));
    const moveY = Number(keys.has("arrowup") || keys.has("w")) - Number(keys.has("arrowdown") || keys.has("s"));
    player.mesh.position.x = THREE.MathUtils.clamp(
        player.mesh.position.x + moveX * delta * 6,
        -worldWidth * 0.44,
        worldWidth * 0.44
    );
    player.mesh.position.y = THREE.MathUtils.clamp(
        player.mesh.position.y + moveY * delta * 6,
        -worldHeight * 0.41,
        worldHeight * 0.41
    );
    player.mesh.rotation.z = THREE.MathUtils.damp(player.mesh.rotation.z, -moveX * 0.17, 7, delta);

    shotTimer = Math.max(0, shotTimer - delta);
    if (keys.has(" ")) shoot();

    spawnTimer += delta;
    if (spawnTimer >= Math.max(0.42, 1.12 - score / 6000)) {
        createEnemy();
        spawnTimer = 0;
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        projectile.position.y += delta * 12;
        if (projectile.position.y > worldHeight / 2 + 1) {
            scene.remove(projectile);
            projectiles.splice(i, 1);
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.mesh.position.y -= enemy.speed * delta;
        enemy.mesh.rotation.x += delta * enemy.spin;
        enemy.mesh.rotation.y += delta * 0.7;

        if (enemy.mesh.position.distanceTo(player.mesh.position) < 0.9) {
            scene.remove(enemy.mesh);
            enemies.splice(i, 1);
            updateHealth(25);
            continue;
        }
        if (enemy.mesh.position.y < -worldHeight / 2 - 0.7) {
            scene.remove(enemy.mesh);
            enemies.splice(i, 1);
            updateHealth(12);
            continue;
        }

        for (let j = projectiles.length - 1; j >= 0; j--) {
            if (enemy.mesh.position.distanceTo(projectiles[j].position) < 0.64) {
                scene.remove(enemy.mesh, projectiles[j]);
                enemies.splice(i, 1);
                projectiles.splice(j, 1);
                score += 100;
                updateScore();
                break;
            }
        }
    }
    threatCount.textContent = String(enemies.length).padStart(2, "0");
}

function animate(time) {
    requestAnimationFrame(animate);
    const delta = Math.min((time - previousTime) / 1000 || 0, 0.04);
    previousTime = time;

    const positions = starGeometry.attributes.position;
    for (let i = 0; i < starCount; i++) {
        const index = i * 3 + 1;
        positions.array[index] -= delta * (gameStarted ? 1.6 : 0.22);
        if (positions.array[index] < -worldHeight / 2) positions.array[index] = worldHeight / 2;
    }
    positions.needsUpdate = true;
    stars.rotation.z += delta * 0.003;
    if (gameStarted) updateGame(delta);
    renderer.render(scene, camera);
}

requestAnimationFrame(animate);
