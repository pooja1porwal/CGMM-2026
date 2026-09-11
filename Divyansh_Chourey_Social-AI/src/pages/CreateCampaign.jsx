import React from 'react';
import { CampaignForm } from '../components/CampaignForm';
import { useCampaign } from '../context/CampaignContext';
import { Layers, Zap, ArrowUpRight } from 'lucide-react';

export const CreateCampaign = () => {
  const { campaignData } = useCampaign();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 transition-colors duration-200">
      {/* Studio Header */}
      <div className="mb-10 pb-6 border-b border-[#E5E2DC] dark:border-[#262626]">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FF5A36] font-semibold mb-2">
          <span>Creative Studio</span>
          <span>·</span>
          <span>Brief Input</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] dark:text-[#F5F5F0] tracking-tight">
          Create a campaign
        </h1>
        <p className="text-sm text-[#737067] dark:text-[#A09D95] mt-1.5 max-w-xl">
          Give us the brief. We'll build the first draft across multi-tone captions, poster visuals, and video storyboards.
        </p>
      </div>

      {/* Two Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Campaign Brief Form */}
        <div className="lg:col-span-8">
          <CampaignForm />
        </div>

        {/* Right: Live Interactive Brief Summary Sheet */}
        <div className="lg:col-span-4 space-y-6">
          <div className="editorial-card p-6 bg-[#FAF9F6] dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DC] dark:border-[#262626]">
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#171717] dark:text-[#F5F5F0]">
                Live Brief Sheet
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#EAE7E0] dark:bg-[#252525] text-[#737067] dark:text-[#A09D95]">
                Real-time
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Product */}
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#737067] dark:text-[#A09D95]">
                  Product Name
                </p>
                <p className="font-bold text-sm text-[#171717] dark:text-[#F5F5F0] mt-0.5">
                  {campaignData.productName || (
                    <span className="text-[#9C9990] dark:text-[#666666] font-normal italic">e.g. SmartFit Pro Watch</span>
                  )}
                </p>
              </div>

              {/* Offer */}
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#737067] dark:text-[#A09D95]">
                  Key Promotion / Offer
                </p>
                <p className="font-medium text-[#171717] dark:text-[#F5F5F0] mt-0.5">
                  {campaignData.promotion || (
                    <span className="text-[#9C9990] dark:text-[#666666] font-normal italic">e.g. 25% OFF this weekend</span>
                  )}
                </p>
              </div>

              {/* Target Audience */}
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#737067] dark:text-[#A09D95]">
                  Target Audience
                </p>
                <p className="font-medium text-[#171717] dark:text-[#F5F5F0] mt-0.5">
                  {campaignData.targetAudience || (
                    <span className="text-[#9C9990] dark:text-[#666666] font-normal italic">e.g. College students</span>
                  )}
                </p>
              </div>

              {/* Grid specs */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E5E2DC] dark:border-[#262626]">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#737067] dark:text-[#A09D95]">Platform</p>
                  <p className="font-bold text-[#171717] dark:text-[#F5F5F0] mt-0.5">{campaignData.platform || 'Instagram'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#737067] dark:text-[#A09D95]">Tone</p>
                  <p className="font-bold text-[#171717] dark:text-[#F5F5F0] mt-0.5">{campaignData.tone || 'Professional'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#737067] dark:text-[#A09D95]">Language</p>
                  <p className="font-bold text-[#171717] dark:text-[#F5F5F0] mt-0.5">{campaignData.language || 'English'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#737067] dark:text-[#A09D95]">Palette</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-3 h-3 rounded-full border border-[#D0CCC3] dark:border-[#444444]"
                      style={{ backgroundColor: campaignData.brandColor || '#6366f1' }}
                    ></span>
                    <span className="font-mono text-[11px] text-[#171717] dark:text-[#F5F5F0] uppercase">
                      {campaignData.brandColor || '#6366F1'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline Notice */}
            <div className="pt-3 border-t border-[#E5E2DC] dark:border-[#262626] text-[11px] text-[#737067] dark:text-[#A09D95] flex items-center justify-between font-mono">
              <span>n8n Endpoint</span>
              <span className="text-[#171717] dark:text-[#F5F5F0] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A36]"></span>
                Production Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
