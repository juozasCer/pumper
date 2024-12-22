// src/components/Scene.jsx

import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, } from '@react-three/drei'
import Controls from './Controls'
import * as THREE from 'three'
import LoadingOverlay from './LoadingOverlay'
import VideoFloor from './VideoFloor'; // Import the new VideoFloor component

const Scene = () => {
  const [pointerLocked, setPointerLocked] = useState(false)
  const [copySuccess, setCopySuccess] = useState('') // State to manage copy success message
  const CONTACT_ADDRESS = 'Loading...'
  const handleLock = () => {
    setPointerLocked(true)
  }

  const handleUnlock = () => {
    setPointerLocked(false)
  }

  const handleOverlayClick = () => {
    // Exit pointer lock when overlay is clicked
    document.exitPointerLock()
    setPointerLocked(false)
  }

  const handleCopy = async () => {
    try {

      await navigator.clipboard.writeText(CONTACT_ADDRESS)
      setCopySuccess('Copied!')
      // Clear the success message after 2 seconds
      setTimeout(() => {
        setCopySuccess('')
      }, 2000)
    } catch (err) {
      console.error('Failed to copy!', err)
      setCopySuccess('Failed to copy!')
      // Clear the error message after 2 seconds
      setTimeout(() => {
        setCopySuccess('')
      }, 2000)
    }
  }

  return (
    <div className="scene-container">
      <Canvas
        style={{ width: '100%', height: '100vh' }}
        camera={{ position: [0, 1.6, 0], fov: 80, near: 0.01, far: 150 }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 1.6, 0) // Makes the camera look forward along the Z-axis
          gl.setClearColor(0x000000)
          gl.shadowMap.enabled = true // Enable shadows globally
          gl.shadowMap.type = THREE.PCFSoftShadowMap // Use soft shadows for better quality
        }}
      >
        <Suspense fallback={<LoadingOverlay />}>
          {/* <ambientLight intensity={0.1} /> */}
          <directionalLight
            position={[100, 100, 100]}
            intensity={5}
            castShadow
            color={"#000000"}
            shadow-mapSize-width={2048} // Increase for higher quality shadows
            shadow-mapSize-height={2048}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
            shadow-camera-near={1}
            shadow-camera-far={200}
            shadow-bias={-0.005}
          />
          <VideoFloor/>
          {/* Environment preset for realistic lighting */}
          <Environment
            files="/media/kloppenheim_02_puresky_4k.hdr" // Replace with your HDRI file path
            background // Use the HDRI as the background
            backgroundBlurriness={0}
            backgroundIntensity={1}
            environmentIntensity={0.5}
          />

          {/* FPS-style camera controls */}
          <Controls onLock={handleLock} onUnlock={handleUnlock} />
        </Suspense>
      </Canvas>

      {/* Blur Overlay */}
      {!pointerLocked && (
        <div className="blur-overlay" onClick={handleOverlayClick}>
          <div className="overlay-content">
            <div className='buslog'>
              <div className='busik1'></div><div className='log'>PUMPFUN 3D</div>
            </div>
            <p>click to move</p>
            <div className="ass">
              <a
                href="https://x.com/memzoo_project"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // Prevent overlay click
              >
                <img src="/media/x.svg" alt="X.com" />
              </a>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation() // Prevent overlay click
                handleCopy()
              }}
              className="copy-div"
              title="Click to copy contact address"
              style={{ cursor: 'pointer', marginTop: '1rem', color: 'white' }} // Optional styling
            >
              <span>{CONTACT_ADDRESS}</span>
              {/* Display the copy success message */}
              {copySuccess && (
                <span className="copy-success" style={{ marginLeft: '0.5rem', color: 'lightgreen' }}>
                  {copySuccess}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Scene
