import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface SuggestionPromptProps {
  prompt: string;
  label?: string;
  onSelect: (prompt: string) => void;
}

export const SuggestionPrompt: React.FC<SuggestionPromptProps> = ({
  prompt,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(prompt)}
      className="group w-full text-left px-3.5 py-2.5 bg-white hover:bg-[#F8FAFC] active:bg-[#F1F5F9] border border-[#DCE1E7] hover:border-[#94A3B8] rounded-[6px] shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors duration-150 flex items-center justify-between gap-3 cursor-pointer"
    >
      <span className="text-[14px] font-normal text-[#1E242B] group-hover:text-[#2C7A7B] leading-5 transition-colors duration-150">
        {prompt}
      </span>
      <ArrowUpRight
        className="w-4 h-4 text-[#8893A2] group-hover:text-[#2C7A7B] shrink-0 transition-colors duration-150"
        aria-hidden="true"
      />
    </button>
  );
};
