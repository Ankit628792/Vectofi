import React from 'react';

export interface VectorStarsProps {
  className?: string;
  size?: number;
  color?: string;
  count?: 1 | 2 | 3 | 4;
  glow?: boolean;
  animated?: boolean;
}

export const VectorStars: React.FC<VectorStarsProps> = ({
  className = '',
  size = 28,
  color = 'currentColor',
  count = 3,
  glow = true,
  animated = true,
}) => {
  return (
    <svg
      className={`pointer-events-none ${className}`}
      width={size * 1.8}
      height={size * 1.8}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {glow && (
          <filter id="star-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* Primary 4-point Star */}
      <g
        className={animated ? 'animate-vector-pulse' : undefined}
        style={{ transformOrigin: '24px 24px' }}
      >
        <path
          d="M 24 6 C 24 16 26 22 36 24 C 26 26 24 32 24 42 C 24 32 22 26 12 24 C 22 22 24 16 24 6 Z"
          fill={color}
          fillOpacity="0.9"
          filter={glow ? 'url(#star-glow)' : undefined}
        />
        {/* Core diamond shine */}
        <circle cx="24" cy="24" r="1.5" fill="#ffffff" />
      </g>

      {/* Secondary Companion Star */}
      {count >= 2 && (
        <g
          className={animated ? 'animate-vector-float' : undefined}
          style={{ transformOrigin: '38px 12px' }}
        >
          <path
            d="M 38 7 C 38 10 39 12 43 13 C 39 14 38 16 38 19 C 38 16 37 14 33 13 C 37 12 38 10 38 7 Z"
            fill={color}
            fillOpacity="0.7"
          />
        </g>
      )}

      {/* Tertiary Companion Star */}
      {count >= 3 && (
        <g
          className={animated ? 'animate-vector-pulse' : undefined}
          style={{ transformOrigin: '10px 34px', animationDelay: '0.8s' }}
        >
          <path
            d="M 10 31 C 10 33 11 34 13 35 C 11 36 10 37 10 39 C 10 37 9 36 7 35 C 9 34 10 33 10 31 Z"
            fill={color}
            fillOpacity="0.6"
          />
        </g>
      )}

      {/* Quaternary Tiny Star Sparkle */}
      {count >= 4 && (
        <circle
          cx="36"
          cy="34"
          r="1"
          fill={color}
          fillOpacity="0.8"
          className={animated ? 'animate-pulse' : undefined}
        />
      )}
    </svg>
  );
};
