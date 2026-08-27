import * as THREE from 
"https://cdn.jsdelivr.net/npm/three@0.180/build/three.module.js";


import { Player } from "./Player.js";


// Scene
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x020617);


// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


camera.position.set(
    0,
    0,
    8
);


camera.lookAt(0,0,0);



// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias:true
});


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


document.body.appendChild(
    renderer.domElement
);



// Lights

const ambientLight =
new THREE.AmbientLight(
    0xffffff,
    1
);


scene.add(ambientLight);



const pointLight =
new THREE.PointLight(
    0x00ffff,
    20
);


pointLight.position.set(
    0,
    5,
    5
);


scene.add(pointLight);



// Player

const player = new Player();

player.addTo(scene);



// Start Menu

let gameStarted = false;


const startButton =
document.getElementById("startButton");


startButton.addEventListener(
"click",
()=>{

    gameStarted = true;


    document.getElementById("menu")
    .style.display="none";

});



// Animation Loop

function animate(){

    requestAnimationFrame(animate);


    if(gameStarted){

        // game updates will go here

    }


    renderer.render(
        scene,
        camera
    );

}


animate();