import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

// table
const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, shininess: 30 });

const tableW = 1200;
const tableH = 75;
const tableD = 600;

const tableGeometry = new THREE.BoxGeometry(tableW, tableH, tableD);

const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.castShadow = true; // Enable shadow casting
table.receiveShadow = true; // Enable shadow receiving

table.position.set(0, -10, -tableD / 4);

scene.add(table);

// racket
const racketMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 30 });

const racketW = 20;
const racketH = 100;
const racketD = 100;

const racketGeometry = new THREE.BoxGeometry(racketW, racketH, racketD);

const racket = new THREE.Mesh(racketGeometry, racketMaterial);
racket.castShadow = true; // Enable shadow casting
racket.receiveShadow = true; // Enable shadow receiving

racket.position.set(-((tableW / 2) - (racketW / 2) - 10), tableH / 2 + racketH, -(tableD / 4));

scene.add(racket);

const rRacketMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 30 });

const rRacketGeometry = new THREE.BoxGeometry(racketW, racketH, racketD);

const rRacket = new THREE.Mesh(rRacketGeometry, rRacketMaterial);
rRacket.castShadow = true;
rRacket.receiveShadow = true; // Enable shadow receiving

rRacket.position.set((tableW / 2) - (racketW / 2) - 10, tableH / 2 + racketH, -(tableD / 4));

scene.add(rRacket);

//ball
const ballGeometry = new THREE.SphereGeometry(15, 300, 300);

const ballMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
});

const ball = new THREE.Mesh(ballGeometry, ballMaterial);

ball.position.set(0, tableH / 2 + 7, -(tableD / 4));

scene.add(ball);

// Create a camera with an increased field of view for a more top-down perspective
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(0, 400, 300);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
renderer.setClearColor(new THREE.Color(0x808080));
document.body.appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Add directional light with shadows from right to left
const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(5, 1, -3);
directionalLight.castShadow = true;

directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 1000;
directionalLight.shadow.camera.left = -700;
directionalLight.shadow.camera.right = 700;
directionalLight.shadow.camera.top = 200;
directionalLight.shadow.camera.bottom = -200;

scene.add(directionalLight);

// Create grid helper
const gridHelper = new THREE.GridHelper(2000, 50, 0xff0000, 0xff0000);
scene.add(gridHelper);

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

const keyState = {
    w: false,
    s: false,
    up: false,
    down: false
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

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        keyState.up = true;
    } else if (event.key === 'ArrowDown') {
        keyState.down = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') {
        keyState.up = false;
    } else if (event.key === 'ArrowDown') {
        keyState.down = false;
    }
});

let ballVelocity = new THREE.Vector3(3, 0, 3);
const tablePosZ = -150;
const ballRadius = 15;

const minZ = tablePosZ - tableD / 2 + ballRadius;
const maxZ = tablePosZ + tableD / 2 - ballRadius;
const halfRacketHeight = racketH / 2;

function racketsMove()
{
    if (keyState.w && racket.position.z > -395 && racket.position.z <= 95) {
        racket.translateZ(-5); // Move the racket backward
        // console.log('Rocket props while rendering W: ', racket.position);
    }

    if (keyState.s && racket.position.z >= -395 && racket.position.z < 95) {
        racket.translateZ(5); // Move the racket forward
        // console.log('Rocket props while rendering S: ', racket.position);
    }

    if (keyState.up && rRacket.position.z > -395 && rRacket.position.z <= 95) {
        rRacket.translateZ(-5); // Move the right racket backward
        // console.log('Right Racket props while rendering ArrowUp: ', rRacket.position);
    }

    if (keyState.down && rRacket.position.z >= -395 && rRacket.position.z < 95) {
        rRacket.translateZ(5); // Move the right racket forward
        // console.log('Right Racket props while rendering ArrowDown: ', rRacket.position);
    }
}

// Handle ball collision
function checkCollision() {
    // Check collision with table depth boundaries
    if (ball.position.z - ballRadius <= minZ && ballVelocity.z < 0) {
        // Ball hits the lower wall
        ballVelocity.z *= -1;
    } else if (ball.position.z + ballRadius >= maxZ && ballVelocity.z > 0) {
        // Ball hits the upper wall
        ballVelocity.z *= -1;
    }

    // Check collision with left racket
    if (
        ball.position.x - ballRadius <= racket.position.x + racketW / 2 &&
        ball.position.x + ballRadius >= racket.position.x - racketW / 2 &&
        ball.position.y - ballRadius <= racket.position.y + racketH / 2 &&
        ball.position.y + ballRadius >= racket.position.y - racketH / 2 &&
        ball.position.z + ballRadius >= racket.position.z - racketD / 2 &&
        ball.position.z - ballRadius <= racket.position.z + racketD / 2
    ) {
        ballVelocity.x *= -1;
    }

    // Check collision with right racket
    if (
        ball.position.x - ballRadius <= rRacket.position.x + racketW / 2 &&
        ball.position.x + ballRadius >= rRacket.position.x - racketW / 2 &&
        ball.position.y - ballRadius <= rRacket.position.y + racketH / 2 &&
        ball.position.y + ballRadius >= rRacket.position.y - racketH / 2 &&
        ball.position.z + ballRadius >= rRacket.position.z - racketD / 2 &&
        ball.position.z - ballRadius <= rRacket.position.z + racketD / 2
    ) {
        ballVelocity.x *= -1;
    }
}




// Animation loop
function animate() {
    requestAnimationFrame(animate);
    // function to move rackets within the table boundaries
    racketsMove();
    // console.log('Table Global Position:', table.position);
    checkCollision();
     // Update ball position based on its velocity
    ball.position.x += ballVelocity.x;
    ball.position.y += ballVelocity.y;
    ball.position.z += ballVelocity.z;

    // ball position to stay within table boundaries
    ball.position.x = Math.max(-tableW / 2 , Math.min(tableW / 2 , ball.position.x));
    ball.position.z = Math.max(minZ, Math.min(maxZ, ball.position.z));

    // let m = -(tableD / 1.5) + 25;
    // let mi = (tableD / 4) - 21;
    // console.log(`Max: ${m}, Min: ${mi}`);
 
    // console.log(ball.position);
    // racket position to stay within table boundaries
    racket.position.y = Math.max(-tableH / 2 + halfRacketHeight, Math.min(tableH / 2 - halfRacketHeight, racket.position.y));
    rRacket.position.y = Math.max(-tableH / 2 + halfRacketHeight, Math.min(tableH / 2 - halfRacketHeight, rRacket.position.y));

    renderer.render(scene, camera);
    orbit.update();
}

animate();
