import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { CreateCampaign } from './pages/CreateCampaign';
import { CampaignResults } from './pages/CampaignResults';
import { CampaignHistory } from './pages/CampaignHistory';
import { AboutUs } from './pages/AboutUs';

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0] dark:bg-[#121212] text-[#171717] dark:text-[#F5F5F0] selection:bg-[#FF5A36] selection:text-white transition-colors duration-200 relative">
      <Navbar />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCampaign />} />
          <Route path="/campaigns" element={<CampaignResults />} />
          <Route path="/history" element={<CampaignHistory />} />
          <Route path="/about" element={<AboutUs />} />
          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
