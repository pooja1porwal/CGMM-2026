import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCampaign } from '../context/CampaignContext';
import { 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Plus, 
  Film, 
  Image as ImageIcon, 
  ArrowRight, 
  Loader2, 
  RefreshCw, 
  ZoomIn,
  AlertCircle,
  Hash,
  MousePointerClick,
  Layers,
  ArrowUpRight
} from 'lucide-react';

/**
 * Robustly parses and extracts image URL / base64 from various n8n & AI response structures
 */
const extractPosterImageUrl = (campaignObj, currentCampaign) => {
  if (!campaignObj && !currentCampaign) return null;

  const rawData = currentCampaign?.rawResponse;

  const candidates = [
    campaignObj?.posterImage,
    campaignObj?.poster_image,
    campaignObj?.posterUrl,
    campaignObj?.poster_url,
    campaignObj?.posterURL,
    campaignObj?.poster,
    campaignObj?.imageUrl,
    campaignObj?.image_url,
    campaignObj?.imageURL,
    campaignObj?.image,
    campaignObj?.generatedImage,
    campaignObj?.generated_image,
    campaignObj?.bannerImage,
    campaignObj?.banner_image,
    campaignObj?.bannerUrl,
    campaignObj?.banner,
    campaignObj?.visual,
    campaignObj?.visualUrl,
    campaignObj?.dalle,
    campaignObj?.dalle_url,
    campaignObj?.outputImage,
    campaignObj?.images,
    campaignObj?.photos,
    campaignObj?.posterImageBase64,
    campaignObj?.base64Image,
    currentCampaign?.posterImage,
    currentCampaign?.poster_image,
    currentCampaign?.imageUrl,
    currentCampaign?.image,
    rawData?.posterImage,
    rawData?.poster_image,
    rawData?.posterUrl,
    rawData?.imageUrl,
    rawData?.image,
    rawData?.data?.posterImage,
    rawData?.data?.image,
    rawData?.[0]?.posterImage,
    rawData?.[0]?.imageUrl,
    rawData?.[0]?.image,
  ];

  const parseItem = (val) => {
    if (!val) return null;

    if (Array.isArray(val)) {
      if (val.length === 0) return null;
      return parseItem(val[0]);
    }

    if (typeof val === 'object') {
      if (val.url && typeof val.url === 'string') return parseItem(val.url);
      if (val.image_url && typeof val.image_url === 'string') return parseItem(val.image_url);
      if (val.imageUrl && typeof val.imageUrl === 'string') return parseItem(val.imageUrl);
      if (val.b64_json && typeof val.b64_json === 'string') return parseItem(val.b64_json);
      if (val.base64 && typeof val.base64 === 'string') return parseItem(val.base64);
      if (val.file && typeof val.file === 'string') return parseItem(val.file);
      if (val.path && typeof val.path === 'string') return parseItem(val.path);
      if (val.data && typeof val.data === 'string') {
        const mime = val.mimeType || val.type || 'image/png';
        if (val.data.startsWith('data:image/')) return val.data;
        return `data:${mime};base64,${val.data}`;
      }
      if (Array.isArray(val.data) && val.data.length > 0) return parseItem(val.data[0]);
    }

    if (typeof val === 'string') {
      let trimmed = val.trim();

      const mdImageMatch = trimmed.match(/!\[.*?\]\((https?:\/\/[^\s\)]+)\)/i);
      if (mdImageMatch && mdImageMatch[1]) return mdImageMatch[1];

      const mdLinkMatch = trimmed.match(/\[.*?\]\((https?:\/\/[^\s\)]+)\)/i);
      if (mdLinkMatch && mdLinkMatch[1]) return mdLinkMatch[1];

      const htmlImgMatch = trimmed.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (htmlImgMatch && htmlImgMatch[1]) return htmlImgMatch[1];

      trimmed = trimmed.replace(/^["'`<\(]+|["'`>\)]+$/g, '').trim();

      if (/^https?:\/\//i.test(trimmed) || /^\/\//i.test(trimmed)) {
        return trimmed.startsWith('//') ? `https:${trimmed}` : trimmed;
      }

      if (/^data:image\/[a-zA-Z+]+;base64,/i.test(trimmed)) {
        return trimmed;
      }

      if (trimmed.startsWith('/9j/')) return `data:image/jpeg;base64,${trimmed}`;
      if (trimmed.startsWith('iVBOR')) return `data:image/png;base64,${trimmed}`;
      if (trimmed.startsWith('R0lGOD')) return `data:image/gif;base64,${trimmed}`;
      if (trimmed.startsWith('UklGR')) return `data:image/webp;base64,${trimmed}`;

      if (trimmed.length > 250 && /^[A-Za-z0-9+/=]+$/.test(trimmed.replace(/\s/g, ''))) {
        return `data:image/png;base64,${trimmed.replace(/\s/g, '')}`;
      }

      const urlMatch = trimmed.match(/https?:\/\/[^\s"'\<\>]+/i);
      if (urlMatch) return urlMatch[0];
    }

    return null;
  };

  for (const item of candidates) {
    const res = parseItem(item);
    if (res) return res;
  }

  if (typeof campaignObj === 'object' && campaignObj !== null) {
    for (const [k, v] of Object.entries(campaignObj)) {
      const lower = k.toLowerCase();
      if (lower.includes('image') || lower.includes('poster') || lower.includes('visual') || lower.includes('photo') || lower.includes('banner')) {
        const res = parseItem(v);
        if (res) return res;
      }
    }
  }

  return null;
};

export const CampaignResults = () => {
  const { currentCampaign } = useCampaign();
  const [copiedKey, setCopiedKey] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);

  const handleCopy = (text, key) => {
    if (!text) return;
    const textToCopy = typeof text === 'string' ? text : JSON.stringify(text, null, 2);
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 2000);
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 2000);
    });
  };

  // If no campaign generated yet
  if (!currentCampaign || !currentCampaign.campaign) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center transition-colors duration-200">
        <div className="editorial-card p-12 sm:p-16 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] max-w-2xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-xl bg-[#EAE7E0] dark:bg-[#252525] border border-[#E5E2DC] dark:border-[#2E2E2E] flex items-center justify-center text-[#171717] dark:text-[#F5F5F0] mx-auto font-mono text-sm font-bold">
            00
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#171717] dark:text-[#F5F5F0] font-sans">
              No active campaign in studio
            </h2>
            <p className="text-sm text-[#737067] dark:text-[#A09D95] max-w-md mx-auto leading-relaxed">
              Submit a creative brief to assemble multi-channel copy, visual art directives, and video storyboards.
            </p>
          </div>

          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#171717] hover:bg-[#2E2E2E] dark:bg-[#F5F5F0] dark:text-[#121212] dark:hover:bg-white active:scale-95 transition-all shadow-paper"
          >
            <span>Create a Campaign</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const { campaignId, campaign, inputData } = currentCampaign;

  const productName = campaign.productName || inputData?.productName || 'Generated Campaign';
  const platform = campaign.platform || inputData?.platform || 'Instagram';
  const tone = campaign.tone || inputData?.tone || 'Professional';
  const promotion = campaign.promotion || inputData?.promotion || '';

  // Extract poster image safely
  const posterImage = extractPosterImageUrl(campaign, currentCampaign);

  // Normalize captions
  const rawCaptions = campaign.captions || [];
  let formattedCaptions = [];

  if (Array.isArray(rawCaptions)) {
    formattedCaptions = rawCaptions.map((item, idx) => {
      if (typeof item === 'string') {
        const types = ['Promotional', 'Creative', 'Professional'];
        return {
          type: types[idx] || `Caption 0${idx + 1}`,
          text: item,
        };
      }
      return {
        type: item.type ? (item.type.charAt(0).toUpperCase() + item.type.slice(1)) : `Caption 0${idx + 1}`,
        text: item.text || item.caption || item.content || JSON.stringify(item),
      };
    });
  } else if (typeof rawCaptions === 'object' && rawCaptions !== null) {
    formattedCaptions = Object.entries(rawCaptions).map(([key, val]) => ({
      type: key.charAt(0).toUpperCase() + key.slice(1),
      text: typeof val === 'string' ? val : JSON.stringify(val),
    }));
  }

  const standardTypes = ['Promotional', 'Creative', 'Professional'];
  const captionsToDisplay = standardTypes.map((typeName) => {
    const found = formattedCaptions.find(c => c.type.toLowerCase().includes(typeName.toLowerCase()));
    if (found) return found;
    const idx = standardTypes.indexOf(typeName);
    if (formattedCaptions[idx]) return formattedCaptions[idx];
    return { type: typeName, text: null };
  });

  // Normalize Hashtags
  let hashtagsList = [];
  if (Array.isArray(campaign.hashtags)) {
    hashtagsList = campaign.hashtags.map(h => typeof h === 'string' ? (h.startsWith('#') ? h : `#${h}`) : JSON.stringify(h));
  } else if (typeof campaign.hashtags === 'string') {
    hashtagsList = campaign.hashtags.split(/[\s,]+/).filter(Boolean).map(h => h.startsWith('#') ? h : `#${h}`);
  }
  const hashtagsString = hashtagsList.join(' ');

  // Normalize CTAs
  let ctaList = [];
  if (Array.isArray(campaign.ctaOptions)) {
    ctaList = campaign.ctaOptions.map(c => typeof c === 'string' ? c : (c.text || JSON.stringify(c)));
  } else if (typeof campaign.ctaOptions === 'string') {
    ctaList = [campaign.ctaOptions];
  }

  // Normalize Poster Concepts
  let posterConcepts = [];
  if (Array.isArray(campaign.posterConcepts)) {
    posterConcepts = campaign.posterConcepts.map((concept, idx) => {
      if (typeof concept === 'string') {
        return { id: idx + 1, title: `Concept 0${idx + 1}`, text: concept };
      }
      return {
        id: idx + 1,
        title: concept.title || `Concept 0${idx + 1}`,
        text: concept.description || concept.text || concept.concept || JSON.stringify(concept),
      };
    });
  } else if (typeof campaign.posterConcepts === 'string') {
    posterConcepts = [{ id: 1, title: 'Concept 01', text: campaign.posterConcepts }];
  }

  while (posterConcepts.length < 3) {
    posterConcepts.push({
      id: posterConcepts.length + 1,
      title: `Concept 0${posterConcepts.length + 1}`,
      text: null,
    });
  }

  // Normalize Reel Storyboard
  let storyboardRows = [];
  if (Array.isArray(campaign.storyboard)) {
    storyboardRows = campaign.storyboard.map((item, idx) => {
      if (typeof item === 'string') {
        return {
          scene: `Scene 0${idx + 1}`,
          stage: ['Hook', 'Product', 'Feature', 'Offer', 'CTA'][idx] || 'Scene',
          duration: '—',
          visual: item,
          onScreenText: '—',
          voiceover: '—',
          transition: 'Cut',
        };
      }
      return {
        scene: item.scene || item.sceneNumber || `Scene 0${idx + 1}`,
        stage: item.stage || ['Hook', 'Product', 'Feature', 'Offer', 'CTA'][idx] || 'Scene',
        duration: item.duration || item.time || '3s',
        visual: item.visual || item.visuals || item.description || '—',
        onScreenText: item.onScreenText || item.text || item.overlayText || '—',
        voiceover: item.voiceover || item.audio || item.script || '—',
        transition: item.transition || item.effect || 'Cut',
      };
    });
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 transition-colors duration-200">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E5E2DC] dark:border-[#262626]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#737067] dark:text-[#A09D95]">
              Campaign / {productName}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-[#EAE7E0] dark:bg-[#222222] text-[#171717] dark:text-[#F5F5F0] font-semibold border border-[#E5E2DC] dark:border-[#2E2E2E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A36]"></span>
              Generated
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] dark:text-[#F5F5F0] tracking-tight">
            {productName}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-[#737067] dark:text-[#A09D95]">
            <span>Platform: <strong className="text-[#171717] dark:text-[#F5F5F0]">{platform}</strong></span>
            <span>·</span>
            <span>Tone: <strong className="text-[#171717] dark:text-[#F5F5F0]">{tone}</strong></span>
            <span>·</span>
            <span>ID: <strong className="text-[#171717] dark:text-[#F5F5F0]">{campaignId}</strong></span>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-3">
          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#171717] hover:bg-[#2E2E2E] dark:bg-[#F5F5F0] dark:text-[#121212] dark:hover:bg-white transition-all shadow-paper-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Brief</span>
          </Link>
        </div>
      </div>

      {/* Main Workspace Layout: Poster Centerpiece (Left) + Copy Dashboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (Span 6): Visual Poster + Concepts */}
        <div className="lg:col-span-6 space-y-8">
          {/* Poster Section */}
          <div className="editorial-card p-6 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA] dark:border-[#262626]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5A36]"></span>
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#171717] dark:text-[#F5F5F0]">
                  Campaign Poster
                </h3>
              </div>

              {posterImage && (
                <span className="text-[11px] font-mono text-[#737067] dark:text-[#A09D95]">
                  1080 × 1350 · {platform}
                </span>
              )}
            </div>

            {/* Canvas */}
            <div className="w-full min-h-[380px] max-h-[520px] rounded-xl border border-[#E5E2DC] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#141414] flex flex-col items-center justify-center p-4 text-center overflow-hidden relative group">
              {posterImage ? (
                <>
                  {isImageLoading && !imageLoadError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF9F6]/80 dark:bg-[#141414]/80 backdrop-blur-sm z-10">
                      <Loader2 className="w-7 h-7 text-[#FF5A36] animate-spin mb-2" />
                      <p className="text-xs text-[#737067] dark:text-[#A09D95] font-mono">Loading creative asset...</p>
                    </div>
                  )}

                  {!imageLoadError ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={posterImage}
                        alt={`${productName} Campaign Poster`}
                        onLoad={() => setIsImageLoading(false)}
                        onError={() => {
                          setIsImageLoading(false);
                          setImageLoadError(true);
                        }}
                        className="max-h-[480px] w-auto max-w-full object-contain rounded-lg shadow-paper border border-[#E5E2DC] dark:border-[#2E2E2E]"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={posterImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded bg-[#171717] dark:bg-[#F5F5F0] text-white dark:text-[#121212] hover:bg-[#2E2E2E] dark:hover:bg-white inline-flex items-center gap-1.5 text-xs font-semibold shadow-md"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>Full View</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 px-4 flex flex-col items-center justify-center text-center">
                      <AlertCircle className="w-8 h-8 text-[#FF5A36] mb-2" />
                      <p className="text-xs font-bold text-[#171717] dark:text-[#F5F5F0] mb-1">Image generated by AI</p>
                      <p className="text-xs text-[#737067] dark:text-[#A09D95] max-w-xs mb-3">Direct preview blocked by host cross-origin headers.</p>
                      <a
                        href={posterImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded bg-[#171717] dark:bg-[#F5F5F0] text-white dark:text-[#121212]"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open Image Directly</span>
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-16 px-6 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-[#EAE7E0] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] flex items-center justify-center text-[#737067] dark:text-[#A09D95] mb-3 font-mono text-xs font-bold">
                    NA
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717] dark:text-[#F5F5F0] mb-1 font-mono">
                    Poster generation was unavailable.
                  </h4>
                  <p className="text-xs text-[#737067] dark:text-[#A09D95] max-w-xs leading-relaxed">
                    Image generation was skipped or image provider node was unavailable during this workflow execution.
                  </p>
                </div>
              )}
            </div>

            {/* Action Bar */}
            {posterImage && (
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={posterImage}
                  download={`poster-${campaignId}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-[#171717] hover:bg-[#2E2E2E] dark:bg-[#F5F5F0] dark:text-[#121212] dark:hover:bg-white transition-all shadow-paper-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Creative</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(posterImage, 'poster-url')}
                  className="px-4 py-2.5 rounded-lg text-xs font-mono text-[#171717] dark:text-[#F5F5F0] bg-[#FAF9F6] dark:bg-[#222222] hover:bg-[#F0EFEA] dark:hover:bg-[#2C2C2C] border border-[#E5E2DC] dark:border-[#2E2E2E] transition-colors"
                >
                  {copiedKey === 'poster-url' ? 'Copied URL!' : 'Copy URL'}
                </button>
              </div>
            )}
          </div>

          {/* Poster Concepts Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#171717] dark:text-[#F5F5F0]">
                Poster Concepts & Directives
              </h3>
              <span className="text-xs font-mono text-[#737067] dark:text-[#A09D95]">3 Visual Angles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {posterConcepts.map((concept, idx) => {
                const copyKey = `concept-${idx}`;
                const isCopied = copiedKey === copyKey;

                return (
                  <div
                    key={concept.id}
                    className="editorial-card p-4 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] flex flex-col justify-between min-h-[170px]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#F0EFEA] dark:border-[#262626]">
                        <span className="text-xs font-mono font-bold text-[#171717] dark:text-[#F5F5F0]">{concept.title}</span>
                        {concept.text && (
                          <button
                            type="button"
                            onClick={() => handleCopy(concept.text, copyKey)}
                            className="p-1 rounded text-[#737067] dark:text-[#A09D95] hover:text-[#171717] dark:hover:text-[#F5F5F0]"
                            title="Copy Concept"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-[#389E0D]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>

                      {concept.text ? (
                        <p className="text-xs text-[#171717] dark:text-[#E0DDD5] leading-relaxed">
                          {concept.text}
                        </p>
                      ) : (
                        <p className="text-xs text-[#9C9990] dark:text-[#666666] italic">Concept {idx + 1} not specified.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Span 6): Captions, Hashtags, CTAs */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Section: CAMPAIGN COPY */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#171717] dark:text-[#F5F5F0]">
                Campaign Copy Options
              </h3>
              <span className="text-xs font-mono text-[#737067] dark:text-[#A09D95]">3 Tonal Styles</span>
            </div>

            <div className="space-y-4">
              {captionsToDisplay.map((cap, idx) => {
                const copyKey = `caption-${idx}`;
                const isCopied = copiedKey === copyKey;

                return (
                  <div
                    key={idx}
                    className="editorial-card p-5 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#F0EFEA] dark:border-[#262626]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#171717] dark:text-[#F5F5F0]">{cap.type}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FAF9F6] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] text-[#737067] dark:text-[#A09D95]">
                          {cap.type === 'Promotional' ? 'High Conversion' : cap.type === 'Creative' ? 'Storytelling' : 'Authority'}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={!cap.text}
                        onClick={() => handleCopy(cap.text, copyKey)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-md transition-all ${
                          isCopied
                            ? 'bg-[#F6FFED] dark:bg-[#132A15] text-[#389E0D] dark:text-[#95DE64] border border-[#B7EB8F] dark:border-[#274916]'
                            : 'bg-[#FAF9F6] dark:bg-[#222222] hover:bg-[#F0EFEA] dark:hover:bg-[#2C2C2C] text-[#171717] dark:text-[#F5F5F0] border border-[#E5E2DC] dark:border-[#2E2E2E]'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-[#389E0D] dark:text-[#95DE64]" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {cap.text ? (
                      <p className="text-xs sm:text-sm text-[#171717] dark:text-[#E0DDD5] leading-relaxed whitespace-pre-wrap font-sans">
                        {cap.text}
                      </p>
                    ) : (
                      <p className="text-xs text-[#9C9990] dark:text-[#666666] italic">
                        Caption format unavailable for this variation.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: HASHTAGS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#171717] dark:text-[#F5F5F0]">
                Hashtags
              </h3>

              {hashtagsList.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleCopy(hashtagsString, 'hashtags-all')}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-md transition-all ${
                    copiedKey === 'hashtags-all'
                      ? 'bg-[#F6FFED] dark:bg-[#132A15] text-[#389E0D] dark:text-[#95DE64] border border-[#B7EB8F] dark:border-[#274916]'
                      : 'bg-[#FAF9F6] dark:bg-[#222222] hover:bg-[#F0EFEA] dark:hover:bg-[#2C2C2C] text-[#171717] dark:text-[#F5F5F0] border border-[#E5E2DC] dark:border-[#2E2E2E]'
                  }`}
                >
                  {copiedKey === 'hashtags-all' ? (
                    <>
                      <Check className="w-3 h-3 text-[#389E0D] dark:text-[#95DE64]" />
                      <span>Copied All!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Hashtags</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="editorial-card p-5 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A]">
              {hashtagsList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {hashtagsList.map((tag, idx) => (
                    <span
                      key={idx}
                      onClick={() => handleCopy(tag, `tag-${idx}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FAF9F6] dark:bg-[#222222] hover:bg-[#F0EFEA] dark:hover:bg-[#2C2C2C] text-xs font-mono text-[#171717] dark:text-[#F5F5F0] border border-[#E5E2DC] dark:border-[#2E2E2E] cursor-pointer transition-colors"
                      title="Click to copy single hashtag"
                    >
                      <span>{tag}</span>
                      {copiedKey === `tag-${idx}` && <Check className="w-3 h-3 text-[#389E0D] dark:text-[#95DE64]" />}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#9C9990] dark:text-[#666666] italic">No hashtags generated in this run.</p>
              )}
            </div>
          </div>

          {/* Section: CALL TO ACTION (CTA) */}
          {ctaList.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#171717] dark:text-[#F5F5F0]">
                  Call to Action Options
                </h3>
                <span className="text-xs font-mono text-[#737067] dark:text-[#A09D95]">{ctaList.length} Options</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ctaList.map((cta, idx) => {
                  const copyKey = `cta-${idx}`;
                  const isCopied = copiedKey === copyKey;

                  return (
                    <div
                      key={idx}
                      className="editorial-card p-3.5 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] flex items-center justify-between gap-2"
                    >
                      <span className="text-xs font-bold text-[#171717] dark:text-[#F5F5F0] truncate">
                        "{cta}"
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(cta, copyKey)}
                        className={`p-1.5 rounded text-xs transition-all flex-shrink-0 ${
                          isCopied ? 'bg-[#F6FFED] dark:bg-[#132A15] text-[#389E0D] dark:text-[#95DE64]' : 'text-[#737067] dark:text-[#A09D95] hover:text-[#171717] dark:hover:text-[#F5F5F0]'
                        }`}
                        title="Copy CTA"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-[#389E0D] dark:text-[#95DE64]" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULL WIDTH: Reel Storyboard Timeline */}
      <div className="pt-8 border-t border-[#E5E2DC] dark:border-[#262626] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#171717] dark:text-[#F5F5F0] font-sans">
              Reel & Short-Form Storyboard
            </h3>
            <p className="text-xs text-[#737067] dark:text-[#A09D95] font-mono mt-0.5">
              Scene-by-scene script sequence & visual cues
            </p>
          </div>
          <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-[#EAE7E0] dark:bg-[#222222] text-[#171717] dark:text-[#F5F5F0] font-semibold border border-[#E5E2DC] dark:border-[#2E2E2E]">
            {storyboardRows.length > 0 ? `${storyboardRows.length} Scenes` : 'Video Script'}
          </span>
        </div>

        {storyboardRows.length > 0 ? (
          <div className="space-y-6">
            {/* Timeline connector bar on desktop */}
            <div className="hidden lg:flex items-center justify-between text-xs font-mono text-[#737067] dark:text-[#A09D95] px-4">
              {storyboardRows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#171717] dark:bg-[#F5F5F0] text-white dark:text-[#121212] flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-[#171717] dark:text-[#F5F5F0]">{row.stage || `Scene 0${idx + 1}`}</span>
                  {idx < storyboardRows.length - 1 && (
                    <span className="text-[#D0CCC3] dark:text-[#333333] mx-4">──────────</span>
                  )}
                </div>
              ))}
            </div>

            {/* Horizontal Grid of Scene Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {storyboardRows.map((row, idx) => (
                <div
                  key={idx}
                  className="editorial-card p-4 bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F0EFEA] dark:border-[#262626] text-[11px] font-mono">
                      <span className="font-bold text-[#FF5A36]">{row.scene}</span>
                      <span className="text-[#737067] dark:text-[#A09D95]">{row.duration}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#737067] dark:text-[#A09D95]">Visual</span>
                      <p className="text-xs text-[#171717] dark:text-[#E0DDD5] font-medium leading-snug mt-0.5">
                        {row.visual}
                      </p>
                    </div>

                    {row.onScreenText !== '—' && (
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#737067] dark:text-[#A09D95]">Overlay Text</span>
                        <p className="text-xs text-[#171717] dark:text-[#F5F5F0] bg-[#FAF9F6] dark:bg-[#222222] p-1.5 rounded border border-[#E5E2DC] dark:border-[#2E2E2E] font-mono mt-0.5">
                          "{row.onScreenText}"
                        </p>
                      </div>
                    )}

                    {row.voiceover !== '—' && (
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#737067] dark:text-[#A09D95]">Voiceover</span>
                        <p className="text-xs text-[#737067] dark:text-[#A09D95] italic leading-snug mt-0.5">
                          "{row.voiceover}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#F0EFEA] dark:border-[#262626] text-[10px] font-mono text-[#737067] dark:text-[#A09D95] flex items-center justify-between">
                    <span>Transition:</span>
                    <span className="text-[#171717] dark:text-[#F5F5F0] font-semibold">{row.transition}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="editorial-card p-12 text-center text-[#737067] dark:text-[#A09D95] bg-white dark:bg-[#1A1A1A] border-[#E5E2DC] dark:border-[#2A2A2A]">
            <Film className="w-6 h-6 text-[#9C9990] dark:text-[#666666] mx-auto mb-2" />
            <p className="text-xs font-mono text-[#171717] dark:text-[#F5F5F0]">
              {campaign.videoConcept || 'No video storyboard scenes returned in this brief execution.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
