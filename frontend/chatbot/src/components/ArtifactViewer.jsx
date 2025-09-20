// src/components/ArtifactViewer.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

export default function ArtifactViewer({ modelPath }) {
  const { scene } = useGLTF(modelPath);

  return (
    <Canvas camera={{ position: [0, 0, 1.8], fov: 50 }}>
      {/* 전체적으로 밝기 업 */}
      <ambientLight intensity={1.2} />  
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-5, -5, -5]} intensity={0.8} />

      {/* 모델 출력 */}
      <primitive object={scene} scale={8} />

      {/* 카메라 컨트롤 (자동 회전 켜둠) */}
      <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1} />

      {/* 환경 배경 */}
      <Environment preset="studio" />
    </Canvas>
  );
}
