import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  ExternalLink,
  Trash2,
  Camera,
  CheckCircle2,
  User,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { ChatHeader } from './ChatHeader';
import { WelcomeState } from './WelcomeState';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { Footer } from '../Footer';
import {
  Conversation,
  Message,
  INITIAL_CONVERSATIONS,
  buildAssistantResponse,
} from '../../types/chat';

export interface ChatLayoutProps {
  userIdentifier: string;
  userName?: string;
  onSignOut: () => void;
}

const STORAGE_CONVERSATIONS_KEY = 'tnnmc_recent_conversations_v2';
const STORAGE_ACTIVE_CONV_KEY = 'tnnmc_active_conversation_id_v2';

/** Maximum ms to wait for a response before showing an error */
const RESPONSE_TIMEOUT_MS = 8000;

function loadPersistedConversations(): Conversation[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_CONVERSATIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage read errors
  }
  return INITIAL_CONVERSATIONS;
}

function loadPersistedActiveId(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_ACTIVE_CONV_KEY) || null;
  } catch {
    return null;
  }
}

function formatDisplayName(identifier: string, explicitName?: string): string {
  if (explicitName && explicitName.trim()) {
    return explicitName.trim();
  }
  const trimmed = identifier.trim();
  if (trimmed.includes('@')) {
    const localPart = trimmed.split('@')[0];
    const formatted = localPart
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return formatted || 'Registered Member';
  }
  return 'Registered Member';
}

function formatCurrentTime(): string {
  try {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Just now';
  }
}

