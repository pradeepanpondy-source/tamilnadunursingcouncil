import React from 'react';
import { TnnmcEmblem } from '../TnnmcEmblem';
import { SuggestionPrompt } from './SuggestionPrompt';
import { SUGGESTED_PROMPTS } from '../../types/chat';

export interface WelcomeStateProps {
  onSelectPrompt: (prompt: string) => void;
}

const QUICK_TOPIC_CHIPS = [
  {
    id: 'chip-license',
    label: 'License status',
    prompt: 'How can I check my license status?',
  },
  {
    id: 'chip-registration',
    label: 'Registration',
    prompt: 'What documents are required for registration?',
  },
  {
    id: 'chip-renewal',
    label: 'Renewal',
    prompt: 'How do I renew my registration?',
  },
  {
    id: 'chip-cne',
    label: 'CNE',
    prompt: 'How can I find information about CNE?',
  },
  {
    id: 'chip-services',
    label: 'Council services',
    prompt: 'What online services are provided by TNNMC?',
  },
];

export const WelcomeState: React.FC<WelcomeStateProps> = ({ onSelectPrompt }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-[720px] mx-auto flex flex-col items-center text-center">
        {/* Institutional Emblem */}
        <div className="mb-4">
          <TnnmcEmblem size={48} className="w-11 h-11 sm:w-12 sm:h-12" />
        </div>

        {/* Heading */}
        <h1 className="text-[22px] sm:text-[26px] font-semibold tracking-[-0.015em] text-[#1E242B] leading-8">
          How can I help you today?
        </h1>

        {/* Supporting text */}
        <p className="mt-2 max-w-[560px] text-[14px] sm:text-[15px] text-[#5A6573] leading-6">
          Ask about TNNMC services, registration, licensing, professional information and other council-related topics.
        </p>

        {/* Horizontally scrollable topic chips on mobile, centered row on desktop */}
        <div className="mt-5 w-full overflow-x-auto no-scrollbar">
          <div className="inline-flex sm:flex sm:flex-wrap items-center justify-start sm:justify-center gap-2 min-w-max sm:min-w-0 px-1 py-0.5">
            {QUICK_TOPIC_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => onSelectPrompt(chip.prompt)}
                className="px-3 py-1.5 text-[13px] font-medium text-[#475569] hover:text-[#2C7A7B] bg-white hover:bg-[#F8FAFC] active:bg-[#F1F5F9] border border-[#DCE1E7] hover:border-[#2C7A7B]/40 rounded-[6px] transition-colors duration-150 whitespace-nowrap cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lightweight suggested prompts */}
        <div
          aria-label="Suggested questions"
          className="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left"
        >
          {SUGGESTED_PROMPTS.map((item) => (
            <SuggestionPrompt
              key={item.id}
              prompt={item.prompt}
              label={item.label}
              onSelect={onSelectPrompt}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
