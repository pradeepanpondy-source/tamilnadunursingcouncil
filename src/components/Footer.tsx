import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

type FooterModalType = 'privacy' | 'disclaimer' | null;

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<FooterModalType>(null);

  return (
    <>
      <footer className="w-full bg-white border-t border-[#E2E8F0] mt-auto shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[#5A6573]">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="font-semibold text-[#1E242B]">
              Tamil Nadu Nurses &amp; Midwives Council
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1.5 text-[#475569]">
              <a href="tel:+914446786539" className="hover:text-[#2C7A7B] transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" /></svg>
                +91-44-4678 6539
              </a>
              <span className="hidden sm:inline text-[#CBD5E1]">|</span>
              <a href="mailto:info@tamilnadunursingcouncil.com" className="hover:text-[#2C7A7B] transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4.2l-8 5-8-5V6l8 5 8-5v2.2z" /></svg>
                info@tamilnadunursingcouncil.com
              </a>
            </div>
          </div>

          <nav
            aria-label="Institutional footer navigation"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-2 md:mt-0"
          >
            <a
              href="https://www.tamilnadunursingcouncil.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#2C7A7B] hover:underline underline-offset-4 transition-colors duration-150 whitespace-nowrap py-0.5"
            >
              Official Website
            </a>

            <span className="text-[#CBD5E1] select-none" aria-hidden="true">
              ·
            </span>

            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="hover:text-[#2C7A7B] hover:underline underline-offset-4 transition-colors duration-150 whitespace-nowrap py-0.5 cursor-pointer"
            >
              Privacy
            </button>

            <span className="text-[#CBD5E1] select-none" aria-hidden="true">
              ·
            </span>

            <button
              type="button"
              onClick={() => setActiveModal('disclaimer')}
              className="hover:text-[#2C7A7B] hover:underline underline-offset-4 transition-colors duration-150 whitespace-nowrap py-0.5 cursor-pointer"
            >
              Disclaimer
            </button>
          </nav>
        </div>
      </footer>

      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-white border border-[#DCE1E7] rounded-[8px] shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-[3px] w-full bg-[#2C7A7B]" aria-hidden="true" />
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <h2
                id="footer-modal-title"
                className="text-[16px] font-semibold text-[#1E242B]"
              >
                {activeModal === 'privacy' ? 'Privacy Information' : 'Institutional Disclaimer'}
              </h2>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Close dialog"
                className="p-1.5 text-[#5A6573] hover:text-[#1E242B] hover:bg-[#F1F5F9] rounded-[4px] transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 text-[14px] text-[#334155] leading-6 space-y-3">
              {activeModal === 'privacy' ? (
                <p>
                  This authentication interface provides entry to the Tamil Nadu Nurses &amp; Midwives Council (TNNMC) digital services. For complete institutional privacy policies and official council notices, please refer to the official TNNMC website.
                </p>
              ) : (
                <p>
                  This portal serves as the authentication entry point for Tamil Nadu Nurses &amp; Midwives Council digital services. Official notices, circulars, and council resources are published on the official TNNMC website.
                </p>
              )}

              <div className="pt-2">
                <a
                  href="https://www.tamilnadunursingcouncil.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2C7A7B] hover:underline underline-offset-4"
                >
                  <span>Visit www.tamilnadunursingcouncil.com</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-[13px] font-semibold text-[#1E242B] bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] rounded-[6px] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
