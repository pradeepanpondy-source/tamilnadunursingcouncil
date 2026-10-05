import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Plus,
  MessageSquare,
  HelpCircle,
  Settings,
  User,
  LogOut,
  X,
  MoreHorizontal,
  Share2,
  Pin,
  PinOff,
  Pencil,
  BookPlus,
  Trash2,
  Search,
  Link,
  CheckCheck,
  BookOpen,
} from 'lucide-react';
import { TnnmcEmblem } from '../TnnmcEmblem';
import { Conversation } from '../../types/chat';

export interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  onRenameConversation?: (id: string, newTitle: string) => void;
  onNewChat: () => void;
  isDesktopCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  onOpenProfile: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
}

const MOCK_NOTEBOOKS = [
  { id: 'nb-1', label: 'Registration Resources' },
  { id: 'nb-2', label: 'Nursing Council Notes' },
  { id: 'nb-3', label: 'Professional Development' },
];

// ─── Context Menu ──────────────────────────────────────────────────────────────
interface ContextMenuProps {
  convId: string;
  convTitle: string;
  isPinned: boolean;
  onClose: () => void;
  onShare: () => void;
  onPin: () => void;
  onRename: () => void;
  onAddToNotebook: () => void;
  onDelete: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  convTitle,
  isPinned,
  onClose,
  onShare,
  onPin,
  onRename,
  onAddToNotebook,
  onDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const items = [
    { icon: Share2, label: 'Share conversation', action: onShare },
    { icon: isPinned ? PinOff : Pin, label: isPinned ? 'Unpin' : 'Pin', action: onPin },
    { icon: Pencil, label: 'Rename', action: onRename },
    { icon: BookPlus, label: 'Add to notebook', action: onAddToNotebook },
  ];

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={`Options for ${convTitle}`}
      className="absolute right-0 top-8 z-50 w-[184px] bg-white border border-[#E2E8F0] rounded-[8px] shadow-lg py-1 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {items.map(({ icon: Icon, label, action }) => (
        <button
          key={label}
          type="button"
          role="menuitem"
          onClick={() => { action(); onClose(); }}
          className="w-full px-3 py-2 text-left text-[13px] text-[#1E242B] flex items-center gap-2.5 hover:bg-[#F1F5F9] transition-colors cursor-pointer"
        >
          <Icon className="w-3.5 h-3.5 text-[#5A6573] shrink-0" aria-hidden="true" />
          {label}
        </button>
      ))}
      <div className="my-1 border-t border-[#E2E8F0]" />
      <button
        type="button"
        role="menuitem"
        onClick={() => { onDelete(); onClose(); }}
        className="w-full px-3 py-2 text-left text-[13px] text-red-600 flex items-center gap-2.5 hover:bg-red-50 transition-colors cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        Delete
      </button>
    </div>
  );
};

