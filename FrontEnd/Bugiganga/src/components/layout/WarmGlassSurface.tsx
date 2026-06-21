import { BlurView } from 'expo-blur';
import { type PropsWithChildren } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { glassBlur, loginGlass } from '@/src/theme/loginGlass';

type GlassLevel = keyof typeof glassBlur.ios;

type WarmGlassSurfaceProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  level?: GlassLevel;
  variant?: 'default' | 'card' | 'modal';
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
  const isModal = variant === 'modal';
  const isCard = variant === 'card' || isModal;
  const blurLevel: GlassLevel = isModal ? 'modal' : level;
  const webBlur = glassBlur.web[blurLevel];

  return (
    <View
      style={[
        styles.shell,
        isCard && !isModal && styles.shellCard,
        isModal && styles.shellModal,
        Platform.OS === 'web'
          ? {
              backdropFilter: `blur(${webBlur})`,
              WebkitBackdropFilter: `blur(${webBlur})`,
            }
          : null,
        style,
      ]}>
      {Platform.OS === 'web' ? (
        <View style={[styles.webFill, isCard && !isModal && styles.webFillCard, isModal && styles.webFillModal]} />
      ) : (
        <BlurView
          intensity={getBlurIntensity(blurLevel)}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={[styles.lightTint, isCard && !isModal && styles.lightTintCard, isModal && styles.lightTintModal]} />
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
  shellModal: {
    backgroundColor: loginGlass.modalGlass,
    borderColor: loginGlass.modalGlassBorder,
  },
  webFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: loginGlass.glassWebFill,
  },
  webFillCard: {
    backgroundColor: loginGlass.glassWebFill,
  },
  webFillModal: {
    backgroundColor: loginGlass.modalWebFill,
  },
  lightTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: loginGlass.glassLightTint,
  },
  lightTintCard: {
    backgroundColor: loginGlass.cardTint,
  },
  lightTintModal: {
    backgroundColor: loginGlass.modalGlassTint,
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
