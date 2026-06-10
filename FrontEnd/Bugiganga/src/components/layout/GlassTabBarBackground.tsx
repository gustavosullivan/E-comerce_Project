import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';

import { colors } from '@/src/theme';

export function GlassTabBarBackground() {
  return (
    <View style={styles.wrap}>
      {Platform.OS === 'web' ? (
        <View style={styles.webFill} />
      ) : (
        <BlurView
          intensity={Platform.OS === 'android' ? 42 : 56}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.tint} />
      <View style={styles.topBorder} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    backgroundColor: colors.tabBarGlass,
  },
  webFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.tabBarGlass,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 10, 20, 0.22)',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: colors.tabBarGlassBorder,
  },
});
