import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Vector3D, PlaneEquation, Line3D, footOfPerpendicularPlane, imageOfPointPlane, vCross, vSub, vMag } from '../../utils/math';

interface Vector3DViewProps {
  mode: 'vectors' | 'plane' | 'skew';
  vectorA: Vector3D;
  vectorB: Vector3D;
  plane?: PlaneEquation;
  pointP?: Vector3D;
  line1?: Line3D;
  line2?: Line3D;
}

export const Vector3DView: React.FC<Vector3DViewProps> = ({
  mode,
  vectorA,
  vectorB,
  plane = { a: 1, b: 1, c: 1, d: 5 },
  pointP = { x: 2, y: 3, z: 4 },
  line1 = { p: { x: 0, y: 0, z: 0 }, d: { x: 2, y: 1, z: 3 } },
  line2 = { p: { x: 1, y: -1, z: 2 }, d: { x: -1, y: 2, z: 1 } },
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const dynamicGroupRef = useRef<THREE.Group | null>(null);

  // Rotation state for touch drag
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.5, y: -0.6 });
  const [zoom, setZoom] = useState(16);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 680;
    const height = Math.max(320, Math.min(420, window.innerHeight * 0.45));

    // Software WebGL probe
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(12, 10, 16);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    // Coordinate Grid Floor & Axes
    const grid = new THREE.GridHelper(16, 16, 0x38bdf8, 0x334155);
    grid.position.y = -0.01;
    scene.add(grid);

    // Custom 3D Axis indicators
    const axesGroup = new THREE.Group();
    // X axis (Red)
    const xMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
    const xGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(7, 0, 0)]);
    axesGroup.add(new THREE.Line(xGeo, xMat));

    // Y axis (Green)
    const yMat = new THREE.LineBasicMaterial({ color: 0x22c55e, linewidth: 2 });
    const yGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 7, 0)]);
    axesGroup.add(new THREE.Line(yGeo, yMat));

    // Z axis (Blue)
    const zMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, linewidth: 2 });
    const zGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 7)]);
    axesGroup.add(new THREE.Line(zGeo, zMat));
    scene.add(axesGroup);

    // Group for dynamic user objects
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);
    dynamicGroupRef.current = dynamicGroup;

    // Render loop
    let animationFrameId = 0;
    const animate = () => {
      if (cameraRef.current) {
        // Orbit camera based on touch rotation
        const radius = zoom;
        const rotX = rotationRef.current.x;
        const rotY = rotationRef.current.y;
        cameraRef.current.position.x = radius * Math.cos(rotX) * Math.sin(rotY);
        cameraRef.current.position.y = radius * Math.sin(rotX);
        cameraRef.current.position.z = radius * Math.cos(rotX) * Math.cos(rotY);
        cameraRef.current.lookAt(0, 0, 0);
      }
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth || 680;
      const h = Math.max(320, Math.min(420, window.innerHeight * 0.45));
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [zoom]);

  // Update 3D scene objects whenever vectors/parameters change
  useEffect(() => {
    const group = dynamicGroupRef.current;
    if (!group) return;

    // Clear old objects
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as any).geometry) (child as any).geometry.dispose();
      if ((child as any).material) {
        if (Array.isArray((child as any).material)) {
          (child as any).material.forEach((m: any) => m.dispose());
        } else {
          (child as any).material.dispose();
        }
      }
    }

    // Helper: create smooth 3D arrow
    const createArrow = (origin: THREE.Vector3, dir: THREE.Vector3, length: number, hexColor: number, radius = 0.08) => {
      const arrowGroup = new THREE.Group();
      if (length < 0.01) return arrowGroup;
      const normDir = dir.clone().normalize();

      // Shaft
      const shaftLen = Math.max(0.1, length - 0.4);
      const shaftGeo = new THREE.CylinderGeometry(radius, radius, shaftLen, 12);
      const shaftMat = new THREE.MeshStandardMaterial({ color: hexColor, roughness: 0.3 });
      const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
      shaftMesh.position.y = shaftLen / 2;
      arrowGroup.add(shaftMesh);

      // Cone Head
      const headGeo = new THREE.ConeGeometry(radius * 2.8, 0.4, 16);
      const headMesh = new THREE.Mesh(headGeo, shaftMat);
      headMesh.position.y = shaftLen + 0.2;
      arrowGroup.add(headMesh);

      // Align arrowGroup along dir vector
      arrowGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normDir);
      arrowGroup.position.copy(origin);
      return arrowGroup;
    };

    if (mode === 'vectors') {
      // Vector A (Blue)
      const dirA = new THREE.Vector3(vectorA.x, vectorA.y, vectorA.z);
      const magA = dirA.length();
      group.add(createArrow(new THREE.Vector3(0, 0, 0), dirA, magA, 0x38bdf8));

      // Vector B (Orange)
      const dirB = new THREE.Vector3(vectorB.x, vectorB.y, vectorB.z);
      const magB = dirB.length();
      group.add(createArrow(new THREE.Vector3(0, 0, 0), dirB, magB, 0xf97316));

      // Vector A + B (Emerald Green)
      const dirSum = dirA.clone().add(dirB);
      group.add(createArrow(new THREE.Vector3(0, 0, 0), dirSum, dirSum.length(), 0x10b981, 0.06));

      // Vector Cross Product A x B (Purple)
      const cross = new THREE.Vector3().crossVectors(dirA, dirB);
      if (cross.length() > 0.1) {
        group.add(createArrow(new THREE.Vector3(0, 0, 0), cross, Math.min(6, cross.length()), 0xa855f7, 0.09));
      }

      // Parallelogram plane indicator
      const paraGeo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        0, 0, 0,
        dirA.x, dirA.y, dirA.z,
        dirSum.x, dirSum.y, dirSum.z,

        0, 0, 0,
        dirSum.x, dirSum.y, dirSum.z,
        dirB.x, dirB.y, dirB.z,
      ]);
      paraGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      paraGeo.computeVertexNormals();
      const paraMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
      group.add(new THREE.Mesh(paraGeo, paraMat));
    } else if (mode === 'plane') {
      // Plane: ax + by + cz = d
      // Render plane rectangle
      const normal = new THREE.Vector3(plane.a, plane.b, plane.c).normalize();
      const planeGeo = new THREE.PlaneGeometry(10, 10);
      const planeMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      });
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);

      // Position plane at d * normal
      const den = plane.a * plane.a + plane.b * plane.b + plane.c * plane.c;
      const centerDist = den !== 0 ? plane.d / Math.sqrt(den) : 0;
      planeMesh.position.copy(normal.clone().multiplyScalar(centerDist));
      planeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      group.add(planeMesh);

      // Normal Vector Arrow
      group.add(createArrow(planeMesh.position, normal, 2.5, 0x38bdf8, 0.06));

      // Point P
      const pVec = new THREE.Vector3(pointP.x, pointP.y, pointP.z);
      const pGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const pMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.copy(pVec);
      group.add(pMesh);

      // Foot of perpendicular
      const foot = footOfPerpendicularPlane(pointP, plane);
      const footVec = new THREE.Vector3(foot.x, foot.y, foot.z);
      const footMesh = new THREE.Mesh(pGeo, new THREE.MeshStandardMaterial({ color: 0x10b981 }));
      footMesh.position.copy(footVec);
      group.add(footMesh);

      // Image Point
      const img = imageOfPointPlane(pointP, plane);
      const imgVec = new THREE.Vector3(img.x, img.y, img.z);
      const imgMesh = new THREE.Mesh(pGeo, new THREE.MeshStandardMaterial({ color: 0xec4899 }));
      imgMesh.position.copy(imgVec);
      group.add(imgMesh);

      // Dashed connector line from Point -> Foot -> Image
      const lineGeo = new THREE.BufferGeometry().setFromPoints([pVec, imgVec]);
      const lineMat = new THREE.LineDashedMaterial({ color: 0xfacc15, dashSize: 0.2, gapSize: 0.1 });
      const connector = new THREE.Line(lineGeo, lineMat);
      connector.computeLineDistances();
      group.add(connector);
    } else if (mode === 'skew') {
      // Line 1: p1 + t * d1
      const l1Start = new THREE.Vector3(line1.p.x - line1.d.x * 3, line1.p.y - line1.d.y * 3, line1.p.z - line1.d.z * 3);
      const l1End = new THREE.Vector3(line1.p.x + line1.d.x * 3, line1.p.y + line1.d.y * 3, line1.p.z + line1.d.z * 3);
      const l1Geo = new THREE.BufferGeometry().setFromPoints([l1Start, l1End]);
      group.add(new THREE.Line(l1Geo, new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 3 })));

      // Line 2: p2 + s * d2
      const l2Start = new THREE.Vector3(line2.p.x - line2.d.x * 3, line2.p.y - line2.d.y * 3, line2.p.z - line2.d.z * 3);
      const l2End = new THREE.Vector3(line2.p.x + line2.d.x * 3, line2.p.y + line2.d.y * 3, line2.p.z + line2.d.z * 3);
      const l2Geo = new THREE.BufferGeometry().setFromPoints([l2Start, l2End]);
      group.add(new THREE.Line(l2Geo, new THREE.LineBasicMaterial({ color: 0xf97316, linewidth: 3 })));

      // Shortest distance vector (along b1 x b2)
      const b1xb2 = vCross(line1.d, line2.d);
      const magCross = vMag(b1xb2);
      if (magCross > 1e-4) {
        const perpDir = new THREE.Vector3(b1xb2.x, b1xb2.y, b1xb2.z).normalize();
        const distSeg = createArrow(new THREE.Vector3(line1.p.x, line1.p.y, line1.p.z), perpDir, 2, 0xec4899, 0.06);
        group.add(distSeg);
      }
    }
  }, [mode, vectorA, vectorB, plane, pointP, line1, line2]);

  // Touch drag rotation handler
  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    isDraggingRef.current = true;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - prevPointerRef.current.x;
    const dy = e.clientY - prevPointerRef.current.y;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };

    rotationRef.current.y += dx * 0.008;
    rotationRef.current.x = Math.max(-1.4, Math.min(1.4, rotationRef.current.x + dy * 0.008));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="w-full select-none">
      <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-inner">
        {/* 3D WebGL Canvas Mount Container */}
        <div
          ref={mountRef}
          className="w-full touch-none cursor-grab active:cursor-grabbing"
          style={{ height: 350 }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />

        {/* 3D Scene HUD Overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-300 pointer-events-none flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-400" /> +X
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> +Y
          </span>
          <span className="flex items-center gap-1.5 text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-400" /> +Z
          </span>
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-900/80 border border-slate-700 rounded-lg p-1 text-slate-200 text-xs">
          <button
            onClick={() => setZoom(z => Math.max(8, z - 2))}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 active:bg-slate-700 font-bold"
            title="Zoom In"
          >
            +
          </button>
          <span className="px-1 text-slate-400 text-[11px]">Zoom</span>
          <button
            onClick={() => setZoom(z => Math.min(30, z + 2))}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 active:bg-slate-700 font-bold"
            title="Zoom Out"
          >
            -
          </button>
        </div>

        {/* Instruction badge */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 border border-slate-800 rounded px-2.5 py-1 text-[11px] text-slate-400 pointer-events-none">
          Drag anywhere to rotate 3D view
        </div>
      </div>
    </div>
  );
};
