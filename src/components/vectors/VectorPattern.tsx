import React, { useId } from 'react';

export type PatternVariant =
  | 'hexagons'
  | 'triangles'
  | 'hex-triangle'
  | 'isometric-cube'
  | 'tri-hex-weave'
  | 'isometric'
  | 'grid'
  | 'dots'
  | 'chevrons'
  | 'circuit'
  | 'crosshatch';

export interface VectorPatternProps {
  className?: string;
  variant?: PatternVariant;
  patternSize?: number;
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
  fillColor?: string;
  fillOpacity?: number;
  width?: number | string;
  height?: number | string;
  vignette?: boolean; // Radial fade towards edges for seamless section backgrounds
  accentNodes?: boolean; // Highlighted vertex dots at polygon corners
}

export const VectorPattern: React.FC<VectorPatternProps> = ({
  className = '',
  variant = 'hex-triangle',
  patternSize = 48,
  strokeColor = '#3b82f6',
  strokeWidth = 1,
  opacity = 0.18,
  fillColor = 'transparent',
  fillOpacity = 0.04,
  width = '100%',
  height = '100%',
  vignette = false,
  accentNodes = true,
}) => {
  const resolvedVariant =
    variant === 'isometric'
      ? 'isometric-cube'
      : variant === 'grid' ||
        variant === 'dots' ||
        variant === 'chevrons' ||
        variant === 'circuit' ||
        variant === 'crosshatch'
      ? 'hex-triangle'
      : variant;

  const rawId = useId();
  const id = rawId.replace(/:/g, '');
  const patternId = `vpattern-geom-${resolvedVariant}-${id}`;
  const maskId = `vpattern-mask-${id}`;

  // Mathematical constants for regular hexagon and equilateral triangle geometry
  // Width of hexagon = 2 * R, Height = sqrt(3) * R
  const s = patternSize;
  const sqrt3 = 1.7320508;
  const h = s * (sqrt3 / 2); // triangle height

  return (
    <svg
      className={`pointer-events-none ${className}`}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Optional radial fade mask for soft edge blend in section headers */}
        {vignette && (
          <mask id={maskId}>
            <radialGradient id={`vignette-grad-${id}`} cx="50%" cy="50%" r="50%">
              <stop offset="20%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <rect width="100%" height="100%" fill={`url(#vignette-grad-${id})`} />
          </mask>
        )}

        {/* 1. Hexagons (Regular Honeycomb Mesh) */}
        {resolvedVariant === 'hexagons' && (
          <pattern
            id={patternId}
            width={s * 3}
            height={h * 2}
            patternUnits="userSpaceOnUse"
          >
            {/* Hexagon 1 */}
            <path
              d={`
                M ${s * 0.5} 0
                L ${s * 1.5} 0
                L ${s * 2} ${h}
                L ${s * 1.5} ${h * 2}
                L ${s * 0.5} ${h * 2}
                L 0 ${h}
                Z
              `}
              fill={fillColor}
              fillOpacity={fillOpacity}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
              strokeLinejoin="round"
            />
            {/* Hexagon 2 (Offset by 1.5s, h) */}
            <path
              d={`
                M ${s * 2} ${h}
                L ${s * 3} ${h}
                L ${s * 3.5} ${h * 2}
                L ${s * 3} ${h * 3}
                L ${s * 2} ${h * 3}
                L ${s * 1.5} ${h * 2}
                Z
              `}
              fill={fillColor}
              fillOpacity={fillOpacity}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
              strokeLinejoin="round"
            />

            {/* Corner Hexagon Caps for seamless repeating tile */}
            <path
              d={`
                M ${s * 3.5} 0
                L ${s * 4.5} 0
                L ${s * 5} ${h}
              `}
              transform={`translate(${-s * 3}, 0)`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
            />

            {accentNodes && (
              <>
                <circle cx={s * 0.5} cy="0" r={1.5} fill={strokeColor} fillOpacity={opacity * 2} />
                <circle cx={s * 1.5} cy="0" r={1.5} fill={strokeColor} fillOpacity={opacity * 2} />
                <circle cx={s * 2} cy={h} r={1.5} fill={strokeColor} fillOpacity={opacity * 2} />
                <circle cx={s * 1.5} cy={h * 2} r={1.5} fill={strokeColor} fillOpacity={opacity * 2} />
                <circle cx={s * 0.5} cy={h * 2} r={1.5} fill={strokeColor} fillOpacity={opacity * 2} />
                <circle cx="0" cy={h} r={1.5} fill={strokeColor} fillOpacity={opacity * 2} />
              </>
            )}
          </pattern>
        )}

        {/* 2. Equilateral Triangles (Delta Mesh) */}
        {resolvedVariant === 'triangles' && (
          <pattern
            id={patternId}
            width={s}
            height={h}
            patternUnits="userSpaceOnUse"
          >
            {/* Upward Triangle */}
            <polygon
              points={`0,${h} ${s / 2},0 ${s},${h}`}
              fill={fillColor}
              fillOpacity={fillOpacity}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
              strokeLinejoin="round"
            />
            {/* Downward Triangles completing the parallelogram */}
            <line x1="0" y1="0" x2={s} y2="0" stroke={strokeColor} strokeWidth={strokeWidth} strokeOpacity={opacity} />
            <line x1="0" y1="0" x2={s / 2} y2={h} stroke={strokeColor} strokeWidth={strokeWidth} strokeOpacity={opacity} />
            <line x1={s / 2} y1={h} x2={s} y2="0" stroke={strokeColor} strokeWidth={strokeWidth} strokeOpacity={opacity} />

            {accentNodes && (
              <>
                <circle cx="0" cy="0" r={1.5} fill={strokeColor} fillOpacity={opacity * 2} />
                <circle cx={s / 2} cy="0" r={1.5} fill={strokeColor} fillOpacity={opacity * 2} />
                <circle cx={s} cy="0" r={1.5} fill={strokeColor} fillOpacity={opacity * 2} />
                <circle cx={s / 2} cy={h} r={1.5} fill={strokeColor} fillOpacity={opacity * 2} />
              </>
            )}
          </pattern>
        )}

        {/* 3. Hex-Triangle Composite (Hexagon subdivided into 6 triangles + central node) */}
        {resolvedVariant === 'hex-triangle' && (
          <pattern
            id={patternId}
            width={s * 1.732}
            height={s * 1.5}
            patternUnits="userSpaceOnUse"
          >
            {/* Hexagonal Outer Perimeter */}
            <path
              d={`
                M ${s * 0.866} 0
                L ${s * 1.732} ${s * 0.5}
                L ${s * 1.732} ${s * 1}
                L ${s * 0.866} ${s * 1.5}
                L 0 ${s * 1}
                L 0 ${s * 0.5}
                Z
              `}
              fill={fillColor}
              fillOpacity={fillOpacity}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
              strokeLinejoin="round"
            />

            {/* Internal Triangle Spokes to Centroid */}
            <line x1={s * 0.866} y1="0" x2={s * 0.866} y2={s * 1.5} stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeOpacity={opacity * 0.85} />
            <line x1="0" y1={s * 0.5} x2={s * 1.732} y2={s * 1} stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeOpacity={opacity * 0.85} />
            <line x1="0" y1={s * 1} x2={s * 1.732} y2={s * 0.5} stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeOpacity={opacity * 0.85} />

            {/* Central Precision Hexagram Core */}
            <circle
              cx={s * 0.866}
              cy={s * 0.75}
              r={strokeWidth * 1.8}
              fill={strokeColor}
              fillOpacity={opacity * 2.2}
            />

            {/* Micro Crosshairs at apex */}
            {accentNodes && (
              <>
                <circle cx={s * 0.866} cy="0" r={1.2} fill={strokeColor} fillOpacity={opacity * 2} />
                <circle cx={s * 1.732} cy={s * 0.5} r={1.2} fill={strokeColor} fillOpacity={opacity * 2} />
                <circle cx={s * 1.732} cy={s * 1} r={1.2} fill={strokeColor} fillOpacity={opacity * 2} />
                <circle cx={s * 0.866} cy={s * 1.5} r={1.2} fill={strokeColor} fillOpacity={opacity * 2} />
                <circle cx="0" cy={s * 1} r={1.2} fill={strokeColor} fillOpacity={opacity * 2} />
                <circle cx="0" cy={s * 0.5} r={1.2} fill={strokeColor} fillOpacity={opacity * 2} />
              </>
            )}
          </pattern>
        )}

        {/* 4. Isometric Cube Lattice (3D Rhombus-faceted Hexagons) */}
        {resolvedVariant === 'isometric-cube' && (
          <pattern
            id={patternId}
            width={s * 1.732}
            height={s}
            patternUnits="userSpaceOnUse"
          >
            {/* Outer Hexagon */}
            <path
              d={`
                M 0 ${s / 2}
                L ${s * 0.866} 0
                L ${s * 1.732} ${s / 2}
                L ${s * 0.866} ${s}
                Z
              `}
              fill={fillColor}
              fillOpacity={fillOpacity}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
              strokeLinejoin="round"
            />
            {/* Isometric Y-axis Center Divider */}
            <path
              d={`
                M ${s * 0.866} 0
                L ${s * 0.866} ${s}
                M 0 ${s / 2}
                L ${s * 0.866} ${s / 2}
                M ${s * 1.732} ${s / 2}
                L ${s * 0.866} ${s / 2}
              `}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity * 0.9}
            />
            {/* Top face subtle tint */}
            <polygon
              points={`0,${s / 2} ${s * 0.866},0 ${s * 1.732},${s / 2} ${s * 0.866},${s / 2}`}
              fill={strokeColor}
              fillOpacity={opacity * 0.15}
            />
          </pattern>
        )}

        {/* 5. Tri-Hexagonal Weave (Kagome Lattice: Hexagons surrounded by Triangles) */}
        {resolvedVariant === 'tri-hex-weave' && (
          <pattern
            id={patternId}
            width={s * 2}
            height={h * 2}
            patternUnits="userSpaceOnUse"
          >
            {/* Central Hexagon */}
            <polygon
              points={`
                ${s * 0.5},${h * 0.5}
                ${s * 1.5},${h * 0.5}
                ${s * 2},${h}
                ${s * 1.5},${h * 1.5}
                ${s * 0.5},${h * 1.5}
                0,${h}
              `}
              fill={fillColor}
              fillOpacity={fillOpacity}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
            />
            {/* Surrounding triangles */}
            <polygon
              points={`0,${h} ${s * 0.5},${h * 0.5} 0,0`}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.8}
              strokeOpacity={opacity * 0.75}
              fill="none"
            />
            <polygon
              points={`${s * 2},${h} ${s * 1.5},${h * 0.5} ${s * 2},0`}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.8}
              strokeOpacity={opacity * 0.75}
              fill="none"
            />
            <polygon
              points={`0,${h} ${s * 0.5},${h * 1.5} 0,${h * 2}`}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.8}
              strokeOpacity={opacity * 0.75}
              fill="none"
            />
            <polygon
              points={`${s * 2},${h} ${s * 1.5},${h * 1.5} ${s * 2},${h * 2}`}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.8}
              strokeOpacity={opacity * 0.75}
              fill="none"
            />
          </pattern>
        )}
      </defs>

      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        mask={vignette ? `url(#${maskId})` : undefined}
      />
    </svg>
  );
};
