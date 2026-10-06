import React, { useEffect, useRef } from 'react';
import { Message } from '../../types/chat';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';

export interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll within the list's own scroll container — not the page
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  return (
    /*
     * overflow-y-auto here — this element IS the scroll container.
     * h-full + min-h-0 are set by the parent; this fills the available space.
     */
    <div
      role="log"
      aria-live="polite"
      aria-label="Conversation transcript"
      className="h-full overflow-y-auto px-4 sm:px-6 pt-4"
    >
      {/* Constrain conversation width for readability */}
      <div className="max-w-[820px] mx-auto">
        <div className="divide-y divide-[#E2E8F0]/60">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>

        {isTyping && <TypingIndicator />}

        {/* Spacer at the bottom so the last message is not flush against the composer */}
        <div ref={bottomRef} className="h-6" aria-hidden="true" />
      </div>
    </div>
  );
};
