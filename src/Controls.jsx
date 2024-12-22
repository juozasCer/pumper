// Controls.jsx
import React, { useRef, useState, useEffect } from 'react'
import { PointerLockControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Controls = ({ onLock, onUnlock }) => {
  const controlsRef = useRef()
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW':
          setKeys((prev) => ({ ...prev, forward: true }))
          break
        case 'KeyA':
          setKeys((prev) => ({ ...prev, left: true }))
          break
        case 'KeyS':
          setKeys((prev) => ({ ...prev, backward: true }))
          break
        case 'KeyD':
          setKeys((prev) => ({ ...prev, right: true }))
          break
        default:
          break
      }
    }

    const handleKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW':
          setKeys((prev) => ({ ...prev, forward: false }))
          break
        case 'KeyA':
          setKeys((prev) => ({ ...prev, left: false }))
          break
        case 'KeyS':
          setKeys((prev) => ({ ...prev, backward: false }))
          break
        case 'KeyD':
          setKeys((prev) => ({ ...prev, right: false }))
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((_, delta) => {
    if (!controlsRef.current || !controlsRef.current.isLocked) return

    const speed = 50
    velocity.current.x -= velocity.current.x * 10.0 * delta
    velocity.current.z -= velocity.current.z * 10.0 * delta

    direction.current.z = Number(keys.forward) - Number(keys.backward)
    direction.current.x = Number(keys.right) - Number(keys.left)
    direction.current.normalize()

    if (keys.forward || keys.backward)
      velocity.current.z -= direction.current.z * speed * delta
    if (keys.left || keys.right)
      velocity.current.x -= direction.current.x * speed * delta

    controlsRef.current.moveRight(-velocity.current.x * delta)
    controlsRef.current.moveForward(-velocity.current.z * delta)

    // // Clamp the camera position within the defined boundaries
    // const camera = controlsRef.current.getObject() // Access the camera
    // // camera.position.x = THREE.MathUtils.clamp(camera.position.x, -2.5, 2.5)
    // // camera.position.z = THREE.MathUtils.clamp(camera.position.z, -25, 2)
  })

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={onLock}
      onUnlock={onUnlock}
    />
  )
}

export default Controls
