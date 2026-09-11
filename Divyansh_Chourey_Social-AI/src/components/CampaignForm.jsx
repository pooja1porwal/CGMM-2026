import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  RotateCcw, 
  Loader2, 
  Check, 
  AlertCircle, 
  Layers, 
  Globe, 
  Smile, 
  Palette,
  CheckCircle2
} from 'lucide-react';
import { useCampaign } from '../context/CampaignContext';
import { generateCampaign } from '../services/campaignApi';
import { useNavigate } from 'react-router-dom';

const PROGRESS_STEPS = [
  { id: 1, label: 'Understanding the brief' },
  { id: 2, label: 'Writing campaign copy & hooks' },
  { id: 3, label: 'Developing creative concepts' },
  { id: 4, label: 'Preparing campaign assets' },
];

export const CampaignForm = () => {
  const navigate = useNavigate();
  const { 
    campaignData, 
    updateField, 
    resetForm, 
    saveGeneratedCampaign,
    notification, 
    showNotification,
    clearNotification,
    isGenerating,
    setIsGenerating
  } = useCampaign();

  const [errors, setErrors] = useState({});
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Cycle through visual progress steps while waiting for n8n API response
  useEffect(() => {
    let intervalId;
    if (isGenerating) {
      setActiveStepIndex(0);
      intervalId = setInterval(() => {
        setActiveStepIndex(prev => (prev < PROGRESS_STEPS.length - 1 ? prev + 1 : prev));
      }, 3500);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isGenerating]);

  const platforms = [
    { value: 'Instagram', label: 'Instagram (Feed & Reels)' },
    { value: 'Facebook', label: 'Facebook (Posts & Ads)' },
    { value: 'LinkedIn', label: 'LinkedIn (Professional Post)' },
    { value: 'X', label: 'X (Twitter Threads)' },
    { value: 'YouTube Shorts', label: 'YouTube Shorts (Script)' },
  ];

  const tones = [
    { value: 'Professional', label: 'Professional — Authoritative & clear' },
    { value: 'Energetic', label: 'Energetic — Bold, urgent, action-driven' },
    { value: 'Funny', label: 'Funny — Witty & humorous' },
    { value: 'Luxury', label: 'Luxury — Sophisticated & exclusive' },
    { value: 'Minimal', label: 'Minimal — Simple, direct & clean' },
    { value: 'Gen-Z', label: 'Gen-Z — Dynamic & casual' },
    { value: 'Friendly', label: 'Friendly — Warm & approachable' },
  ];

  const languages = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'Hindi (हिंदी)' },
    { value: 'Hinglish', label: 'Hinglish (Hindi in Latin script)' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!campaignData.productName?.trim()) {
      newErrors.productName = 'Product name is required.';
    } else if (campaignData.productName.trim().length < 2) {
      newErrors.productName = 'Product name must be at least 2 characters.';
    }

    if (!campaignData.productDescription?.trim()) {
      newErrors.productDescription = 'Product description is required.';
    } else if (campaignData.productDescription.trim().length < 10) {
      newErrors.productDescription = 'Please provide a more descriptive brief (min 10 characters).';
    }

    if (!campaignData.promotion?.trim()) {
      newErrors.promotion = 'Promotional message / offer is required.';
    }

    if (!campaignData.targetAudience?.trim()) {
      newErrors.targetAudience = 'Target audience is required.';
    }

    if (!campaignData.platform) {
      newErrors.platform = 'Platform selection is required.';
    }

    if (!campaignData.tone) {
      newErrors.tone = 'Tone selection is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('Please complete all required fields marked with *', 'error');
      return;
    }

    clearNotification();
    setIsGenerating(true);

    try {
      const response = await generateCampaign(campaignData);
      saveGeneratedCampaign(response);
      navigate('/campaigns');
    } catch (err) {
      showNotification(err.message || 'Unable to generate campaign. Please try again.', 'error', 10000);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full">
      {/* Error / Status Alert */}
      {notification && (
        <div 
          className={`mb-6 p-4 rounded-xl border transition-all animate-slide-up flex items-start justify-between gap-3 ${
            notification.type === 'error'
              ? 'bg-[#FFF2F0] dark:bg-[#2A1215] border-[#FFCCC7] dark:border-[#5C0011] text-[#CF1322] dark:text-[#FFA39E]'
              : 'bg-[#F6FFED] dark:bg-[#132A15] border-[#B7EB8F] dark:border-[#274916] text-[#389E0D] dark:text-[#95DE64]'
          }`}
          role="status"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-medium">{notification.message}</p>
          </div>

          <button
            type="button"
            onClick={clearNotification}
            className="text-xs font-semibold underline hover:opacity-80 flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Creative Brief Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="editorial-card p-6 sm:p-8 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] relative space-y-8"
      >
        {/* Progress Overlay during Generation */}
        {isGenerating && (
          <div className="absolute inset-0 bg-[#F7F5F0]/95 dark:bg-[#121212]/95 backdrop-blur-sm rounded-xl z-20 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="max-w-md w-full bg-white dark:bg-[#1A1A1A] p-8 rounded-2xl border border-[#E5E2DC] dark:border-[#2E2E2E] shadow-paper-card space-y-6 text-left">
              <div className="flex items-center gap-3 pb-4 border-b border-[#F0EFEA] dark:border-[#262626]">
                <div className="w-8 h-8 rounded-lg bg-[#FF5A36] text-white flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#737067] dark:text-[#A09D95] font-semibold">
                    Studio Pipeline
                  </h4>
                  <p className="text-sm font-bold text-[#171717] dark:text-[#F5F5F0]">
                    Building your campaign
                  </p>
                </div>
              </div>

              {/* Progress Checklist */}
              <div className="space-y-3 font-sans text-xs">
                {PROGRESS_STEPS.map((step, idx) => {
                  const isDone = idx < activeStepIndex;
                  const isCurrent = idx === activeStepIndex;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 transition-opacity ${
                        isDone 
                          ? 'text-[#171717] dark:text-[#F5F5F0]' 
                          : isCurrent 
                            ? 'text-[#FF5A36] font-semibold' 
                            : 'text-[#9C9990] dark:text-[#666666]'
                      }`}
                    >
                      <span className="font-mono text-[11px] w-4 text-center">
                        {isDone ? '✓' : isCurrent ? '●' : '○'}
                      </span>
                      <span>{step.label}</span>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-[#737067] dark:text-[#A09D95] font-mono border-t border-[#F0EFEA] dark:border-[#262626] pt-3">
                Communicating with n8n Cloud workflow...
              </p>
            </div>
          </div>
        )}

        {/* Section 1: PRODUCT */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F0EFEA] dark:border-[#262626]">
            <span className="text-xs font-mono font-bold text-[#FF5A36]">01</span>
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#171717] dark:text-[#F5F5F0]">
              Product
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label 
                htmlFor="productName" 
                className="block text-xs font-bold uppercase tracking-wider text-[#171717] dark:text-[#F5F5F0] mb-1.5 font-mono"
              >
                Product Name <span className="text-[#FF5A36]">*</span>
              </label>
              <input
                id="productName"
                type="text"
                disabled={isGenerating}
                value={campaignData.productName}
                onChange={(e) => {
                  updateField('productName', e.target.value);
                  if (errors.productName) setErrors(prev => ({ ...prev, productName: null }));
                }}
                placeholder="e.g. SmartFit Pro Watch"
                className={`w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#222222] border text-sm text-[#171717] dark:text-[#F5F5F0] placeholder-[#9C9990] dark:placeholder-[#666666] focus:bg-white dark:focus:bg-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:focus:ring-[#FF5A36] transition-all ${
                  errors.productName ? 'border-[#FF4D4F]' : 'border-[#E5E2DC] dark:border-[#2E2E2E] hover:border-[#D0CCC3] dark:hover:border-[#404040]'
                } disabled:opacity-50`}
              />
              {errors.productName && (
                <p className="text-xs text-[#CF1322] dark:text-[#FFA39E] mt-1 font-sans">{errors.productName}</p>
              )}
            </div>

            <div>
              <label 
                htmlFor="productDescription" 
                className="block text-xs font-bold uppercase tracking-wider text-[#171717] dark:text-[#F5F5F0] mb-1.5 font-mono"
              >
                Product Description <span className="text-[#FF5A36]">*</span>
              </label>
              <textarea
                id="productDescription"
                rows={3}
                disabled={isGenerating}
                value={campaignData.productDescription}
                onChange={(e) => {
                  updateField('productDescription', e.target.value);
                  if (errors.productDescription) setErrors(prev => ({ ...prev, productDescription: null }));
                }}
                placeholder="Describe your product..."
                className={`w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#222222] border text-sm text-[#171717] dark:text-[#F5F5F0] placeholder-[#9C9990] dark:placeholder-[#666666] focus:bg-white dark:focus:bg-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:focus:ring-[#FF5A36] transition-all resize-y min-h-[80px] ${
                  errors.productDescription ? 'border-[#FF4D4F]' : 'border-[#E5E2DC] dark:border-[#2E2E2E] hover:border-[#D0CCC3] dark:hover:border-[#404040]'
                } disabled:opacity-50`}
              />
              {errors.productDescription && (
                <p className="text-xs text-[#CF1322] dark:text-[#FFA39E] mt-1 font-sans">{errors.productDescription}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: CAMPAIGN */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F0EFEA] dark:border-[#262626]">
            <span className="text-xs font-mono font-bold text-[#FF5A36]">02</span>
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#171717] dark:text-[#F5F5F0]">
              Campaign & Offer
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="promotion" 
                className="block text-xs font-bold uppercase tracking-wider text-[#171717] dark:text-[#F5F5F0] mb-1.5 font-mono"
              >
                Promotional Message <span className="text-[#FF5A36]">*</span>
              </label>
              <input
                id="promotion"
                type="text"
                disabled={isGenerating}
                value={campaignData.promotion}
                onChange={(e) => {
                  updateField('promotion', e.target.value);
                  if (errors.promotion) setErrors(prev => ({ ...prev, promotion: null }));
                }}
                placeholder="e.g. Get 25% OFF this weekend"
                className={`w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#222222] border text-sm text-[#171717] dark:text-[#F5F5F0] placeholder-[#9C9990] dark:placeholder-[#666666] focus:bg-white dark:focus:bg-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:focus:ring-[#FF5A36] transition-all ${
                  errors.promotion ? 'border-[#FF4D4F]' : 'border-[#E5E2DC] dark:border-[#2E2E2E] hover:border-[#D0CCC3] dark:hover:border-[#404040]'
                } disabled:opacity-50`}
              />
              {errors.promotion && (
                <p className="text-xs text-[#CF1322] dark:text-[#FFA39E] mt-1 font-sans">{errors.promotion}</p>
              )}
            </div>

            <div>
              <label 
                htmlFor="targetAudience" 
                className="block text-xs font-bold uppercase tracking-wider text-[#171717] dark:text-[#F5F5F0] mb-1.5 font-mono"
              >
                Target Audience <span className="text-[#FF5A36]">*</span>
              </label>
              <input
                id="targetAudience"
                type="text"
                disabled={isGenerating}
                value={campaignData.targetAudience}
                onChange={(e) => {
                  updateField('targetAudience', e.target.value);
                  if (errors.targetAudience) setErrors(prev => ({ ...prev, targetAudience: null }));
                }}
                placeholder="e.g. College students"
                className={`w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#222222] border text-sm text-[#171717] dark:text-[#F5F5F0] placeholder-[#9C9990] dark:placeholder-[#666666] focus:bg-white dark:focus:bg-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:focus:ring-[#FF5A36] transition-all ${
                  errors.targetAudience ? 'border-[#FF4D4F]' : 'border-[#E5E2DC] dark:border-[#2E2E2E] hover:border-[#D0CCC3] dark:hover:border-[#404040]'
                } disabled:opacity-50`}
              />
              {errors.targetAudience && (
                <p className="text-xs text-[#CF1322] dark:text-[#FFA39E] mt-1 font-sans">{errors.targetAudience}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: PUBLISHING */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F0EFEA] dark:border-[#262626]">
            <span className="text-xs font-mono font-bold text-[#FF5A36]">03</span>
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#171717] dark:text-[#F5F5F0]">
              Publishing & Tone
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Platform */}
            <div>
              <label 
                htmlFor="platform" 
                className="block text-xs font-bold uppercase tracking-wider text-[#171717] dark:text-[#F5F5F0] mb-1.5 font-mono"
              >
                Platform <span className="text-[#FF5A36]">*</span>
              </label>
              <select
                id="platform"
                disabled={isGenerating}
                value={campaignData.platform}
                onChange={(e) => updateField('platform', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] text-sm text-[#171717] dark:text-[#F5F5F0] focus:bg-white dark:focus:bg-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:focus:ring-[#FF5A36] transition-all cursor-pointer disabled:opacity-50"
              >
                {platforms.map((p) => (
                  <option key={p.value} value={p.value} className="dark:bg-[#222222] dark:text-[#F5F5F0]">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tone */}
            <div>
              <label 
                htmlFor="tone" 
                className="block text-xs font-bold uppercase tracking-wider text-[#171717] dark:text-[#F5F5F0] mb-1.5 font-mono"
              >
                Tone <span className="text-[#FF5A36]">*</span>
              </label>
              <select
                id="tone"
                disabled={isGenerating}
                value={campaignData.tone}
                onChange={(e) => updateField('tone', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] text-sm text-[#171717] dark:text-[#F5F5F0] focus:bg-white dark:focus:bg-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:focus:ring-[#FF5A36] transition-all cursor-pointer disabled:opacity-50"
              >
                {tones.map((t) => (
                  <option key={t.value} value={t.value} className="dark:bg-[#222222] dark:text-[#F5F5F0]">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div>
              <label 
                htmlFor="language" 
                className="block text-xs font-bold uppercase tracking-wider text-[#171717] dark:text-[#F5F5F0] mb-1.5 font-mono"
              >
                Language
              </label>
              <select
                id="language"
                disabled={isGenerating}
                value={campaignData.language}
                onChange={(e) => updateField('language', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] text-sm text-[#171717] dark:text-[#F5F5F0] focus:bg-white dark:focus:bg-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:focus:ring-[#FF5A36] transition-all cursor-pointer disabled:opacity-50"
              >
                {languages.map((l) => (
                  <option key={l.value} value={l.value} className="dark:bg-[#222222] dark:text-[#F5F5F0]">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Brand Color (Optional) */}
          <div className="pt-2">
            <label 
              htmlFor="brandColor" 
              className="block text-xs font-bold uppercase tracking-wider text-[#171717] dark:text-[#F5F5F0] mb-1.5 font-mono"
            >
              Brand Color (Optional)
            </label>
            <div className="flex items-center gap-3 p-1.5 bg-[#FAF9F6] dark:bg-[#222222] rounded-lg border border-[#E5E2DC] dark:border-[#2E2E2E] max-w-xs">
              <input
                id="brandColor"
                type="color"
                disabled={isGenerating}
                value={campaignData.brandColor || '#6366f1'}
                onChange={(e) => updateField('brandColor', e.target.value)}
                className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <input
                type="text"
                disabled={isGenerating}
                value={campaignData.brandColor || '#6366F1'}
                onChange={(e) => updateField('brandColor', e.target.value)}
                className="w-full bg-transparent text-xs font-mono text-[#171717] dark:text-[#F5F5F0] uppercase focus:outline-none"
                placeholder="#6366F1"
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-[#E5E2DC] dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            disabled={isGenerating}
            onClick={resetForm}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#737067] dark:text-[#A09D95] hover:text-[#171717] dark:hover:text-[#F5F5F0] transition-colors order-2 sm:order-1 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset brief</span>
          </button>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-sm font-bold text-white bg-[#FF5A36] hover:bg-[#E54724] active:scale-95 transition-all shadow-paper order-1 sm:order-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating campaign...</span>
              </>
            ) : (
              <>
                <span>Generate campaign →</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
