import React from 'react';

export interface VectorLinesProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical' | 'cross' | 'bracket';
  length?: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  label?: string;
  ticks?: boolean;
}

export const VectorLines: React.FC<VectorLinesProps> = ({
  className = '',
  orientation = 'horizontal',
  length = 240,
  color = 'currentColor',
  strokeWidth = 1,
  opacity = 0.25,
  label = 'Δ 24.00px',
  ticks = true,
}) => {
  if (orientation === 'bracket') {
    return (
      <svg
        className={`pointer-events-none ${className}`}
        width={length}
        height={32}
        viewBox={`0 0 ${length} 32`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d={`M 0 16 L 12 16 L 18 6 L ${length / 2 - 24} 6 M ${length / 2 + 24} 6 L ${length - 18} 6 L ${length - 12} 16 L ${length} 16`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeOpacity={opacity}
        />
        <circle cx="0" cy="16" r="2" fill={color} fillOpacity={opacity * 1.5} />
        <circle cx={length} cy="16" r="2" fill={color} fillOpacity={opacity * 1.5} />
        {label && (
          <text
            x={length / 2}
            y={10}
            textAnchor="middle"
            fill={color}
            fillOpacity={opacity * 2}
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="0.05em"
          >
            {label}
          </text>
        )}
      </svg>
    );
  }

  if (orientation === 'cross') {
    const size = length;
    const half = size / 2;
    return (
      <svg
        className={`pointer-events-none ${className}`}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <line
          x1={0}
          y1={half}
          x2={size}
          y2={half}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeOpacity={opacity}
          strokeDasharray="4 3"
        />
        <line
          x1={half}
          y1={0}
          x2={half}
          y2={size}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeOpacity={opacity}
          strokeDasharray="4 3"
        />
        <circle cx={half} cy={half} r="3" fill="none" stroke={color} strokeWidth="1" strokeOpacity={opacity * 1.5} />
        <circle cx={half} cy={half} r="1" fill={color} fillOpacity={opacity * 2} />
      </svg>
    );
  }

  if (orientation === 'vertical') {
    return (
      <svg
        className={`pointer-events-none ${className}`}
        width={24}
        height={length}
        viewBox={`0 0 24 ${length}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <line
          x1={12}
          y1={0}
          x2={12}
          y2={length}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeOpacity={opacity}
        />
        {ticks && (
          <>
            {Array.from({ length: Math.floor(length / 20) + 1 }).map((_, i) => {
              const y = i * 20;
              const isMajor = i % 5 === 0;
              return (
                <line
                  key={i}
                  x1={isMajor ? 4 : 8}
                  y1={y}
                  x2={isMajor ? 20 : 16}
                  y2={y}
                  stroke={color}
                  strokeWidth={isMajor ? 1.25 : 0.75}
                  strokeOpacity={isMajor ? opacity * 1.5 : opacity}
                />
              );
            })}
          </>
        )}
      </svg>
    );
  }

  // Default: Horizontal
  return (
    <svg
      className={`pointer-events-none ${className}`}
      width={length}
      height={24}
      viewBox={`0 0 ${length} 24`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line
        x1={0}
        y1={12}
        x2={length}
        y2={12}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={opacity}
      />
      {ticks && (
        <>
          {Array.from({ length: Math.floor(length / 20) + 1 }).map((_, i) => {
            const x = i * 20;
            const isMajor = i % 5 === 0;
            return (
              <line
                key={i}
                x1={x}
                y1={isMajor ? 4 : 8}
                x2={x}
                y2={isMajor ? 20 : 16}
                stroke={color}
                strokeWidth={isMajor ? 1.25 : 0.75}
                strokeOpacity={isMajor ? opacity * 1.5 : opacity}
              />
            );
          })}
        </>
      )}
      {label && (
        <text
          x={length / 2}
          y={22}
          textAnchor="middle"
          fill={color}
          fillOpacity={opacity * 1.6}
          fontSize="7.5"
          fontFamily="monospace"
        >
          {label}
        </text>
      )}
    </svg>
  );
};
