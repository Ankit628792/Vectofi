import React, { useMemo } from 'react';
import { IconItem } from '../../types';
import { parseSvgBodyToMorphablePaths } from '../../utils/animations';
import { isFillBasedIcon } from '../../utils/svgUtils';
import { useIconBody } from '../../hooks/useIconBody';

interface AnimatedIconRendererProps {
  icon: IconItem;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  animated?: boolean;
  speed?: number;
  className?: string;
  forceStatic?: boolean;
  lazy?: boolean;
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
  lazy = true,
}) => {
  // Lazily resolve SVG path body on demand
  const { body, isLoaded } = useIconBody(icon, lazy);

  const isReducedMotionActive =
    typeof document !== 'undefined' &&
    (document.documentElement.classList.contains('reduced-motion') ||
      document.documentElement.getAttribute('data-reduced-motion') === 'true');

  const shouldAnimate = !forceStatic && !isReducedMotionActive && animated && icon.hasAnimation;

  // Detect whether this icon uses filled vector geometries (Remix, Material) or stroke lines (Lucide, Tabler)
  const isFill = useMemo(() => {
    return isFillBasedIcon(body, icon.style);
  }, [body, icon.style]);

  // Parse SVG geometric elements into normalized morphable path descriptors (only when animating)
  const morphablePaths = useMemo(() => {
    if (!shouldAnimate || !body) return [];
    return parseSvgBodyToMorphablePaths(body, icon.slug, 14);
  }, [body, icon.slug, shouldAnimate]);

  // Duration in seconds (scaled by speed prop)
  const durationSec = Math.max(0.6, 2.4 / Math.max(0.2, speed)).toFixed(2);

  // Placeholder if body is still hydrating
  if (!body && !isLoaded) {
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
        className={`transition-colors inline-block opacity-40 animate-pulse ${className}`}
        aria-label={`Loading ${icon.name}`}
      >
        <rect x="3" y="3" width="18" height="18" rx="4" strokeDasharray="3 3" opacity="0.6" />
      </svg>
    );
  }

  // If not animating, render authentic source SVG markup with 100% fidelity
  if (!shouldAnimate) {
    if (isFill) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox={icon.viewBox || '0 0 24 24'}
          fill={color}
          className={`transition-colors inline-block ${className}`}
          aria-label={icon.name}
        >
          <g dangerouslySetInnerHTML={{ __html: body }} />
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
        <g dangerouslySetInnerHTML={{ __html: body }} />
      </svg>
    );
  }

  // Fallback: If no paths could be parsed, render static SVG body safely
  if (morphablePaths.length === 0) {
    if (isFill) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox={icon.viewBox || '0 0 24 24'}
          fill={color}
          className={`transition-colors inline-block ${className}`}
          aria-label={icon.name}
        >
          <g dangerouslySetInnerHTML={{ __html: body }} />
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
        <g dangerouslySetInnerHTML={{ __html: body }} />
      </svg>
    );
  }

  if (isFill) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={icon.viewBox || '0 0 24 24'}
        fill={color}
        className={`transition-colors inline-block ${className}`}
        aria-label={icon.name}
      >
        <g>
          {morphablePaths.map(p => {
            const fillColor =
              p.fill && p.fill !== 'none'
                ? p.fill === 'currentColor'
                  ? color
                  : p.fill
                : color;

            return (
              <path
                key={p.id}
                d={p.originalD}
                fill={fillColor}
                opacity={p.opacity}
              >
                <animate
                  attributeName="d"
                  dur={`${durationSec}s`}
                  repeatCount="indefinite"
                  values={p.valuesString}
                />
              </path>
            );
          })}
        </g>
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
        {morphablePaths.map(p => {
          const pathStroke =
            p.stroke && p.stroke !== 'none'
              ? p.stroke === 'currentColor'
                ? color
                : p.stroke
              : color;
          const pathWidth = p.strokeWidth || strokeWidth;

          return (
            <path
              key={p.id}
              d={p.originalD}
              stroke={pathStroke}
              strokeWidth={pathWidth}
              fill={p.fill || 'none'}
              opacity={p.opacity}
              strokeLinecap={p.strokeLinecap || 'round'}
              strokeLinejoin={p.strokeLinejoin || 'round'}
            >
              <animate
                attributeName="d"
                dur={`${durationSec}s`}
                repeatCount="indefinite"
                values={p.valuesString}
              />
            </path>
          );
        })}
      </g>
    </svg>
  );
};
