import { Platform } from 'react-native';

const sans = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
  web: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
})!;

export const fonts = {
  sans,
  serif: sans,
  gothic: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'serif',
    web: "'UnifrakturMaguntia', 'Old English Text MT', 'Blackletter', serif",
  })!,
} as const;

export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
} as const;
