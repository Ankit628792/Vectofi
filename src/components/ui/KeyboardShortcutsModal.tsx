import React from 'react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '/', desc: 'Focus instant icon search input' },
    { key: '⌘ K  /  Ctrl K', desc: 'Open command palette' },
    { key: 'Esc', desc: 'Close open modal, preview, or command palette' },
    { key: 'C', desc: 'Copy current icon SVG code to clipboard' },
    { key: 'D', desc: 'Download current icon SVG file' },
    { key: 'M', desc: 'Toggle reduced motion (disable/enable animations)' },
    { key: '←  →', desc: 'Navigate to previous / next icon in laboratory' },
    { key: '?', desc: 'Open this keyboard shortcuts cheat sheet' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl p-6 text-[#e5e5e5]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-mono text-blue-400 font-bold">⌨</span>
            <h3 className="font-display font-bold text-base text-white">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="py-4 space-y-3">
          {shortcuts.map(s => (
            <div key={s.key} className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-white/60">{s.desc}</span>
              <kbd className="px-2 py-1 font-mono text-xs font-semibold rounded-md bg-white/5 border border-white/10 text-white/90 shadow-2xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-mono font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors cursor-pointer"
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
};
