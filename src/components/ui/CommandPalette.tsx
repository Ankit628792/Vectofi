import React, { useState, useEffect, useRef } from 'react';
import { IconItem } from '../../types';
import { AnimatedIconRenderer } from '../icons/AnimatedIconRenderer';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  icons: IconItem[];
  onSelectIcon: (icon: IconItem) => void;
  onNavigate: (route: string) => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
  reducedMotion?: boolean;
  onToggleReducedMotion?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  icons,
  onSelectIcon,
  onNavigate,
  onToggleDarkMode,
  darkMode,
  reducedMotion = false,
  onToggleReducedMotion,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // General commands
  const defaultCommands = [
    { id: 'explore', label: 'Explore All Icons', action: () => onNavigate('/icons'), category: 'Navigation', iconSymbol: '◈' },
    { id: 'animated', label: 'Browse Animated Icons', action: () => onNavigate('/animated'), category: 'Navigation', iconSymbol: '▶' },
    { id: 'categories', label: 'Browse Categories', action: () => onNavigate('/categories'), category: 'Navigation', iconSymbol: '⌁' },
    { id: 'collections', label: 'Manage Collections', action: () => onNavigate('/collections'), category: 'Navigation', iconSymbol: '▣' },
    { id: 'favorites', label: 'View Saved Favorites', action: () => onNavigate('/favorites'), category: 'Navigation', iconSymbol: '♡' },
    { id: 'docs', label: 'Documentation & Guide', action: () => onNavigate('/docs'), category: 'Navigation', iconSymbol: '<>' },
    { id: 'theme', label: darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode', action: onToggleDarkMode, category: 'Preferences', iconSymbol: '☼' },
    ...(onToggleReducedMotion
      ? [
          {
            id: 'reduced-motion',
            label: reducedMotion
              ? 'Restore Animations (Disable Reduced Motion)'
              : 'Enable Reduced Motion (Disable All Keyframe Animations)',
            action: onToggleReducedMotion,
            category: 'Preferences',
            iconSymbol: reducedMotion ? '▶' : '⏸',
          },
        ]
      : []),
  ];

  // Matching icons
  const matchingIcons = query.trim()
    ? icons
        .filter(
          i =>
            i.name.toLowerCase().includes(query.toLowerCase()) ||
            i.slug.toLowerCase().includes(query.toLowerCase()) ||
            i.category.toLowerCase().includes(query.toLowerCase()) ||
            i.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 8)
    : [];

  // Matching commands
  const matchingCommands = query.trim()
    ? defaultCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : defaultCommands;

  const totalItems = matchingIcons.length + matchingCommands.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (totalItems || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (totalItems || 1)) % (totalItems || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (matchingIcons.length > 0 && selectedIndex < matchingIcons.length) {
          onSelectIcon(matchingIcons[selectedIndex]);
          onClose();
        } else {
          const cmdIndex = selectedIndex - matchingIcons.length;
          if (matchingCommands[cmdIndex]) {
            matchingCommands[cmdIndex].action();
            onClose();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, matchingIcons, matchingCommands, totalItems, onClose, onSelectIcon]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden text-[#e5e5e5]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <svg className="w-5 h-5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search 110+ icons..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none font-sans"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/40 border border-white/10">
            Esc
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/5">
          {/* Matching Icons */}
          {matchingIcons.length > 0 && (
            <div className="py-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase text-white/40">
                Icons ({matchingIcons.length})
              </div>
              {matchingIcons.map((iconItem, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={iconItem.slug}
                    type="button"
                    onClick={() => {
                      onSelectIcon(iconItem);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30'
                        : 'text-white/80 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center text-white/60">
                        <AnimatedIconRenderer icon={iconItem} size={18} strokeWidth={1.8} animated={false} />
                      </div>
                      <span className="text-white">{iconItem.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/40">
                        {iconItem.category}
                      </span>
                    </div>
                    {iconItem.hasAnimation && (
                      <span className="text-[10px] font-mono text-blue-400">animated</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Commands */}
          {matchingCommands.length > 0 && (
            <div className="py-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase text-white/40">
                Actions & Navigation
              </div>
              {matchingCommands.map((cmd, idx) => {
                const overallIdx = matchingIcons.length + idx;
                const isSelected = selectedIndex === overallIdx;
                return (
                  <button
                    key={cmd.id}
                    type="button"
                    onClick={() => {
                      cmd.action();
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30'
                        : 'text-white/80 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center font-mono text-white/40">{cmd.iconSymbol}</span>
                      <span className="text-white">{cmd.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/40">
                      {cmd.category}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {matchingIcons.length === 0 && matchingCommands.length === 0 && (
            <div className="p-8 text-center text-sm text-white/40 font-mono">
              No matching icons or commands found.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#050505] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>110+ icons registered</span>
        </div>
      </div>
    </div>
  );
};