function summarizeConversationTitle(prompt: string): string {
  const cleaned = prompt.replace(/[?!.]+$/, '').trim();
  if (cleaned.length <= 32) return cleaned;
  return `${cleaned.slice(0, 30).trim()}...`;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  userIdentifier,
  userName,
  onSignOut,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    loadPersistedConversations()
  );

  // Validate the persisted active ID against loaded conversations
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(() => {
    const persistedId = loadPersistedActiveId();
    const initialConvs = loadPersistedConversations();
    if (persistedId && initialConvs.some((c) => c.id === persistedId)) {
      return persistedId;
    }
    return null;
  });

  const [isTyping, setIsTyping] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<{
    content: string;
    attachmentName?: string;
  } | null>(null);

  // Sidebar states for desktop & mobile
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Restrained institutional dialogs for Profile, Help & Settings
  const [activeDialog, setActiveDialog] = useState<
    'profile' | 'help' | 'settings' | null
  >(null);

  // Track the active conversation ID in a ref for timeout callbacks
  const activeConvIdRef = useRef(activeConversationId);
  useEffect(() => {
    activeConvIdRef.current = activeConversationId;
  }, [activeConversationId]);

  // Response timeout guard ref
  const responseTimeoutRef = useRef<number | null>(null);

  // Persist Recent Conversations list in localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_CONVERSATIONS_KEY,
        JSON.stringify(conversations)
      );
    } catch {
      // Ignore storage write errors
    }
  }, [conversations]);

  // Persist active conversation selection
  useEffect(() => {
    try {
      if (activeConversationId) {
        window.localStorage.setItem(
          STORAGE_ACTIVE_CONV_KEY,
          activeConversationId
        );
      } else {
        window.localStorage.removeItem(STORAGE_ACTIVE_CONV_KEY);
      }
    } catch {
      // Ignore storage write errors
    }
  }, [activeConversationId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (responseTimeoutRef.current) {
        window.clearTimeout(responseTimeoutRef.current);
      }
    };
  }, []);

  // User Profile State (Frontend-only)
  const initialName = formatDisplayName(userIdentifier, userName);
  const isInitialEmail = userIdentifier.includes('@');

  const [profileName, setProfileName] = useState(initialName);
  const [profileEmail, setProfileEmail] = useState(
    isInitialEmail ? userIdentifier : ''
  );
  const [profileMobile, setProfileMobile] = useState(
    !isInitialEmail ? userIdentifier : ''
  );
  const [profileRegNumber, setProfileRegNumber] = useState('');
  const [profileQualification, setProfileQualification] =
    useState('B.Sc. Nursing');
  const [profileInstitution, setProfileInstitution] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const displayedName = profileName.trim() || initialName;
  const displayedEmail =
    profileEmail.trim() || profileMobile.trim() || userIdentifier;

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || null;

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      setIsDesktopSidebarCollapsed((prev) => !prev);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setIsTyping(false);
    setResponseError(null);
    setLastFailedMessage(null);
    if (responseTimeoutRef.current) {
      window.clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }
  };

  // Toggle mock chat states in the main window when clicking history items
  const handleSelectConversation = (id: string) => {
    setIsTyping(false);
    setResponseError(null);
    setLastFailedMessage(null);
    if (responseTimeoutRef.current) {
      window.clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }
    setActiveConversationId((prevId) => (prevId === id ? null : id));
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((conv) => conv.id !== id);
      return filtered.length > 0 ? filtered : INITIAL_CONVERSATIONS;
    });
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === id ? { ...conv, title: newTitle } : conv))
    );
  };

  const dispatchAssistantResponse = useCallback(
    (content: string, attachmentName: string | undefined, convId: string) => {
      // Clear any previous timeout
      if (responseTimeoutRef.current) {
        window.clearTimeout(responseTimeoutRef.current);
        responseTimeoutRef.current = null;
      }

      setResponseError(null);
      setIsTyping(true);

      // Safety timeout — if response never arrives, show error
      responseTimeoutRef.current = window.setTimeout(() => {
        setIsTyping(false);
        setResponseError(
          'Unable to get a response right now. Please try again.'
        );
        setLastFailedMessage({ content, attachmentName });
        responseTimeoutRef.current = null;
      }, RESPONSE_TIMEOUT_MS);

      // Simulate network delay then deliver mock response
      window.setTimeout(() => {
        // Cancel the safety timeout since we got a response
        if (responseTimeoutRef.current) {
          window.clearTimeout(responseTimeoutRef.current);
          responseTimeoutRef.current = null;
        }

        try {
          const replyData = buildAssistantResponse(content);
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            timestamp: formatCurrentTime(),
            content: replyData.content,
            blocks: replyData.blocks,
            source: replyData.source,
          };

          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === convId
                ? {
                    ...conv,
                    messages: [...conv.messages, assistantMessage],
                  }
                : conv
            )
          );
          setIsTyping(false);
          setResponseError(null);
          setLastFailedMessage(null);
        } catch {
          setIsTyping(false);
          setResponseError(
            'Unable to get a response right now. Please try again.'
          );
          setLastFailedMessage({ content, attachmentName });
        }
      }, 650);
    },
    []
  );

  const handleSendMessage = useCallback(
    (content: string, attachmentName?: string) => {
      if (!content.trim() && !attachmentName) return;
      if (isTyping) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        timestamp: formatCurrentTime(),
        content,
        attachmentName,
      };

      let targetConvId = activeConvIdRef.current;

      if (!targetConvId) {
        const newConvId = `conv-${Date.now()}`;
        const newConv: Conversation = {
          id: newConvId,
          title: summarizeConversationTitle(content),
          updatedAt: 'Just now',
          messages: [userMessage],
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(newConvId);
        targetConvId = newConvId;
      } else {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === targetConvId
              ? {
                  ...conv,
                  updatedAt: 'Just now',
                  messages: [...conv.messages, userMessage],
                }
              : conv
          )
        );
      }

      dispatchAssistantResponse(content, attachmentName, targetConvId);
    },
    [isTyping, dispatchAssistantResponse]
  );

  const handleRetry = useCallback(() => {
    if (!lastFailedMessage) return;
    setResponseError(null);
    handleSendMessage(lastFailedMessage.content, lastFailedMessage.attachmentName);
  }, [lastFailedMessage, handleSendMessage]);

  const handleResetHistory = () => {
    setConversations(INITIAL_CONVERSATIONS);
    setActiveConversationId(null);
    setIsTyping(false);
    setResponseError(null);
    setLastFailedMessage(null);
    try {
      window.localStorage.removeItem(STORAGE_CONVERSATIONS_KEY);
      window.localStorage.removeItem(STORAGE_ACTIVE_CONV_KEY);
    } catch {
      // Ignore storage errors
    }
    setActiveDialog(null);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        setProfileSavedNotice(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSavedNotice(true);
  };

  const openProfileModal = () => {
    setProfileSavedNotice(false);
    setActiveDialog('profile');
  };

  const hasActiveChat =
    activeConversation !== null && activeConversation.messages.length > 0;

  return (
    <div className="h-screen w-full overflow-hidden flex bg-[#F7F8FA] text-[#1E242B]">
      {/* Left Sidebar (Collapsible on Desktop, Slide-Out Drawer on Mobile) */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onNewChat={handleNewChat}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        userName={displayedName}
        userEmail={displayedEmail}
        avatarUrl={avatarUrl}
        onOpenProfile={openProfileModal}
        onOpenHelp={() => setActiveDialog('help')}
        onOpenSettings={() => setActiveDialog('settings')}
        onSignOut={onSignOut}
      />

      {/*
        Main Chat Area
        ─────────────
        flex column, fills remaining height:
          ① ChatHeader   — shrink-0 (fixed height)
          ② Chat viewport — flex-1, min-h-0 (takes remaining space)
               ├─ EMPTY STATE: flex column, centers welcome + composer naturally
               └─ ACTIVE STATE: scrollable message log + sticky composer
      */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* ① Fixed top bar */}
        <ChatHeader
          isSidebarOpen={!isDesktopSidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
          userName={displayedName}
          userEmail={displayedEmail}
          avatarUrl={avatarUrl}
          onOpenProfile={openProfileModal}
          onOpenSettings={() => setActiveDialog('settings')}
          onOpenHelp={() => setActiveDialog('help')}
          onSignOut={onSignOut}
        />

        {/* ② Chat viewport — stretches to fill remaining space */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

          {/* ── EMPTY STATE ─────────────────────────────────────────────────────
              A single flex column that is itself scrollable (for very small screens).
              justify-between pushes welcome content to top-center and composer
              to the bottom of this container. On taller screens, justify-center
              keeps everything vertically centered as a group.
          ─────────────────────────────────────────────────────────────────────── */}
          {!hasActiveChat && (
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
              {/* Centering wrapper — grows to fill, centers content vertically */}
              <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
                {/* Welcome section */}
                <WelcomeState onSelectPrompt={(prompt) => handleSendMessage(prompt)} />
              </div>

              {/* Composer — anchored just below the welcome content */}
              <div className="shrink-0 w-full">
                <ComposerArea
                  onSendMessage={handleSendMessage}
                  disabled={isTyping}
                  responseError={responseError}
                  onRetry={handleRetry}
                />
              </div>

              {/* Footer below composer in empty state */}
              <div className="shrink-0">
                <Footer />
              </div>
            </div>
          )}

          {/* ── ACTIVE CHAT STATE ────────────────────────────────────────────────
              MessageList scrolls independently inside flex-1.
              Composer is a shrink-0 strip pinned at the bottom.
          ─────────────────────────────────────────────────────────────────────── */}
          {hasActiveChat && (
            <>
              {/* Scrollable conversation log */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <MessageList
                  messages={activeConversation!.messages}
                  isTyping={isTyping}
                />
              </div>

              {/* Sticky composer at the bottom */}
              <div className="shrink-0 w-full">
                <ComposerArea
                  onSendMessage={handleSendMessage}
                  disabled={isTyping}
                  responseError={responseError}
                  onRetry={handleRetry}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Institutional Profile, Help & Settings Modals */}
      {activeDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 overflow-y-auto"
          onClick={() => setActiveDialog(null)}
        >
          <div
            className="w-full max-w-lg bg-white border border-[#DCE1E7] rounded-[8px] shadow-lg overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-[3px] w-full bg-[#2C7A7B]" aria-hidden="true" />

            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <h2
                id="chat-dialog-title"
                className="text-[16px] font-semibold text-[#1E242B]"
              >
                {activeDialog === 'profile'
                  ? 'Member Profile & Basic Details'
                  : activeDialog === 'help'
                  ? 'About TNNMC Assistant'
                  : 'Assistant Settings'}
              </h2>
              <button
                type="button"
                onClick={() => setActiveDialog(null)}
                aria-label="Close dialog"
                className="p-1.5 text-[#5A6573] hover:text-[#1E242B] hover:bg-[#F1F5F9] rounded-[4px] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {activeDialog === 'profile' && (
              <form onSubmit={handleSaveProfile} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                {profileSavedNotice && (
                  <div
                    role="status"
                    className="p-3.5 rounded-[6px] bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-2.5 text-[13px] font-medium text-[#166534]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" aria-hidden="true" />
                    <span>Profile details and photograph have been updated.</span>
                  </div>
                )}

                {/* Profile Picture Upload Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-[#E2E8F0]">
                  <div className="relative h-20 w-20 rounded-[8px] bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-center overflow-hidden shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayedName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-[#64748B]" aria-hidden="true" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-[14px] font-semibold text-[#1E242B]">
                        Profile Photograph
                      </div>
                      <p className="text-[12px] text-[#5A6573] mt-0.5">
                        Upload a clear passport-style photograph (JPG or PNG)
                      </p>
                    </div>

                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      aria-hidden="true"
                      tabIndex={-1}
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="px-3 py-1.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1E242B] bg-white hover:bg-[#F8FAFC] active:bg-[#F1F5F9] border border-[#CBD5E1] rounded-[6px] transition-colors cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#2C7A7B]" aria-hidden="true" />
                        <span>{avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                      </button>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarUrl(undefined);
                            setProfileSavedNotice(false);
                          }}
                          className="px-3 py-1.5 text-[13px] font-medium text-[#2C7A7B] hover:bg-[#F0FDFA]/60 rounded-[6px] transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Basic Details Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="profile-full-name"
                      className="block text-[13px] font-medium text-[#1E242B] mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="profile-full-name"
                      type="text"
                      value={profileName}
                      onChange={(e) => {
                        setProfileName(e.target.value);
                        setProfileSavedNotice(false);
                      }}
                      placeholder="Enter your full name"
                      className="w-full h-10 px-3.5 text-[14px] text-[#1E242B] bg-white border border-[#CBD5E1] rounded-[6px] focus:outline-none focus:border-[#2C7A7B]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-email"
                      className="block text-[13px] font-medium text-[#1E242B] mb-1.5"
                    >
                      Registered Email Address
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      value={profileEmail}
                      onChange={(e) => {
                        setProfileEmail(e.target.value);
                        setProfileSavedNotice(false);
                      }}
                      placeholder="Enter email address"
                      className="w-full h-10 px-3.5 text-[14px] text-[#1E242B] bg-white border border-[#CBD5E1] rounded-[6px] focus:outline-none focus:border-[#2C7A7B]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-mobile"
                      className="block text-[13px] font-medium text-[#1E242B] mb-1.5"
                    >
                      Mobile Number
                    </label>
                    <input
                      id="profile-mobile"
                      type="tel"
                      value={profileMobile}
                      onChange={(e) => {
                        setProfileMobile(e.target.value);
                        setProfileSavedNotice(false);
                      }}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full h-10 px-3.5 text-[14px] text-[#1E242B] bg-white border border-[#CBD5E1] rounded-[6px] focus:outline-none focus:border-[#2C7A7B]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-reg-no"
                      className="block text-[13px] font-medium text-[#1E242B] mb-1.5"
                    >
                      TNNMC Registration Number
                    </label>
                    <input
                      id="profile-reg-no"
                      type="text"
                      value={profileRegNumber}
                      onChange={(e) => {
                        setProfileRegNumber(e.target.value);
                        setProfileSavedNotice(false);
                      }}
                      placeholder="e.g., RN-104582"
                      className="w-full h-10 px-3.5 text-[14px] text-[#1E242B] bg-white border border-[#CBD5E1] rounded-[6px] focus:outline-none focus:border-[#2C7A7B]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-qualification"
                      className="block text-[13px] font-medium text-[#1E242B] mb-1.5"
                    >
                      Nursing Qualification
                    </label>
                    <select
                      id="profile-qualification"
                      value={profileQualification}
                      onChange={(e) => {
                        setProfileQualification(e.target.value);
                        setProfileSavedNotice(false);
                      }}
                      className="w-full h-10 px-3 text-[14px] text-[#1E242B] bg-white border border-[#CBD5E1] rounded-[6px] focus:outline-none focus:border-[#2C7A7B]"
                    >
                      <option value="B.Sc. Nursing">B.Sc. Nursing</option>
                      <option value="General Nursing and Midwifery (GNM)">
                        General Nursing and Midwifery (GNM)
                      </option>
                      <option value="Post-Basic B.Sc. Nursing">
                        Post-Basic B.Sc. Nursing
                      </option>
                      <option value="M.Sc. Nursing">M.Sc. Nursing</option>
                      <option value="Auxiliary Nurse Midwife (ANM)">
                        Auxiliary Nurse Midwife (ANM)
                      </option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="profile-institution"
                      className="block text-[13px] font-medium text-[#1E242B] mb-1.5"
                    >
                      Institution / Hospital Name (Optional)
                    </label>
                    <input
                      id="profile-institution"
                      type="text"
                      value={profileInstitution}
                      onChange={(e) => {
                        setProfileInstitution(e.target.value);
                        setProfileSavedNotice(false);
                      }}
                      placeholder="Enter current hospital or nursing institution"
                      className="w-full h-10 px-3.5 text-[14px] text-[#1E242B] bg-white border border-[#CBD5E1] rounded-[6px] focus:outline-none focus:border-[#2C7A7B]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveDialog(null)}
                    className="h-10 px-4 text-[13px] font-semibold text-[#1E242B] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-[6px] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-5 text-[13px] font-semibold text-white bg-[#2C7A7B] hover:bg-[#286A6B] active:bg-[#1F5050] rounded-[6px] shadow-[0_1px_2px_rgba(15,23,42,0.08)] transition-colors cursor-pointer"
                  >
                    Save Details
                  </button>
                </div>
              </form>
            )}

            {activeDialog === 'help' && (
              <>
                <div className="p-6 text-[14px] text-[#334155] leading-6 space-y-3">
                  <p>
                    <strong>TNNMC Assistant</strong> provides guidance on Tamil Nadu Nurses &amp; Midwives Council services, including registration requirements, license status verification, renewal procedures, and Continuing Nursing Education (CNE) information.
                  </p>
                  <p>
                    Responses in this interface are for informational guidance. To submit official applications or verify live registry records, please use the official TNNMC website.
                  </p>
                  <div className="pt-1">
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
                    onClick={() => setActiveDialog(null)}
                    className="px-4 py-2 text-[13px] font-semibold text-[#1E242B] bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] rounded-[6px] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </>
            )}

            {activeDialog === 'settings' && (
              <>
                <div className="p-6 text-[14px] text-[#334155] space-y-4">
                  <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px]">
                    <div className="text-[12px] font-medium text-[#5A6573]">
                      Signed-in Account
                    </div>
                    <div className="text-[14px] font-semibold text-[#1E242B] mt-0.5 break-all">
                      {displayedEmail}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#E2E8F0]">
                    <div>
                      <div className="text-[14px] font-medium text-[#1E242B]">
                        Conversation History
                      </div>
                      <div className="text-[12px] text-[#5A6573]">
                        Restore default demonstration conversations
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetHistory}
                      className="px-3 py-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#2C7A7B] bg-white hover:bg-[#F0FDFA]/60 border border-[#CBD5E1] rounded-[6px] transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
                <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveDialog(null)}
                    className="px-4 py-2 text-[13px] font-semibold text-[#1E242B] bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] rounded-[6px] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   ComposerArea
   Wraps MessageComposer + optional error banner.
   Keeps all composer chrome in one place so both empty-state and active-chat
   render identical composer UX.
───────────────────────────────────────────────────────────────────────────── */
interface ComposerAreaProps {
  onSendMessage: (content: string, attachmentName?: string) => void;
  disabled: boolean;
  responseError: string | null;
  onRetry: () => void;
}

const ComposerArea: React.FC<ComposerAreaProps> = ({
  onSendMessage,
  disabled,
  responseError,
  onRetry,
}) => {
  return (
    <div className="bg-[#F7F8FA] border-t border-[#E2E8F0]/70">
      {/* Error banner — shown when assistant response fails */}
      {responseError && (
        <div
          role="alert"
          className="max-w-[780px] mx-auto px-4 sm:px-6 pt-3"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#FFF7ED] border border-[#FED7AA] rounded-[8px] text-[13px]">
            <span className="text-[#92400E] font-medium">{responseError}</span>
            <button
              type="button"
              onClick={onRetry}
              className="shrink-0 px-3 py-1.5 text-[13px] font-semibold text-[#C2410C] bg-white border border-[#FED7AA] hover:bg-[#FFF7ED] rounded-[6px] transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <MessageComposer
        onSendMessage={onSendMessage}
        disabled={disabled}
      />
    </div>
  );
};
