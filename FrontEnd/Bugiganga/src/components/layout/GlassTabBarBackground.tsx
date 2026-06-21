import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';

import { glassBlur, loginGlass } from '@/src/theme/loginGlass';

export function GlassTabBarBackground() {
  const intensity =
    Platform.OS === 'android' ? glassBlur.android.tabBar : glassBlur.ios.tabBar;
  const webBlur = glassBlur.web.tabBar;

  return (
    <View
      style={[
        styles.wrap,
        Platform.OS === 'web'
          ? {
              backdropFilter: `blur(${webBlur})`,
              WebkitBackdropFilter: `blur(${webBlur})`,
            }
          : null,
      ]}>
      {Platform.OS === 'web' ? (
        <View style={styles.webFill} />
      ) : (
        <BlurView
          intensity={intensity}
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
    backgroundColor: loginGlass.tabBarGlass,
  },
  webFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: loginGlass.glassWebFill,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: loginGlass.tabBarTint,
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: loginGlass.shellHighlight,
  },
});
