import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { layout } from '@/src/theme';

import { HOME_STICKY_TOOLBAR_HEIGHT } from '@/src/components/layout/HomeHeader';

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

/** Reserva espaço do cabeçalho fixo respeitando a status bar (edge-to-edge). */
export function useTopChromeInset() {
  const insets = useSafeAreaInsets();
  const toolbarPadding = layout.xs;
  const toolbarGap = layout.sm;
  const chromeHeight = insets.top + toolbarPadding + HOME_STICKY_TOOLBAR_HEIGHT + toolbarGap;

  return {
    topInset: insets.top,
    toolbarPadding,
    chromeHeight,
    stickyToolbarStyle: {
      paddingTop: insets.top + toolbarPadding,
      paddingBottom: toolbarPadding,
    },
  };
}
