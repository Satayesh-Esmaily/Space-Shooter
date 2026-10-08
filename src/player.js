import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180/build/three.module.js";

export class Player {
    constructor() {
        this.mesh = new THREE.Group();

        const hullShape = new THREE.Shape();
        hullShape.moveTo(0, 1.05);
        hullShape.lineTo(0.17, 0.16);
        hullShape.lineTo(0.64, -0.47);
        hullShape.lineTo(0.29, -0.35);
        hullShape.lineTo(0.16, -0.91);
        hullShape.lineTo(-0.16, -0.91);
        hullShape.lineTo(-0.29, -0.35);
        hullShape.lineTo(-0.64, -0.47);
        hullShape.lineTo(-0.17, 0.16);
        hullShape.closePath();

        const hull = new THREE.Mesh(
            new THREE.ShapeGeometry(hullShape),
            new THREE.MeshStandardMaterial({
                color: 0xc5f176,
                emissive: 0x25370d,
                emissiveIntensity: 0.7,
                metalness: 0.52,
                roughness: 0.32,
                side: THREE.DoubleSide
            })
        );
        hull.position.z = 0.05;
        this.mesh.add(hull);

        const cockpit = new THREE.Mesh(
            new THREE.SphereGeometry(0.13, 12, 10),
            new THREE.MeshStandardMaterial({
                color: 0x9be9ff,
                emissive: 0x287baf,
                emissiveIntensity: 1.8,
                metalness: 0.3,
                roughness: 0.18
            })
        );
        cockpit.scale.set(0.76, 1.55, 0.4);
        cockpit.position.set(0, 0.29, 0.24);
        this.mesh.add(cockpit);

        const engine = new THREE.Mesh(
            new THREE.ConeGeometry(0.14, 0.53, 12),
            new THREE.MeshBasicMaterial({ color: 0x77d9ff })
        );
        engine.rotation.z = Math.PI;
        engine.scale.set(0.6, 0.75, 0.7);
        engine.position.set(0, -1.13, 0);
        this.mesh.add(engine);

        const engineGlow = new THREE.PointLight(0x66cfff, 1.5, 2.2);
        engineGlow.position.set(0, -0.9, 0.2);
        this.mesh.add(engineGlow);
    }

    addTo(scene) {
        scene.add(this.mesh);
    }
}
