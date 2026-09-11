import React, { createContext, useContext, useState } from 'react';

const CampaignContext = createContext(null);

export const initialCampaignData = {
  productName: '',
  productDescription: '',
  promotion: '',
  targetAudience: '',
  platform: 'Instagram',
  tone: 'Professional',
  language: 'English',
  brandColor: '#6366f1',
};

export const CampaignProvider = ({ children }) => {
  const [campaignData, setCampaignData] = useState(initialCampaignData);
  const [currentCampaign, setCurrentCampaign] = useState(null); // Real n8n campaign response { campaignId, campaign, inputData }
  const [campaignsList, setCampaignsList] = useState([]); // List of past generated campaigns
  const [notification, setNotification] = useState(null); // { message, type: 'info' | 'success' | 'error' }
  const [isGenerating, setIsGenerating] = useState(false);

  const updateField = (field, value) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setCampaignData(initialCampaignData);
  };

  const saveGeneratedCampaign = (campaignResult) => {
    setCurrentCampaign(campaignResult);
    setCampaignsList(prev => [
      {
        id: campaignResult.campaignId,
        createdAt: new Date().toISOString(),
        productName: campaignResult.inputData?.productName || campaignResult.campaign?.productName || 'Untitled Campaign',
        platform: campaignResult.inputData?.platform || campaignResult.campaign?.platform || 'Instagram',
        tone: campaignResult.inputData?.tone || campaignResult.campaign?.tone || 'Professional',
        data: campaignResult,
      },
      ...prev,
    ]);
  };

  const showNotification = (message, type = 'info', duration = 6000) => {
    setNotification({ message, type });
    if (duration > 0) {
      setTimeout(() => {
        setNotification(null);
      }, duration);
    }
  };

  const clearNotification = () => {
    setNotification(null);
  };

  return (
    <CampaignContext.Provider
      value={{
        campaignData,
        setCampaignData,
        updateField,
        resetForm,
        currentCampaign,
        setCurrentCampaign,
        saveGeneratedCampaign,
        campaignsList,
        setCampaignsList,
        notification,
        showNotification,
        clearNotification,
        isGenerating,
        setIsGenerating,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};
