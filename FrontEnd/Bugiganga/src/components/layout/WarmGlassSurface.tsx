import { BlurView } from 'expo-blur';
import { type PropsWithChildren } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { glassBlur, loginGlass } from '@/src/theme/loginGlass';

type GlassLevel = keyof typeof glassBlur.ios;

type WarmGlassSurfaceProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  level?: GlassLevel;
  variant?: 'default' | 'card';
}>;

function getBlurIntensity(level: GlassLevel) {
  return Platform.OS === 'android' ? glassBlur.android[level] : glassBlur.ios[level];
}

export function WarmGlassSurface({
  children,
  style,
  contentStyle,
  level = 'shell',
  variant = 'default',
}: WarmGlassSurfaceProps) {
  const webBlur = glassBlur.web[level];
  const isCard = variant === 'card';

  return (
    <View
      style={[
        styles.shell,
        isCard && styles.shellCard,
        Platform.OS === 'web'
          ? {
              backdropFilter: `blur(${webBlur})`,
              WebkitBackdropFilter: `blur(${webBlur})`,
            }
          : null,
        style,
      ]}>
      {Platform.OS === 'web' ? (
        <View style={[styles.webFill, isCard && styles.webFillCard]} />
      ) : (
        <BlurView
          intensity={getBlurIntensity(level)}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={[styles.lightTint, isCard && styles.lightTintCard]} />
      <View style={styles.highlight} />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
    backgroundColor: loginGlass.shell,
    borderWidth: 1,
    borderColor: loginGlass.shellBorder,
  },
  shellCard: {
    backgroundColor: loginGlass.cardGlass,
    borderColor: loginGlass.cardBorder,
  },
  webFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: loginGlass.glassWebFill,
  },
  webFillCard: {
    backgroundColor: loginGlass.glassWebFill,
  },
  lightTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: loginGlass.glassLightTint,
  },
  lightTintCard: {
    backgroundColor: loginGlass.cardTint,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: loginGlass.shellHighlight,
    zIndex: 1,
  },
  content: {
    zIndex: 2,
  },
});
