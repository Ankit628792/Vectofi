import { IconItem, IconDefinition } from '../types';
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
];

export const iconRegistry = new IconRegistry(ICONS_DEFINITIONS);
export const ICONS: IconItem[] = iconRegistry.getAll();
export const ICONS_DATA: IconItem[] = ICONS;
