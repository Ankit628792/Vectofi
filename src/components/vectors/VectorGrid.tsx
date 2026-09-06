import React, { useId, useState, useEffect, useRef, useMemo } from 'react';

export interface MagnetPoint {
  x: number;
  y: number;
  distance: number;
  opacity: number;
  scale: number;
}

export interface VectorGridProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  gridSize?: number;
  strokeColor?: string;
  accentColor?: string;
  strokeWidth?: number;
  crosshairs?: boolean;
  dots?: boolean;
  opacity?: number;
  interactive?: boolean;
  magnetPoints?: boolean;
  snapRadius?: number;
  showCoordinates?: boolean;
  showTether?: boolean;
}

export const VectorGrid: React.FC<VectorGridProps> = ({
  className = '',
  width = '100%',
  height = '100%',
  gridSize = 48,
  strokeColor = '#3b82f6',
  accentColor = '#38bdf8',
  strokeWidth = 0.75,
  crosshairs = true,
  dots = true,
  opacity = 0.2,
  interactive = true,
  magnetPoints = true,
  snapRadius = 90,
  showCoordinates = true,
  showTether = true,
}) => {
  const rawId = useId();
  const id = rawId.replace(/:/g, '');
  const patternId = `vgrid-pattern-${id}`;
  const dotsId = `vgrid-dots-${id}`;

  const containerRef = useRef<SVGSVGElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 800,
    height: 600,
  });

  // Track cursor coordinates across the parent grid area
  useEffect(() => {
    if (!interactive) return;

    const svgElement = containerRef.current;
    if (!svgElement) return;

    // Use parent element if available for a wider interactive hover catchment area
    const targetElement = svgElement.parentElement || svgElement;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = svgElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update container dimensions
      if (rect.width !== containerSize.width || rect.height !== containerSize.height) {
        setContainerSize({ width: rect.width, height: rect.height });
      }

      if (x >= -40 && x <= rect.width + 40 && y >= -40 && y <= rect.height + 40) {
        setMousePos({ x, y });
      } else {
        setMousePos(null);
      }
    };

    const handleMouseLeave = () => {
      setMousePos(null);
    };

    targetElement.addEventListener('mousemove', handleMouseMove, { passive: true });
    targetElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      targetElement.removeEventListener('mousemove', handleMouseMove);
      targetElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [interactive, containerSize.width, containerSize.height]);

  // Compute nearest snapped magnet anchor and neighboring active nodes
  const magnetState = useMemo(() => {
    if (!mousePos || !magnetPoints) return null;

    const { x, y } = mousePos;
    const snapX = Math.round(x / gridSize) * gridSize;
    const snapY = Math.round(y / gridSize) * gridSize;
    const distToSnap = Math.hypot(x - snapX, y - snapY);

    const isLocked = distToSnap <= snapRadius;

    // Calculate surrounding grid intersection points to light up in proximity
    const nearbyPoints: MagnetPoint[] = [];
    const searchRadius = gridSize * 2.5;

    const minCol = Math.floor((x - searchRadius) / gridSize);
    const maxCol = Math.ceil((x + searchRadius) / gridSize);
    const minRow = Math.floor((y - searchRadius) / gridSize);
    const maxRow = Math.ceil((y + searchRadius) / gridSize);

    for (let col = minCol; col <= maxCol; col++) {
      for (let row = minRow; row <= maxRow; row++) {
        const ptX = col * gridSize;
        const ptY = row * gridSize;
        const d = Math.hypot(x - ptX, y - ptY);

        if (d < searchRadius && ptX >= 0 && ptY >= 0) {
          const proximity = 1 - d / searchRadius;
          nearbyPoints.push({
            x: ptX,
            y: ptY,
            distance: d,
            opacity: Math.pow(proximity, 1.8),
            scale: 1 + proximity * 1.5,
          });
        }
      }
    }

    return {
      snapX,
      snapY,
      distToSnap,
      isLocked,
      nearbyPoints,
    };
  }, [mousePos, magnetPoints, gridSize, snapRadius]);

  return (
    <svg
      ref={containerRef}
      className={`pointer-events-none select-none overflow-visible ${className}`}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Architectural Base Grid Pattern */}
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
              d={`M ${gridSize / 2 - 2.5} ${gridSize / 2} L ${gridSize / 2 + 2.5} ${gridSize / 2} M ${gridSize / 2} ${gridSize / 2 - 2.5} L ${gridSize / 2} ${gridSize / 2 + 2.5}`}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 1.2}
              strokeOpacity={opacity * 1.8}
            />
          )}
        </pattern>

        {/* Micro Subgrid Dots */}
        {dots && (
          <pattern
            id={dotsId}
            width={gridSize / 4}
            height={gridSize / 4}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={gridSize / 8}
              cy={gridSize / 8}
              r={0.75}
              fill={strokeColor}
              fillOpacity={opacity * 0.75}
            />
          </pattern>
        )}

        {/* Glow Filter for Activated Magnet Points */}
        <filter id={`magnet-glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Grid Pattern Fills */}
      {dots && <rect width="100%" height="100%" fill={`url(#${dotsId})`} />}
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />

      {/* Interactive Magnet Points and Snap Reticle */}
      {interactive && magnetPoints && mousePos && magnetState && (
        <g id={`magnet-system-${id}`} className="transition-opacity duration-200">
          {/* Proximity Ambient Vertex Points */}
          {magnetState.nearbyPoints.map((pt, index) => (
            <g key={`pt-${index}`}>
              {/* Diffuse Vertex Aura */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={3 * pt.scale}
                fill={accentColor}
                opacity={pt.opacity * 0.35}
              />
              {/* Sharp Magnetic Vertex Center */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={1.5 * pt.scale}
                fill={accentColor}
                opacity={pt.opacity * 0.9}
                filter={`url(#magnet-glow-${id})`}
              />
              {/* Vertex Anchor Crosshair on close proximity */}
              {pt.distance < gridSize && (
                <path
                  d={`M ${pt.x - 4} ${pt.y} L ${pt.x + 4} ${pt.y} M ${pt.x} ${pt.y - 4} L ${pt.x} ${pt.y + 4}`}
                  stroke={accentColor}
                  strokeWidth="0.8"
                  strokeOpacity={pt.opacity * 0.8}
                />
              )}
            </g>
          ))}

          {/* Magnetic Attraction Tether Line to Nearest Snap Point */}
          {showTether && magnetState.isLocked && (
            <line
              x1={mousePos.x}
              y1={mousePos.y}
              x2={magnetState.snapX}
              y2={magnetState.snapY}
              stroke={accentColor}
              strokeWidth="1"
              strokeDasharray="2 3"
              strokeOpacity="0.65"
            />
          )}

          {/* Primary Locked Magnet Point Indicator */}
          {magnetState.isLocked && (
            <g transform={`translate(${magnetState.snapX}, ${magnetState.snapY})`}>
              {/* Precision Target Reticle Bracket */}
              <circle
                cx="0"
                cy="0"
                r="10"
                fill="none"
                stroke={accentColor}
                strokeWidth="1.2"
                strokeDasharray="4 3"
                opacity="0.9"
                className="animate-spin"
                style={{ animationDuration: '8s' }}
              />

              {/* Pulsing Solid Snap Target */}
              <circle
                cx="0"
                cy="0"
                r="3.5"
                fill={accentColor}
                filter={`url(#magnet-glow-${id})`}
              />
              <circle cx="0" cy="0" r="1.5" fill="#ffffff" />

              {/* Precision Coordinate HUD Tag */}
              {showCoordinates && (
                <g transform="translate(14, -12)">
                  <rect
                    x="-4"
                    y="-12"
                    width="104"
                    height="18"
                    rx="4"
                    fill="#0a0f1d"
                    fillOpacity="0.9"
                    stroke={accentColor}
                    strokeWidth="0.8"
                    strokeOpacity="0.75"
                  />
                  <text
                    x="4"
                    y="0"
                    fill={accentColor}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="600"
                    letterSpacing="0.04em"
                  >
                    SNAP {magnetState.snapX},{magnetState.snapY}
                  </text>
                  {/* Status Indicator Dot */}
                  <circle cx="92" cy="-3" r="2" fill="#22c55e" />
                </g>
              )}
            </g>
          )}

          {/* Floating Subtle Cursor Probe Dot */}
          <circle
            cx={mousePos.x}
            cy={mousePos.y}
            r="2"
            fill="#ffffff"
            opacity="0.75"
          />
        </g>
      )}
    </svg>
  );
};
