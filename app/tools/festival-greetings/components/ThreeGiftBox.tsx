"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BoxTheme } from '../types';
import styles from './ThreeGiftBox.module.css';

interface ThreeGiftBoxProps {
  theme?: BoxTheme;
  isOpened?: boolean;
  onBoxClick?: () => void;
  interactive?: boolean;
}

export const ThreeGiftBox: React.FC<ThreeGiftBoxProps> = ({
  theme = 'candy',
  isOpened = false,
  onBoxClick,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOpenedRef = useRef(isOpened);
  isOpenedRef.current = isOpened;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 340;
    const height = container.clientHeight || 340;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.8, 6.2);
    camera.lookAt(0, 0.4, 0);

    // 2. WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn("WebGL initialization failed:", e);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting setup for cartoon plush depth
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.4);
    mainLight.position.set(4, 7, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const rimLight = new THREE.PointLight(0xff99dd, 1.2, 10);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const insideLight = new THREE.PointLight(0xffd700, 0, 8);
    insideLight.position.set(0, 0.8, 0);
    scene.add(insideLight);

    // 4. Color Palettes by Theme
    const themeColors: Record<BoxTheme, { box: number; ribbon: number; bow: number; rim: number }> = {
      candy: { box: 0xff3b7e, ribbon: 0xffe600, bow: 0xffd000, rim: 0xff88bb },
      gold: { box: 0x241d49, ribbon: 0xffb703, bow: 0xfb8500, rim: 0x8ecae6 },
      cosmic: { box: 0x43126f, ribbon: 0x00f5d4, bow: 0x70e000, rim: 0x9b5de5 },
      neon: { box: 0x111625, ribbon: 0xff007f, bow: 0x00f0ff, rim: 0x39ff14 },
      rainbow: { box: 0x06d6a0, ribbon: 0xef476f, bow: 0xffd166, rim: 0x118ab2 },
    };

    const palette = themeColors[theme] || themeColors.candy;

    // 5. Build 3D Gift Box Model
    const boxGroup = new THREE.Group();
    scene.add(boxGroup);

    // Materials
    const boxMat = new THREE.MeshStandardMaterial({
      color: palette.box,
      roughness: 0.25,
      metalness: 0.1,
    });

    const ribbonMat = new THREE.MeshStandardMaterial({
      color: palette.ribbon,
      roughness: 0.2,
      metalness: 0.35,
    });

    const bowMat = new THREE.MeshStandardMaterial({
      color: palette.bow,
      roughness: 0.15,
      metalness: 0.4,
    });

    // Box Body (1.8 x 1.4 x 1.8)
    const boxGeo = new THREE.BoxGeometry(1.8, 1.4, 1.8);
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxGroup.add(boxMesh);

    // Ribbons on Body
    const ribbonVGeo = new THREE.BoxGeometry(0.32, 1.41, 1.82);
    const ribbonVMesh = new THREE.Mesh(ribbonVGeo, ribbonMat);
    boxGroup.add(ribbonVMesh);

    const ribbonHGeo = new THREE.BoxGeometry(1.82, 1.41, 0.32);
    const ribbonHMesh = new THREE.Mesh(ribbonHGeo, ribbonMat);
    boxGroup.add(ribbonHMesh);

    // Lid Group (removable / animated!)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.72, 0);
    boxGroup.add(lidGroup);

    const lidGeo = new THREE.BoxGeometry(1.92, 0.36, 1.92);
    const lidMesh = new THREE.Mesh(lidGeo, boxMat);
    lidMesh.position.set(0, 0.18, 0);
    lidMesh.castShadow = true;
    lidGroup.add(lidMesh);

    // Ribbons on Lid
    const lidRibbonV = new THREE.Mesh(
      new THREE.BoxGeometry(0.33, 0.37, 1.94),
      ribbonMat
    );
    lidRibbonV.position.set(0, 0.18, 0);
    lidGroup.add(lidRibbonV);

    const lidRibbonH = new THREE.Mesh(
      new THREE.BoxGeometry(1.94, 0.37, 0.33),
      ribbonMat
    );
    lidRibbonH.position.set(0, 0.18, 0);
    lidGroup.add(lidRibbonH);

    // 3D Cartoon Bow Loops on top of Lid
    const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), bowMat);
    bowKnot.position.set(0, 0.42, 0);
    lidGroup.add(bowKnot);

    const createBowLoop = (rotY: number, tilt: number) => {
      const loopGroup = new THREE.Group();
      loopGroup.position.set(0, 0.42, 0);
      loopGroup.rotation.y = rotY;

      const loopGeo = new THREE.TorusGeometry(0.32, 0.1, 12, 24, Math.PI * 1.5);
      const loopMesh = new THREE.Mesh(loopGeo, bowMat);
      loopMesh.rotation.z = tilt;
      loopMesh.position.set(0.24, 0.12, 0);
      loopMesh.scale.set(1.2, 0.8, 1);
      loopGroup.add(loopMesh);
      return loopGroup;
    };

    lidGroup.add(createBowLoop(0.4, 0.4));
    lidGroup.add(createBowLoop(Math.PI - 0.4, -0.4));
    lidGroup.add(createBowLoop(Math.PI * 0.5 + 0.3, 0.4));
    lidGroup.add(createBowLoop(-Math.PI * 0.5 - 0.3, -0.4));

    // 6. Floating Celebration Particles / Stars
    const particleCount = 45;
    const particleGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xffec59 });
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);

    const particleData: Array<{ mesh: THREE.Mesh; angle: number; radius: number; speed: number; y: number; ySpeed: number }> = [];

    for (let i = 0; i < particleCount; i++) {
      const pMesh = new THREE.Mesh(
        particleGeo,
        new THREE.MeshBasicMaterial({
          color: [0xffec59, 0xff6b8b, 0x48dbfb, 0x1dd1a1, 0xff9f43][i % 5],
        })
      );
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.6 + Math.random() * 1.2;
      const y = -0.5 + Math.random() * 2.5;

      pMesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      particlesGroup.add(pMesh);

      particleData.push({
        mesh: pMesh,
        angle,
        radius,
        speed: 0.008 + Math.random() * 0.015,
        y,
        ySpeed: 0.005 + Math.random() * 0.01,
      });
    }

    // 7. Floating 3D Helium Balloons in Background
    const balloonGroup = new THREE.Group();
    scene.add(balloonGroup);

    const createBalloon = (color: number, x: number, y: number, z: number) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(x, y, z);

      // Balloon body (egg-shaped)
      const bGeo = new THREE.SphereGeometry(0.48, 16, 16);
      bGeo.scale(1, 1.25, 1);
      const bMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.15,
        metalness: 0.2,
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bGroup.add(bMesh);

      // Balloon knot
      const knotGeo = new THREE.ConeGeometry(0.08, 0.1, 8);
      const knotMesh = new THREE.Mesh(knotGeo, bMat);
      knotMesh.position.set(0, -0.62, 0);
      knotMesh.rotation.x = Math.PI;
      bGroup.add(knotMesh);

      // Wavy balloon string
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.65, 0),
        new THREE.Vector3(0.05, -1.0, 0),
        new THREE.Vector3(-0.04, -1.4, 0),
        new THREE.Vector3(0.02, -1.8, 0),
      ]);
      const tubeGeo = new THREE.TubeGeometry(curve, 12, 0.012, 4, false);
      const stringMat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
      const stringMesh = new THREE.Mesh(tubeGeo, stringMat);
      bGroup.add(stringMesh);

      return bGroup;
    };

    const balloon1 = createBalloon(0xff477e, -2.1, 1.2, -1.2);
    const balloon2 = createBalloon(0x06d6a0, 2.2, 1.6, -1.5);
    const balloon3 = createBalloon(0xffb703, 1.8, 0.5, -0.8);
    balloonGroup.add(balloon1, balloon2, balloon3);

    // 8. Pointer / Gyroscope depth reaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const handlePointerMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 2;
      mouseY = y * 2;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!interactive || !e.touches[0]) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width - 0.5;
      const y = (touch.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 2;
      mouseY = y * 2;
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 9. Animation Loop
    let clock = new THREE.Clock();
    let lidLiftProgress = isOpenedRef.current ? 1 : 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera / box tilt tracking mouse
      targetRotY = mouseX * 0.45;
      targetRotX = mouseY * 0.35;

      boxGroup.rotation.y += (targetRotY - boxGroup.rotation.y) * 0.08;
      boxGroup.rotation.x += (targetRotX - boxGroup.rotation.x) * 0.08;

      // Idle floating bob
      boxGroup.position.y = Math.sin(elapsedTime * 2.2) * 0.08;

      // Balloons bobbing gently
      balloon1.position.y = 1.2 + Math.sin(elapsedTime * 1.5) * 0.15;
      balloon1.rotation.z = Math.sin(elapsedTime * 1.2) * 0.05;
      balloon2.position.y = 1.6 + Math.cos(elapsedTime * 1.7) * 0.18;
      balloon2.rotation.z = Math.cos(elapsedTime * 1.4) * 0.06;
      balloon3.position.y = 0.5 + Math.sin(elapsedTime * 2.0 + 1) * 0.12;

      // Particles orbiting
      particleData.forEach((p) => {
        p.angle += p.speed;
        p.y += p.ySpeed;
        if (p.y > 2.8) p.y = -0.6;
        p.mesh.position.x = Math.cos(p.angle) * p.radius;
        p.mesh.position.z = Math.sin(p.angle) * p.radius;
        p.mesh.position.y = p.y;
        p.mesh.scale.setScalar(0.7 + Math.sin(elapsedTime * 4 + p.angle) * 0.3);
      });

      // Opening Animation State Transition
      const targetLid = isOpenedRef.current ? 1 : 0;
      lidLiftProgress += (targetLid - lidLiftProgress) * 0.08;

      if (lidLiftProgress > 0.01) {
        // Lid shoots up, twists, and flings back
        lidGroup.position.y = 0.72 + lidLiftProgress * 2.4;
        lidGroup.position.z = -lidLiftProgress * 0.8;
        lidGroup.rotation.x = -lidLiftProgress * 0.8;
        lidGroup.rotation.z = lidLiftProgress * 0.5;

        // Inside light shines with high intensity
        insideLight.intensity = lidLiftProgress * 4.5;

        // Make box ribbons expand slightly
        ribbonVMesh.scale.set(1 + lidLiftProgress * 0.1, 1, 1 + lidLiftProgress * 0.1);
        ribbonHMesh.scale.set(1 + lidLiftProgress * 0.1, 1, 1 + lidLiftProgress * 0.1);
      } else {
        lidGroup.position.set(0, 0.72, 0);
        lidGroup.rotation.set(0, 0, 0);
        insideLight.intensity = 0;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. ResizeObserver for fluid responsive scaling
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handleTouchMove);
      renderer.dispose();
      boxGeo.dispose();
      boxMat.dispose();
      ribbonMat.dispose();
      bowMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      onClick={onBoxClick}
      className={`${styles.container} ${interactive ? styles.interactive : ''}`}
      title={interactive ? 'Tap or drag to interact with the 3D Gift!' : ''}
    />
  );
};