import { Platform } from 'react-native';

export const fonts = Platform.select({
  ios: { serif: 'Georgia', sans: 'System' },
  android: { serif: 'serif', sans: 'normal' },
  default: { serif: 'Georgia', sans: 'System' },
  web: { serif: "Georgia, 'Times New Roman', serif", sans: 'system-ui' },
})!;
