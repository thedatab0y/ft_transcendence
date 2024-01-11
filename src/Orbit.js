import { useRef, useEffect } from 'react';
import { OrbitControls as OrbitControlsClass } from 'three/examples/jsm/controls/OrbitControls';

const OrbitControls = ({ camera, gl }) => {
 const orbitControlsRef = useRef();

 useEffect(() => {
    if (camera && gl.domElement) {
      orbitControlsRef.current = new OrbitControlsClass(camera, gl.domElement);
      return () => {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.dispose();
        }
      };
    }
 }, [camera, gl]);

 return null;
};

export default OrbitControls;