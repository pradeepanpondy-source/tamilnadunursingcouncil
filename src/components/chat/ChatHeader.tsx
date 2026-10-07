import React from 'react';
import { PanelLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="w-full bg-white border-b border-[#E2E8F0] shrink-0">
      {/* Restrained 3px institutional crimson top bar matching the login page */}
      <div className="h-[3px] w-full bg-[#2C7A7B]" aria-hidden="true" />

      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Sidebar Toggle + Council Title */}
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
              className="text-[15px] sm:text-[17px] lg:text-[18px] font-bold text-[#1B4E7B] truncate leading-snug block"
              style={{ fontFamily: "'Libre Baskerville', Georgia, Cambria, serif" }}
            >
              Nightingale chatbot
            </span>
          </div>
        </div>

        {/* Right Top Corner: Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
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

