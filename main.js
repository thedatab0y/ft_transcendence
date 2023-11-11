import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

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

// Create a camera with an increased field of view for a more top-down perspective
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 2000);

// Adjusted camera position for a better top-down view
camera.position.set(0, 400, 300);
camera.lookAt(0, 0, 0);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows

// Set the background color to a nice gray (you can adjust the RGB values)
renderer.setClearColor(new THREE.Color(0x808080));

document.body.appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const gridHelper = new THREE.GridHelper(2000, 50, 0xff0000, 0xff0000);
scene.add(gridHelper);

// Add directional light with shadows from right to left
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 1, -1); // Adjusted light position
directionalLight.castShadow = true; // Enable shadow casting for the light
scene.add(directionalLight);

// Create axes helper
const axesHelper = new THREE.AxesHelper(1000); // Increase the size for better visibility
// axesHelper.position.set(0, tableH/ 2, 0);

// Add axes helper to the scene
scene.add(axesHelper);

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

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // axesHelper.rotation.y += 0.01;
    renderer.render(scene, camera);
	orbit.update();
}

animate();
