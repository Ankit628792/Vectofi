import React, { useId } from 'react';

export interface VectorGridProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  gridSize?: number;
  strokeColor?: string;
  strokeWidth?: number;
  crosshairs?: boolean;
  dots?: boolean;
  opacity?: number;
}

export const VectorGrid: React.FC<VectorGridProps> = ({
  className = '',
  width = '100%',
  height = '100%',
  gridSize = 40,
  strokeColor = '#3b82f6',
  strokeWidth = 0.75,
  crosshairs = true,
  dots = true,
  opacity = 0.2,
}) => {
  const rawId = useId();
  const id = rawId.replace(/:/g, '');
  const patternId = `vgrid-pattern-${id}`;
  const dotsId = `vgrid-dots-${id}`;

  return (
    <svg
      className={`pointer-events-none ${className}`}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={patternId}
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeOpacity={opacity}
          />
          {crosshairs && (
            <path
              d={`M ${gridSize / 2 - 2} ${gridSize / 2} L ${gridSize / 2 + 2} ${gridSize / 2} M ${gridSize / 2} ${gridSize / 2 - 2} L ${gridSize / 2} ${gridSize / 2 + 2}`}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 1.2}
              strokeOpacity={opacity * 2}
            />
          )}
        </pattern>
        {dots && (
          <pattern
            id={dotsId}
            width={gridSize / 5}
            height={gridSize / 5}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={gridSize / 10}
              cy={gridSize / 10}
              r={0.75}
              fill={strokeColor}
              fillOpacity={opacity * 0.7}
            />
          </pattern>
        )}
      </defs>
      {dots && <rect width="100%" height="100%" fill={`url(#${dotsId})`} />}
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};
