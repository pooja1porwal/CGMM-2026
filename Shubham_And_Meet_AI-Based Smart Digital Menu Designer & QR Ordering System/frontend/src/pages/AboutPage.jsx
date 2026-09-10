import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { 
  ChefHat, 
  Sparkles, 
  QrCode, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Smartphone, 
  ArrowRight, 
  RotateCw, 
  Pause, 
  Play, 
  Eye, 
  CheckCircle2, 
  Globe, 
  Heart, 
  Compass,
  Flame,
  ChevronRight,
  Code2,
  Palette
} from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import DarkModeToggle from '../components/DarkModeToggle';

export default function AboutPage() {
  const { isDark, toggle } = useDarkMode();
  const canvasContainerRef = useRef(null);
  
  // 3D Scene states
  const [isRotating, setIsRotating] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'innovations' | 'architecture'

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);

    // 3. Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL not supported:', e);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf97316, 2.2); // Warm orange key
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4); // Cool cyan fill
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xfbbf24, 2.0, 10);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // 5. Main 3D Floating Object Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ── Centerpiece: Floating 3D Tablet / Smart Menu Device ──
    const deviceGroup = new THREE.Group();

    // Device Body (Sleek slate chassis)
    const chassisGeo = new THREE.BoxGeometry(2.0, 2.8, 0.12);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25,
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    deviceGroup.add(chassisMesh);

    // Glowing Border Bezel
    const bezelGeo = new THREE.BoxGeometry(2.05, 2.85, 0.08);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xea580c,
      emissiveIntensity: 0.35,
      roughness: 0.4,
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.z = -0.01;
    deviceGroup.add(bezelMesh);

    // Screen with dynamic Canvas Texture
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 716;
    const ctx = screenCanvas.getContext('2d');

    function drawScreenContent() {
      // Dark glass gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 716);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 716);

      // Header Bar
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.roundRect(40, 40, 70, 70, 16);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('SmartMenu', 130, 85);
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Interactive 3D Dining', 130, 115);

      // Card 1 (Food Item with 3D Tag)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(40, 150, 432, 160, 20);
      ctx.fill();

      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.roundRect(60, 175, 110, 110, 16);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '50px sans-serif';
      ctx.fillText('🍲', 85, 250);

      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('Veg Spring Rolls', 190, 205);
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#f97316';
      ctx.fillText('₹220  •  ⭐ 4.9', 190, 240);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('⚡ 3D Interactive View', 190, 275);

      // Card 2 (QR Fast Ordering)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(40, 335, 432, 160, 20);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(60, 360, 110, 110, 16);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '50px sans-serif';
      ctx.fillText('📱', 85, 435);

      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('Touchless QR Scan', 190, 390);
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Instant Mobile Ordering', 190, 425);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('✓ Live Kitchen Sync', 190, 460);

      // Bottom Bar
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.roundRect(40, 530, 432, 70, 20);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('EXPLORE FULL MENU', 256, 575);
      ctx.textAlign = 'left';
    }
    drawScreenContent();

    const screenTex = new THREE.CanvasTexture(screenCanvas);
    screenTex.colorSpace = THREE.SRGBColorSpace;
    const screenGeo = new THREE.PlaneGeometry(1.88, 2.68);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.065;
    deviceGroup.add(screenMesh);

    rootGroup.add(deviceGroup);

    // ── Orbiting Satellite Nodes ──
    const satellites = [];

    // Node 1: Glowing 3D QR Code Cube
    const qrCubeGeo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
    const qrCubeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    });
    const qrNode = new THREE.Mesh(qrCubeGeo, qrCubeMat);
    rootGroup.add(qrNode);
    satellites.push({ mesh: qrNode, radius: 2.1, speed: 1.2, angle: 0, yOffset: 0.4 });

    // Node 2: Golden Cloche Dome (Food Quality)
    const domeGeo = new THREE.SphereGeometry(0.3, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.15,
    });
    const domeNode = new THREE.Mesh(domeGeo, domeMat);
    rootGroup.add(domeNode);
    satellites.push({ mesh: domeNode, radius: 2.2, speed: 0.9, angle: 2.1, yOffset: -0.5 });

    // Node 3: AI Sparkle Octahedron
    const aiGeo = new THREE.OctahedronGeometry(0.32);
    const aiMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xdb2777,
      emissiveIntensity: 0.7,
      roughness: 0.3,
      metalness: 0.6,
    });
    const aiNode = new THREE.Mesh(aiGeo, aiMat);
    rootGroup.add(aiNode);
    satellites.push({ mesh: aiNode, radius: 1.9, speed: 1.4, angle: 4.2, yOffset: 0.7 });

    // ── Floating Culinary Starfield Particles ──
    const particleCount = 180;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Interactive Mouse Parallax ──
    let targetRotY = 0;
    let targetRotX = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isPointerDragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;

      if (isPointerDragging) {
        const deltaX = e.clientX - lastPointerX;
        const deltaY = e.clientY - lastPointerY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.006;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
      }
    };

    const handlePointerDown = (e) => {
      isPointerDragging = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      container.style.cursor = 'grabbing';
    };

    const handlePointerUp = () => {
      isPointerDragging = false;
      container.style.cursor = 'grab';
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // ── Animation Loop ──
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Gentle floating hover
      deviceGroup.position.y = Math.sin(elapsed * 1.8) * 0.12;

      // Auto Turntable or Parallax lerp
      if (isRotating && !isPointerDragging) {
        rootGroup.rotation.y += delta * 0.55;
        rootGroup.rotation.x = THREE.MathUtils.lerp(rootGroup.rotation.x, mouseY * 0.25, 0.05);
      } else if (isPointerDragging) {
        rootGroup.rotation.y = THREE.MathUtils.lerp(rootGroup.rotation.y, targetRotY, 0.1);
        rootGroup.rotation.x = THREE.MathUtils.lerp(rootGroup.rotation.x, targetRotX, 0.1);
      } else {
        rootGroup.rotation.y = THREE.MathUtils.lerp(rootGroup.rotation.y, mouseX * 0.45, 0.05);
        rootGroup.rotation.x = THREE.MathUtils.lerp(rootGroup.rotation.x, mouseY * 0.35, 0.05);
      }

      // Orbit satellite nodes
      satellites.forEach((sat) => {
        sat.angle += delta * sat.speed;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
        sat.mesh.position.y = sat.yOffset + Math.sin(elapsed * 2.5 + sat.angle) * 0.15;
        sat.mesh.rotation.x += 0.02;
        sat.mesh.rotation.y += 0.03;
      });

      // Drift particle aura
      particles.rotation.y = elapsed * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize handler ──
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      chassisGeo.dispose();
      chassisMat.dispose();
      bezelGeo.dispose();
      bezelMat.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      screenTex.dispose();
      qrCubeGeo.dispose();
      qrCubeMat.dispose();
      domeGeo.dispose();
      domeMat.dispose();
      aiGeo.dispose();
      aiMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [isRotating]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-950 to-gray-950 text-white selection:bg-primary-500 selection:text-white">
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/6 left-1/4 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[130px]" />
        <div className="absolute top-3/4 left-1/3 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[120px]" />
      </div>

      {/* ── Top Navigation Bar ──────────────────────────────── */}
      <header className="relative z-20 flex items-center justify-between px-6 lg:px-16 py-5 border-b border-white/5 bg-gray-950/60 backdrop-blur-xl sticky top-0">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-amber-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-white group-hover:text-primary-400 transition-colors">
            SmartMenu
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-primary-400 bg-primary-500/10 border border-primary-500/20"
          >
            About Project
          </Link>
          <Link
            to="/menu/urban-spice"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            Live Demo
          </Link>
          <DarkModeToggle isDark={isDark} toggle={toggle} />
          <Link to="/login" className="btn-primary text-sm px-4 py-2">
            Sign In
          </Link>
        </div>
      </header>

      {/* ── Hero Section with Interactive 3D WebGL Canvas ─────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 shadow-inner">
              <Sparkles className="w-4 h-4 text-primary-400 animate-pulse" />
              <span className="text-xs font-semibold text-primary-300 uppercase tracking-wider">
                Next-Gen Restaurant Tech • Engineering Innovation
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-tight">
              Reinventing Dining with{' '}
              <span className="bg-gradient-to-r from-primary-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                Interactive 3D
              </span>{' '}
              QR Menus
            </h1>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl">
              SmartMenu is a next-generation contactless restaurant operating platform that bridges physical hospitality 
              with cutting-edge digital experiences. Designed to replace static laminated menus with interactive 
              3D food previews, instant QR ordering, AI culinary copywriting, and real-time kitchen orchestration.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero App Downloads</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-primary-400" />
                <span>360° 3D Food Showcase</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Live Kitchen Sync</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/menu/urban-spice"
                className="btn-primary px-6 py-3 text-sm flex items-center gap-2 shadow-xl shadow-primary-500/25"
              >
                Experience Live Customer Menu <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all flex items-center gap-2"
              >
                Create Restaurant Free
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive 3D WebGL Canvas Stage */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[480px] bg-gradient-to-b from-slate-900/90 to-gray-950/90 rounded-3xl border border-white/15 shadow-2xl shadow-primary-500/10 overflow-hidden p-2 group">
              {/* 3D WebGL Mount */}
              <div 
                ref={canvasContainerRef} 
                className="w-full h-full cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden"
                title="Click & drag to tilt 3D scene"
              />

              {/* Floating 3D Controls Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-2 bg-gray-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-bold tracking-wider text-gray-200 uppercase">
                    Three.js WebGL Live
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsRotating(prev => !prev)}
                  className="pointer-events-auto p-2 rounded-xl bg-gray-950/80 backdrop-blur-md border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors shadow-lg"
                  title={isRotating ? 'Pause 3D Turntable' : 'Play 3D Turntable'}
                >
                  {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              {/* Bottom Hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 text-[11px] text-gray-400">
                Drag to rotate 3D device • Move mouse to tilt
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Impact Metrics in 3D Style ──────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { metric: '< 1s', label: 'Scan-to-Menu Time', sub: 'Instant mobile loading' },
            { metric: '100%', label: 'Contactless & Clean', sub: 'Zero physical touches' },
            { metric: '40%', label: 'Faster Order Turnaround', sub: 'Direct to kitchen line' },
            { metric: '360°', label: 'Visual 3D Inspection', sub: 'High customer trust' },
          ].map((stat, i) => (
            <div
              key={i}
              className="relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-md hover:border-primary-500/40 hover:scale-[1.02] transition-all duration-300 shadow-xl group overflow-hidden"
              style={{ transform: 'perspective(600px) rotateX(2deg)' }}
            >
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary-500/10 rounded-full blur-xl group-hover:bg-primary-500/20 transition-all" />
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-amber-300 font-display">
                {stat.metric}
              </div>
              <div className="text-sm font-bold text-white mt-1.5">{stat.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Interactive 3D Showcase Sections (Tabs) ─────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-12 flex-wrap">
          {[
            { id: 'overview', label: 'Project Overview & Mission', icon: Compass },
            { id: 'innovations', label: 'Core 3D & AI Innovations', icon: Sparkles },
            { id: 'architecture', label: 'Engineering Architecture', icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-amber-500 text-white shadow-lg shadow-primary-500/25 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview & Mission */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
            <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:border-primary-500/30 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-primary-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">The Challenge</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Traditional dining suffers from outdated paper menus that get damaged, high printing costs whenever 
                prices or seasonal items change, long wait times during peak hours, and guests having zero visual 
                clarity on dish portion sizes or presentation.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:border-primary-500/30 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-rose-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">The Smart Solution</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                SmartMenu provides a complete end-to-end digital ecosystem. Guests scan a table-specific QR code to 
                explore interactive 3D dishes, customize spice levels, and place orders directly to the kitchen display 
                in seconds, reducing staff fatigue and doubling turnaround.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:border-primary-500/30 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">The Future of Dining</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Bridging food with spatial computing and AI. By enabling 360° interactive dish previews right in the 
                browser without any app installation, customers dine with heightened sensory excitement and confidence.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Core 3D & AI Innovations */}
        {activeTab === 'innovations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {[
              {
                icon: Eye,
                title: '360° Interactive 3D Dish Viewport',
                desc: 'Photorealistic WebGL rendering allows diners to orbit, zoom, and inspect dishes from any culinary perspective.',
                badge: 'Three.js Powered',
                color: 'from-primary-500 to-amber-500',
              },
              {
                icon: Sparkles,
                title: 'AI Gourmet Menu Copywriter',
                desc: 'Integrated with Google Gemini to generate mouthwatering dish descriptions, allergens, and pairing suggestions with 1 click.',
                badge: 'GenAI Engine',
                color: 'from-amber-500 to-rose-500',
              },
              {
                icon: QrCode,
                title: 'Smart Table-Aware QR Codes',
                desc: 'Instant QR generation linking directly to specific tables with automated routing to the kitchen display.',
                badge: 'Zero-App Install',
                color: 'from-sky-500 to-cyan-500',
              },
              {
                icon: Layers,
                title: 'Live Kitchen Display System (KDS)',
                desc: 'WebSockets push orders in real time to the chef station with audio chimes, status progression, and timer tracking.',
                badge: 'WebSocket Sync',
                color: 'from-emerald-500 to-teal-500',
              },
              {
                icon: Palette,
                title: 'Multi-Atmosphere Menu Themes',
                desc: 'Dynamically switch customer menus between Modern, Warm Bistro, Cyber Neon, and Minimalist styling in real-time.',
                badge: 'Dynamic CSS Engine',
                color: 'from-indigo-500 to-purple-500',
              },
              {
                icon: ShieldCheck,
                title: 'Integrated Razorpay Payments',
                desc: 'Secure digital checkout supporting UPI, Credit Cards, Net Banking, and Pay-at-Counter workflows.',
                badge: 'PCI Compliant',
                color: 'from-rose-500 to-pink-500',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-primary-500/40 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                  style={{ transform: 'perspective(800px)' }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[11px] font-bold text-primary-300 bg-primary-500/10 border border-primary-500/20 px-2.5 py-1 rounded-full">
                        {item.badge}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Engineering Architecture */}
        {activeTab === 'architecture' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Frontend Card */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Frontend Client</h4>
                    <span className="text-xs text-sky-400">React 18 & Vite</span>
                  </div>
                </div>
                <ul className="text-xs text-gray-300 space-y-2 border-t border-white/5 pt-3">
                  <li>• React 18 with modern hooks</li>
                  <li>• Three.js WebGL 3D Rendering</li>
                  <li>• TailwindCSS Utility System</li>
                  <li>• DnD Kit for drag-and-drop</li>
                  <li>• Lucide Modern Iconography</li>
                </ul>
              </div>

              {/* Backend Card */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Backend API</h4>
                    <span className="text-xs text-emerald-400">FastAPI & Python 3.11</span>
                  </div>
                </div>
                <ul className="text-xs text-gray-300 space-y-2 border-t border-white/5 pt-3">
                  <li>• High-concurrency Async Architecture</li>
                  <li>• RESTful CRUD endpoints with Pydantic</li>
                  <li>• JWT Auth & bcrypt password hashing</li>
                  <li>• Native WebSockets for instant KDS events</li>
                  <li>• Automated schema migrations</li>
                </ul>
              </div>

              {/* Database & Storage Card */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Data & Persistence</h4>
                    <span className="text-xs text-amber-400">SQLAlchemy & SQLite/PG</span>
                  </div>
                </div>
                <ul className="text-xs text-gray-300 space-y-2 border-t border-white/5 pt-3">
                  <li>• SQLAlchemy ORM relational models</li>
                  <li>• Dynamic table seeding & fallback repair</li>
                  <li>• Order transactions & audit trails</li>
                  <li>• Optimized media storage & lookup</li>
                  <li>• Production PostgreSQL ready</li>
                </ul>
              </div>

              {/* AI & Cloud Services Card */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">AI & Gateways</h4>
                    <span className="text-xs text-purple-400">Gemini & Razorpay</span>
                  </div>
                </div>
                <ul className="text-xs text-gray-300 space-y-2 border-t border-white/5 pt-3">
                  <li>• Google Gemini AI Menu Generation</li>
                  <li>• Razorpay Payment Gateway integration</li>
                  <li>• Dynamic QR Code SVG encoding</li>
                  <li>• Production deployment on Render & Vercel</li>
                  <li>• CORS & security hardening</li>
                </ul>
              </div>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-gray-900/90 via-slate-900/90 to-gray-900/90 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-primary-400 uppercase tracking-wider">
                <Code2 className="w-4 h-4" />
                <span>End-to-End System Pipeline</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-2xl mb-1 block">📱</span>
                  <div className="text-xs font-bold text-white">Diner Scans QR</div>
                  <div className="text-[10px] text-gray-400 mt-1">Loads 3D WebGL Menu instantly on mobile</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-2xl mb-1 block">✨</span>
                  <div className="text-xs font-bold text-white">Inspect & Order</div>
                  <div className="text-[10px] text-gray-400 mt-1">Cart management & online payment option</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-2xl mb-1 block">⚡</span>
                  <div className="text-xs font-bold text-white">WebSocket Relay</div>
                  <div className="text-[10px] text-gray-400 mt-1">FastAPI pushes order live to kitchen in &lt;100ms</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-2xl mb-1 block">🍳</span>
                  <div className="text-xs font-bold text-white">Kitchen Prepares</div>
                  <div className="text-[10px] text-gray-400 mt-1">Status updates live on customer order tracker</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Project Context & Team Story ───────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="p-6 sm:p-12 rounded-3xl bg-gradient-to-br from-primary-950/40 via-slate-900/70 to-gray-950/90 border border-primary-500/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 text-xs font-bold text-primary-300">
              <ChefHat className="w-3.5 h-3.5" /> Culinary Technology Platform
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-display text-white">
              Built with Passion for Modern Culinary Engineering
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              This platform was conceived and engineered to bridge physical dining with spatial computing. The vision is to 
              deliver enterprise-grade software architecture capable of running in real restaurants while exploring 
              the future of immersive WebGL 3D food presentation and generative AI.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div>
                <div className="text-xs text-gray-400 font-mono uppercase">Developer</div>
                <div className="text-base font-bold text-white mt-0.5">Shubham Maurya</div>
                <div className="text-xs text-primary-400">Software & Full-Stack Engineer</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-mono uppercase">Technologies</div>
                <div className="text-base font-bold text-white mt-0.5">Three.js • React • FastAPI</div>
                <div className="text-xs text-gray-400">Python 3.11 & Modern WebGL</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-mono uppercase">Deployment</div>
                <div className="text-base font-bold text-white mt-0.5">Cloud Ready</div>
                <div className="text-xs text-emerald-400">Render (API) & Vercel (UI)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ready to Elevate Your Restaurant CTA ─────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
          Experience the Future of Dining Today
        </h2>
        <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
          Explore the live demo menu as a guest, or launch your restaurant's digital 3D menu in minutes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/menu/urban-spice" className="btn-primary px-8 py-3.5 text-base flex items-center gap-2">
            View Live Customer Demo <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/register" className="btn-secondary px-8 py-3.5 text-base bg-white/5 border-white/10 text-white hover:bg-white/10">
            Sign Up Free
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/10 py-8 sm:py-10 px-4 sm:px-6 text-center text-sm text-gray-500 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/about" className="hover:text-white transition-colors text-primary-400 font-medium">About Project</Link>
          <Link to="/menu/urban-spice" className="hover:text-white transition-colors">Live Demo</Link>
          <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
        </div>
        <p className="text-xs text-gray-500">© 2026 SmartMenu — Smart Digital Menu Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
