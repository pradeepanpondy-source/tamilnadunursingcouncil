import React from 'react';
import { TnnmcEmblem } from './TnnmcEmblem';

interface HeaderProps {
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome }) => {
  return (
    <header className="w-full bg-white border-b border-[#E2E8F0]">
      {/* Restrained 3px institutional crimson top bar */}
      <div className="h-[3px] w-full bg-[#2C7A7B]" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left / Center Brand Area: Emblem + Tamil & English Official Name */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="group flex items-center gap-3.5 sm:gap-4 text-left focus:outline-none rounded-sm cursor-pointer"
          aria-label="Tamil Nadu Nurses and Midwives Council - Digital Services Home"
        >
          <TnnmcEmblem size={56} className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" />
          <div className="text-center sm:text-left">
            <span
              className="block text-[14px] sm:text-[17px] md:text-[19px] font-bold text-[#1B4E7B] leading-snug tracking-tight"
              style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}
            >
              தமிழ்நாடு செவிலியர் மற்றும் மகப்பேறு செவிலியர் அவையம்
            </span>
            <span
              className="block text-[15px] sm:text-[18px] md:text-[20px] font-bold text-[#1B4E7B] leading-snug mt-0.5"
              style={{ fontFamily: "'Libre Baskerville', Georgia, Cambria, serif" }}
            >
              Tamil Nadu Nurses and Midwives Council
            </span>
          </div>
        </button>

        {/* Top-right section removed as requested */}
      </div>
    </header>
  );
};
