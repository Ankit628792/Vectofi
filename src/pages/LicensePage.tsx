import React, { useState } from 'react';

interface LicensePageProps {
  onNavigate?: (route: string) => void;
  onShowToast?: (msg: string) => void;
}

const MIT_LICENSE_TEXT = `MIT License

Copyright (c) 2026 Ankit Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

export const LicensePage: React.FC<LicensePageProps> = ({ onNavigate, onShowToast }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MIT_LICENSE_TEXT).then(() => {
      setCopied(true);
      if (onShowToast) {
        onShowToast('MIT License copied to clipboard');
      }
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#e5e5e5]">
      {/* Header & Back Action */}
      <div className="mb-10 border-b border-white/10 pb-8">
        <div className="flex items-center gap-2 mb-3">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('/icons')}
              className="text-xs font-mono text-white/50 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back to Library</span>
            </button>
          )}
          <span className="text-white/20">/</span>
          <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-semibold">
            Open Source Legal
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-light text-3xl sm:text-4xl text-white tracking-tight">
              The <span className="font-bold">MIT License</span>
            </h1>
            <p className="text-sm text-white/50 mt-1.5 leading-relaxed">
              Vectofi is free and open-source software crafted with care by{' '}
              <a
                href="https://www.instagram.com/ankit_628792"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 underline font-medium"
              >
                Ankit Kumar
              </a>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://github.com/Ankit628792/Vectofi/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <svg className="w-3.5 h-3.5 text-white/60 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span>View on GitHub</span>
              <svg className="w-3 h-3 text-white/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>

            <a
              href="https://opensource.org/licenses/MIT"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-xs font-mono text-blue-400 hover:text-blue-300 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>OSI Standard</span>
              <svg className="w-3 h-3 text-blue-400/60 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {/* Quick Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase text-emerald-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Permissions</span>
            </div>
            <ul className="text-xs text-white/70 space-y-1 font-sans">
              <li>• Commercial use</li>
              <li>• Modification & remixing</li>
              <li>• Distribution & bundling</li>
              <li>• Private & personal use</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase text-blue-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Conditions</span>
            </div>
            <ul className="text-xs text-white/70 space-y-1 font-sans">
              <li>• Include original copyright</li>
              <li>• Include license notice</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase text-rose-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>Limitations</span>
            </div>
            <ul className="text-xs text-white/70 space-y-1 font-sans">
              <li>• No liability warranty</li>
              <li>• Provided "as is"</li>
            </ul>
          </div>
        </div>

        {/* License Text Container */}
        <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden shadow-2xl">
          <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs font-mono text-white/40 ml-2">LICENSE.txt</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-white/50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy License</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-6 font-mono text-xs sm:text-sm text-white/70 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all selection:bg-blue-600/40">
            {MIT_LICENSE_TEXT}
          </pre>
        </div>

        {/* Commercial & Open Source FAQ note */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] space-y-3">
          <h2 className="font-display font-bold text-base text-white">
            Can I use Vectofi in commercial applications and SaaS products?
          </h2>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            <strong>Yes.</strong> The MIT License is one of the most permissive open-source licenses in existence. You can incorporate Vectofi icons, animated SVG components, and generated code into client work, internal tools, mobile apps, SaaS products, and themes without paying licensing fees or royalties.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-blue-400">
            <a
              href="https://github.com/Ankit628792/Vectofi"
              target="_blank"
              rel="noreferrer"
              className="hover:underline inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span>GitHub: Ankit628792/Vectofi</span>
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <span className="text-white/20">•</span>
            <a
              href="https://www.instagram.com/ankit_628792"
              target="_blank"
              rel="noreferrer"
              className="hover:underline inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span>Developer: Ankit Kumar</span>
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
