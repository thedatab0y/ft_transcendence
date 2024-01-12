import React, {useRef, useEffect, useState} from 'react';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import { MeshPhongMaterial, SphereGeometry} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { lerp } from 'three/src/math/MathUtils';

//table prop
const tableW = 1200;
const tableH = 75;
const tableD = 600;
const tableZ = -tableD / 4;
const tablePosZ = -150;
const moveDistance = 5;

// racket prop
const racketW = 20;
const racketH = 100;
const racketD = 100;
const ballRadius = 15;

const colProp = {
  minZ : tablePosZ - tableD / 2 + ballRadius,
  maxZ : tablePosZ + tableD / 2 -ballRadius
};
const ballVelocity = [10, 0, 10];

function Ball({position}) {
  const material = new MeshPhongMaterial({ color: 0xffffff });
  const geometry = new SphereGeometry(15, 300, 300);

  return (
    <mesh geometry={geometry} material={material} position={position} castShadow receiveShadow/>
  );
}





function Table() {
  const material = new MeshPhongMaterial({ color: 0x00ff00, shininess: 30});
  return (
    <mesh position={[0, -10, -tableD / 4]} material={material} receiveShadow castShadow>
      <boxGeometry args={[tableW, tableH, tableD]} />
    </mesh>
  );
}

function Racket({ position}) {
  const material = new MeshPhongMaterial({ color: 0xff0000, shininess: 30 });

  return (
    <mesh position={position} material={material} castShadow receiveShadow>
      <boxGeometry args={[racketW, racketH, racketD]} />
    </mesh>
  );
}

function App() {
  return (
    <Canvas 
      style={{ background: '#01106C', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      camera={{ position: [0 , 400, 300], fov: 90, near: 1, far: 2000}}
    >
      <CanvasContent />
    </Canvas>
  );
}

function CanvasContent() {
  const { camera, gl } = useThree();
  const [racket1TargetPosition, setRacket1TargetPosition] = useState([-((tableW / 2) - (racketW / 2) - 10), racketH / 5, -(tableD / 4)]);
  const [racket2TargetPosition, setRacket2TargetPosition] = useState([(tableW / 2) - (racketW / 2) - 10, racketH / 5, -(tableD / 4)]);
  const lerpAmount = 2; // Adjust this value based on the desired smoothness
  const [ballPosition, setBallPosition] = useState([0, tableH / 2 + 7, -(tableD / 4)]);

  const [userInput, setUserInput] = useState({
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false,
  });

  const handleKeyDown = (event) => {
    setUserInput((prev) => ({...prev, [event.key]: true}));
  }
  const handleKeyUp = (event) => {
    setUserInput((prev) => ({ ...prev, [event.key]: false }));
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      console.log('Resized window');
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
  
      gl.setSize(window.innerWidth, window.innerHeight);
      gl.setPixelRatio(window.devicePixelRatio);
    }
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [camera, gl]);

  useFrame(() => {
    setRacket1TargetPosition((prev) => [
      prev[0],
      prev[1],
      lerp(
        prev[2],
        Math.max(-400, Math.min(100, prev[2] + (userInput.w ? moveDistance : userInput.s ? -moveDistance : 0))),
        lerpAmount
      ),
    ]);
  
    setRacket2TargetPosition((prev) => [
      prev[0],
      prev[1],
      lerp(
        prev[2],
        Math.max(-400, Math.min(100, prev[2] + (userInput.ArrowUp ? moveDistance : userInput.ArrowDown ? -moveDistance : 0))),
        lerpAmount
      ),
    ]);
  });
  

  useFrame(() => {
    // console.log(`ballVelocity before seeting  ${ballVelocity[2]}`);
    setBallPosition((prev) => [
      prev[0] + ballVelocity[0],
      prev[1] + ballVelocity[1],
      prev[2] + ballVelocity[2],
    ]);

    if (ballPosition[0] + 15 >= tableW / 2 || ballPosition[0] - 15 <= -tableW / 2)
    {
      ballVelocity[0] = -ballVelocity[0];
    }
    	// Check collision with table depth boundaries
    if (ballPosition[2] - ballRadius <= colProp.minZ && ballVelocity[2] < 0) {
      // Ball hits the lower wall
      ballVelocity[2] *= -1;
      // console.log(`Lower minZ : ${colProp.minZ} and maxZ : ${colProp.maxZ}`);
      // console.log(`ball Z : ${ballPosition[2]}`);
      // console.log(`ballVellocity : ${ballVelocity[2]}`);
    } else if (ballPosition[2] + ballRadius >= colProp.maxZ && ballVelocity[2] > 0) {
      // Ball hits the upper wall
      ballVelocity[2] *= -1;
      // console.log(`Upper minZ : ${colProp.minZ} and maxZ : ${colProp.maxZ}`);
      // console.log(`ball Z : ${ballPosition[2] + ballRadius}`);
      // console.log(`ballVellocity : ${ballVelocity[2]}`);
    }
    if (
      ballPosition[0] - ballRadius <= racket1TargetPosition[0] + racketW / 2 &&
      ballPosition[0] + ballRadius >= racket1TargetPosition[0] - racketW / 2 &&
      ballPosition[1] - ballRadius <= racket1TargetPosition[1] + racketH / 2 &&
      ballPosition[1] + ballRadius >= racket1TargetPosition[1] - racketH / 2 &&
      ballPosition[2] + ballRadius >= racket1TargetPosition[2] - racketD / 2 &&
      ballPosition[2] - ballRadius <= racket1TargetPosition[2] + racketD / 2
    ) {
      ballVelocity[0] *= -1;
    }
  
    // Check collision with right racket
    if (
      ballPosition[0] - ballRadius <= racket2TargetPosition[0] + racketW / 2 &&
      ballPosition[0] + ballRadius >= racket2TargetPosition[0] - racketW / 2 &&
      ballPosition[1] - ballRadius <= racket2TargetPosition[1] + racketH / 2 &&
      ballPosition[1] + ballRadius >= racket2TargetPosition[1] - racketH / 2 &&
      ballPosition[2] + ballRadius >= racket2TargetPosition[2] - racketD / 2 &&
      ballPosition[2] - ballRadius <= racket2TargetPosition[2] + racketD / 2
    ) {
      ballVelocity[0] *= -1;
    }
    
  });
  
  
  return (
    <>
      <OrbitControlsComponent />
      <ambientLight color={0x404040}/>
      <directionalLight
        color={0xffffff}
        position={[tableW / 2, 300, tableZ / 4]}
        castShadow={true}
        intensity={5}
        shadow-camera-near={1}
        shadow-camera-far={2000}
        shadow-camera-left={-1200}
        shadow-camera-right={1200}
        shadow-camera-top={400}
        shadow-camera-bottom={-400}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Table />
      <Racket position={racket1TargetPosition} />
      <Racket position={racket2TargetPosition} /> 
      <Ball position={ballPosition}/>
    </>
  );
}

function OrbitControlsComponent() {
  const controlsRef = useRef();
  const { camera, gl } = useThree();
 
  useEffect(() => {
     controlsRef.current = new OrbitControls(camera, gl.domElement);
 
     return () => {
       if (controlsRef.current) {
         controlsRef.current.dispose();
       }
     };
  }, [camera, gl]);
  return null;
}


export default App;


// maybe delete orbit cuz game a bit lagging and fix hooks for the user input
