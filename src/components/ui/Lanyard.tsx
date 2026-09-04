/* eslint-disable react/no-unknown-property */
'use client';

import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer, Html } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RapierRigidBody,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import { Track } from '@/types/music';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Sparkles,
} from 'lucide-react';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
  namespace React.JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}

const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

export interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
  cardScale?: number;
  track?: Track | null;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  isShuffle?: boolean;
  isRepeat?: boolean;
  isSaved?: boolean;
  onTogglePlay?: () => void;
  onNextTrack?: () => void;
  onPrevTrack?: () => void;
  onToggleShuffle?: () => void;
  onToggleRepeat?: () => void;
  onSeek?: (time: number) => void;
  onToggleSave?: () => void;
}

export function Lanyard({
  position = [0, -0.48, 10.4],
  gravity = [0, -32, 0],
  fov = 22,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1.35,
  cardScale = 2.9,
  track = null,
  isPlaying = false,
  currentTime = 0,
  duration = 180,
  isShuffle = false,
  isRepeat = false,
  isSaved = false,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onToggleShuffle,
  onToggleRepeat,
  onSeek,
  onToggleSave,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMounted) {
    return (
      <div className="lanyard-wrapper flex items-center justify-center">
        <div className="w-72 h-96 rounded-2xl bg-white/[0.03] border border-white/[0.08] animate-pulse" />
      </div>
    );
  }

  const activeFrontImage = frontImage || track?.artworkUrl || null;

  return (
    <div className="lanyard-wrapper select-none">
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI * 1.2} />
        <directionalLight position={[4, 8, 6]} intensity={1.3} />
        <directionalLight position={[-4, -2, 5]} intensity={0.5} color="#e5b067" />

        <Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band
              isMobile={isMobile}
              frontImage={activeFrontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
              cardScale={cardScale}
              track={track}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              isShuffle={isShuffle}
              isRepeat={isRepeat}
              isSaved={isSaved}
              onTogglePlay={onTogglePlay}
              onNextTrack={onNextTrack}
              onPrevTrack={onPrevTrack}
              onToggleShuffle={onToggleShuffle}
              onToggleRepeat={onToggleRepeat}
              onSeek={onSeek}
              onToggleSave={onToggleSave}
            />
          </Physics>
        </Suspense>

        <Environment blur={0.8}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={8}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1.35,
  cardScale = 2.9,
  track = null,
  isPlaying = false,
  currentTime = 0,
  duration = 180,
  isShuffle = false,
  isRepeat = false,
  isSaved = false,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onToggleShuffle,
  onToggleRepeat,
  onSeek,
  onToggleSave,
}: {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
  cardScale?: number;
  track?: Track | null;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  isShuffle?: boolean;
  isRepeat?: boolean;
  isSaved?: boolean;
  onTogglePlay?: () => void;
  onNextTrack?: () => void;
  onPrevTrack?: () => void;
  onToggleShuffle?: () => void;
  onToggleRepeat?: () => void;
  onSeek?: (time: number) => void;
  onToggleSave?: () => void;
}) {
  const band = useRef<any>(null);
  const fixed = useRef<RapierRigidBody | null>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<RapierRigidBody | null>(null);

  const vec = useMemo(() => new THREE.Vector3(), []);

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF('/assets/lanyard/card.glb') as any;
  const texture = useTexture(lanyardImage || '/assets/lanyard/lanyard.png');

  const [frontImgObj, setFrontImgObj] = useState<HTMLImageElement | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
    if (!frontImage || frontImage === BLANK_PIXEL) {
      setFrontImgObj(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setFrontImgObj(img);
    img.onerror = () => {
      setFrontImgObj(null);
      setImgFailed(true);
    };
    img.src = frontImage;
  }, [frontImage]);

  const cardMap = useMemo(() => {
    if (!materials?.base?.map) return null;
    const baseMap = materials.base.map;
    const baseImg = baseMap.image;
    if (!baseImg) return baseMap;

    const W = baseImg.width || 1024;
    const H = baseImg.height || 1024;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;

    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img: any, rect: typeof FRONT_UV_RECT) => {
      if (!img || !img.width || !img.height) return;
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      try {
        ctx.save();
        ctx.beginPath();
        ctx.rect(rx, ry, rw, rh);
        ctx.clip();
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
      } catch {
        // Ignore canvas taint if cross-origin
      }
    };

    // Back face VIP Pass
    const rx = BACK_UV_RECT.x * W;
    const ry = BACK_UV_RECT.y * H;
    const rw = BACK_UV_RECT.w * W;
    const rh = BACK_UV_RECT.h * H;
    ctx.save();
    ctx.fillStyle = '#08080a';
    ctx.fillRect(rx, ry, rw, rh);
    ctx.strokeStyle = '#e5b067';
    ctx.lineWidth = 4;
    ctx.strokeRect(rx + 16, ry + 16, rw - 32, rh - 32);
    ctx.fillStyle = '#e5b067';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('LIVO AUDIO PASS', rx + 32, ry + 64);
    ctx.fillStyle = '#8e8c87';
    ctx.font = '14px sans-serif';
    ctx.fillText('HI-RES MASTER ACCESS', rx + 32, ry + 96);
    ctx.fillText('24-BIT / 96KHZ LOSSLESS', rx + 32, ry + 118);
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 40; i++) {
      const barW = i % 3 === 0 ? 6 : i % 2 === 0 ? 3 : 2;
      ctx.fillRect(rx + 32 + i * 7, ry + rh - 90, barW, 45);
    }
    ctx.restore();

    if (frontImgObj) {
      drawFitted(frontImgObj, FRONT_UV_RECT);
    }

    try {
      const composite = new THREE.CanvasTexture(canvas);
      composite.colorSpace = THREE.SRGBColorSpace;
      composite.flipY = baseMap.flipY;
      composite.anisotropy = 16;
      composite.needsUpdate = true;
      return composite;
    } catch {
      return baseMap;
    }
  }, [frontImgObj, imageFit, materials]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  const scaleRatio = cardScale / 2.25;
  const cardAnchorY = 1.45 * scaleRatio;
  const groupOffsetY = -1.2 * scaleRatio;
  const colliderW = 0.8 * scaleRatio;
  const colliderH = 1.15 * scaleRatio;
  const ropeSegmentLength = 0.72;

  useRopeJoint(fixed as any, j1 as any, [[0, 0, 0], [0, 0, 0], ropeSegmentLength]);
  useRopeJoint(j1 as any, j2 as any, [[0, 0, 0], [0, 0, 0], ropeSegmentLength]);
  useRopeJoint(j2 as any, j3 as any, [[0, 0, 0], [0, 0, 0], ropeSegmentLength]);
  useSphericalJoint(j3 as any, card as any, [
    [0, 0, 0],
    [0, cardAnchorY, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    // Clamp delta strictly so loading stalls or frame drops don't explode interpolation
    const safeDelta = Math.min(delta, 0.033);

    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      const dir = vec.clone().sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current && card.current && j1.current && j2.current && j3.current) {
      [j1, j2].forEach((ref) => {
        const trans = ref.current?.translation();
        if (
          !trans ||
          !Number.isFinite(trans.x) ||
          !Number.isFinite(trans.y) ||
          !Number.isFinite(trans.z)
        ) {
          return;
        }

        if (!ref.current.lerped || !Number.isFinite(ref.current.lerped.x)) {
          ref.current.lerped = new THREE.Vector3(trans.x, trans.y, trans.z);
        }

        const target = new THREE.Vector3(trans.x, trans.y, trans.z);
        const dist = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(target)));
        const alpha = Math.min(
          1,
          Math.max(0, safeDelta * (minSpeed + dist * (maxSpeed - minSpeed)))
        );
        ref.current.lerped.lerp(target, alpha);
      });

      const p0 = j3.current?.translation();
      const p1 = j2.current?.lerped;
      const p2 = j1.current?.lerped;
      const p3 = fixed.current?.translation();

      if (
        p0 && Number.isFinite(p0.x) && Number.isFinite(p0.y) && Number.isFinite(p0.z) &&
        p1 && Number.isFinite(p1.x) && Number.isFinite(p1.y) && Number.isFinite(p1.z) &&
        p2 && Number.isFinite(p2.x) && Number.isFinite(p2.y) && Number.isFinite(p2.z) &&
        p3 && Number.isFinite(p3.x) && Number.isFinite(p3.y) && Number.isFinite(p3.z)
      ) {
        curve.points[0].set(p0.x, p0.y, p0.z);
        curve.points[1].copy(p1);
        curve.points[2].copy(p2);
        curve.points[3].set(p3.x, p3.y, p3.z);

        if (band.current?.geometry) {
          const pts = curve.getPoints(isMobile ? 16 : 32);
          const allFinite = pts.every(
            (p) => Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.z)
          );
          if (allFinite) {
            band.current.geometry.setPoints(pts);
          }
        }
      }

      const a = card.current.angvel();
      const r = card.current.rotation();
      if (
        a &&
        Number.isFinite(a.x) &&
        Number.isFinite(a.y) &&
        Number.isFinite(a.z) &&
        r &&
        Number.isFinite(r.y)
      ) {
        card.current.setAngvel({ x: a.x, y: a.y - r.y * 0.25, z: a.z }, true);
      }
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <group position={[0, 3.3, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[colliderW, colliderH, 0.02]} />
          <group
            scale={cardScale}
            position={[0, groupOffsetY, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as any)?.releasePointerCapture?.(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as any)?.setPointerCapture?.(e.pointerId);
              if (card.current) {
                drag(
                  new THREE.Vector3()
                    .copy(e.point)
                    .sub(new THREE.Vector3().copy(card.current.translation() as any))
                );
              }
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap || materials?.base?.map}
                map-anisotropy={16}
                clearcoat={0}
                roughness={0.6}
                metalness={0.0}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />

            <Html
              transform
              position={[0, 0.523, 0.015]}
              scale={0.00225}
              occlude={false}
              style={{
                width: '320px',
                height: '445px',
                pointerEvents: 'auto',
                userSelect: 'none',
                backgroundColor: 'transparent',
              }}
            >
              <div
                className="w-full h-full rounded-[22px] p-3 flex flex-col justify-between overflow-hidden relative select-none group/card pointer-events-auto"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Header VIP Pass indicator (appears on hover) */}
                <div className="flex items-center justify-between px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/[0.08] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                  <span className="text-[9px] font-mono tracking-widest text-[#e5b067] uppercase font-semibold">
                    LIVO VIP PASS
                  </span>
                  <div className="text-[9px] font-mono tracking-wider text-zinc-300 uppercase">
                    {track?.genre || 'MASTER AUDIO'}
                  </div>
                </div>

                {/* Empty center: Photo stays 100% clean and unobstructed */}
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onTogglePlay?.()}
                  title={isPlaying ? 'Pause' : 'Play'}
                />

                {/* Bottom glass control bar embedded on the card (reveals on hover) */}
                <div className="p-2.5 rounded-xl bg-black/70 backdrop-blur-lg border border-white/[0.12] space-y-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 shadow-2xl">
                  <div className="text-center px-1">
                    <h3 className="text-sm font-semibold text-[#f5f4f0] truncate tracking-tight">
                      {track?.title || 'Cadence Audio'}
                    </h3>
                    <p className="text-[11px] text-[#8e8c87] truncate mt-0.5">
                      {track?.artist || 'Select a frequency'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSeek && duration > 0) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                          onSeek(ratio * duration);
                        }
                      }}
                      className="group relative h-1.5 w-full bg-white/[0.12] hover:bg-white/[0.22] rounded-full overflow-hidden cursor-pointer transition-colors"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-white transition-all duration-100 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/[0.08]">
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleShuffle?.();
                      }}
                      className={`p-1 rounded-full transition-all cursor-pointer ${
                        isShuffle ? 'text-emerald-400' : 'text-zinc-400 hover:text-white'
                      }`}
                      title="Shuffle"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPrevTrack?.();
                      }}
                      className="p-1 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors active:scale-90 cursor-pointer"
                      title="Previous Track"
                    >
                      <SkipBack className="w-4 h-4 fill-current" />
                    </button>

                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePlay?.();
                      }}
                      className="w-8 h-8 rounded-full bg-white text-black hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-[0_0_12px_rgba(255,255,255,0.3)] cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>

                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNextTrack?.();
                      }}
                      className="p-1 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors active:scale-90 cursor-pointer"
                      title="Next Track"
                    >
                      <SkipForward className="w-4 h-4 fill-current" />
                    </button>

                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleRepeat?.();
                      }}
                      className={`p-1 rounded-full transition-all cursor-pointer ${
                        isRepeat ? 'text-emerald-400' : 'text-zinc-400 hover:text-white'
                      }`}
                      title="Repeat"
                    >
                      <Repeat className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Html>
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

export default Lanyard;
