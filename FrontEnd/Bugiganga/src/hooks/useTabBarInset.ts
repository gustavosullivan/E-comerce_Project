import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { layout } from '@/src/theme';

export const TAB_BAR_HEIGHT = 68;

export function useTabBarInset() {
  const insets = useSafeAreaInsets();
  const tabBarBottom = (Platform.OS === 'ios' ? 14 : 10) + insets.bottom;
  const floatingOffset = TAB_BAR_HEIGHT + tabBarBottom;
  const scenePaddingBottom = floatingOffset + layout.md;
  const contentBottomInset = floatingOffset + layout.md;

  return {
    tabBarHeight: TAB_BAR_HEIGHT,
    tabBarBottom,
    floatingOffset,
    scenePaddingBottom,
    contentBottomInset,
  };
}
