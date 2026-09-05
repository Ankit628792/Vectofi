import React, { useId } from 'react';

export interface VectorBlobProps {
  className?: string;
  size?: number;
  color?: string;
  variant?: 1 | 2 | 3 | 4;
  animated?: boolean;
  dashedRing?: boolean;
  opacity?: number;
}

export const VectorBlob: React.FC<VectorBlobProps> = ({
  className = '',
  size = 320,
  color = '#3b82f6',
  variant = 1,
  animated = true,
  dashedRing = true,
  opacity = 0.08,
}) => {
  const id = useId().replace(/:/g, '');

  const paths = {
    1: 'M38.9,-46.8C50.2,-38.3,58.9,-26.2,62.2,-12.3C65.5,1.7,63.4,17.4,55.1,28.8C46.8,40.1,32.3,47.1,17.3,51.8C2.3,56.5,-13.2,59,-27.4,54.3C-41.5,49.7,-54.3,37.9,-60.2,23.3C-66.2,8.7,-65.4,-8.6,-59.2,-23.4C-53,-38.1,-41.4,-50.2,-28.1,-57.8C-14.7,-65.4,0.3,-68.4,14.2,-64.7C28,-61,41,-50.6,38.9,-46.8Z',
    2: 'M44.7,-57.4C58.3,-48.5,70,-34.5,73.5,-18.4C77,-2.3,72.4,15.9,62.9,29.9C53.5,43.9,39.3,53.8,23.8,60.2C8.3,66.6,-8.4,69.5,-23.5,65.3C-38.6,61.1,-52.1,49.8,-60.3,35.7C-68.5,21.5,-71.4,4.5,-68.3,-11.2C-65.2,-26.9,-56.1,-41.3,-43.5,-50.5C-30.8,-59.6,-14.6,-63.5,1.2,-65.2C17.1,-66.8,31.1,-66.2,44.7,-57.4Z',
    3: 'M36.1,-47.1C47.7,-38.8,58.5,-28.7,64.2,-15.5C69.9,-2.4,70.5,13.9,63.9,27.1C57.3,40.3,43.5,50.4,28.4,57.1C13.3,63.7,-3.1,66.9,-18.2,63.6C-33.3,60.3,-47.2,50.6,-57.4,37.3C-67.6,24,-74.1,7.2,-71.9,-8.4C-69.6,-23.9,-58.5,-38.2,-45.3,-46.4C-32.1,-54.5,-16.9,-56.6,-1.3,-54.9C14.3,-53.2,24.5,-55.4,36.1,-47.1Z',
    4: 'M48.2,-54.3C60.4,-44.1,67,-27.7,67.6,-11.9C68.2,3.9,62.8,19,53.5,31.5C44.3,43.9,31.2,53.7,16.8,58.4C2.3,63.1,-13.4,62.7,-27.2,56.3C-41.1,49.9,-53.1,37.5,-60.1,22.7C-67.1,7.9,-69.1,-9.3,-63.2,-23.8C-57.3,-38.3,-43.5,-50,-28.8,-59.1C-14.1,-68.1,1.5,-74.5,15.8,-71.6C30.1,-68.6,36,-56.3,48.2,-54.3Z',
  };

  return (
    <svg
      className={`pointer-events-none ${className} ${animated ? 'animate-vector-float' : ''}`}
      width={size}
      height={size}
      viewBox="-90 -90 180 180"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`blob-grad-${id}`} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor={color} stopOpacity={opacity * 2.5} />
          <stop offset="100%" stopColor={color} stopOpacity={opacity * 0.2} />
        </radialGradient>
      </defs>

      {/* Dashed outer constraint ring */}
      {dashedRing && (
        <circle
          cx="0"
          cy="0"
          r="75"
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeOpacity={opacity * 1.5}
          strokeDasharray="4 6"
        />
      )}

      {/* Vector Blob Shape */}
      <path
        d={paths[variant] || paths[1]}
        fill={`url(#blob-grad-${id})`}
        stroke={color}
        strokeWidth="1.25"
        strokeOpacity={opacity * 3}
      />
    </svg>
  );
};
