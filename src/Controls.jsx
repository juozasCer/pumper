// Controls.jsx
import React, { useEffect, useRef, useState } from 'react';
import { PointerLockControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Controls({ disabled }) {
  const controlsRef = useRef();
  const [move, setMove] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  // Handle keyboard input
  useEffect(() => {
    if (disabled) {
      // Reset movement when disabled
      setMove({
        forward: false,
        backward: false,
        left: false,
        right: false,
      });
      return;
    }

    const onKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW':
          setMove((prev) => ({ ...prev, forward: true }));
          break;
        case 'KeyA':
          setMove((prev) => ({ ...prev, left: true }));
          break;
        case 'KeyS':
          setMove((prev) => ({ ...prev, backward: true }));
          break;
        case 'KeyD':
          setMove((prev) => ({ ...prev, right: true }));
          break;
        default:
          break;
      }
    };

    const onKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW':
          setMove((prev) => ({ ...prev, forward: false }));
          break;
        case 'KeyA':
          setMove((prev) => ({ ...prev, left: false }));
          break;
        case 'KeyS':
          setMove((prev) => ({ ...prev, backward: false }));
          break;
        case 'KeyD':
          setMove((prev) => ({ ...prev, right: false }));
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [disabled]);

  // Handle movement in the animation loop
  useFrame((_, delta) => {
    if (!controlsRef.current || !controlsRef.current.isLocked || disabled) return;

    const speed = 50;
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;

    direction.current.z = Number(move.forward) - Number(move.backward);
    direction.current.x = Number(move.right) - Number(move.left);
    direction.current.normalize();

    if (move.forward || move.backward)
      velocity.current.z -= direction.current.z * speed * delta;
    if (move.left || move.right)
      velocity.current.x -= direction.current.x * speed * delta;

    // Move the camera based on velocity
    controlsRef.current.moveRight(-velocity.current.x * delta);
    controlsRef.current.moveForward(-velocity.current.z * delta);
  });

  return <PointerLockControls ref={controlsRef} />;
}

export default Controls;
