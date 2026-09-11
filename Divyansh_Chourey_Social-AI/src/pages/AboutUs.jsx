import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Code2, 
  Layers, 
  Zap, 
  CheckCircle2, 
  Cpu, 
  Target, 
  Globe, 
  Rocket,
  User,
  Heart
} from 'lucide-react';

export const AboutUs = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 transition-colors duration-200">
      {/* 1. Header / Hero */}
      <div className="max-w-3xl mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE7E0] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] text-xs font-mono tracking-wider uppercase text-[#171717] dark:text-[#F5F5F0]">
          <span className="w-2 h-2 rounded-full bg-[#FF5A36]"></span>
          <span>Studio Profile</span>
          <span className="text-[#9C9990] dark:text-[#666666]">·</span>
          <span>About Us</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#171717] dark:text-[#F5F5F0] tracking-tight leading-[1.12]">
          Built to bridge the gap between{' '}
          <span className="font-serif italic font-normal text-[#FF5A36]">
            creative concept
          </span>{' '}
          and execution.
        </h1>

        <p className="text-base sm:text-lg text-[#737067] dark:text-[#A09D95] font-normal leading-relaxed pt-2">
          Social AI Studio is a dedicated creative workspace engineered for modern marketers, content strategists, and founders. We transform raw product briefs into production-ready social campaigns in seconds.
        </p>
      </div>

      {/* 2. Creator Spotlight Card */}
      <div className="editorial-card p-8 sm:p-10 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-start space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-[#EAE7E0] dark:bg-[#252525] border border-[#E5E2DC] dark:border-[#2E2E2E] flex items-center justify-center text-[#171717] dark:text-[#F5F5F0] text-2xl font-mono font-extrabold shadow-paper-sm">
              DC
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#171717] dark:text-[#F5F5F0]">
                Divyansh Chourey
              </h2>
              <p className="text-xs font-mono uppercase tracking-wider text-[#FF5A36] font-semibold mt-0.5">
                Creator & Full-Stack AI Engineer
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#737067] dark:text-[#A09D95] bg-[#FAF9F6] dark:bg-[#202020] border border-[#E5E2DC] dark:border-[#2E2E2E] px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Available for Creative AI Collaborations</span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4 text-sm text-[#737067] dark:text-[#A09D95] leading-relaxed border-t lg:border-t-0 lg:border-l border-[#E5E2DC] dark:border-[#262626] pt-6 lg:pt-0 lg:pl-8">
            <h3 className="text-base font-bold text-[#171717] dark:text-[#F5F5F0]">
              The Vision Behind Social AI Studio
            </h3>
            <p>
              "Most social media generation tools produce generic, flat text snippets that lack context, art direction, and brand nuance. I built Social AI Studio to treat marketing campaigns as holistic creative assets."
            </p>
            <p>
              "From a single product brief, our automated pipeline orchestrates multi-tone copywriting (promotional, storytelling, professional), visual poster art direction, short-form video storyboards, and platform-calibrated hashtag strategies. It gives teams the speed of AI combined with the polish of an editorial creative agency."
            </p>
          </div>
        </div>
      </div>

      {/* 3. Core Principles / Pillars */}
      <div className="mb-16">
        <div className="max-w-2xl mb-8">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#FF5A36] font-semibold mb-1">
            Foundations
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] dark:text-[#F5F5F0] tracking-tight">
            How we think about creative automation.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="editorial-card p-6 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] flex items-center justify-center text-[#FF5A36]">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#FF5A36] block">01 / VELOCITY</span>
            <h3 className="text-base font-bold text-[#171717] dark:text-[#F5F5F0]">Rapid Turnaround</h3>
            <p className="text-xs text-[#737067] dark:text-[#A09D95] leading-relaxed">
              Eliminate hours of manual brainstorming. Move from initial concept to launch-ready copy and visuals in under a minute.
            </p>
          </div>

          <div className="editorial-card p-6 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] flex items-center justify-center text-[#FF5A36]">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#FF5A36] block">02 / TONE CALIBRATION</span>
            <h3 className="text-base font-bold text-[#171717] dark:text-[#F5F5F0]">Multi-Voice Copy</h3>
            <p className="text-xs text-[#737067] dark:text-[#A09D95] leading-relaxed">
              Every generation produces distinct promotional, narrative, and professional styles adapted to your target demographics.
            </p>
          </div>

          <div className="editorial-card p-6 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] flex items-center justify-center text-[#FF5A36]">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#FF5A36] block">03 / MULTI-CHANNEL</span>
            <h3 className="text-base font-bold text-[#171717] dark:text-[#F5F5F0]">Integrated Assets</h3>
            <p className="text-xs text-[#737067] dark:text-[#A09D95] leading-relaxed">
              Captions, high-impact poster art prompts, and scene-by-scene Reel/Shorts storyboards generated simultaneously.
            </p>
          </div>

          <div className="editorial-card p-6 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] flex items-center justify-center text-[#FF5A36]">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#FF5A36] block">04 / WORKFLOWS</span>
            <h3 className="text-base font-bold text-[#171717] dark:text-[#F5F5F0]">Production Pipelines</h3>
            <p className="text-xs text-[#737067] dark:text-[#A09D95] leading-relaxed">
              Powered by an asynchronous n8n orchestration engine with fallback resilience and persistent campaign history tracking.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Architecture & Technical Breakdown */}
      <div className="editorial-sheet p-8 sm:p-10 mb-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E2DC] dark:border-[#262626]">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF5A36] font-semibold block mb-1">
              Architecture
            </span>
            <h2 className="text-2xl font-bold text-[#171717] dark:text-[#F5F5F0]">
              What Powers the Studio
            </h2>
          </div>
          <span className="text-xs font-mono text-[#737067] dark:text-[#A09D95]">
            v1.0.0 Production Release
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#171717] dark:text-[#F5F5F0] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF5A36]" />
              Frontend Experience
            </h4>
            <p className="text-xs text-[#737067] dark:text-[#A09D95] leading-relaxed">
              Built with React 18, Vite, and Tailwind CSS. Features light/dark editorial themes, smooth state caching, and responsive layouts.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#171717] dark:text-[#F5F5F0] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF5A36]" />
              Automation Engine
            </h4>
            <p className="text-xs text-[#737067] dark:text-[#A09D95] leading-relaxed">
              Integrated with an enterprise n8n workflow pipeline that validates inputs, structures prompts, and returns clean campaign JSON.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#171717] dark:text-[#F5F5F0] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF5A36]" />
              Campaign Archive
            </h4>
            <p className="text-xs text-[#737067] dark:text-[#A09D95] leading-relaxed">
              Every generation is saved to your local workspace history, letting you review, re-inspect, and export past briefs anytime.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Call to Action */}
      <div className="editorial-card p-8 sm:p-12 bg-[#171717] dark:bg-[#1A1A1A] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl font-bold text-white">
            Experience the studio in action.
          </h3>
          <p className="text-sm text-neutral-400 max-w-lg">
            Create your first multi-platform marketing campaign brief today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/history"
            className="px-5 py-3 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 transition-colors"
          >
            View History
          </Link>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold text-white bg-[#FF5A36] hover:bg-[#E54724] transition-all shadow-paper"
          >
            <span>Start a Campaign</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default AboutUs;
