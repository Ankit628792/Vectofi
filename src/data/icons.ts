import { IconItem, IconDefinition, AnimationType } from '../types';
import { IconRegistry } from './iconRegistry';
import { ARROWS_ICONS } from './icons/arrows';
import { NAVIGATION_ICONS } from './icons/navigation';
import { INTERFACE_ICONS } from './icons/interface';
import { COMMUNICATION_ICONS } from './icons/communication';
import { SOCIAL_ICONS } from './icons/social';
import { FILES_ICONS } from './icons/files';
import { MEDIA_ICONS } from './icons/media';
import { COMMERCE_ICONS } from './icons/commerce';
import { SECURITY_ICONS } from './icons/security';
import { USERS_ICONS } from './icons/users';
import { WEATHER_ICONS } from './icons/weather';
import { DEVICES_ICONS } from './icons/devices';
import { DEVELOPMENT_ICONS } from './icons/development';
import { BUSINESS_ICONS } from './icons/business';
import { DESIGN_ICONS } from './icons/design';
import { EDITOR_ICONS } from './icons/editor';
import { TRAVEL_ICONS } from './icons/travel';
import { HEALTH_ICONS } from './icons/health';
import { FOOD_ICONS } from './icons/food';
import { SPORTS_ICONS } from './icons/sports';
import expandedData from './expandedIcons.json';
import remixData from './remixIcons.json';
import materialData from './materialIcons.json';

const EXPANDED_ICONS: IconDefinition[] = (expandedData as [string, string, string, string[], string, AnimationType][]).map(
  ([slug, name, category, tags, body, animationType], idx) => ({
    id: `tb-${slug}`,
    name,
    slug,
    category,
    tags,
    style: 'outline',
    body,
    hasAnimation: true,
    animationType: animationType as AnimationType,
    license: 'MIT',
    popularity: 50 + (idx % 45),
    featured: idx % 100 === 0,
    author: 'Tabler & Vectofi',
    isNew: true,
  })
);

const REMIX_ICONS: IconDefinition[] = (remixData as [string, string, string, string[], string, AnimationType][]).map(
  ([slug, name, category, tags, body, animationType], idx) => ({
    id: `ri-${slug}`,
    name,
    slug,
    category,
    tags,
    style: slug.endsWith('-fill') ? 'filled' : 'outline',
    body,
    hasAnimation: true,
    animationType: animationType as AnimationType,
    license: 'Apache-2.0',
    popularity: 50 + (idx % 45),
    featured: idx % 120 === 0,
    author: 'Remix & Vectofi',
    isNew: true,
  })
);

const MATERIAL_ICONS: IconDefinition[] = (materialData as [string, string, string, string[], string, AnimationType][]).map(
  ([slug, name, category, tags, body, animationType], idx) => ({
    id: `mdi-${slug}`,
    name,
    slug,
    category,
    tags,
    style: slug.endsWith('-outline') ? 'outline' : 'filled',
    body,
    hasAnimation: true,
    animationType: animationType as AnimationType,
    license: 'Apache-2.0',
    popularity: 50 + (idx % 45),
    featured: idx % 150 === 0,
    author: 'Material & Vectofi',
    isNew: true,
  })
);

export const ICONS_DEFINITIONS: IconDefinition[] = [
  ...ARROWS_ICONS,
  ...NAVIGATION_ICONS,
  ...INTERFACE_ICONS,
  ...COMMUNICATION_ICONS,
  ...SOCIAL_ICONS,
  ...FILES_ICONS,
  ...MEDIA_ICONS,
  ...COMMERCE_ICONS,
  ...SECURITY_ICONS,
  ...USERS_ICONS,
  ...WEATHER_ICONS,
  ...DEVICES_ICONS,
  ...DEVELOPMENT_ICONS,
  ...BUSINESS_ICONS,
  ...DESIGN_ICONS,
  ...EDITOR_ICONS,
  ...TRAVEL_ICONS,
  ...HEALTH_ICONS,
  ...FOOD_ICONS,
  ...SPORTS_ICONS,
  ...EXPANDED_ICONS,
  ...REMIX_ICONS,
  ...MATERIAL_ICONS,
];

export const iconRegistry = new IconRegistry(ICONS_DEFINITIONS);
export const ICONS: IconItem[] = iconRegistry.getAll();
export const ICONS_DATA: IconItem[] = ICONS;

