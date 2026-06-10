import { type PropsWithChildren } from 'react';
import { StyleSheet, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native';

import { layout } from '@/src/theme/layout';

type PageContainerProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}>;

export function PageContainer({ children, style, fullWidth }: PageContainerProps) {
  const { width } = useWindowDimensions();
  const contentWidth = fullWidth
    ? width - layout.md * 2
    : Math.min(width - layout.md * 2, layout.maxContentWidth);

  return (
    <View style={[styles.outer, style]}>
      <View style={[styles.inner, { width: contentWidth }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    alignItems: 'center',
  },
  inner: {
    maxWidth: layout.maxContentWidth,
  },
});
