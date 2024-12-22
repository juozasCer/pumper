// src/components/LoadingOverlay.jsx

import React from 'react'
import { Html, useProgress } from '@react-three/drei'


const LoadingOverlay = () => {
  const { progress } = useProgress()

  return (
    <Html center>
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="spinner"></div>
        </div>
      </div>
    </Html>
  )
}

export default LoadingOverlay
