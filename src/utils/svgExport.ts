import { IconItem, LaboratorySettings, FrameworkType } from '../types';
import {
  generateStaticSvg,
  generateAnimatedSvg,
  getAnimationCss,
  createSvgDataUri,
  downloadSvgFile,
  generateSvgSprite,
  cleanSvgMarkup,
  optimizeSvg,
} from './svgUtils';

export {
  generateStaticSvg,
  generateAnimatedSvg,
  getAnimationCss,
  createSvgDataUri,
  downloadSvgFile,
  generateSvgSprite,
  cleanSvgMarkup,
  optimizeSvg,
};

/**
 * Builds clean, valid SVG string representation based on laboratory settings
 */
export function generateSvgCode(
  icon: IconItem,
  settings: Partial<LaboratorySettings> = {}
): string {
  const isAnimated = Boolean(settings.animated && icon.hasAnimation);
  if (isAnimated) {
    return generateAnimatedSvg(icon, settings);
  }
  return generateStaticSvg(icon, settings);
}

/**
 * Generates framework-specific code for 6+ target architectures
 */
export function generateFrameworkCode(
  icon: IconItem,
  framework: FrameworkType,
  settings: Partial<LaboratorySettings> = {}
): string {
  const size = settings.size || 24;
  const color = settings.color || 'currentColor';
  const strokeWidth = settings.strokeWidth || 2;
  const pascalName = icon.slug
    .split('-')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');

  switch (framework) {
    case 'svg':
      return generateSvgCode(icon, settings);

    case 'html':
      return `<!-- ${icon.name} Icon -->
<svg class="icon icon-${icon.slug}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
  ${icon.body}
</svg>`;

    case 'react':
      // Convert HTML SVG attributes to JSX camelCase
      const jsxBody = icon.body
        .replace(/stroke-width/g, 'strokeWidth')
        .replace(/stroke-linecap/g, 'strokeLinecap')
        .replace(/stroke-linejoin/g, 'strokeLinejoin')
        .replace(/stroke-dasharray/g, 'strokeDasharray')
        .replace(/stroke-dashoffset/g, 'strokeDashoffset');

      return `import React from 'react';

interface ${pascalName}IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

export const ${pascalName}Icon: React.FC<${pascalName}IconProps> = ({
  size = ${size},
  color = '${color}',
  strokeWidth = ${strokeWidth},
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    ${jsxBody}
  </svg>
);`;

    case 'vue':
      return `<script setup>
defineProps({
  size: { type: [Number, String], default: ${size} },
  color: { type: String, default: '${color}' },
  strokeWidth: { type: Number, default: ${strokeWidth} }
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    ${icon.body}
  </svg>
</template>`;

    case 'svelte':
      return `<script>
  export let size = ${size};
  export let color = '${color}';
  export let strokeWidth = ${strokeWidth};
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  {...$$restProps}
>
  ${icon.body}
</svg>`;

    case 'angular':
      return `import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-${icon.slug}',
  template: \`
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      [attr.stroke]="color"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      ${icon.body}
    </svg>
  \`,
  styles: [':host { display: inline-flex; }']
})
export class ${pascalName}IconComponent {
  @Input() size: number | string = ${size};
  @Input() color: string = '${color}';
  @Input() strokeWidth: number = ${strokeWidth};
}`;

    case 'css':
      const rawSvg = generateSvgCode(icon, settings);
      const dataUri = createSvgDataUri(rawSvg);
      return `/* Use as CSS background image */
.icon-${icon.slug} {
  display: inline-block;
  width: ${size}px;
  height: ${size}px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url("${dataUri}");
}`;

    default:
      return generateSvgCode(icon, settings);
  }
}
