import React, { useId } from 'react';

export interface VectorDotsProps {
  className?: string;
  rows?: number;
  cols?: number;
  gap?: number;
  dotSize?: number;
  color?: string;
  opacity?: number;
  animated?: boolean;
}

export const VectorDots: React.FC<VectorDotsProps> = ({
  className = '',
  rows = 5,
  cols = 8,
  gap = 16,
  dotSize = 2,
  color = 'currentColor',
  opacity = 0.35,
  animated = false,
}) => {
  const width = (cols - 1) * gap + dotSize * 2;
  const height = (rows - 1) * gap + dotSize * 2;
  const id = useId().replace(/:/g, '');

  return (
    <svg
      className={`pointer-events-none ${className}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {animated && (
        <style>
          {`
            @keyframes dot-pulse-${id} {
              0%, 100% { opacity: 0.15; transform: scale(0.85); }
              50% { opacity: 0.8; transform: scale(1.3); }
            }
            .dot-anim-${id} {
              transform-box: fill-box;
              transform-origin: center;
            }
          `}
        </style>
      )}
      <g fill={color} fillOpacity={opacity}>
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const cx = dotSize + c * gap;
            const cy = dotSize + r * gap;
            const delay = ((r + c) * 0.12).toFixed(2);
            return (
              <circle
                key={`${r}-${c}`}
                cx={cx}
                cy={cy}
                r={dotSize}
                className={animated ? `dot-anim-${id}` : undefined}
                style={
                  animated
                    ? {
                        animation: `dot-pulse-${id} 3s ease-in-out infinite`,
                        animationDelay: `${delay}s`,
                      }
                    : undefined
                }
              />
            );
          })
        )}
      </g>
    </svg>
  );
};
