import React, { useState, useEffect, useRef, useMemo, useDeferredValue } from 'react';
import { IconItem } from '../../types';
import { AnimatedIconRenderer } from '../icons/AnimatedIconRenderer';
import { UI_TEXT } from '../../utils/common';
import {
  getSynonymsForToken,
  getSearchSuggestions,
  calculateRelevanceScoreWithSynonyms,
  POPULAR_SEARCH_SUGGESTIONS,
} from '../../services/synonyms';

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

interface ScoredIconResult {
  icon: IconItem;
  score: number;
  matchedSynonym?: string;
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
  const [rawQuery, setRawQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Defer the query to keep keystrokes and UI responsiveness at 60+ FPS
  const deferredQuery = useDeferredValue(debouncedQuery);

  // Handle debouncing of user input
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!rawQuery.trim()) {
      setDebouncedQuery('');
    } else {
      debounceTimerRef.current = setTimeout(() => {
        setDebouncedQuery(rawQuery);
      }, 35);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [rawQuery]);

  useEffect(() => {
    if (isOpen) {
      setRawQuery('');
      setDebouncedQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // General commands
  const defaultCommands = useMemo(
    () => [
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
    ],
    [darkMode, onNavigate, onToggleDarkMode, onToggleReducedMotion, reducedMotion]
  );

  // Dynamic search suggestions based on raw or deferred query
  const suggestions = useMemo(() => {
    return getSearchSuggestions(rawQuery, 5);
  }, [rawQuery]);

  // Matching icons with synonym awareness and relevance ranking
  const matchingIcons = useMemo<ScoredIconResult[]>(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return [];

    const tokens = q.split(/\s+/).filter(Boolean);
    const tokenSynonymMap = tokens.map(token => [token, ...getSynonymsForToken(token)]);

    const results: ScoredIconResult[] = [];

    for (let i = 0; i < icons.length; i++) {
      const icon = icons[i];
      const nameLower = icon.name.toLowerCase();
      const slugLower = icon.slug.toLowerCase();
      const catLower = icon.category.toLowerCase();
      const tagsLower = icon.tags.map(t => t.toLowerCase());

      // Check if all tokens match directly or via synonym
      let iconMatches = true;
      for (let t = 0; t < tokenSynonymMap.length; t++) {
        const variants = tokenSynonymMap[t];
        let tokenMatched = false;

        for (let v = 0; v < variants.length; v++) {
          const variant = variants[v];
          if (
            nameLower.includes(variant) ||
            slugLower.includes(variant) ||
            catLower.includes(variant) ||
            tagsLower.some(tag => tag.includes(variant))
          ) {
            tokenMatched = true;
            break;
          }
        }

        if (!tokenMatched) {
          iconMatches = false;
          break;
        }
      }

      if (iconMatches) {
        const { score, matchedSynonym } = calculateRelevanceScoreWithSynonyms(
          icon.slug,
          icon.name,
          icon.category,
          icon.tags,
          q
        );
        results.push({ icon, score, matchedSynonym });
      }
    }

    // Sort by relevance score descending
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, 10);
  }, [deferredQuery, icons]);

  // Matching commands
  const matchingCommands = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return defaultCommands;
    return defaultCommands.filter(c => c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
  }, [defaultCommands, deferredQuery]);

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
      } else if (e.key === 'Tab' && suggestions.length > 0) {
        // Tab autocompletes the first suggestion if input is different
        if (rawQuery !== suggestions[0].term) {
          e.preventDefault();
          setRawQuery(suggestions[0].term);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (matchingIcons.length > 0 && selectedIndex < matchingIcons.length) {
          onSelectIcon(matchingIcons[selectedIndex].icon);
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
  }, [isOpen, selectedIndex, matchingIcons, matchingCommands, totalItems, onClose, onSelectIcon, suggestions, rawQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden text-[#e5e5e5] flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <svg className="w-5 h-5 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder={UI_TEXT.commandPalettePlaceholder}
            value={rawQuery}
            onChange={e => {
              setRawQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-white/40 focus:outline-none font-sans"
            aria-label="Search icons and actions with synonyms"
          />
          {rawQuery && (
            <button
              type="button"
              onClick={() => {
                setRawQuery('');
                setDebouncedQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-white/40 hover:text-white transition-colors"
              title="Clear search"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/40 border border-white/10">
            Esc
          </kbd>
        </div>

        {/* Search Suggestions & Synonym Hints */}
        {suggestions.length > 0 && (
          <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 shrink-0 mr-1 flex items-center gap-1">
              <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Suggestions:
            </span>
            {suggestions.map(s => (
              <button
                key={s.term}
                type="button"
                onClick={() => {
                  setRawQuery(s.term);
                  setDebouncedQuery(s.term);
                  setSelectedIndex(0);
                  inputRef.current?.focus();
                }}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all shrink-0 cursor-pointer ${
                  rawQuery.toLowerCase() === s.term.toLowerCase()
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 shadow-sm'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-white/5 max-h-[60vh]">
          {/* Matching Icons */}
          {matchingIcons.length > 0 && (
            <div className="py-1">
              <div className="flex items-center justify-between px-3 py-1 text-[10px] font-mono uppercase text-white/40">
                <span>Matching Icons ({matchingIcons.length})</span>
                {deferredQuery && (
                  <span className="text-blue-400/80 lowercase">synonym dictionary active</span>
                )}
              </div>
              {matchingIcons.map(({ icon: iconItem, matchedSynonym }, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={iconItem.slug}
                    type="button"
                    onClick={() => {
                      onSelectIcon(iconItem);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30 shadow-sm'
                        : 'text-white/80 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/70 shrink-0 border border-white/5">
                        <AnimatedIconRenderer icon={iconItem} size={18} strokeWidth={1.8} animated={false} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white truncate font-medium">{iconItem.name}</span>
                          <span className="text-[10px] font-mono text-white/40 truncate">
                            {iconItem.slug}
                          </span>
                        </div>
                        {matchedSynonym && matchedSynonym !== deferredQuery.toLowerCase() && (
                          <span className="text-[10px] font-mono text-emerald-400/90 flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                            synonym match: <strong className="font-semibold">{matchedSynonym}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/40 whitespace-nowrap">
                        {iconItem.category}
                      </span>
                      {iconItem.hasAnimation && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 whitespace-nowrap">
                          animated
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Commands */}
          {matchingCommands.length > 0 && (
            <div className="py-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase text-white/40">
                Actions & Navigation ({matchingCommands.length})
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30 shadow-sm'
                        : 'text-white/80 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center font-mono text-white/50 shrink-0 text-xs">
                        {cmd.iconSymbol}
                      </span>
                      <span className="text-white truncate">{cmd.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/40 whitespace-nowrap shrink-0">
                      {cmd.category}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {matchingIcons.length === 0 && matchingCommands.length === 0 && (
            <div className="p-8 text-center text-sm text-white/40 font-mono space-y-3">
              <p>No matching icons or commands found for &ldquo;{rawQuery}&rdquo;.</p>
              <p className="text-xs text-white/30">
                Try searching for related concepts like <code className="text-blue-400">trash</code>,{' '}
                <code className="text-blue-400">pencil</code>, <code className="text-blue-400">gear</code>, or{' '}
                <code className="text-blue-400">magnifier</code>.
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#050505] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40 gap-2">
          <div className="flex items-center gap-3 whitespace-nowrap">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>Tab autocomplete</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>{UI_TEXT.registeredIconsLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

