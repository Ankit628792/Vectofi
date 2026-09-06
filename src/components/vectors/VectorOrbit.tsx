import React, { useId, useState } from 'react';

export interface Satellite {
  id: string;
  name?: string;
  orbitRadius: number;
  size: number;
  color: string;
  duration: number; // seconds
  reverse?: boolean;
  hasSubSatellite?: boolean;
  subSatelliteRadius?: number;
  subSatelliteDuration?: number;
}

export interface VectorOrbitProps {
  className?: string;
  size?: number | string;
  color?: string;
  primaryColor?: string;
  accentColor?: string;
  rings?: 1 | 2 | 3 | 4;
  orbitsCount?: 2 | 3 | 4;
  tilt?: number; // degrees
  speedMultiplier?: number;
  satellites?: boolean;
  showSatellites?: boolean;
  showLabels?: boolean;
  showCentralStar?: boolean;
  animated?: boolean;
  interactive?: boolean;
  opacity?: number;
}

const DEFAULT_SATELLITES: Satellite[] = [
  {
    id: 'mercury',
    name: 'Core Orbit',
    orbitRadius: 42,
    size: 4,
    color: '#38bdf8', // sky blue
    duration: 12,
    reverse: false,
  },
  {
    id: 'terra',
    name: 'Primary Node',
    orbitRadius: 68,
    size: 6,
    color: '#60a5fa', // blue
    duration: 22,
    reverse: false,
    hasSubSatellite: true,
    subSatelliteRadius: 10,
    subSatelliteDuration: 4,
  },
  {
    id: 'mars',
    name: 'Relay Satellite',
    orbitRadius: 94,
    size: 5,
    color: '#f43f5e', // rose
    duration: 34,
    reverse: true,
  },
  {
    id: 'outer',
    name: 'Perimeter Probe',
    orbitRadius: 120,
    size: 4.5,
    color: '#a855f7', // purple
    duration: 48,
    reverse: false,
  },
];

