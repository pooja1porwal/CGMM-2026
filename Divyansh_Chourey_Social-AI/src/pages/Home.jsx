import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MessageSquare, 
  Heart, 
  Share2, 
  Bookmark, 
  Sparkles,
  Layers,
  Code2,
  Cpu,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const Home = () => {
  return (
    <div className="w-full flex flex-col items-center transition-colors duration-200">
      {/* 1. Refined Editorial Hero (Without AquaPure card & with Divyansh Chourey branding) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-16 sm:pb-24 border-b border-[#E5E2DC] dark:border-[#262626]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Studio & Creator Tag */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE7E0] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] text-xs font-mono tracking-wider uppercase text-[#171717] dark:text-[#F5F5F0]">
            <span className="w-2 h-2 rounded-full bg-[#FF5A36]"></span>
            <span>Social AI · Creative Campaign Studio</span>
            <span className="text-[#9C9990] dark:text-[#666666]">/</span>
            <span className="font-semibold text-[#FF5A36]">Developed by Divyansh Chourey</span>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-extrabold text-[#171717] dark:text-[#F5F5F0] tracking-tight leading-[1.08]">
            From product idea to{' '}
            <span className="font-serif italic font-normal text-[#FF5A36]">
              campaign-ready.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#737067] dark:text-[#A09D95] max-w-2xl mx-auto font-normal leading-relaxed">
            Generate multi-tone captions, visual art direction concepts, and short-form video storyboards from a single product brief. Built for modern marketing workflows.
          </p>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white bg-[#FF5A36] hover:bg-[#E54724] active:scale-95 transition-all shadow-paper"
            >
              <span>Create a Campaign</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/campaigns"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-sm font-medium text-[#171717] dark:text-[#F5F5F0] bg-white dark:bg-[#1E1E1E] hover:bg-[#F0EFEA] dark:hover:bg-[#282828] border border-[#E5E2DC] dark:border-[#2E2E2E] transition-all"
            >
              <span>View Campaigns</span>
            </Link>
          </div>

          {/* 3 Studio Pillars */}
          <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="editorial-card p-5 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#FF5A36]">01 / COPY</span>
              <h4 className="text-sm font-bold text-[#171717] dark:text-[#F5F5F0]">Multi-Tone Captions</h4>
              <p className="text-xs text-[#737067] dark:text-[#A09D95] leading-relaxed">
                Promotional hooks, storytelling drafts, and professional variations.
              </p>
            </div>

            <div className="editorial-card p-5 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#FF5A36]">02 / VISUALS</span>
              <h4 className="text-sm font-bold text-[#171717] dark:text-[#F5F5F0]">Art Direction Directives</h4>
              <p className="text-xs text-[#737067] dark:text-[#A09D95] leading-relaxed">
                Structured layout concepts, dimensions, and composition guidelines.
              </p>
            </div>

            <div className="editorial-card p-5 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#FF5A36]">03 / SHORT-FORM</span>
              <h4 className="text-sm font-bold text-[#171717] dark:text-[#F5F5F0]">Reel & Shorts Storyboards</h4>
              <p className="text-xs text-[#737067] dark:text-[#A09D95] leading-relaxed">
                Scene-by-scene script sequences, visuals, and voiceover pacing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Process: "Everything starts with a brief." */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-[#E5E2DC] dark:border-[#262626]">
        <div className="max-w-2xl mb-14">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#FF5A36] font-semibold mb-2">
            The Method
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] dark:text-[#F5F5F0] tracking-tight">
            Everything starts with a brief.
          </h2>
          <p className="text-[#737067] dark:text-[#A09D95] text-base mt-2">
            A structured three-step workflow designed to take raw product notes to refined multi-platform creative deliverables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="editorial-card p-8 bg-white dark:bg-[#1A1A1A] relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-bold text-[#171717] dark:text-[#F5F5F0]">01</span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] text-[#737067] dark:text-[#A09D95]">
                Input
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#171717] dark:text-[#F5F5F0] font-sans">Describe</h3>
            <p className="text-sm text-[#737067] dark:text-[#A09D95] leading-relaxed">
              Enter product details, target personas, offer incentives, platform focus, and desired tonal cadence.
            </p>
          </div>

          {/* Step 2 */}
          <div className="editorial-card p-8 bg-white dark:bg-[#1A1A1A] relative space-y-4 border-t-2 border-t-[#FF5A36]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-bold text-[#FF5A36]">02</span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFF1ED] dark:bg-[#331D17] border border-[#FFDCD3] dark:border-[#4D271D] text-[#FF5A36] font-semibold">
                Generate
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#171717] dark:text-[#F5F5F0] font-sans">Generate</h3>
            <p className="text-sm text-[#737067] dark:text-[#A09D95] leading-relaxed">
              The automated workflow orchestrates copywriting, visual direction, hashtag strategy, and storyboard sequencing.
            </p>
          </div>

          {/* Step 3 */}
          <div className="editorial-card p-8 bg-white dark:bg-[#1A1A1A] relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-bold text-[#171717] dark:text-[#F5F5F0]">03</span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] text-[#737067] dark:text-[#A09D95]">
                Output
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#171717] dark:text-[#F5F5F0] font-sans">Refine</h3>
            <p className="text-sm text-[#737067] dark:text-[#A09D95] leading-relaxed">
              Review promotional, creative, and professional caption variations. Copy assets directly or export visual posters.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Asymmetric Magazine Capabilities Grid: "One brief. Multiple pieces of content." */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-[#E5E2DC] dark:border-[#262626]">
        <div className="max-w-2xl mb-14">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#FF5A36] font-semibold mb-2">
            Deliverables
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] dark:text-[#F5F5F0] tracking-tight">
            One brief.{' '}
            <span className="font-serif italic font-normal text-[#171717] dark:text-[#F5F5F0]">
              Multiple pieces of content.
            </span>
          </h2>
          <p className="text-[#737067] dark:text-[#A09D95] text-base mt-2">
            Every run produces an integrated package tailored for conversion and brand consistency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Captions (Span 7) */}
          <div className="md:col-span-7 editorial-card p-8 bg-white dark:bg-[#1A1A1A] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF5A36] font-semibold">
                  Multi-Tone Copy
                </span>
                <span className="text-xs font-mono text-[#737067] dark:text-[#A09D95]">3 Styles</span>
              </div>
              <h3 className="text-2xl font-bold text-[#171717] dark:text-[#F5F5F0]">Captions</h3>
              <p className="text-sm text-[#737067] dark:text-[#A09D95] leading-relaxed max-w-lg">
                Generates high-converting promotional hooks, storytelling-driven engagement copy, and authoritative professional variations tailored to your audience.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#737067] dark:text-[#A09D95] font-mono text-[11px]">
                <span>Promotional Style</span>
                <span className="text-[#171717] dark:text-[#F5F5F0] font-semibold">Ready to copy</span>
              </div>
              <p className="text-[#171717] dark:text-[#F5F5F0] font-medium italic">
                "Meet the timepiece built for precision. 14-day battery life, seamless sync. Claim yours today with 25% off."
              </p>
            </div>
          </div>

          {/* Card 2: Poster Concepts (Span 5) */}
          <div className="md:col-span-5 editorial-card p-8 bg-white dark:bg-[#1A1A1A] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#171717] dark:text-[#F5F5F0] font-semibold">
                  Visual Art
                </span>
                <span className="text-xs font-mono text-[#737067] dark:text-[#A09D95]">Directives</span>
              </div>
              <h3 className="text-2xl font-bold text-[#171717] dark:text-[#F5F5F0]">Poster Concepts</h3>
              <p className="text-sm text-[#737067] dark:text-[#A09D95] leading-relaxed">
                Clear creative directions with composition guidelines, brand color palettes, and high-impact typographic layouts.
              </p>
            </div>

            <div className="h-24 rounded-xl bg-[#EAE5D9] dark:bg-[#252525] border border-[#D9D4C7] dark:border-[#333333] p-3 flex items-center justify-between text-xs font-mono text-[#171717] dark:text-[#F5F5F0]">
              <span>Minimal Focus</span>
              <span className="text-[#FF5A36]">1080 × 1350</span>
            </div>
          </div>

          {/* Card 3: Social Copy & CTAs (Span 5) */}
          <div className="md:col-span-5 editorial-card p-8 bg-white dark:bg-[#1A1A1A] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#171717] dark:text-[#F5F5F0] font-semibold">
                  Conversion
                </span>
                <span className="text-xs font-mono text-[#737067] dark:text-[#A09D95]">Tags & CTAs</span>
              </div>
              <h3 className="text-2xl font-bold text-[#171717] dark:text-[#F5F5F0]">Social Copy</h3>
              <p className="text-sm text-[#737067] dark:text-[#A09D95] leading-relaxed">
                Hashtags calibrated for discovery and high-performing call-to-action options ready for immediate deployment.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] text-[#171717] dark:text-[#F5F5F0]">#CampaignReady</span>
              <span className="px-2.5 py-1 rounded bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] text-[#171717] dark:text-[#F5F5F0]">#DailyDesign</span>
              <span className="px-2.5 py-1 rounded bg-[#FFF1ED] dark:bg-[#331D17] border border-[#FFDCD3] dark:border-[#4D271D] text-[#FF5A36]">Shop Now</span>
            </div>
          </div>

          {/* Card 4: Reel Storyboard (Span 7) */}
          <div className="md:col-span-7 editorial-card p-8 bg-white dark:bg-[#1A1A1A] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF5A36] font-semibold">
                  Short-Form Video
                </span>
                <span className="text-xs font-mono text-[#737067] dark:text-[#A09D95]">Timeline</span>
              </div>
              <h3 className="text-2xl font-bold text-[#171717] dark:text-[#F5F5F0]">Reel Storyboard</h3>
              <p className="text-sm text-[#737067] dark:text-[#A09D95] leading-relaxed max-w-lg">
                Scene-by-scene script breakdowns including visual pacing, on-screen text overlays, audio voiceover scripts, and cut transitions.
              </p>
            </div>

            {/* Mini Timeline Mockup */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#F0EFEA] dark:border-[#262626]">
              <div className="p-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] text-[11px]">
                <p className="font-mono font-bold text-[#171717] dark:text-[#F5F5F0]">01 Hook</p>
                <p className="text-[#737067] dark:text-[#A09D95] text-[10px] mt-0.5">0-2s · Problem</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] text-[11px]">
                <p className="font-mono font-bold text-[#171717] dark:text-[#F5F5F0]">02 Product</p>
                <p className="text-[#737067] dark:text-[#A09D95] text-[10px] mt-0.5">2-5s · Reveal</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] text-[11px]">
                <p className="font-mono font-bold text-[#171717] dark:text-[#F5F5F0]">03 Feature</p>
                <p className="text-[#737067] dark:text-[#A09D95] text-[10px] mt-0.5">5-8s · Value</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FFF1ED] dark:bg-[#331D17] border border-[#FFDCD3] dark:border-[#4D271D] text-[11px]">
                <p className="font-mono font-bold text-[#FF5A36]">04 CTA</p>
                <p className="text-[#FF5A36] text-[10px] mt-0.5">8-10s · Action</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom Studio Action Call with Divyansh Chourey Signature */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="editorial-card p-10 sm:p-16 bg-[#171717] dark:bg-[#1A1A1A] text-white rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden border border-transparent dark:border-[#2E2E2E]">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF5A36] font-semibold">
              Designed & Engineered by Divyansh Chourey
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Launch your next social campaign in minutes.
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-sans">
              Enter your product brief and let the studio assemble multi-channel copy, visual art direction, and video concepts.
            </p>
          </div>

          <Link
            to="/create"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white bg-[#FF5A36] hover:bg-[#E54724] transition-all shadow-paper self-start md:self-auto flex-shrink-0"
          >
            <span>Start a Campaign</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
