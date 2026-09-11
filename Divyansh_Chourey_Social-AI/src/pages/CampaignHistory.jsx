import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCampaign } from '../context/CampaignContext';
import { ArrowRight, Plus, Calendar, Layers, Image as ImageIcon } from 'lucide-react';

export const CampaignHistory = () => {
  const navigate = useNavigate();
  const { campaignsList, setCurrentCampaign } = useCampaign();

  const handleSelectCampaign = (campaignItem) => {
    if (campaignItem.data) {
      setCurrentCampaign(campaignItem.data);
      navigate('/campaigns');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 transition-colors duration-200">
      {/* Archive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E2DC] dark:border-[#262626] mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FF5A36] font-semibold mb-2">
            <span>Studio Archive</span>
            <span>·</span>
            <span>History</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] dark:text-[#F5F5F0] tracking-tight">
            Campaign History
          </h1>
          <p className="text-sm text-[#737067] dark:text-[#A09D95] mt-1">
            Access and review previously generated social media briefs and creative packages.
          </p>
        </div>

        <Link
          to="/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#171717] hover:bg-[#2E2E2E] dark:bg-[#F5F5F0] dark:text-[#121212] dark:hover:bg-white active:scale-95 transition-all shadow-paper-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Campaign</span>
        </Link>
      </div>

      {/* Campaign Cards Grid */}
      {campaignsList && campaignsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaignsList.map((c) => {
            const hasPoster = c.data?.campaign?.posterImage || c.data?.campaign?.posterUrl || c.data?.campaign?.image;

            return (
              <div
                key={c.id}
                className="editorial-card p-6 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] flex flex-col justify-between hover:border-[#D0CCC3] dark:hover:border-[#3D3D3D] transition-all group"
              >
                <div className="space-y-4">
                  {/* Visual Header / Thumbnail Box */}
                  <div className="w-full h-36 rounded-lg bg-[#FAF9F6] dark:bg-[#141414] border border-[#E5E2DC] dark:border-[#2E2E2E] flex items-center justify-center overflow-hidden">
                    {hasPoster ? (
                      <img
                        src={hasPoster}
                        alt={c.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <span className="font-mono text-xs text-[#737067] dark:text-[#A09D95] uppercase font-bold tracking-wider block">
                          {c.platform} Creative
                        </span>
                        <span className="text-[10px] text-[#9C9990] dark:text-[#666666] font-mono mt-1 block">
                          {c.id}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#737067] dark:text-[#A09D95] mb-1">
                      <span className="font-bold text-[#171717] dark:text-[#F5F5F0]">{c.platform}</span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#171717] dark:text-[#F5F5F0] group-hover:text-[#FF5A36] transition-colors">
                      {c.productName}
                    </h3>

                    <p className="text-xs text-[#737067] dark:text-[#A09D95] font-mono mt-1">
                      Tone: {c.tone}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F0EFEA] dark:border-[#262626] flex items-center justify-between mt-4">
                  <span className="text-[11px] font-mono text-[#9C9990] dark:text-[#666666]">
                    {c.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectCampaign(c)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#171717] dark:text-[#F5F5F0] group-hover:text-[#FF5A36] transition-colors"
                  >
                    <span>View Campaign</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="editorial-card p-12 sm:p-16 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] max-w-2xl mx-auto text-center space-y-6 my-8">
          <div className="w-12 h-12 rounded-xl bg-[#EAE7E0] dark:bg-[#252525] border border-[#E5E2DC] dark:border-[#2E2E2E] flex items-center justify-center text-[#171717] dark:text-[#F5F5F0] mx-auto font-mono text-sm font-bold">
            00
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#171717] dark:text-[#F5F5F0] font-sans">
              No campaigns archived yet
            </h3>
            <p className="text-sm text-[#737067] dark:text-[#A09D95] max-w-md mx-auto leading-relaxed">
              When you submit brief details and generate creative packages, they will be archived here for reference.
            </p>
          </div>

          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold text-white bg-[#171717] hover:bg-[#2E2E2E] dark:bg-[#F5F5F0] dark:text-[#121212] dark:hover:bg-white active:scale-95 transition-all shadow-paper"
          >
            <span>Create Your First Campaign</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};
