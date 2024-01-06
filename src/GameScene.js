import { useEffect} from 'react';
import * as THREE from 'three';



function GameScene() {
  const tableW = 1200;
  const tableH = 75;
  const tableD = 600;
  
  const racketW = 20;
  const racketH = 100;
  const racketD = 100;
  
  // const tablePosZ = -150;
  // const ballRadius = 15;
  
  // const tableProp = {
    //   minZ : tablePosZ - tableD / 2 + ballRadius,
    //   maxZ : tablePosZ + tableD / 2 - ballRadius,
    //   minX : -tableW / 2,
    //   maxX: tableW / 2
    // };
    
  useEffect(() => {
    // scene
    const scene = new THREE.Scene();
    
    // camera
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 400, 300);
    camera.lookAt(0, 0, 0);
    
    // renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // enable shadows
    renderer.shadowMap.type = THREE.PCFShadowMap; // soft shadows
	  renderer.setClearColor(new THREE.Color(0x01106C));
    document.body.appendChild(renderer.domElement);
    
    renderer.domElement.focus();
    // ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // table
    const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, shininess: 30 });
    const tableGeometry = new THREE.BoxGeometry(tableW, tableH, tableD);
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.castShadow = true; // Enable shadow casting
    table.receiveShadow = true; // Enable shadow receiving
    table.position.set(0, -10, -tableD / 4);
    scene.add(table);
    
	  // racket
    const racketMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 30 });

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

    
    // ball
    const ballGeometry = new THREE.SphereGeometry(15, 300, 300);
    
    const ballMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 30,
    });
    
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    
    ball.castShadow = true;
    ball.receiveShadow = true;
    
    ball.position.set(0, tableH / 2 + 7, -(tableD / 4));
    
    scene.add(ball);
    

    
    // directional light
    const directionalLight = new THREE.DirectionalLight(0xffcc00, 5);
    directionalLight.position.set(tableW / 2, 300, table.position.z / 2);
    directionalLight.castShadow = true;
    
    // Set up shadow camera parameters
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 2000;
    directionalLight.shadow.camera.left = -1200;
    directionalLight.shadow.camera.right = 1200;
    directionalLight.shadow.camera.top = 400;
    directionalLight.shadow.camera.bottom = -400;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // grid helper
    const gridHelper = new THREE.GridHelper(2000, 50, 0xff0000, 0xff0000);
    scene.add(gridHelper);
    
	  // Create axes helper
    const axesHelper = new THREE.AxesHelper(2000);
    scene.add(axesHelper);
    
    // Properties for ball
    const halfRacketHeight = racketH / 2;
    

    const animate = () => {
      requestAnimationFrame(animate);
      
      racket.position.y = Math.max(-tableH / 2 + halfRacketHeight, Math.min(tableH / 2 - halfRacketHeight, racket.position.y));
      rRacket.position.y = Math.max(-tableH / 2 + halfRacketHeight, Math.min(tableH / 2 - halfRacketHeight, rRacket.position.y));
      renderer.render(scene, camera);
    };

    const resizeHandler = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
  
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
  
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', resizeHandler);


    animate();

    return () => {
      window.removeEventListener('resize', resizeHandler);

      // Clean up Three.js scene when component unmounts
      scene.remove(table);
      scene.remove(racket);
      scene.remove(rRacket);
      scene.remove(ball);

      document.body.removeChild(renderer.domElement);


      renderer.forceContextLoss();
      renderer.dispose();
    };
  }, []);

  return null; // No need to render anything in this component
}

export default GameScene;