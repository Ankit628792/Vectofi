import React from 'react';
import { IconItem, AnimationType } from '../../types';

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
  const shouldAnimate = !forceStatic && animated && icon.hasAnimation;
  const animationType: AnimationType = icon.animationType || 'pulse';

  // Dynamic animation class mapping
  let animationClass = '';
  let customStyle: React.CSSProperties = {
    animationDuration: `${(2 / speed).toFixed(2)}s`,
  };

  if (shouldAnimate) {
    switch (animationType) {
      case 'spin':
        animationClass = 'animate-spin';
        break;
      case 'bounce':
        animationClass = 'animate-bounce';
        break;
      case 'pulse':
        animationClass = 'animate-vector-pulse';
        break;
      case 'draw':
        animationClass = 'animate-vector-dash';
        break;
      case 'shake':
        animationClass = 'animate-wiggle';
        break;
      case 'slide':
        animationClass = 'animate-pulse';
        break;
      case 'float':
      default:
        animationClass = 'animate-vector-float';
        break;
    }
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
      <g
        className={shouldAnimate ? animationClass : ''}
        style={shouldAnimate ? customStyle : undefined}
        dangerouslySetInnerHTML={{ __html: icon.body }}
      />
    </svg>
  );
};