export const VectorOrbit: React.FC<VectorOrbitProps> = ({
  className = '',
  size = 280,
  color,
  primaryColor,
  accentColor = '#38bdf8',
  rings,
  orbitsCount,
  tilt = -18,
  speedMultiplier = 1,
  satellites,
  showSatellites,
  showLabels = false,
  showCentralStar = true,
  animated = true,
  interactive = true,
  opacity = 0.85,
}) => {
  const resolvedPrimaryColor = primaryColor || color || '#3b82f6';
  const resolvedOrbitsCount = (Math.max(2, Math.min(4, orbitsCount || rings || 3))) as 2 | 3 | 4;
  const resolvedShowSatellites = showSatellites !== undefined ? showSatellites : (satellites !== undefined ? satellites : true);

  const rawId = useId();
  const id = rawId.replace(/:/g, '');
  const [hoveredSatellite, setHoveredSatellite] = useState<string | null>(null);

  const activeSatellites = DEFAULT_SATELLITES.slice(0, resolvedOrbitsCount);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      id={`vector-orbit-${id}`}
    >
      <svg
        viewBox="-140 -140 280 280"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Vector Orbit Solar System Graphic"
      >
        <defs>
          {/* Central Star Radiant Corona Gradient */}
          <radialGradient id={`star-glow-${id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="1" />
            <stop offset="40%" stopColor={resolvedPrimaryColor} stopOpacity="0.8" />
            <stop offset="80%" stopColor={resolvedPrimaryColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={resolvedPrimaryColor} stopOpacity="0" />
          </radialGradient>

          {/* Atmosphere Glow Filter */}
          <filter id={`orbit-glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Scoped CSS Keyframe Rotations for Solar Orbit System */}
          <style>
            {`
              @keyframes orbit-cw-${id} {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes orbit-ccw-${id} {
                from { transform: rotate(360deg); }
                to { transform: rotate(0deg); }
              }
              @keyframes orbit-star-pulse-${id} {
                0%, 100% { transform: scale(1); opacity: 0.85; }
                50% { transform: scale(1.18); opacity: 1; }
              }
              @keyframes orbit-flare-spin-${id} {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes orbit-beacon-${id} {
                0%, 100% { r: 1.5; opacity: 0.4; }
                50% { r: 3.5; opacity: 1; }
              }

              .star-core-${id} {
                transform-origin: 0px 0px;
                animation: orbit-star-pulse-${id} 4s ease-in-out infinite;
              }
              .star-flare-${id} {
                transform-origin: 0px 0px;
                animation: orbit-flare-spin-${id} 30s linear infinite;
              }
              ${activeSatellites
                .map(sat => {
                  const duration = sat.duration / Math.max(0.1, speedMultiplier);
                  const animName = sat.reverse ? `orbit-ccw-${id}` : `orbit-cw-${id}`;
                  return `
                    .orbit-track-${sat.id}-${id} {
                      transform-origin: 0px 0px;
                      animation: ${animName} ${duration}s linear infinite;
                    }
                  `;
                })
                .join('\n')}
            `}
          </style>
        </defs>

        {/* Outer System Constraint Bracket / Grid Compass */}
        <g opacity={opacity * 0.4}>
          <circle cx="0" cy="0" r="132" fill="none" stroke={resolvedPrimaryColor} strokeWidth="0.75" strokeDasharray="2 6" />
          <line x1="-136" y1="0" x2="-128" y2="0" stroke={resolvedPrimaryColor} strokeWidth="1" />
          <line x1="128" y1="0" x2="136" y2="0" stroke={resolvedPrimaryColor} strokeWidth="1" />
          <line x1="0" y1="-136" x2="0" y2="-128" stroke={resolvedPrimaryColor} strokeWidth="1" />
          <line x1="0" y1="128" x2="0" y2="136" stroke={resolvedPrimaryColor} strokeWidth="1" />
        </g>

        {/* Tilted Solar-System Orbital Plane */}
        <g transform={`rotate(${tilt})`} style={{ transformOrigin: '0px 0px' }}>
          {/* Orbital Elliptical Tracks */}
          {activeSatellites.map((sat, idx) => {
            const isHovered = hoveredSatellite === sat.id;
            return (
              <g key={`track-group-${sat.id}`}>
                {/* Secondary guide aura */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx={sat.orbitRadius}
                  ry={sat.orbitRadius * 0.72}
                  fill="none"
                  stroke={isHovered ? sat.color : resolvedPrimaryColor}
                  strokeWidth={isHovered ? 1.5 : 0.85}
                  strokeOpacity={isHovered ? 0.9 : opacity * (0.35 + idx * 0.08)}
                  strokeDasharray={idx % 2 === 0 ? '4 4' : '6 3'}
                  className="transition-all duration-300"
                />

                {/* Technical trajectory tick marks on orbit */}
                <circle
                  cx={sat.orbitRadius}
                  cy="0"
                  r="1"
                  fill={sat.color}
                  opacity={opacity * 0.5}
                />
                <circle
                  cx={-sat.orbitRadius}
                  cy="0"
                  r="1"
                  fill={sat.color}
                  opacity={opacity * 0.5}
                />
              </g>
            );
          })}

          {/* Central Star / Core Sun */}
          {showCentralStar && (
            <g id={`orbit-central-star-${id}`}>
              {/* Diffuse Outer Corona */}
              <circle
                cx="0"
                cy="0"
                r="22"
                fill={`url(#star-glow-${id})`}
                className={`star-core-${id}`}
              />

              {/* Geometric Solar Flares (Ray Diamond) */}
              <g className={`star-flare-${id}`} opacity={0.65}>
                <polygon
                  points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4"
                  fill={accentColor}
                  opacity="0.5"
                />
                <polygon
                  points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3"
                  transform="rotate(45)"
                  fill={resolvedPrimaryColor}
                  opacity="0.4"
                />
              </g>

              {/* Dense Star Core Sphere */}
              <circle
                cx="0"
                cy="0"
                r="8"
                fill={accentColor}
                filter={`url(#orbit-glow-${id})`}
              />
              <circle
                cx="0"
                cy="0"
                r="5"
                fill="#ffffff"
                opacity="0.9"
              />
            </g>
          )}

          {/* Rotating Satellites and Planetary Bodies */}
          {resolvedShowSatellites &&
            activeSatellites.map(sat => {
              const isHovered = hoveredSatellite === sat.id;
              // Orbital path scaled for elliptical projection
              const rx = sat.orbitRadius;
              const ry = sat.orbitRadius * 0.72;

              return (
                <g
                  key={sat.id}
                  className={`orbit-track-${sat.id}-${id}`}
                  style={{ transformOrigin: '0px 0px' }}
                >
                  {/* Position of Satellite along the track at 0deg rotation */}
                  <g
                    transform={`translate(${rx}, 0)`}
                    className={`cursor-pointer ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}`}
                    onMouseEnter={() => interactive && setHoveredSatellite(sat.id)}
                    onMouseLeave={() => interactive && setHoveredSatellite(null)}
                  >
                    {/* Atmospheric Glow on Hover or High Opacity */}
                    <circle
                      cx="0"
                      cy="0"
                      r={sat.size * (isHovered ? 2.4 : 1.6)}
                      fill={sat.color}
                      opacity={isHovered ? 0.4 : 0.15}
                      className="transition-all duration-300"
                    />

                    {/* Outer Satellite Orbit Ring (Constraint Bracket) */}
                    <circle
                      cx="0"
                      cy="0"
                      r={sat.size * 1.3}
                      fill="none"
                      stroke={sat.color}
                      strokeWidth="0.8"
                      strokeDasharray="2 2"
                      opacity={isHovered ? 0.9 : 0.45}
                    />

                    {/* Satellite Celestial Body */}
                    <circle
                      cx="0"
                      cy="0"
                      r={sat.size}
                      fill={sat.color}
                      filter={`url(#orbit-glow-${id})`}
                    />

                    {/* Specular Highlight */}
                    <circle
                      cx={-sat.size * 0.28}
                      cy={-sat.size * 0.28}
                      r={sat.size * 0.35}
                      fill="#ffffff"
                      opacity="0.85"
                    />

                    {/* Sub-Satellite / Natural Moon */}
                    {sat.hasSubSatellite && (
                      <g>
                        <ellipse
                          cx="0"
                          cy="0"
                          rx={sat.subSatelliteRadius || 10}
                          ry={(sat.subSatelliteRadius || 10) * 0.6}
                          fill="none"
                          stroke={sat.color}
                          strokeWidth="0.5"
                          strokeDasharray="1.5 2"
                          opacity="0.4"
                        />
                        <circle
                          cx={sat.subSatelliteRadius || 10}
                          cy="0"
                          r="1.8"
                          fill="#ffffff"
                          opacity="0.9"
                        />
                      </g>
                    )}

                    {/* Satellite Beacon Pulse */}
                    <circle
                      cx="0"
                      cy="0"
                      r="1.5"
                      fill="#ffffff"
                      opacity="0.9"
                      style={{
                        animation: `orbit-beacon-${id} 2s infinite ease-in-out`,
                      }}
                    />

                    {/* Name Tag / Metadata */}
                    {showLabels && (
                      <text
                        x={sat.size + 4}
                        y="3"
                        fill={isHovered ? '#ffffff' : sat.color}
                        fontSize="7"
                        fontFamily="monospace"
                        fontWeight="600"
                        letterSpacing="0.05em"
                        opacity={isHovered ? 1 : 0.75}
                      >
                        {sat.name || sat.id.toUpperCase()}
                      </text>
                    )}
                  </g>
                </g>
              );
            })}
        </g>
      </svg>
    </div>
  );
};
