import React, { useMemo } from 'react';
import { IconItem } from '../../types';
import { parseSvgBodyToMorphablePaths } from '../../utils/animations';

interface AnimatedIconRendererProps {
  icon: IconItem;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  animated?: boolean;
  speed?: number;
  className?: string;
  forceStatic?: boolean;
}

export const AnimatedIconRenderer: React.FC<AnimatedIconRendererProps> = ({
  icon,
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  animated = false,
  speed = 1,
  className = '',
  forceStatic = false,
}) => {
  const isReducedMotionActive =
    typeof document !== 'undefined' &&
    (document.documentElement.classList.contains('reduced-motion') ||
      document.documentElement.getAttribute('data-reduced-motion') === 'true');

  const shouldAnimate = !forceStatic && !isReducedMotionActive && animated && icon.hasAnimation;

  // Parse SVG geometric elements into normalized morphable path descriptors
  const morphablePaths = useMemo(() => {
    return parseSvgBodyToMorphablePaths(icon.body, icon.slug, 14);
  }, [icon.body, icon.slug]);

  // Duration in seconds (scaled by speed prop)
  const durationSec = Math.max(0.6, 2.4 / Math.max(0.2, speed));

  // If not animating, render authentic source SVG markup with 100% fidelity
  if (!shouldAnimate) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={icon.viewBox || '0 0 24 24'}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-colors inline-block ${className}`}
        aria-label={icon.name}
      >
        <g dangerouslySetInnerHTML={{ __html: icon.body }} />
      </svg>
    );
  }

  // Fallback: If no paths could be parsed, render static SVG body safely
  if (morphablePaths.length === 0) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={icon.viewBox || '0 0 24 24'}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-colors inline-block ${className}`}
        aria-label={icon.name}
      >
        <g dangerouslySetInnerHTML={{ __html: icon.body }} />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={icon.viewBox || '0 0 24 24'}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-colors inline-block ${className}`}
      aria-label={icon.name}
    >
      <g>
        {morphablePaths.map(p => (
          <path
            key={`${p.id}-anim`}
            d={p.originalD}
            stroke={p.stroke || color}
            strokeWidth={p.strokeWidth || strokeWidth}
            fill={p.fill || 'none'}
            strokeLinecap={p.strokeLinecap || 'round'}
            strokeLinejoin={p.strokeLinejoin || 'round'}
            opacity={p.opacity}
          >
            <animate
              attributeName="d"
              dur={`${durationSec.toFixed(2)}s`}
              repeatCount="indefinite"
              values={p.valuesString}
            />
          </path>
        ))}
      </g>
    </svg>
  );
};
