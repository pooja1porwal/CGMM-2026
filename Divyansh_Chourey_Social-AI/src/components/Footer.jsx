import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-[#E5E2DC] dark:border-[#262626] bg-[#FAF9F6] dark:bg-[#161616] text-[#737067] dark:text-[#A09D95] mt-24 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#E5E2DC] dark:border-[#262626]">
          {/* Brand Manifesto & Developer Info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#171717] dark:bg-[#F5F5F0] rounded-md flex items-center justify-center text-white">
                <span className="w-2 h-2 bg-[#FF5A36] rounded-sm"></span>
              </div>
              <span className="text-sm font-extrabold tracking-tight text-[#171717] dark:text-[#F5F5F0] uppercase">
                SOCIAL AI STUDIO
              </span>
            </div>
            
            <p className="text-sm text-[#737067] dark:text-[#A09D95] max-w-md leading-relaxed font-sans">
              A modern campaign workspace engineered for marketing teams and creative directors. From a single product brief to multi-channel captions, promotional posters, and storyboard concepts.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-mono text-[#171717] dark:text-[#F5F5F0] bg-[#EAE7E0] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] px-3 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-[#FF5A36]"></span>
                <span>Developed by <strong>Divyansh Chourey</strong></span>
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#737067] dark:text-[#A09D95] bg-[#FAF9F6] dark:bg-[#1E1E1E] border border-[#E5E2DC] dark:border-[#2E2E2E] px-2.5 py-1 rounded-md">
                <span>n8n Production Connected</span>
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#171717] dark:text-[#F5F5F0] font-semibold">
              Workspace
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-[#171717] dark:hover:text-[#F5F5F0] transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-[#171717] dark:hover:text-[#F5F5F0] transition-colors">
                  Create Campaign
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="hover:text-[#171717] dark:hover:text-[#F5F5F0] transition-colors">
                  Campaign Results
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-[#171717] dark:hover:text-[#F5F5F0] transition-colors">
                  Campaign Archive
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#171717] dark:hover:text-[#F5F5F0] transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Capabilities */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#171717] dark:text-[#F5F5F0] font-semibold">
              Capabilities
            </p>
            <ul className="space-y-2 text-sm">
              <li className="text-[#171717] dark:text-[#F5F5F0]">Captions & Tone Alignment</li>
              <li className="text-[#171717] dark:text-[#F5F5F0]">Visual Poster Generation</li>
              <li className="text-[#171717] dark:text-[#F5F5F0]">Targeted Hashtags & CTAs</li>
              <li className="text-[#171717] dark:text-[#F5F5F0]">Reel & Shorts Storyboards</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737067] dark:text-[#888888]">
          <p>© {new Date().getFullYear()} Social AI Studio. Designed & Developed by <strong>Divyansh Chourey</strong>.</p>
          <p className="font-mono text-[11px] text-[#9C9990] dark:text-[#777777]">Crafted for high-conversion social media marketing</p>
        </div>
      </div>
    </footer>
  );
};
