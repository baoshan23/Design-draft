'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, QuadraticBezierLine, RoundedBox, Float, Sparkles, Edges } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { User, QrCode, Zap, Server, Building2, ShieldCheck, Wallet, CreditCard } from 'lucide-react';
import * as THREE from 'three';

interface DiagramProps {
    type: 'B2C' | 'B2B';
}

// Warm GCSS palette — keep all node glows within the gold/amber family so
// the diagram feels like part of the site theme, not a cyberpunk overlay.
const GOLD_BRIGHT = '#FFD95A';  // data / user-facing nodes
const GOLD_PRIMARY = '#FEBF1D'; // infra / hardware (matches site --primary)
const GOLD_AMBER = '#F59E0B';   // money / payment
const GOLD_DEEP = '#C07F00';    // business entities (CPO, admin)
const CREAM = '#FFF7D4';

const b2cNodes = [
    { id: 'user', label: 'User (车手)', icon: User, pos: [-10, 0, 4], color: GOLD_BRIGHT },
    { id: 'qr', label: 'QR Code', icon: QrCode, pos: [-4, 4, 2], color: GOLD_BRIGHT },
    { id: 'charger', label: 'EV Charger', icon: Zap, pos: [2, 4, 0], color: GOLD_PRIMARY },
    { id: 'wallet_user', label: 'Wallet', icon: Wallet, pos: [-4, -4, 4], color: GOLD_AMBER },
    { id: 'payment', label: 'Payment Co.', icon: CreditCard, pos: [2, -4, 2], color: GOLD_AMBER },
    { id: 'server', label: 'Server', icon: Server, pos: [8, 0, -2], color: GOLD_PRIMARY },
    { id: 'cpo', label: 'CPO', icon: Building2, pos: [14, 0, 0], color: GOLD_DEEP },
];

const b2bNodes = [
    { id: 'user', label: 'User (车手)', icon: User, pos: [-12, 0, 4], color: GOLD_BRIGHT },
    { id: 'qr', label: 'QR Code', icon: QrCode, pos: [-6, 4, 2], color: GOLD_BRIGHT },
    { id: 'charger', label: 'EV Charger', icon: Zap, pos: [0, 4, 0], color: GOLD_PRIMARY },
    { id: 'wallet_user', label: 'Wallet', icon: Wallet, pos: [-6, -4, 4], color: GOLD_AMBER },
    { id: 'payment', label: 'Payment Co.', icon: CreditCard, pos: [0, -4, 2], color: GOLD_AMBER },
    { id: 'server', label: 'Server', icon: Server, pos: [6, 0, -2], color: GOLD_PRIMARY },
    { id: 'cpo1', label: 'CPO 1', icon: Building2, pos: [12, 5, 0], color: GOLD_DEEP },
    { id: 'cpo2', label: 'CPO 2', icon: Building2, pos: [12, 0, 0], color: GOLD_DEEP },
    { id: 'cpo3', label: 'CPO 3', icon: Building2, pos: [12, -5, 0], color: GOLD_DEEP },
    { id: 'wallet_cpo', label: 'Wallet (Fee)', icon: Wallet, pos: [16, 8, 0], color: GOLD_AMBER },
    { id: 'admin', label: 'GCSS Super Admin', icon: ShieldCheck, pos: [20, 0, -4], color: GOLD_DEEP },
];

type LinkType = {
    start: string;
    end: string;
    color: string;
    dashed: boolean;
    curveOffset?: [number, number, number];
};

const b2cLinks: LinkType[] = [
    { start: 'user', end: 'qr', color: 'data', dashed: true },
    { start: 'qr', end: 'charger', color: 'data', dashed: true },
    { start: 'charger', end: 'server', color: 'data', dashed: false },
    { start: 'server', end: 'cpo', color: 'data', dashed: false },
    { start: 'user', end: 'wallet_user', color: 'money', dashed: true },
    { start: 'wallet_user', end: 'payment', color: 'money', dashed: false },
    { start: 'payment', end: 'server', color: 'money', dashed: false },
];

