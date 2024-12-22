// src/components/VideoFloor.jsx
import * as THREE from 'three'
import React from 'react';
import { Plane, useVideoTexture } from '@react-three/drei';

function VideoFloor() {
  // Use useVideoTexture to load and apply the video texture
  const videoTexture = useVideoTexture('/media/PUMPFUN3D.mp4', {
    muted: true,
    loop: true,
    autoplay: true,
    crossOrigin: 'Anonymous',
  });

  // Adjust texture properties
  videoTexture.wrapS = videoTexture.wrapT = THREE.RepeatWrapping;
  videoTexture.repeat.set(1080 / 16, 1824 / 16);

  return (
    <Plane args={[1000, 1000]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      {/* <meshStandardMaterial map={videoTexture} /> */}
      <meshBasicMaterial map={videoTexture} />
    </Plane>
  );
}

export default VideoFloor;
