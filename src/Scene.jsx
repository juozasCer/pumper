// src/components/Scene.jsx

import React, { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';
import Controls from './Controls'; // Import the Controls component
import Environment from './Environment'; // Import the Environment component
// import './Scene.css'; // Import the CSS for styling

function Scene() {
  const [videoTexture, setVideoTexture] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const canvasRef = useRef();

  // Set up the video texture
  useEffect(() => {
    const video = document.createElement('video');
    video.src = '/media/PUMPFUN3D.mp4'; // Path to the MP4 file in the public folder
    video.crossOrigin = 'Anonymous'; // Ensure cross-origin if needed
    video.load();
    video.muted = true;
    video.loop = true;

    // Attempt to play the video
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error('Error playing video:', error);
      });
    }

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1080 / 16, 1824 / 16);

    setVideoTexture(texture);

    // Cleanup on unmount
    return () => {
      video.pause();
      video.src = '';
    };
  }, []);

  // Handle pointer lock changes
  useEffect(() => {
    const handlePointerLockChange = () => {
      const lockedElement = document.pointerLockElement;
      setIsPointerLocked(lockedElement === canvasRef.current);
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('pointerlockerror', handlePointerLockChange);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('pointerlockerror', handlePointerLockChange);
    };
  }, []);

  const handleStartGame = (e) => {
    e.stopPropagation(); // Prevent the click from propagating to the Canvas
    setIsGameStarted(true);
    // Request pointer lock on the Canvas element
    if (canvasRef.current) {
      canvasRef.current.requestPointerLock();
    }
  };

  const handleCanvasClick = () => {
    // Only request pointer lock if the game is already started
    if (isGameStarted && !isPointerLocked && canvasRef.current) {
      canvasRef.current.requestPointerLock();
    }
  };

  const handleBlurOverlayClick = (e) => {
    e.stopPropagation(); // Prevent the click from propagating to the Canvas
    setIsGameStarted(true); // Optionally resume the game
    if (canvasRef.current) {
      canvasRef.current.requestPointerLock();
    }
  };

  return (
    <>
      {/* Start Game Overlay */}
      {!isGameStarted && (
        <div className="start-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="start-overlay-content">
            <div className='text'>PUMPFUN 3D</div>
            <button onClick={handleStartGame} className="start-button">
              Start
            </button>
            <p>Contact Address</p>
            <div className="ass">
            <a href="https://x.com/memsec_" target="_blank">
              <img src="/media/x.svg" alt="X.com" />
            </a>
          </div>
          </div>
        </div>
      )}

      {/* Blur Overlay when Pointer is not locked */}
      {isGameStarted && !isPointerLocked && (
        <div className="blur-overlay" onClick={handleBlurOverlayClick}>
          <div className="blur-overlay-content">
            <p>Paused. Click to resume.</p>
            <p>Contact Address</p>
             <div className="ass">
            <a href="https://x.com/memsec_" target="_blank">
              <img src="/media/x.svg" alt="X.com" />
            </a>
          </div>
          </div>
         
        </div>
      )}

      <Canvas
        ref={canvasRef}
        className="game-canvas"
        camera={{ position: [0, 1.6, 0], fov: 80, near: 0.01, far: 1000 }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 1.6, -1); // Adjusted to look forward along the Z-axis
          gl.setClearColor(0x000000); // Sets the background color to black for better contrast
        }}
        onClick={handleCanvasClick}
      >
        {/* Add the Environment component here */}
        <Environment />

        {/* Lights */}
        {/* <ambientLight intensity={0.5} /> */}
        {/* <directionalLight position={[10, 10, 5]} intensity={1} /> */}

        {/* Video Texture Plane */}
        {videoTexture && (
          <Plane args={[1000, 1000]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <meshBasicMaterial map={videoTexture} />
          </Plane>
        )}

        {/* Controls */}
        <Controls disabled={!isPointerLocked || !isGameStarted} />
      </Canvas>
    </>
  );
}

export default Scene;
