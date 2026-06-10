import { MaterialIcons } from '@expo/vector-icons';
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
import { colors, fonts, motion, radii, shadow } from '@/src/theme';

const ICONS: Record<SnackbarType, keyof typeof MaterialIcons.glyphMap> = {
  success: 'check-circle',
  error: 'error-outline',
  info: 'info-outline',
};

const ACCENTS: Record<SnackbarType, string> = {
  success: colors.success,
  error: colors.danger,
  info: colors.primary,
};

export function Snackbar() {
  const insets = useSafeAreaInsets();
  const visible = useSnackbarStore((s) => s.visible);
  const message = useSnackbarStore((s) => s.message);
  const type = useSnackbarStore((s) => s.type);
  const hide = useSnackbarStore((s) => s.hide);

  const translateY = useSharedValue(120);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, motion.spring);
      opacity.value = withTiming(1, { duration: motion.fast });
    } else {
      translateY.value = withTiming(120, { duration: motion.normal });
      opacity.value = withTiming(0, { duration: motion.fast });
    }
  }, [visible, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const bottomOffset = Math.max(insets.bottom, 12) + (Platform.OS === 'web' ? 16 : 72);

  return (
    <View style={[styles.host, { bottom: bottomOffset }]} pointerEvents="box-none">
      <Animated.View style={[styles.bar, animatedStyle]}>
        <View style={[styles.accent, { backgroundColor: ACCENTS[type] }]} />
        <MaterialIcons name={ICONS[type]} size={22} color={ACCENTS[type]} />
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
        <ScalePressable onPress={hide} hitSlop={10} style={styles.closeBtn}>
          <MaterialIcons name="close" size={18} color={colors.textMuted} />
        </ScalePressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 20,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    maxWidth: 480,
    backgroundColor: colors.inputBg,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    paddingLeft: 16,
    overflow: 'hidden',
    ...shadow.paper,
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  message: {
    flex: 1,
    fontFamily: fonts.serif,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 18,
  },
  closeBtn: {
    padding: 2,
  },
});
