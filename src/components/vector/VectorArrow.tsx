import React from 'react';

export interface VectorArrowProps {
  className?: string;
  variant?: 'curved' | 'pointer' | 'sketch' | 'tech';
  size?: number;
  color?: string;
  strokeWidth?: number;
  direction?: 'right' | 'left' | 'up' | 'down';
  animated?: boolean;
}

export const VectorArrow: React.FC<VectorArrowProps> = ({
  className = '',
  variant = 'curved',
  size = 48,
  color = 'currentColor',
  strokeWidth = 1.75,
  direction = 'right',
  animated = false,
}) => {
  const rotationMap = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
  };

  const rot = rotationMap[direction];

  return (
    <svg
      className={`pointer-events-none ${className} ${animated ? 'animate-vector-dash' : ''}`}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        transform: rot ? `rotate(${rot}deg)` : undefined,
        transformOrigin: '32px 32px',
      }}
    >
      {variant === 'curved' && (
        <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          {/* Sweeping Bézier arc with arrowhead */}
          <path d="M 12 44 C 18 20, 36 18, 52 24" />
          <polyline points="42 16 52 24 45 34" />
        </g>
      )}

      {variant === 'sketch' && (
        <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          {/* Organic designer scribble arrow */}
          <path d="M 10 46 C 22 42, 28 34, 34 26 C 40 18, 48 22, 54 22" />
          <path d="M 44 14 C 48 18, 52 21, 54 22 C 50 25, 46 29, 44 32" />
        </g>
      )}

      {variant === 'tech' && (
        <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          {/* Angular schematic pointer */}
          <polyline points="8 48 28 48 40 24 54 24" />
          <polyline points="46 16 54 24 46 32" />
          <circle cx="8" cy="48" r="2" fill={color} />
        </g>
      )}

      {variant === 'pointer' && (
        <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          {/* Straight precision directional arrow */}
          <line x1="8" y1="32" x2="56" y2="32" />
          <polyline points="42 18 56 32 42 46" />
        </g>
      )}
    </svg>
  );
};