// ─── Share Dialog ──────────────────────────────────────────────────────────────
interface ShareDialogProps {
  conv: Conversation;
  onClose: () => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ conv, onClose }) => {
  const mockLink = `https://tnnmc.gov.in/share/chat/${conv.id.slice(-8)}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(mockLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-dialog-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0F172A]/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-[10px] shadow-xl border border-[#E2E8F0] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[3px] w-full bg-[#2C7A7B]" />
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 id="share-dialog-title" className="text-[15px] font-semibold text-[#1E242B]">
            Share conversation
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-[#5A6573] hover:text-[#1E242B] hover:bg-[#F1F5F9] rounded-[4px] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <p className="text-[12px] font-medium text-[#64748B] mb-1">Conversation</p>
            <p className="text-[14px] font-medium text-[#1E242B] truncate">{conv.title}</p>
          </div>
          <div>
            <p className="text-[12px] font-medium text-[#64748B] mb-1.5">Share link</p>
            <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px] px-3 py-2">
              <Link className="w-3.5 h-3.5 text-[#5A6573] shrink-0" />
              <span className="text-[12px] text-[#334155] truncate flex-1">{mockLink}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full h-9 inline-flex items-center justify-center gap-2 text-[13px] font-semibold rounded-[6px] transition-colors cursor-pointer ${
              copied
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-[#2C7A7B] text-white hover:bg-[#286A6B]'
            }`}
          >
            {copied ? (
              <><CheckCheck className="w-4 h-4" /> Link copied!</>
            ) : (
              <><Link className="w-4 h-4" /> Copy link</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Rename Dialog ─────────────────────────────────────────────────────────────
interface RenameDialogProps {
  conv: Conversation;
  onSave: (newTitle: string) => void;
  onClose: () => void;
}

const RenameDialog: React.FC<RenameDialogProps> = ({ conv, onSave, onClose }) => {
  const [value, setValue] = useState(conv.title);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.select();
  }, []);

  const handleSave = () => {
    if (!value.trim()) { setError('Title cannot be empty.'); return; }
    onSave(value.trim());
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rename-dialog-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0F172A]/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-[10px] shadow-xl border border-[#E2E8F0] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[3px] w-full bg-[#2C7A7B]" />
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 id="rename-dialog-title" className="text-[15px] font-semibold text-[#1E242B]">Rename conversation</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1.5 text-[#5A6573] hover:text-[#1E242B] hover:bg-[#F1F5F9] rounded-[4px] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label htmlFor="rename-input" className="block text-[12px] font-medium text-[#64748B] mb-1.5">Conversation title</label>
            <input
              id="rename-input"
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onClose(); }}
              className="w-full h-9 px-3 text-[14px] text-[#1E242B] bg-white border border-[#CBD5E1] rounded-[6px] focus:outline-none focus:border-[#2C7A7B] focus:ring-2 focus:ring-[#2C7A7B]/15"
            />
            {error && <p className="text-[12px] text-red-600 mt-1">{error}</p>}
          </div>
          <div className="flex gap-2.5 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-[#475569] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-[6px] transition-colors cursor-pointer">Cancel</button>
            <button type="button" onClick={handleSave} className="px-4 py-2 text-[13px] font-semibold text-white bg-[#2C7A7B] hover:bg-[#286A6B] rounded-[6px] transition-colors cursor-pointer">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Notebook Dialog ───────────────────────────────────────────────────────────
interface NotebookDialogProps {
  conv: Conversation;
  onClose: () => void;
}

const NotebookDialog: React.FC<NotebookDialogProps> = ({ conv, onClose }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleAdd = () => {
    if (!selected) return;
    setConfirmed(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notebook-dialog-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0F172A]/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-[10px] shadow-xl border border-[#E2E8F0] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[3px] w-full bg-[#2C7A7B]" />
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 id="notebook-dialog-title" className="text-[15px] font-semibold text-[#1E242B]">Add to notebook</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1.5 text-[#5A6573] hover:text-[#1E242B] hover:bg-[#F1F5F9] rounded-[4px] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {confirmed ? (
            <div className="flex flex-col items-center gap-3 py-3 text-center">
              <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCheck className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-[14px] font-medium text-[#1E242B]">
                Added to <span className="font-semibold">{MOCK_NOTEBOOKS.find(n => n.id === selected)?.label}</span>
              </p>
              <p className="text-[12px] text-[#64748B] truncate max-w-[220px]">{conv.title}</p>
              <button type="button" onClick={onClose} className="mt-1 px-4 py-2 text-[13px] font-semibold text-white bg-[#2C7A7B] hover:bg-[#286A6B] rounded-[6px] transition-colors cursor-pointer">Done</button>
            </div>
          ) : (
            <>
              <p className="text-[12px] text-[#64748B]">Select a notebook for <span className="font-medium text-[#1E242B]">{conv.title}</span></p>
              <div className="space-y-1.5">
                {MOCK_NOTEBOOKS.map((nb) => (
                  <button
                    key={nb.id}
                    type="button"
                    onClick={() => setSelected(nb.id)}
                    className={`w-full px-3 py-2.5 text-left text-[13px] flex items-center gap-2.5 rounded-[6px] border transition-colors cursor-pointer ${
                      selected === nb.id
                        ? 'border-[#2C7A7B] bg-[#F0FDFA] text-[#1E242B] font-medium'
                        : 'border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#334155]'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#5A6573] shrink-0" />
                    {nb.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2.5 justify-end">
                <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-[#475569] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-[6px] transition-colors cursor-pointer">Cancel</button>
                <button type="button" onClick={handleAdd} disabled={!selected} className="px-4 py-2 text-[13px] font-semibold text-white bg-[#2C7A7B] hover:bg-[#286A6B] disabled:opacity-40 disabled:cursor-not-allowed rounded-[6px] transition-colors cursor-pointer">Add</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirmation Dialog ────────────────────────────────────────────────
interface DeleteDialogProps {
  conv: Conversation;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ conv, onConfirm, onClose }) => (
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="delete-dialog-title"
    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0F172A]/40"
    onClick={onClose}
  >
    <div
      className="w-full max-w-sm bg-white rounded-[10px] shadow-xl border border-[#E2E8F0] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="h-[3px] w-full bg-red-500" />
      <div className="p-5 space-y-4">
        <div>
          <h2 id="delete-dialog-title" className="text-[15px] font-semibold text-[#1E242B]">Delete this conversation?</h2>
          <p className="text-[13px] text-[#5A6573] mt-1">This action cannot be undone.</p>
          <p className="text-[13px] font-medium text-[#334155] mt-1 truncate">{conv.title}</p>
        </div>
        <div className="flex gap-2.5 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-[#475569] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-[6px] transition-colors cursor-pointer">Cancel</button>
          <button type="button" onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 text-[13px] font-semibold text-white bg-red-600 hover:bg-red-700 rounded-[6px] transition-colors cursor-pointer">Delete</button>
        </div>
      </div>
    </div>
  </div>
);

// ─── Conversation Item ─────────────────────────────────────────────────────────
interface ConvItemProps {
  conv: Conversation;
  isActive: boolean;
  isPinned: boolean;
  openMenuId: string | null;
  onSelect: () => void;
  onMenuOpen: (id: string) => void;
  onMenuClose: () => void;
  onShare: (conv: Conversation) => void;
  onPin: (id: string) => void;
  onRename: (conv: Conversation) => void;
  onAddToNotebook: (conv: Conversation) => void;
  onDelete: (conv: Conversation) => void;
}

const ConvItem: React.FC<ConvItemProps> = ({
  conv, isActive, isPinned, openMenuId,
  onSelect, onMenuOpen, onMenuClose,
  onShare, onPin, onRename, onAddToNotebook, onDelete,
}) => {
  const isMenuOpen = openMenuId === conv.id;
  const lastMessage = conv.messages[conv.messages.length - 1];

  return (
    <div
      className={`group relative w-full rounded-[6px] transition-colors duration-150 ${
        isActive
          ? 'bg-[#EEF9F9] border border-[#2C7A7B]/30'
          : 'hover:bg-[#F8FAFC] border border-transparent'
      }`}
    >
      <button
        type="button"
        aria-current={isActive ? 'page' : undefined}
        onClick={onSelect}
        className="w-full px-2.5 py-2 text-left flex items-start gap-2.5 cursor-pointer pr-9"
      >
        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          {isPinned && <Pin className="w-3 h-3 text-[#2C7A7B]" aria-label="Pinned" />}
          {!isPinned && (
            <MessageSquare
              className={`w-3.5 h-3.5 ${isActive ? 'text-[#2C7A7B]' : 'text-[#64748B]'}`}
              aria-hidden="true"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className={`text-[13px] truncate leading-snug ${isActive ? 'text-[#2C7A7B] font-semibold' : 'text-[#1E242B] font-medium'}`}>
            {conv.title}
          </div>
          {lastMessage && (
            <div className="mt-0.5 text-[11px] text-[#64748B] truncate">
              {lastMessage.content}
            </div>
          )}
        </div>
      </button>

      {/* Three-dot menu trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          isMenuOpen ? onMenuClose() : onMenuOpen(conv.id);
        }}
        aria-label={`Options for ${conv.title}`}
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        className={`absolute right-1.5 top-2 h-6 w-6 inline-flex items-center justify-center text-[#64748B] hover:text-[#1E242B] hover:bg-[#E2E8F0] rounded-[4px] transition-all cursor-pointer ${
          isMenuOpen ? 'opacity-100 bg-[#E2E8F0]' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
        }`}
      >
        <MoreHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
      </button>

      {isMenuOpen && (
        <ContextMenu
          convId={conv.id}
          convTitle={conv.title}
          isPinned={isPinned}
          onClose={onMenuClose}
          onShare={() => onShare(conv)}
          onPin={() => onPin(conv.id)}
          onRename={() => onRename(conv)}
          onAddToNotebook={() => onAddToNotebook(conv)}
          onDelete={() => onDelete(conv)}
        />
      )}
    </div>
  );
};

// ─── Main Sidebar ──────────────────────────────────────────────────────────────
export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onNewChat,
  isDesktopCollapsed,
  isMobileOpen,
  onCloseMobile,
  userName,
  userEmail,
  avatarUrl,
  onOpenProfile,
  onOpenHelp,
  onOpenSettings,
  onSignOut,
}) => {
  const initials =
    userName.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || 'TN';

  // ── State ──
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Dialogs
  const [shareConv, setShareConv] = useState<Conversation | null>(null);
  const [renameConv, setRenameConv] = useState<Conversation | null>(null);
  const [notebookConv, setNotebookConv] = useState<Conversation | null>(null);
  const [deleteConv, setDeleteConv] = useState<Conversation | null>(null);

  // ── Derived ──
  const pinnedConvs = conversations.filter((c) => pinnedIds.has(c.id));
  const recentConvs = conversations.filter((c) => !pinnedIds.has(c.id));

  const filterConvs = useCallback((list: Conversation[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((c) => c.title.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredPinned = filterConvs(pinnedConvs);
  const filteredRecent = filterConvs(recentConvs);
  const hasResults = filteredPinned.length + filteredRecent.length > 0;

  // Focus search on open
  useEffect(() => {
    if (searchActive) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchActive]);

  const handlePin = (id: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleDelete = (conv: Conversation) => {
    setPinnedIds((prev) => { const n = new Set(prev); n.delete(conv.id); return n; });
    onDeleteConversation?.(conv.id);
  };

  const handleRename = (id: string, newTitle: string) => {
    onRenameConversation?.(id, newTitle);
  };

  const closeAllMenus = () => setOpenMenuId(null);

  // ── Conversation item factory ──
  const renderItem = (conv: Conversation) => (
    <ConvItem
      key={conv.id}
      conv={conv}
      isActive={activeConversationId === conv.id}
      isPinned={pinnedIds.has(conv.id)}
      openMenuId={openMenuId}
      onSelect={() => { onSelectConversation(conv.id); onCloseMobile(); }}
      onMenuOpen={(id) => setOpenMenuId(id)}
      onMenuClose={closeAllMenus}
      onShare={setShareConv}
      onPin={handlePin}
      onRename={setRenameConv}
      onAddToNotebook={setNotebookConv}
      onDelete={setDeleteConv}
    />
  );

  const sidebarContent = (
    <div className="h-full w-full flex flex-col bg-white border-r border-[#E2E8F0] select-none">
      {/* Top Brand Area */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-2 border-b border-[#E2E8F0]">
        <button
          type="button"
          onClick={() => { onNewChat(); onCloseMobile(); }}
          className="flex items-center gap-2.5 text-left min-w-0 rounded-[4px] focus:outline-none cursor-pointer"
        >
          <TnnmcEmblem size={36} className="w-9 h-9 shrink-0" />
          <div className="min-w-0">
            <span className="block text-[14px] font-semibold text-[#1E242B] truncate leading-tight">TNNMC Assistant</span>
            <span className="block text-[11px] text-[#5A6573] truncate leading-tight mt-0.5">Tamil Nadu Nursing Council</span>
          </div>
        </button>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation drawer"
          className="md:hidden h-8 w-8 inline-flex items-center justify-center text-[#5A6573] hover:text-[#1E242B] hover:bg-[#F1F5F9] rounded-[6px] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* New Chat + Search */}
      <div className="px-3 pt-3 pb-1 space-y-2">
        <button
          type="button"
          onClick={() => { onNewChat(); onCloseMobile(); }}
          className="w-full h-10 px-3.5 inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-white bg-[#2C7A7B] hover:bg-[#286A6B] active:bg-[#1F5050] rounded-[6px] shadow-[0_1px_2px_rgba(15,23,42,0.08)] transition-colors duration-150 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>New Chat</span>
        </button>

        {/* Search chats */}
        {searchActive ? (
          <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#2C7A7B]/40 rounded-[6px] px-2.5 h-9">
            <Search className="w-3.5 h-3.5 text-[#5A6573] shrink-0" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') { setSearchActive(false); setSearchQuery(''); } }}
              placeholder="Search chats..."
              className="flex-1 bg-transparent text-[13px] text-[#1E242B] placeholder:text-[#94A3B8] focus:outline-none min-w-0"
              aria-label="Search conversations"
            />
            <button
              type="button"
              onClick={() => { setSearchActive(false); setSearchQuery(''); }}
              aria-label="Clear search"
              className="text-[#5A6573] hover:text-[#1E242B] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSearchActive(true)}
            className="w-full h-9 px-2.5 inline-flex items-center gap-2 text-[13px] text-[#5A6573] hover:text-[#1E242B] hover:bg-[#F1F5F9] rounded-[6px] transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Search chats</span>
          </button>
        )}
      </div>

      {/* Conversation Lists */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
        {/* Pinned */}
        {filteredPinned.length > 0 && (
          <div>
            <div className="px-2 mb-1.5 flex items-center gap-1.5">
              <Pin className="w-3 h-3 text-[#2C7A7B]" aria-hidden="true" />
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Pinned</span>
            </div>
            <nav aria-label="Pinned conversations" className="space-y-0.5">
              {filteredPinned.map(renderItem)}
            </nav>
          </div>
        )}

        {/* Recent */}
        {filteredRecent.length > 0 && (
          <div>
            <div className="px-2 mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                {searchQuery ? 'Results' : 'Recent Conversations'}
              </span>
              {!searchQuery && (
                <span className="text-[11px] font-medium text-[#94A3B8]">{recentConvs.length}</span>
              )}
            </div>
            <nav aria-label="Recent conversations" className="space-y-0.5">
              {filteredRecent.map(renderItem)}
            </nav>
          </div>
        )}

        {/* No results */}
        {searchQuery && !hasResults && (
          <div className="py-8 text-center">
            <Search className="w-6 h-6 text-[#CBD5E1] mx-auto mb-2" />
            <p className="text-[13px] text-[#94A3B8]">No chats found</p>
            <p className="text-[12px] text-[#CBD5E1] mt-0.5">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Bottom Area: Profile, Help, Settings, User */}
      <div className="p-3 border-t border-[#E2E8F0] space-y-1 bg-[#FAFBFD]">
        <button type="button" onClick={() => { onOpenProfile(); onCloseMobile(); }} className="w-full px-2.5 py-2 text-left rounded-[6px] flex items-center gap-2.5 text-[13px] font-medium text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E242B] transition-colors duration-150 cursor-pointer">
          <User className="w-4 h-4 text-[#5A6573] shrink-0" aria-hidden="true" /><span>Profile</span>
        </button>
        <button type="button" onClick={() => { onOpenHelp(); onCloseMobile(); }} className="w-full px-2.5 py-2 text-left rounded-[6px] flex items-center gap-2.5 text-[13px] font-medium text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E242B] transition-colors duration-150 cursor-pointer">
          <HelpCircle className="w-4 h-4 text-[#5A6573] shrink-0" aria-hidden="true" /><span>Help</span>
        </button>
        <button type="button" onClick={() => { onOpenSettings(); onCloseMobile(); }} className="w-full px-2.5 py-2 text-left rounded-[6px] flex items-center gap-2.5 text-[13px] font-medium text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E242B] transition-colors duration-150 cursor-pointer">
          <Settings className="w-4 h-4 text-[#5A6573] shrink-0" aria-hidden="true" /><span>Settings</span>
        </button>

        {/* User Profile Row */}
        <div className="pt-2 mt-1 border-t border-[#E2E8F0] flex items-center justify-between gap-2 px-1 py-1">
          <button
            type="button"
            onClick={() => { onOpenProfile(); onCloseMobile(); }}
            title="Edit profile details"
            className="flex items-center gap-2.5 min-w-0 text-left flex-1 hover:bg-[#F1F5F9] p-1 rounded-[6px] transition-colors cursor-pointer"
          >
            <div className="h-8 w-8 rounded-[6px] bg-white border border-[#CBD5E1] flex items-center justify-center text-[12px] font-semibold text-[#2C7A7B] overflow-hidden shrink-0" aria-hidden="true">
              {avatarUrl ? <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" /> : initials}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#1E242B] truncate leading-tight">{userName}</p>
              <p className="text-[11px] text-[#5A6573] truncate leading-tight mt-0.5">{userEmail}</p>
            </div>
          </button>
          <button
            type="button"
            onClick={onSignOut}
            aria-label="Sign Out"
            title="Sign Out"
            className="h-8 w-8 inline-flex items-center justify-center text-[#5A6573] hover:text-[#2C7A7B] hover:bg-[#F1F5F9] rounded-[6px] transition-colors duration-150 shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Collapsible Sidebar */}
      <aside
        aria-label="Conversation sidebar"
        className={`hidden md:block shrink-0 transition-all duration-200 overflow-hidden ${isDesktopCollapsed ? 'w-0' : 'w-[276px]'}`}
      >
        <div className="w-[276px] h-full">{sidebarContent}</div>
      </aside>

      {/* Mobile Slide-Out Drawer */}
      {isMobileOpen && (
        <div role="dialog" aria-modal="true" aria-label="Navigation drawer" className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-[#0F172A]/40 transition-opacity" onClick={onCloseMobile} aria-hidden="true" />
          <div className="relative z-10 w-[284px] max-w-[85vw] h-full shadow-lg">{sidebarContent}</div>
        </div>
      )}

      {/* Modals rendered via portals at root level */}
      {shareConv && <ShareDialog conv={shareConv} onClose={() => setShareConv(null)} />}
      {renameConv && (
        <RenameDialog
          conv={renameConv}
          onSave={(t) => handleRename(renameConv.id, t)}
          onClose={() => setRenameConv(null)}
        />
      )}
      {notebookConv && <NotebookDialog conv={notebookConv} onClose={() => setNotebookConv(null)} />}
      {deleteConv && (
        <DeleteDialog
          conv={deleteConv}
          onConfirm={() => handleDelete(deleteConv)}
          onClose={() => setDeleteConv(null)}
        />
      )}
    </>
  );
};
