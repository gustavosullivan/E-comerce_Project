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
    backgroundColor: '#C1A37E',
  },
  webFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#C1A37E',
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#A8845C',
  },
});
