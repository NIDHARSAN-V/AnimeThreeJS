import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Environment } from '@react-three/drei';

const Model = ({ roar }) => {
  const group = useRef();
  const { scene, animations, materials, nodes } = useGLTF('/models/grimlock.glb');
  const { actions } = useAnimations(animations, group);

 useEffect(() => {
  if (!actions) return;

  if (roar) {
    let anim = Object.values(actions)[3]; // Animation index 3
    if (anim) {
      anim.reset().fadeIn(0.5).play();
      anim = Object.values(actions)[1];
      anim.reset().fadeIn(0.5).play();
      
    }

    // Optional stop or transition
  } else {
    const anim = Object.values(actions)[0]; // Animation index 3
    if (anim) {
      anim.reset().fadeIn(0.1).play();
    }
    

    
  }
}, [actions, roar]);


  return (
 <primitive
  ref={group}
  object={scene}
  scale={2}
  position={[0, roar ? -6.5 : -10, -25]} // <-- change here
/>
  );
};

const GPrimalModel = ({ roar }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '1000px',
        position: 'absolute',
        top: '0%',
        left: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas camera={{ position: [0, 0, 28], fov: 50 }} style={{ background: 'transparent' }} shadows>
        <ambientLight intensity={2} />
        <directionalLight position={[0, -7, 8]} intensity={20} castShadow />
        <directionalLight position={[-10, -7, -18]} intensity={40} color="#ffffff" />
        <directionalLight position={[10, -7, -18]} intensity={40} color="#ffffff" />
        <spotLight position={[0, 20, -10]} angle={0.4} intensity={90} penumbra={0.8} castShadow />
        <Environment preset="city" background={false} />

        <Suspense fallback={null}>
          <Model roar={roar} />
          <OrbitControls
            enableZoom
            enablePan
            enableRotate
            minDistance={3}
            maxDistance={30}
            target={[0, -1, -18]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GPrimalModel;
