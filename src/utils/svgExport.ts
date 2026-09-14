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
  isFillBasedIcon,
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
  isFillBasedIcon,
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
  const viewBox = icon.viewBox || '0 0 24 24';
  const isFill = isFillBasedIcon(icon.body, icon.style);
  const pascalName = icon.slug
    .split('-')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');

  switch (framework) {
    case 'svg':
      return generateSvgCode(icon, settings);

    case 'html':
      if (isFill) {
        return `<!-- ${icon.name} Icon -->
<svg class="icon icon-${icon.slug}" width="${size}" height="${size}" viewBox="${viewBox}" fill="${color}">
  ${icon.body}
</svg>`;
      }
      return `<!-- ${icon.name} Icon -->
<svg class="icon icon-${icon.slug}" width="${size}" height="${size}" viewBox="${viewBox}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
  ${icon.body}
</svg>`;

    case 'react':
      // Convert HTML SVG attributes to JSX camelCase
      const jsxBody = icon.body
        .replace(/stroke-width/g, 'strokeWidth')
        .replace(/stroke-linecap/g, 'strokeLinecap')
        .replace(/stroke-linejoin/g, 'strokeLinejoin')
        .replace(/stroke-dasharray/g, 'strokeDasharray')
        .replace(/stroke-dashoffset/g, 'strokeDashoffset')
        .replace(/fill-rule/g, 'fillRule')
        .replace(/clip-rule/g, 'clipRule');

      if (isFill) {
        return `import React from 'react';

interface ${pascalName}IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export const ${pascalName}Icon: React.FC<${pascalName}IconProps> = ({
  size = ${size},
  color = '${color}',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="${viewBox}"
    fill={color}
    className={className}
    {...props}
  >
    ${jsxBody}
  </svg>
);`;
      }

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
    viewBox="${viewBox}"
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
      if (isFill) {
        return `<script setup>
defineProps({
  size: { type: [Number, String], default: ${size} },
  color: { type: String, default: '${color}' }
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="${viewBox}"
    :fill="color"
  >
    ${icon.body}
  </svg>
</template>`;
      }

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
    viewBox="${viewBox}"
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
      if (isFill) {
        return `<script>
  export let size = ${size};
  export let color = '${color}';
</script>

<svg
  width={size}
  height={size}
  viewBox="${viewBox}"
  fill={color}
  {...$$restProps}
>
  {@html \`${icon.body}\`}
</svg>`;
      }

      return `<script>
  export let size = ${size};
  export let color = '${color}';
  export let strokeWidth = ${strokeWidth};
</script>

<svg
  width={size}
  height={size}
  viewBox="${viewBox}"
  fill="none"
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  {...$$restProps}
>
  {@html \`${icon.body}\`}
</svg>`;

    case 'angular':
      if (isFill) {
        return `import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-${icon.slug}',
  template: \`
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="${viewBox}"
      [attr.fill]="color"
    >
      ${icon.body}
    </svg>
  \`,
  styles: [':host { display: inline-flex; }']
})
export class ${pascalName}IconComponent {
  @Input() size: number | string = ${size};
  @Input() color: string = '${color}';
}`;
      }

      return `import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-${icon.slug}',
  template: \`
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="${viewBox}"
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
