import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { useSnackbarStore, type SnackbarType } from '@/src/store/snackbarStore';
import { colors, fonts, motion, radius, shadows } from '@/src/theme';

const ICONS: Record<SnackbarType, keyof typeof MaterialIcons.glyphMap> = {
  success: 'check-circle',
  error: 'error-outline',
  info: 'info-outline',
};

const ACCENTS: Record<SnackbarType, string> = {
  success: colors.success,
  error: '#E11D48',
  info: colors.tabBarActive,
};

const BAR_THEMES: Record<
  SnackbarType,
  { borderColor: string; glassBg: string; tint: string; highlight: string }
> = {
  success: {
    borderColor: 'rgba(16, 185, 129, 0.45)',
    glassBg: 'rgba(236, 253, 245, 0.92)',
    tint: 'rgba(167, 243, 208, 0.55)',
    highlight: 'rgba(255, 255, 255, 0.72)',
  },
  error: {
    borderColor: 'rgba(251, 113, 133, 0.55)',
    glassBg: 'rgba(255, 228, 230, 0.88)',
    tint: 'rgba(254, 205, 211, 0.55)',
    highlight: 'rgba(255, 255, 255, 0.72)',
  },
  info: {
    borderColor: colors.glassBorder,
    glassBg: colors.tabBarGlass,
    tint: 'rgba(8, 10, 20, 0.28)',
    highlight: colors.glassHighlight,
  },
};

export function Snackbar() {
  const insets = useSafeAreaInsets();
  const visible = useSnackbarStore((s) => s.visible);
  const message = useSnackbarStore((s) => s.message);
  const type = useSnackbarStore((s) => s.type);
  const hide = useSnackbarStore((s) => s.hide);

  const translateY = useSharedValue(-24);
  const translateX = useSharedValue(24);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, motion.spring);
      translateX.value = withSpring(0, motion.spring);
      opacity.value = withTiming(1, { duration: motion.fast });
    } else {
      translateY.value = withTiming(-24, { duration: motion.normal });
      translateX.value = withTiming(24, { duration: motion.normal });
      opacity.value = withTiming(0, { duration: motion.fast });
    }
  }, [visible, translateY, translateX, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const theme = BAR_THEMES[type];
  const topOffset = Math.max(insets.top, 12) + 8;
  const rightOffset = Math.max(insets.right, 16);

  return (
    <View
      style={[
        styles.host,
        { top: topOffset, right: rightOffset },
        Platform.OS === 'web' && styles.hostWeb,
      ]}
      pointerEvents="box-none">
      <Animated.View style={[styles.barOuter, animatedStyle]}>
        <View
          style={[
            styles.bar,
            {
              borderColor: theme.borderColor,
              backgroundColor: theme.glassBg,
            },
          ]}>
          {Platform.OS === 'web' ? (
            <View style={[styles.webGlass, { backgroundColor: theme.glassBg }]} />
          ) : (
            <BlurView
              intensity={Platform.OS === 'android' ? 36 : 48}
              tint={type === 'error' || type === 'success' ? 'light' : 'dark'}
              style={StyleSheet.absoluteFill}
            />
          )}
          <View style={[styles.glassTint, { backgroundColor: theme.tint }]} />
          <View style={[styles.glassHighlight, { backgroundColor: theme.highlight }]} />

          <View style={styles.content}>
            <View
              style={[
                styles.iconWrap,
                { borderColor: ACCENTS[type] },
                type === 'error' && styles.iconWrapError,
                type === 'success' && styles.iconWrapSuccess,
              ]}>
              <MaterialIcons name={ICONS[type]} size={18} color={ACCENTS[type]} />
            </View>
            <Text
              style={[
                styles.message,
                type === 'error' && styles.messageError,
                type === 'success' && styles.messageSuccess,
              ]}
              numberOfLines={2}>
              {message}
            </Text>
            <ScalePressable
              onPress={hide}
              hitSlop={10}
              style={[
                styles.closeBtn,
                type === 'error' && styles.closeBtnError,
                type === 'success' && styles.closeBtnSuccess,
              ]}>
              <MaterialIcons
                name="close"
                size={16}
                color={
                  type === 'error'
                    ? '#BE123C'
                    : type === 'success'
                      ? '#047857'
                      : colors.glassMuted
                }
              />
            </ScalePressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    zIndex: 9999,
    elevation: 24,
    alignItems: 'flex-end',
  },
  hostWeb: {
    position: 'fixed',
  },
  barOuter: {
    maxWidth: 340,
    minWidth: 220,
    ...shadows.lg,
  },
  bar: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.tabBarGlass,
  },
  webGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.tabBarGlass,
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 10, 20, 0.28)',
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: colors.glassHighlight,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    zIndex: 1,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glassImageBg,
  },
  iconWrapError: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  iconWrapSuccess: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  message: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: colors.glassText,
    lineHeight: 18,
  },
  messageError: {
    color: '#9F1239',
  },
  messageSuccess: {
    color: '#047857',
  },
  closeBtn: {
    padding: 4,
    borderRadius: radius.full,
    backgroundColor: colors.glassImageBg,
  },
  closeBtnError: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  closeBtnSuccess: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
});
