import * as THREE from 
"https://cdn.jsdelivr.net/npm/three@0.180/build/three.module.js";


export class Player{


constructor(){


const geometry =
new THREE.ConeGeometry(
    0.5,
    2,
    4
);


const material =
new THREE.MeshStandardMaterial({

    color:0x00ffff,

    emissive:0x0033ff

});


this.mesh =
new THREE.Mesh(
    geometry,
    material
);


this.mesh.rotation.x =
Math.PI / 2;



this.mesh.position.y=-3;


}


addTo(scene){

    scene.add(this.mesh);

}


}