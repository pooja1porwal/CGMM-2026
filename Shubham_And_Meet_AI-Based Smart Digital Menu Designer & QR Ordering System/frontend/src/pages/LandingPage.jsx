import { Link } from 'react-router-dom';
import { 
  ChefHat, 
  QrCode, 
  Sparkles, 
  Palette, 
  ArrowRight, 
  Star, 
  Box, 
  Eye, 
  Zap, 
  CheckCircle2, 
  Layers, 
  Smartphone,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import DarkModeToggle from '../components/DarkModeToggle';
import Hero3DScene from '../components/Hero3DScene';

const features = [
  { 
    icon: Eye, 
    title: '360° Interactive 3D Visuals', 
    desc: 'Powered by Three.js WebGL. Diners inspect dishes from any angle with real-time soft shadows and culinary shaders.',
    badge: 'Computer Graphics',
    color: 'from-orange-500 to-amber-500'
  },
  { 
    icon: Sparkles, 
    title: 'AI-Powered Menu Designer', 
    desc: 'Generate mouthwatering dish descriptions, allergen tags, and pairings with Google Gemini AI assistance.',
    badge: 'GenAI Engine',
    color: 'from-amber-500 to-rose-500'
  },
  { 
    icon: QrCode, 
    title: 'Contactless QR Code Ordering', 
    desc: 'Zero app downloads needed. Diners scan table QR codes and order dishes directly from their mobile browser.',
    badge: 'Frictionless',
    color: 'from-sky-500 to-cyan-500'
  },
  { 
    icon: Layers, 
    title: 'Live Kitchen Display (KDS)', 
    desc: 'Real-time order synchronization delivers tickets instantly to kitchen staff with live status progression.',
    badge: 'Real-Time Sync',
    color: 'from-emerald-500 to-teal-500'
  },
];

export default function LandingPage() {
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/60 via-white to-orange-50/50 dark:from-gray-950 dark:via-slate-950 dark:to-gray-950 text-gray-900 dark:text-white transition-colors duration-300 selection:bg-primary-500 selection:text-white overflow-x-hidden">
      {/* Floating ambient glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-amber-500/10 dark:bg-amber-600/10 rounded-full blur-[120px]" />
      </div>

      {/* ── Navbar ───────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4 sm:py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 via-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-black font-display tracking-tight text-gray-900 dark:text-white">SmartMenu</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-500/10 border border-primary-500/20 px-2 py-0.5 rounded-full">
              3D Interactive
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            to="/about" 
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            <Info className="w-4 h-4 text-primary-500" />
            <span>About Project</span>
          </Link>
          
          <DarkModeToggle isDark={isDark} toggle={toggle} />
          
          <Link 
            to="/login" 
            className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Sign In
          </Link>
          
          <Link 
            to="/register" 
            className="btn-primary text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 shadow-md shadow-primary-500/25"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* ── Hero Section with Interactive 3D Dish Showcase ────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 sm:pt-10 pb-12 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-700 dark:text-primary-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              <span>3D Computer Graphics Culinary Engine</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display leading-[1.1] tracking-tight text-gray-900 dark:text-white">
              Experience Food in{' '}
              <span className="bg-gradient-to-r from-primary-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Interactive 3D
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Transform traditional static food menus into interactive WebGL dining experiences. 
              Let diners inspect dishes from every angle with real-time soft shadows, ingredient controls, and touchless QR ordering.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1">
              <Link 
                to="/register" 
                className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 justify-center shadow-xl shadow-primary-500/25 group"
              >
                <span>Create Restaurant Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/menu/urban-spice" 
                className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 justify-center bg-white/80 dark:bg-white/5 border-gray-200/80 dark:border-white/10 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 shadow-sm"
              >
                <span>View Live Demo</span>
              </Link>
            </div>

            {/* Quick Feature Highlights */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                360° Dish Inspection
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Instant QR Ordering
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Zero App Download
              </span>
            </div>
          </div>

          {/* Right Column: The 3D Interactive Stage Component */}
          <div className="lg:col-span-7 w-full">
            <Hero3DScene />
          </div>
        </div>
      </section>

      {/* ── Impact Metrics ───────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            { metric: '60 FPS', label: 'Smooth 3D Graphics', sub: 'WebGL accelerated' },
            { metric: '< 1s', label: 'Scan-to-Menu Time', sub: 'Instant mobile loading' },
            { metric: '40%', label: 'Faster Turnaround', sub: 'Direct kitchen routing' },
            { metric: '100%', label: 'Contactless & Clean', sub: 'Zero physical touches' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-2xl bg-white/75 dark:bg-white/[0.04] border border-orange-100 dark:border-white/10 backdrop-blur-md hover:border-primary-500/40 hover:scale-[1.02] transition-all duration-300 shadow-sm dark:shadow-xl"
            >
              <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-amber-500 font-display">
                {stat.metric}
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mt-1">{stat.label}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
            Intelligent Dining Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-gray-900 dark:text-white">
            Built for Modern High-Growth Restaurants
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            Everything your restaurant needs to boost guest satisfaction, reduce staff labor, and showcase your cuisine in high definition.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-2xl bg-white/75 dark:bg-white/[0.04] border border-orange-100 dark:border-white/10 hover:border-primary-500/40 hover:-translate-y-1 transition-all duration-300 group shadow-sm dark:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-primary-600 dark:text-primary-300 bg-primary-500/10 border border-primary-500/20 px-2 py-0.5 rounded-full">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1.5">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Call to Action Banner ────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 pb-14 sm:pb-20">
        <div className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary-500 via-amber-500 to-orange-600 text-white text-center shadow-2xl shadow-primary-500/25 space-y-4 sm:space-y-6 relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display">
              Ready to Upgrade Your Restaurant with 3D Menus?
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
              Join the revolution in digital hospitality. Create your dynamic restaurant menu, customize templates, and print table QR codes in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
              <Link 
                to="/register" 
                className="px-6 sm:px-8 py-3 rounded-xl font-bold bg-gray-950 text-white hover:bg-gray-900 shadow-xl transition-all text-sm sm:text-base text-center"
              >
                Create Restaurant Free
              </Link>
              <Link 
                to="/about" 
                className="px-6 sm:px-8 py-3 rounded-xl font-semibold bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md transition-all text-sm sm:text-base text-center"
              >
                Learn About Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Clean Professional Footer (Zero BTech mentions) ───── */}
      <footer className="relative z-10 border-t border-gray-200/70 dark:border-white/10 py-8 px-4 sm:px-6 text-center transition-colors">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-primary-500 transition-colors font-medium">About Project</Link>
          <Link to="/menu/urban-spice" className="hover:text-primary-500 transition-colors">Live Demo</Link>
          <Link to="/login" className="hover:text-primary-500 transition-colors">Sign In</Link>
          <Link to="/register" className="hover:text-primary-500 transition-colors">Register</Link>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2026 SmartMenu — Modern Contactless QR Dining & Interactive 3D Visuals. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