const b2bLinks: LinkType[] = [
    { start: 'user', end: 'qr', color: 'data', dashed: true },
    { start: 'qr', end: 'charger', color: 'data', dashed: true },
    { start: 'charger', end: 'server', color: 'data', dashed: false },
    { start: 'server', end: 'cpo1', color: 'data', dashed: false },
    { start: 'user', end: 'wallet_user', color: 'money', dashed: true },
    { start: 'wallet_user', end: 'payment', color: 'money', dashed: false },
    { start: 'payment', end: 'server', color: 'money', dashed: false },
    { start: 'cpo1', end: 'wallet_cpo', color: 'revenue', dashed: false },
    { start: 'wallet_cpo', end: 'admin', color: 'revenue', dashed: false },
    { start: 'cpo1', end: 'admin', color: 'data', dashed: false, curveOffset: [0, 0, -2] },
    { start: 'cpo2', end: 'admin', color: 'data', dashed: false, curveOffset: [0, 3, -1] },
    { start: 'cpo2', end: 'admin', color: 'revenue', dashed: false, curveOffset: [0, -3, -1] },
    { start: 'cpo3', end: 'admin', color: 'data', dashed: false, curveOffset: [0, 3, -1] },
    { start: 'cpo3', end: 'admin', color: 'revenue', dashed: false, curveOffset: [0, -3, -1] },
];

const flowColor = (role: string) => {
    if (role === 'data') return GOLD_BRIGHT;
    if (role === 'money') return GOLD_AMBER;
    if (role === 'revenue') return GOLD_DEEP;
    return GOLD_BRIGHT;
};

const ArrowHead = ({ mid, end, color }: { mid: [number, number, number], end: [number, number, number], color: string }) => {
    const hex = flowColor(color);
    const midVec = new THREE.Vector3(...mid);
    const endVec = new THREE.Vector3(...end);

    const direction = new THREE.Vector3().subVectors(endVec, midVec).normalize();
    const arrowPos = endVec.clone().sub(direction.clone().multiplyScalar(2.2));

    if (direction.lengthSq() === 0) direction.set(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    return (
        <mesh position={arrowPos} quaternion={quaternion}>
            <coneGeometry args={[0.28, 0.9, 14]} />
            <meshBasicMaterial color={hex} />
        </mesh>
    );
};

interface EdgeProps {
    startPos: [number, number, number];
    endPos: [number, number, number];
    color: string;
    dashed: boolean;
    curveOffset?: [number, number, number];
}

const Edge = ({ startPos, endPos, color, dashed, curveOffset = [0, 0, 0] }: EdgeProps) => {
    const lineRef = useRef<any>(null);

    const midPos: [number, number, number] = [
        (startPos[0] + endPos[0]) / 2 + curveOffset[0],
        (startPos[1] + endPos[1]) / 2 + curveOffset[1],
        (startPos[2] + endPos[2]) / 2 + curveOffset[2],
    ];

    const hex = flowColor(color);

    useFrame((_, delta) => {
        if (lineRef.current && lineRef.current.material) {
            lineRef.current.material.dashOffset -= delta * (dashed ? 2 : 4);
        }
    });

    return (
        <group>
            <QuadraticBezierLine
                ref={lineRef}
                start={startPos}
                end={endPos}
                mid={midPos}
                color={hex}
                lineWidth={3}
                dashed={true}
                dashScale={5}
                dashSize={dashed ? 0.5 : 2}
                gapSize={dashed ? 0.5 : 0.2}
            />
            <ArrowHead mid={midPos} end={endPos} color={color} />
        </group>
    );
};

const NodeCard = ({ node }: { node: any }) => {
    return (
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
            <group position={node.pos}>
                <RoundedBox args={[4, 2, 0.2]} radius={0.12} smoothness={4}>
                    <meshPhysicalMaterial
                        color="#2a1f18"
                        metalness={0.75}
                        roughness={0.28}
                        transmission={0.35}
                        opacity={0.95}
                        transparent
                        clearcoat={0.6}
                        clearcoatRoughness={0.2}
                    />
                    <Edges scale={1.01} threshold={15} color={node.color} />
                </RoundedBox>

                <Html transform distanceFactor={10} position={[0, 0, 0.11]} center zIndexRange={[100, 0]}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '160px',
                            color: CREAM,
                            pointerEvents: 'none',
                            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                            textShadow: `0 0 12px ${node.color}`,
                        }}
                    >
                        <node.icon
                            size={32}
                            color={node.color}
                            style={{
                                marginBottom: '8px',
                                filter: `drop-shadow(0 0 10px ${node.color})`,
                            }}
                        />
                        <span
                            style={{
                                fontSize: '13px',
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                textAlign: 'center',
                            }}
                        >
                            {node.label}
                        </span>
                    </div>
                </Html>
            </group>
        </Float>
    );
};

