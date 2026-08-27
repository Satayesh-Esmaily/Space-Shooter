import * as THREE from 
"https://cdn.jsdelivr.net/npm/three@0.180/build/three.module.js";


// Scene
const scene = new THREE.Scene();


// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


camera.position.z = 10;


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


// Light

const light = new THREE.PointLight(
    0xffffff,
    100
);


light.position.set(
    0,
    5,
    5
);


scene.add(light);


// Animation loop

function animate(){

    requestAnimationFrame(animate);


    renderer.render(
        scene,
        camera
    );

}


animate();