import React, { useId } from 'react';

export interface VectorOrbitProps {
  className?: string;
  size?: number;
  color?: string;
  rings?: 1 | 2 | 3;
  tilt?: number; // degrees
  satellites?: boolean;
  animated?: boolean;
  opacity?: number;
}

export const VectorOrbit: React.FC<VectorOrbitProps> = ({
  className = '',
  size = 200,
  color = 'currentColor',
  rings = 2,
  tilt = -25,
  satellites = true,
  animated = true,
  opacity = 0.25,
}) => {
  const id = useId().replace(/:/g, '');

  return (
    <svg
      className={`pointer-events-none ${className}`}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {animated && (
        <style>
          {`
            @keyframes orbit-spin-${id} {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes orbit-spin-rev-${id} {
              from { transform: rotate(360deg); }
              to { transform: rotate(0deg); }
            }
            .orbit-group-${id} {
              transform-origin: 100px 100px;
              animation: orbit-spin-${id} 28s linear infinite;
            }
            .orbit-group-rev-${id} {
              transform-origin: 100px 100px;
              animation: orbit-spin-rev-${id} 36s linear infinite;
            }
          `}
        </style>
      )}

      {/* Tilted orbital plane */}
      <g transform={`rotate(${tilt} 100 100)`}>
        {/* Ring 1 - Inner Ellipse */}
        <ellipse
          cx="100"
          cy="100"
          rx="72"
          ry="32"
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          strokeOpacity={opacity}
          strokeDasharray="4 4"
        />

        {/* Ring 2 - Outer Ellipse */}
        {rings >= 2 && (
          <ellipse
            cx="100"
            cy="100"
            rx="92"
            ry="42"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            strokeOpacity={opacity * 0.75}
          />
        )}

        {/* Ring 3 - Deep Trajectory */}
        {rings >= 3 && (
          <ellipse
            cx="100"
            cy="100"
            rx="52"
            ry="22"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeOpacity={opacity * 0.9}
            strokeDasharray="2 3"
          />
        )}

        {/* Animated Satellite Nodes */}
        {satellites && (
          <>
            <g className={animated ? `orbit-group-${id}` : undefined}>
              {/* Satellite 1 on inner track */}
              <circle
                cx="172"
                cy="100"
                r="3.5"
                fill={color}
                fillOpacity="0.85"
              />
              <circle
                cx="172"
                cy="100"
                r="6"
                fill="none"
                stroke={color}
                strokeWidth="0.75"
                strokeOpacity="0.5"
              />
            </g>

            {rings >= 2 && (
              <g className={animated ? `orbit-group-rev-${id}` : undefined}>
                {/* Satellite 2 on outer track */}
                <circle
                  cx="8"
                  cy="100"
                  r="2.5"
                  fill={color}
                  fillOpacity="0.7"
                />
              </g>
            )}
          </>
        )}

        {/* Central Core Crosshair */}
        <g stroke={color} strokeWidth="0.75" strokeOpacity={opacity * 0.8}>
          <line x1="94" y1="100" x2="106" y2="100" />
          <line x1="100" y1="94" x2="100" y2="106" />
          <circle cx="100" cy="100" r="1.5" fill={color} fillOpacity="0.9" />
        </g>
      </g>
    </svg>
  );
};
