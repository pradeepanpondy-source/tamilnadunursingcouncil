import React from 'react';
import { PanelLeft } from 'lucide-react';


export interface ChatHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onSignOut: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  userName,
  userEmail,
  avatarUrl,
  onOpenProfile,
  onOpenSettings,
  onOpenHelp,
  onSignOut,
}) => {
  return (
    <header className="w-full bg-white border-b border-[#E2E8F0] shrink-0">
      {/* Restrained 3px institutional crimson top bar matching the login page */}
      <div className="h-[3px] w-full bg-[#2C7A7B]" aria-hidden="true" />

      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Sidebar Toggle + Bilingual Tamil & English Council Title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="h-9 w-9 inline-flex items-center justify-center text-[#475569] hover:text-[#1E242B] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] rounded-[6px] transition-colors duration-150 shrink-0 cursor-pointer"
          >
            <PanelLeft className="w-4 h-4" aria-hidden="true" />
          </button>

          <div className="min-w-0">
            <span
              className="block text-[12px] sm:text-[14px] lg:text-[15px] font-bold text-[#1B4E7B] truncate leading-snug"
              style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}
            >
              தமிழ்நாடு செவிலியர் மற்றும் மகப்பேறு செவிலியர் அவையம்
            </span>
            <div className="flex items-baseline gap-2 min-w-0 mt-0.5">
              <span
                className="text-[13px] sm:text-[15px] lg:text-[16px] font-bold text-[#1B4E7B] truncate leading-snug"
                style={{ fontFamily: "'Libre Baskerville', Georgia, Cambria, serif" }}
              >
                Tamil Nadu Nurses and Midwives Council
              </span>
              <span className="hidden xl:inline-block text-[11px] font-medium text-[#5A6573] truncate">
                · TNNMC Assistant
              </span>
            </div>
          </div>
        </div>

        {/* Right Top Corner: Contact Details + Social Icons + User Profile Menu */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Profile and contact details removed as requested */}
        </div>
      </div>
    </header>
  );
};
