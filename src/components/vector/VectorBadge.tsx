import React from 'react';

export interface VectorBadgeProps {
  className?: string;
  text?: string;
  subtext?: string;
  variant?: 'tech' | 'pill' | 'shield' | 'hexagon';
  color?: string;
  statusPulse?: boolean;
}

export const VectorBadge: React.FC<VectorBadgeProps> = ({
  className = '',
  text = 'SVG 2.0',
  subtext = 'READY',
  variant = 'tech',
  color = '#3b82f6',
  statusPulse = true,
}) => {
  if (variant === 'shield') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg
          width="36"
          height="42"
          viewBox="0 0 36 42"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M 18 2 L 32 8 L 32 22 C 32 32, 18 40, 18 40 C 18 40, 4 32, 4 22 L 4 8 Z"
            fill={`${color}15`}
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M 18 9 L 26 13 L 26 21 C 26 27, 18 32, 18 32 C 18 32, 10 27, 10 21 L 10 13 Z"
            fill="none"
            stroke={color}
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />
          <circle cx="18" cy="20" r="3" fill={color} />
        </svg>
        {(text || subtext) && (
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-wider">{text}</span>
            {subtext && <span className="text-[9px] font-mono text-white/50">{subtext}</span>}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'hexagon') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg
          width="36"
          height="36"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <polygon
            points="20,2 36,11 36,29 20,38 4,29 4,11"
            fill={`${color}15`}
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <polygon
            points="20,7 31,14 31,26 20,33 9,26 9,14"
            fill="none"
            stroke={color}
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />
          <circle cx="20" cy="20" r="2.5" fill={color} />
        </svg>
        {(text || subtext) && (
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-wider">{text}</span>
            {subtext && <span className="text-[9px] font-mono text-white/50">{subtext}</span>}
          </div>
        )}
      </div>
    );
  }

  // Tech chamfered badge (Default)
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 backdrop-blur-sm ${className}`}
      style={{
        borderColor: `${color}30`,
        backgroundColor: `${color}0c`,
      }}
    >
      {/* Mini technical vector diamond glyph */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M 8 1 L 15 8 L 8 15 L 1 8 Z"
          fill={`${color}20`}
          stroke={color}
          strokeWidth="1.25"
        />
        {statusPulse ? (
          <circle cx="8" cy="8" r="2" fill={color} className="animate-pulse" />
        ) : (
          <circle cx="8" cy="8" r="2" fill={color} />
        )}
      </svg>

      <div className="flex items-center gap-1.5 font-mono text-xs">
        <span className="font-semibold text-white tracking-wider uppercase">{text}</span>
        {subtext && (
          <>
            <span className="text-white/30">•</span>
            <span style={{ color }} className="font-bold text-[10px] tracking-widest uppercase">
              {subtext}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
