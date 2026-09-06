import React, { useMemo } from 'react';
import { calculateIntermediatePaths, MorphEasing } from '../../utils/animations';

export interface VectorStarsProps {
  className?: string;
  size?: number;
  color?: string;
  count?: 1 | 2 | 3 | 4;
  glow?: boolean;
  animated?: boolean;
}

export const VectorStars: React.FC<VectorStarsProps> = ({
  className = '',
  size = 28,
  color = 'currentColor',
  count = 3,
  glow = true,
  animated = true,
}) => {
  const primaryRestD = 'M 24 6 C 24 16 26 22 36 24 C 26 26 24 32 24 42 C 24 32 22 26 12 24 C 22 22 24 16 24 6 Z';
  const primaryMorphD = 'M 24 13 C 24 19 21 22 17 24 C 21 26 24 29 24 35 C 24 29 27 26 31 24 C 27 22 24 19 24 13 Z';

  const secondaryRestD = 'M 38 7 C 38 10 39 12 43 13 C 39 14 38 16 38 19 C 38 16 37 14 33 13 C 37 12 38 10 38 7 Z';
  const secondaryMorphD = 'M 38 10 C 38 11 39 12 41 13 C 39 14 38 15 38 16 C 38 15 37 14 35 13 C 37 12 38 11 38 10 Z';

  const tertiaryRestD = 'M 10 31 C 10 33 11 34 13 35 C 11 36 10 37 10 39 C 10 37 9 36 7 35 C 9 34 10 33 10 31 Z';
  const tertiaryMorphD = 'M 10 33 C 10 34 11 34.5 12 35 C 11 35.5 10 36 10 37 C 10 36 9 35.5 8 35 C 9 34.5 10 34 10 33 Z';

  const primaryValues = useMemo(
    () => calculateIntermediatePaths(primaryRestD, primaryMorphD, 8, { loopBack: true, ease: MorphEasing.easeInOutCubic }).join(';'),
    []
  );

  const secondaryValues = useMemo(
    () => calculateIntermediatePaths(secondaryRestD, secondaryMorphD, 8, { loopBack: true, ease: MorphEasing.easeInOutCubic }).join(';'),
    []
  );

  const tertiaryValues = useMemo(
    () => calculateIntermediatePaths(tertiaryRestD, tertiaryMorphD, 8, { loopBack: true, ease: MorphEasing.easeInOutCubic }).join(';'),
    []
  );

  return (
    <svg
      className={`pointer-events-none ${className}`}
      width={size * 1.8}
      height={size * 1.8}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {glow && (
          <filter id="star-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* Primary 4-point Star with SVG Path Morph */}
      <g>
        <path
          d={primaryRestD}
          fill={color}
          fillOpacity="0.9"
          filter={glow ? 'url(#star-glow)' : undefined}
        >
          {animated && (
            <animate
              attributeName="d"
              dur="2.2s"
              repeatCount="indefinite"
              values={primaryValues}
            />
          )}
        </path>
        {/* Core diamond shine */}
        <circle cx="24" cy="24" r="1.5" fill="#ffffff" />
      </g>

      {/* Secondary Companion Star with SVG Path Morph */}
      {count >= 2 && (
        <g>
          <path
            d={secondaryRestD}
            fill={color}
            fillOpacity="0.7"
          >
            {animated && (
              <animate
                attributeName="d"
                dur="2.6s"
                repeatCount="indefinite"
                values={secondaryValues}
              />
            )}
          </path>
        </g>
      )}

      {/* Tertiary Companion Star with SVG Path Morph */}
      {count >= 3 && (
        <g>
          <path
            d={tertiaryRestD}
            fill={color}
            fillOpacity="0.6"
          >
            {animated && (
              <animate
                attributeName="d"
                dur="1.9s"
                repeatCount="indefinite"
                values={tertiaryValues}
              />
            )}
          </path>
        </g>
      )}

      {/* Quaternary Tiny Star Sparkle */}
      {count >= 4 && (
        <circle
          cx="36"
          cy="34"
          r="1"
          fill={color}
          fillOpacity="0.8"
        />
      )}
    </svg>
  );
};
