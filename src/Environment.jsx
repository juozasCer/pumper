// src/components/Environment.jsx

import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import * as THREE from 'three';

function Environment() {
  const { scene, gl } = useThree();

  useEffect(() => {
    const loader = new EXRLoader();
    loader.load(
      '/media/kloppenheim_02_puresky_1k.exr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.encoding = THREE.LinearEncoding;
        scene.environment = texture;
        scene.background = texture; // Optional: Set as background
        gl.outputEncoding = THREE.sRGBEncoding;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
        gl.needsUpdate = true;
      },
      undefined,
      (error) => {
        console.error('An error occurred loading the EXR environment map:', error);
      }
    );

    // Cleanup function
    return () => {
      if (scene.environment) {
        scene.environment.dispose();
        scene.environment = null;
      }
      if (scene.background) {
        scene.background.dispose();
        scene.background = null;
      }
    };
  }, [scene, gl]);

  return null; // This component does not render anything directly
}

export default Environment;
