import React, { useId } from 'react';

export interface VectorPatternProps {
  className?: string;
  variant?: 'grid' | 'dots' | 'isometric' | 'chevrons' | 'circuit' | 'crosshatch';
  patternSize?: number;
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
  width?: number | string;
  height?: number | string;
}

export const VectorPattern: React.FC<VectorPatternProps> = ({
  className = '',
  variant = 'isometric',
  patternSize = 40,
  strokeColor = '#3b82f6',
  strokeWidth = 1,
  opacity = 0.15,
  width = '100%',
  height = '100%',
}) => {
  const id = useId().replace(/:/g, '');
  const patternId = `vpattern-${variant}-${id}`;

  return (
    <svg
      className={`pointer-events-none ${className}`}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {variant === 'isometric' && (
          <pattern
            id={patternId}
            width={patternSize * 1.732}
            height={patternSize}
            patternUnits="userSpaceOnUse"
          >
            {/* Isometric cube wireframe pattern */}
            <path
              d={`M 0 ${patternSize / 2} L ${patternSize * 0.866} 0 L ${patternSize * 1.732} ${patternSize / 2} L ${patternSize * 0.866} ${patternSize} Z M ${patternSize * 0.866} 0 L ${patternSize * 0.866} ${patternSize}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
            />
          </pattern>
        )}

        {variant === 'grid' && (
          <pattern
            id={patternId}
            width={patternSize}
            height={patternSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${patternSize} 0 L 0 0 0 ${patternSize}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
            />
            {/* Small center intersection crosshair */}
            <path
              d={`M ${patternSize / 2 - 2} ${patternSize / 2} L ${patternSize / 2 + 2} ${patternSize / 2} M ${patternSize / 2} ${patternSize / 2 - 2} L ${patternSize / 2} ${patternSize / 2 + 2}`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity * 1.5}
            />
          </pattern>
        )}

        {variant === 'dots' && (
          <pattern
            id={patternId}
            width={patternSize / 2}
            height={patternSize / 2}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={(patternSize / 4)}
              cy={(patternSize / 4)}
              r={strokeWidth * 1.2}
              fill={strokeColor}
              fillOpacity={opacity * 1.8}
            />
          </pattern>
        )}

        {variant === 'chevrons' && (
          <pattern
            id={patternId}
            width={patternSize}
            height={patternSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M 0 ${patternSize * 0.25} L ${patternSize / 2} 0 L ${patternSize} ${patternSize * 0.25} M 0 ${patternSize * 0.75} L ${patternSize / 2} ${patternSize * 0.5} L ${patternSize} ${patternSize * 0.75}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
            />
          </pattern>
        )}

        {variant === 'circuit' && (
          <pattern
            id={patternId}
            width={patternSize * 1.5}
            height={patternSize * 1.5}
            patternUnits="userSpaceOnUse"
          >
            {/* PCB tracks and terminal nodes */}
            <path
              d={`M 0 10 L 20 10 L 30 20 L 50 20 M 20 40 L 40 40 L 50 50 L 60 50 M 10 30 L 10 50 L 20 60`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
            />
            <circle cx="20" cy="10" r="1.5" fill={strokeColor} fillOpacity={opacity * 2} />
            <circle cx="50" cy="20" r="1.5" fill={strokeColor} fillOpacity={opacity * 2} />
            <circle cx="40" cy="40" r="1.5" fill={strokeColor} fillOpacity={opacity * 2} />
          </pattern>
        )}

        {variant === 'crosshatch' && (
          <pattern
            id={patternId}
            width={patternSize / 2}
            height={patternSize / 2}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M 0 0 L ${patternSize / 2} ${patternSize / 2} M 0 ${patternSize / 2} L ${patternSize / 2} 0`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.75}
              strokeOpacity={opacity * 0.8}
            />
          </pattern>
        )}
      </defs>

      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};