const Scene = ({ type }: DiagramProps) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
            groupRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.1) * 0.02;
        }
    });

    const nodes = type === 'B2C' ? b2cNodes : b2bNodes;
    const links = type === 'B2C' ? b2cLinks : b2bLinks;

    const getNodePos = (id: string): [number, number, number] => {
        const node = nodes.find(n => n.id === id);
        if (node && node.pos.length === 3) {
            return [node.pos[0], node.pos[1], node.pos[2]];
        }
        return [0, 0, 0];
    };

    return (
        <group ref={groupRef} position={[type === 'B2B' ? -2 : 0, 0, 0]}>
            {links.map((link, i) => (
                <Edge
                    key={i}
                    startPos={getNodePos(link.start)}
                    endPos={getNodePos(link.end)}
                    color={link.color}
                    dashed={link.dashed}
                    curveOffset={link.curveOffset}
                />
            ))}
            {nodes.map(node => (
                <NodeCard key={node.id} node={node} />
            ))}
            <Sparkles count={180} scale={30} size={2.2} speed={0.35} opacity={0.35} color={GOLD_BRIGHT} />
        </group>
    );
};

const legendRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
};

const legendLineStyle = (color: string): React.CSSProperties => ({
    width: '26px',
    height: '3px',
    borderRadius: '999px',
    background: color,
    boxShadow: `0 0 10px ${color}`,
});

export default function Diagram3D({ type }: DiagramProps) {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: 'radial-gradient(ellipse at center, #2a1f18 0%, #1a1210 65%, #120a08 100%)',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'move',
            }}
        >
            <Canvas camera={{ position: [4, 0, 28], fov: 45 }}>
                <color attach="background" args={['#1a1210']} />
                <ambientLight intensity={0.35} />
                <directionalLight position={[10, 20, 15]} intensity={1.4} color="#fff5d6" />
                <pointLight position={[-10, -10, -10]} intensity={0.4} color="#C07F00" />
                <pointLight position={[0, 0, 10]} intensity={0.3} color="#FFD95A" />

                <Scene type={type} />

                <EffectComposer>
                    <Bloom luminanceThreshold={0.18} mipmapBlur intensity={1.6} />
                </EffectComposer>

                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={10}
                    maxDistance={50}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 4}
                />
            </Canvas>

            {/* Legend */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '18px',
                    right: '18px',
                    background: 'rgba(26, 18, 16, 0.82)',
                    WebkitBackdropFilter: 'blur(10px)',
                    backdropFilter: 'blur(10px)',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 217, 90, 0.25)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 24px rgba(192, 127, 0, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    pointerEvents: 'none',
                    minWidth: '180px',
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                }}
            >
                <h4
                    style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: GOLD_BRIGHT,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        margin: 0,
                        marginBottom: '2px',
                    }}
                >
                    Flow Legend
                </h4>
                <div style={legendRowStyle}>
                    <div style={legendLineStyle(GOLD_BRIGHT)}></div>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: CREAM }}>Data Flow</span>
                </div>
                <div style={legendRowStyle}>
                    <div style={legendLineStyle(GOLD_AMBER)}></div>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: CREAM }}>Money Flow</span>
                </div>
                <div style={legendRowStyle}>
                    <div style={legendLineStyle(GOLD_DEEP)}></div>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: CREAM }}>Revenue Flow</span>
                </div>
                <div
                    style={{
                        ...legendRowStyle,
                        marginTop: '4px',
                        paddingTop: '10px',
                        borderTop: '1px solid rgba(255, 217, 90, 0.18)',
                    }}
                >
                    <div
                        style={{
                            width: '26px',
                            borderTop: `2px dashed ${GOLD_BRIGHT}`,
                            opacity: 0.7,
                        }}
                    ></div>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255, 247, 212, 0.7)' }}>
                        Indirect / Scan
                    </span>
                </div>
                <div
                    style={{
                        marginTop: '6px',
                        fontSize: '9px',
                        color: 'rgba(255, 247, 212, 0.5)',
                        fontWeight: 500,
                        textAlign: 'center',
                        letterSpacing: '0.03em',
                    }}
                >
                    Drag to rotate • Scroll to zoom
                </div>
            </div>
        </div>
    );
}
