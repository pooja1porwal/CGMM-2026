import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Plus, 
  User, 
  Menu, 
  X,
  Sun,
  Moon,
  Code2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Create', path: '/create' },
    { name: 'Campaigns', path: '/campaigns' },
    { name: 'History', path: '/history' },
    { name: 'About Us', path: '/about' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E2DC] dark:border-[#262626] bg-[#F7F5F0]/95 dark:bg-[#121212]/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Creator Attribution */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none"
          >
            {/* Minimalist Geometric Studio Logo Mark */}
            <div className="w-7 h-7 bg-[#171717] dark:bg-[#F5F5F0] rounded-md flex items-center justify-center text-white transition-transform group-hover:scale-105">
              <span className="w-2.5 h-2.5 bg-[#FF5A36] rounded-sm"></span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-[#171717] dark:text-[#F5F5F0] uppercase font-sans">
                SOCIAL AI
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#737067] dark:text-[#A09D95] px-1.5 py-0.5 rounded bg-[#EAE7E0] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E]">
                Studio
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-[#737067] dark:text-[#A09D95] ml-1">
                by <span className="text-[#171717] dark:text-[#F5F5F0] font-semibold">Divyansh Chourey</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative py-1.5 ${
                    active
                      ? 'text-[#171717] dark:text-[#F5F5F0] font-semibold'
                      : 'text-[#737067] dark:text-[#A09D95] hover:text-[#171717] dark:hover:text-[#F5F5F0]'
                  }`}
                >
                  <span>{link.name}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF5A36] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[#737067] hover:text-[#171717] dark:text-[#A09D95] dark:hover:text-[#F5F5F0] hover:bg-[#EAE7E0] dark:hover:bg-[#222222] transition-colors focus:outline-none"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[#FF5A36] transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-[#171717] transition-transform rotate-0 hover:-rotate-12" />
              )}
            </button>

            <div className="h-4 w-px bg-[#E5E2DC] dark:bg-[#262626]"></div>

            <Link
              to="/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#171717] hover:bg-[#2E2E2E] dark:bg-[#F5F5F0] dark:text-[#121212] dark:hover:bg-white active:scale-95 transition-all shadow-paper-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>New Campaign</span>
            </Link>

            <div className="h-4 w-px bg-[#E5E2DC] dark:bg-[#262626]"></div>

            <div
              className="w-8 h-8 rounded-full bg-[#EAE7E0] dark:bg-[#222222] border border-[#E5E2DC] dark:border-[#2E2E2E] flex items-center justify-center text-[#171717] dark:text-[#F5F5F0] text-xs font-mono font-bold"
              title="Developed by Divyansh Chourey"
            >
              DC
            </div>
          </div>

          {/* Mobile Actions: Theme + Menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[#737067] dark:text-[#A09D95] hover:bg-[#EAE7E0] dark:hover:bg-[#222222] transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FF5A36]" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#171717] dark:text-[#F5F5F0] hover:bg-[#EAE7E0] dark:hover:bg-[#222222] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E2DC] dark:border-[#262626] bg-[#F7F5F0] dark:bg-[#181818] px-4 pt-3 pb-6 space-y-2 animate-fade-in">
          <div className="pb-2 mb-2 border-b border-[#E5E2DC] dark:border-[#262626] flex items-center justify-between text-xs font-mono text-[#737067] dark:text-[#A09D95] px-1">
            <span>SOCIAL AI STUDIO</span>
            <span>by Divyansh Chourey</span>
          </div>

          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#EAE7E0] dark:bg-[#252525] text-[#171717] dark:text-[#F5F5F0] font-semibold'
                    : 'text-[#737067] dark:text-[#A09D95] hover:text-[#171717] dark:hover:text-[#F5F5F0] hover:bg-[#F0EFEA] dark:hover:bg-[#202020]'
                }`}
              >
                <span>{link.name}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A36]"></span>}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[#E5E2DC] dark:border-[#262626] flex items-center justify-between">
            <Link
              to="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-xs font-semibold px-4 py-2.5 rounded-lg bg-[#171717] dark:bg-[#F5F5F0] text-white dark:text-[#121212]"
            >
              + Create Campaign
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
