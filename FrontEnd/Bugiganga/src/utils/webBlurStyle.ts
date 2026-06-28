import { Platform, type ViewStyle } from 'react-native';

/** Web-only backdrop blur; safe to spread into React Native `View` styles. */
export function webBackdropBlur(blur: string): ViewStyle | undefined {
  if (Platform.OS !== 'web') return undefined;

  return {
    backdropFilter: `blur(${blur})`,
    WebkitBackdropFilter: `blur(${blur})`,
  } as ViewStyle;
}
