import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { TnnmcEmblem } from './TnnmcEmblem';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome }) => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="w-full bg-white border-b border-[#E2E8F0]">
      {/* Restrained 3px institutional crimson top bar */}
      <div className="h-[3px] w-full bg-[#2C7A7B]" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex flex-row items-center justify-between gap-4">
        {/* Left / Center Brand Area: Emblem + Official Name */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="group flex items-center gap-3.5 sm:gap-4 text-left focus:outline-none rounded-sm cursor-pointer"
          aria-label="Nightingale chatbot - Home"
        >
          <TnnmcEmblem size={56} className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" alt="Nightingale chatbot logo" />
          <div className="text-left">
            <span
              className="block text-[18px] sm:text-[20px] md:text-[22px] font-bold text-[#1B4E7B] leading-snug"
              style={{ fontFamily: "'Libre Baskerville', Georgia, Cambria, serif" }}
            >
              Nightingale chatbot
            </span>
          </div>
        </button>

        {/* Top-right Theme Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            aria-label={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="h-9 w-9 inline-flex items-center justify-center text-[#5A6573] hover:text-[#1E242B] hover:bg-[#F1F5F9] rounded-[6px] transition-colors duration-150 cursor-pointer"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-[#475569]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
