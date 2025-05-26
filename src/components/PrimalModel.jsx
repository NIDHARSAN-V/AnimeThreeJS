import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';

const Model = ({ paused, rotationZ = 0 }) => {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/primal.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      const firstAnimation = Object.values(actions)[0];
      if (firstAnimation) {
        if (paused) {
          firstAnimation.stop();
        } else {
          firstAnimation.reset().fadeIn(0.5).play();
        }
      }
    }
  }, [actions, paused]);

  useEffect(() => {
    if (group.current) {
      group.current.rotation.z = rotationZ;
    }
  }, [rotationZ]);

  return (
    <primitive
      ref={group}
      object={scene}
      scale={2}
      position={[0, -14.3, 2.5]}
    />
  );
};

const PrimalModel = ({ paused, rotationZ = 0 }) => {
  return (
    <div style={{
      width: '100%',
      height: '1000px',
      position: 'absolute',
      top: '0%',
      left: 0,
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      <Canvas camera={{ position: [0, -5, 8], fov: 50 }} style={{ background: 'transparent' }}>
        <ambientLight intensity={8} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={null}>
          <Model paused={paused} rotationZ={rotationZ} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            minDistance={3}
            maxDistance={15}
            target={[0, -5.5, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PrimalModel;
