import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import ExperienceFlowLogo from '../../assets/experienceflow-logo.svg';

const ITSMSplashScreen = ({ onLogin }) => {
    const mountRef = useRef(null);
    const rendererRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x040a1a);
        scene.fog = new THREE.Fog(0x040a1a, 20, 80);

        const width = mount.clientWidth;
        const height = mount.clientHeight;

        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
        camera.position.set(0, 0, 22);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // ── Central glowing sphere ──────────────────────────────────────────────
        const sphereGeo = new THREE.SphereGeometry(2.5, 64, 64);
        const sphereMat = new THREE.MeshPhongMaterial({
            color: 0x0066ff,
            emissive: 0x0033aa,
            shininess: 120,
            transparent: true,
            opacity: 0.92,
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        scene.add(sphere);

        // Inner bright core
        const coreMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1.4, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0x44aaff, transparent: true, opacity: 0.5 })
        );
        scene.add(coreMesh);

        // ── Rotating rings ──────────────────────────────────────────────────────
        const ringColors = [0x00aaff, 0x7c3aed, 0x00ffcc];
        const rings = ringColors.map((color, i) => {
            const geo = new THREE.TorusGeometry(4 + i * 1.8, 0.06, 16, 120);
            const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.rotation.x = Math.PI / 2 + (i * Math.PI) / 5;
            mesh.rotation.z = (i * Math.PI) / 4;
            scene.add(mesh);
            return mesh;
        });

        // ── Network nodes & edges ───────────────────────────────────────────────
        const nodePositions = [];
        const nodeCount = 36;
        const nodeMeshes = [];
        for (let i = 0; i < nodeCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 7 + Math.random() * 5;
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            nodePositions.push(new THREE.Vector3(x, y, z));

            const nodeGeo = new THREE.SphereGeometry(0.15 + Math.random() * 0.15, 10, 10);
            const nodeMat = new THREE.MeshBasicMaterial({
                color: [0x00aaff, 0x7c3aed, 0x00ffcc, 0xffffff][i % 4],
            });
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            node.position.copy(nodePositions[i]);
            scene.add(node);
            nodeMeshes.push(node);
        }

        // Edges between nearby nodes
        const edgeMat = new THREE.LineBasicMaterial({ color: 0x1155aa, transparent: true, opacity: 0.35 });
        nodePositions.forEach((pos, i) => {
            nodePositions.forEach((pos2, j) => {
                if (j <= i) return;
                if (pos.distanceTo(pos2) < 6.5) {
                    const geo = new THREE.BufferGeometry().setFromPoints([pos, pos2]);
                    scene.add(new THREE.Line(geo, edgeMat));
                }
            });
        });

        // Lines from centre to close nodes
        const linesToCenter = [];
        nodePositions.forEach((pos) => {
            if (pos.length() < 9) {
                const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), pos]);
                const mat = new THREE.LineBasicMaterial({ color: 0x0066ff, transparent: true, opacity: 0.2 });
                const line = new THREE.Line(geo, mat);
                scene.add(line);
                linesToCenter.push(line);
            }
        });

        // ── Floating particles ──────────────────────────────────────────────────
        const particleCount = 600;
        const pPositions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            pPositions[i * 3] = (Math.random() - 0.5) * 60;
            pPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
            pPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
        }
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
        const particles = new THREE.Points(
            pGeo,
            new THREE.PointsMaterial({ color: 0x3388ff, size: 0.12, transparent: true, opacity: 0.6 })
        );
        scene.add(particles);

        // ── Lights ──────────────────────────────────────────────────────────────
        scene.add(new THREE.AmbientLight(0x112244, 1.2));
        const pointLight = new THREE.PointLight(0x0077ff, 3, 30);
        pointLight.position.set(0, 0, 5);
        scene.add(pointLight);
        const purpleLight = new THREE.PointLight(0x7c3aed, 2.5, 25);
        purpleLight.position.set(-8, 6, 0);
        scene.add(purpleLight);

        // ── Animation loop ───────────────────────────────────────────────────────
        let t = 0;
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            t += 0.008;

            // Pulsing sphere
            const pulse = 1 + 0.04 * Math.sin(t * 3);
            sphere.scale.setScalar(pulse);
            coreMesh.scale.setScalar(pulse * 0.95);
            sphere.rotation.y += 0.004;

            // Rotate rings at different speeds/axes
            rings[0].rotation.y += 0.008;
            rings[1].rotation.x += 0.006;
            rings[2].rotation.z += 0.005;
            rings[2].rotation.y += 0.003;

            // Slowly rotate entire node cloud
            nodeMeshes.forEach((n) => {
                n.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.002);
            });

            // Drift particles
            particles.rotation.y += 0.0005;
            particles.rotation.x += 0.0002;

            // Camera gentle orbit
            camera.position.x = 22 * Math.sin(t * 0.12);
            camera.position.z = 22 * Math.cos(t * 0.12);
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };
        animate();

        // Resize handler
        const handleResize = () => {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationRef.current);
            renderer.dispose();
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#040a1a]">
            {/* Three.js canvas */}
            <div ref={mountRef} className="absolute inset-0" />

            {/* Overlay UI */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                {/* Logo / brand */}
                <div className="mb-4 pointer-events-none">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        {/* Logo icon — natural teal colours, no filter */}
                        <img
                            src={ExperienceFlowLogo}
                            alt="ExperienceFlow logo"
                            style={{ height: '48px', width: 'auto' }}
                        />
                        {/* Brand name beside the logo */}
                        <span
                            className="text-3xl font-bold tracking-wide"
                            style={{ color: '#e2e8f0', textShadow: '0 0 30px rgba(0,136,255,0.6)' }}
                        >
                            ExperienceFlow
                        </span>
                    </div>
                    <p
                        className="text-center text-sm tracking-[0.35em] uppercase font-medium"
                        style={{ color: '#64b5f6' }}
                    >
                        ITSM Intelligence Platform
                    </p>
                </div>

                {/* Headline */}
                <h1
                    className="text-5xl md:text-6xl font-extrabold text-center mt-6 leading-tight"
                    style={{
                        background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: 'none',
                    }}
                >
                    AI-Powered
                    <br />
                    ITSM Analytics
                </h1>
                <p
                    className="mt-4 text-base md:text-lg text-center max-w-md"
                    style={{ color: '#94a3b8' }}
                >
                    Real-time delivery intelligence for engineering &amp; operations teams.
                    Predict SLA breaches before they happen.
                </p>

                {/* Stats pills */}
                <div className="flex gap-4 mt-6 flex-wrap justify-center">
                    {[
                        { label: 'DTIF Tracked', value: '96.7%' },
                        { label: 'Tickets Resolved', value: '2.4K' },
                        { label: 'SLA Compliance', value: '98.1%' },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            className="px-4 py-2 rounded-full text-xs font-semibold"
                            style={{
                                background: 'rgba(0,102,255,0.15)',
                                border: '1px solid rgba(0,102,255,0.4)',
                                color: '#93c5fd',
                                backdropFilter: 'blur(6px)',
                            }}
                        >
                            <span style={{ color: '#60a5fa', fontWeight: 700 }}>{value}</span>&nbsp;{label}
                        </div>
                    ))}
                </div>

                {/* Login button */}
                <button
                    onClick={onLogin}
                    className="pointer-events-auto mt-10 px-10 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                        boxShadow: '0 0 40px rgba(37,99,235,0.5), 0 4px 20px rgba(0,0,0,0.5)',
                    }}
                >
                    Get Started →
                </button>

                <p className="mt-4 text-xs" style={{ color: '#475569' }}>
                    Secure enterprise login
                </p>
            </div>
        </div>
    );
};

export default ITSMSplashScreen;
