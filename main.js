import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Create a scene
const scene = new THREE.Scene();

// Create a material for the table
const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, shininess: 30 });

// Dimensions of an even larger table
const tableW = 1200;
const tableH = 75;
const tableD = 600;

// Create a BoxGeometry for the table
const tableGeometry = new THREE.BoxGeometry(tableW, tableH, tableD);

// Create the table mesh
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.castShadow = true; // Enable shadow casting

// Position the larger table at the center and slightly more back on the scene
table.position.set(0, -10, -tableD / 4);

// Add the larger table to the scene
scene.add(table);

// Create a material for the racket
const racketMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 30 });

// Dimensions of the racket
const racketW = 20;
const racketH = 100;
const racketD = 100;

// Create a BoxGeometry for the racket
const racketGeometry = new THREE.BoxGeometry(racketW, racketH, racketD);

// Create the racket mesh
const racket = new THREE.Mesh(racketGeometry, racketMaterial);
racket.castShadow = true; // Enable shadow casting


// Position the racket on the left side
racket.position.set(-((tableW / 2) - (racketW / 2) - 10), tableH / 2 + racketH, -(tableD / 4));
// racket.position.set(-(tableW / 2) - (racketW / 2), 0, -(tableD / 4));

// -(tableD / 4)
// Add the racket to the scene
scene.add(racket);

console.log('Rocket pisition: ' , racket.position );
console.log("Table Position: " , table.position);

// Create a camera with an increased field of view for a more top-down perspective
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(0, 400, 300);
camera.lookAt(0, 0, 0);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
renderer.setClearColor(new THREE.Color(0x808080));
document.body.appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Create grid helper
const gridHelper = new THREE.GridHelper(2000, 50, 0xff0000, 0xff0000);
scene.add(gridHelper);

// Add directional light with shadows from right to left
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 1, -1);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Create axes helper
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

// Create OrbitControls
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// Handle window resize
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
    orbit.update();
});

// Handle key events for racket movement
const keyState = {
    w: false,
    s: false
};

document.addEventListener('keydown', (event) => {
    if (event.key === 'w') {
        keyState.w = true;
    } else if (event.key === 's') {
        keyState.s = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w') {
        keyState.w = false;
    } else if (event.key === 's') {
        keyState.s = false;
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

 if (keyState.w) {
        racket.translateZ(-5); // Move the racket backward
    }

    if (keyState.s) {
        racket.translateZ(5); // Move the racket forward
    }

    // Clamp racket position to stay within table boundaries
    const halfRacketHeight = racketH / 2;
    racket.position.y = Math.max(-tableH / 2 + halfRacketHeight, Math.min(tableH / 2 - halfRacketHeight, racket.position.y));

    const halfRacketDepth = racketD / 2;
    const tableCenterZ = 300; // Center of the table along the z-axis
    const tableHalfDepth = tableD / 2;

    // Clamp racket position along the z-axis to stay within the table boundaries
    racket.position.z = Math.max(-(tableCenterZ + tableHalfDepth) + halfRacketDepth, Math.min(tableCenterZ + tableHalfDepth - halfRacketDepth, racket.position.z));

    
    renderer.render(scene, camera);
    orbit.update();
}

animate();
