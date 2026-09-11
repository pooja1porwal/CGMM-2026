/**
 * Campaign API Service for Social AI
 * Connects frontend to the n8n Cloud webhook endpoint.
 */

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://divyansh1.app.n8n.cloud/webhook/social-content';
const REQUEST_TIMEOUT_MS = 180000; // 3 minutes for comprehensive AI workflow

/**
 * Sanitizes and strips sensitive trace information from error strings
 */
const sanitizeErrorMessage = (rawError) => {
  if (!rawError || typeof rawError !== 'string') {
    return 'The AI service encountered an unexpected error.';
  }

  // Handle n8n inactive webhook 404 notice gracefully
  if (rawError.toLowerCase().includes('not registered') || rawError.toLowerCase().includes('webhook')) {
    return 'The n8n production webhook is not active yet. Please toggle your workflow to "Active" in your n8n Cloud editor, then try again.';
  }

  // Strip HTML / markup
  if (rawError.includes('<!DOCTYPE') || rawError.includes('<html>')) {
    return 'The AI service returned an unexpected response.';
  }

  // Redact potential keys or secrets
  return rawError.replace(/(key|token|auth|bearer|secret)[a-z0-9_-]{10,}/gi, '[REDACTED]');
};

/**
 * Sends campaign brief payload to n8n webhook
 * @param {Object} campaignInput
 * @returns {Promise<Object>} Formatted campaign response
 */
export const generateCampaign = async (campaignInput) => {
  // Construct clean payload strictly adhering to required schema
  const payload = {
    productName: campaignInput.productName?.trim() || '',
    productDescription: campaignInput.productDescription?.trim() || '',
    promotion: campaignInput.promotion?.trim() || '',
    targetAudience: campaignInput.targetAudience?.trim() || '',
    platform: campaignInput.platform || 'Instagram',
    tone: campaignInput.tone || 'Professional',
    language: campaignInput.language || 'English',
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let serverError = '';
      try {
        const errorJson = await response.json();
        if (errorJson && errorJson.error) {
          serverError = errorJson.error;
        } else if (errorJson && errorJson.message) {
          serverError = errorJson.message;
        }
      } catch {
        // Non-JSON error response
      }

      if (serverError) {
        throw new Error(sanitizeErrorMessage(serverError));
      }
      throw new Error('The AI service returned an unexpected response.');
    }

    const data = await response.json();

    // Check explicit error in JSON response: { success: false, error: "..." }
    if (data && data.success === false) {
      const errMsg = data.error ? sanitizeErrorMessage(data.error) : 'The AI service returned an unexpected response.';
      throw new Error(errMsg);
    }

    // Normalize response structure safely
    // Handles case where n8n returns { success: true, campaignId, campaign: { ... } } or nested arrays or flat object
    const rootData = (Array.isArray(data) && data.length > 0) ? data[0] : data;
    const nestedCampaign = rootData?.campaign || {};
    
    // Merge top-level properties with nested campaign object to ensure no image or metadata fields are missed
    const campaignObj = (typeof nestedCampaign === 'object' && nestedCampaign !== null && Object.keys(nestedCampaign).length > 0)
      ? { ...rootData, ...nestedCampaign }
      : (typeof rootData === 'object' && rootData !== null ? rootData : {});

    const campaignId = rootData?.campaignId || rootData?.id || nestedCampaign?.campaignId || `CMP-${Math.floor(10000 + Math.random() * 90000)}`;

    if (!campaignObj || typeof campaignObj !== 'object') {
      throw new Error('The AI service returned an unexpected response.');
    }

    return {
      success: true,
      campaignId: campaignId,
      campaign: campaignObj,
      rawResponse: data,
      inputData: payload,
    };
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      throw new Error('Campaign generation is taking longer than expected. Please try again.');
    }

    if (err.message && (
      err.message.includes('Failed to fetch') ||
      err.message.includes('NetworkError') ||
      err.message.includes('fetch failed') ||
      err.message.includes('ERR_CONNECTION') ||
      err.message.includes('Load failed')
    )) {
      throw new Error('Unable to connect to the AI service. Please try again.');
    }

    // Re-throw sanitized error message
    throw new Error(err.message || 'The AI service returned an unexpected response.');
  }
};
