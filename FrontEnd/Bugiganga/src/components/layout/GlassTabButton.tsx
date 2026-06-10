import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/src/theme';

export function GlassTabButton({
  accessibilityState,
  children,
  style,
  ...props
}: BottomTabBarButtonProps) {
  const selected = accessibilityState?.selected;

  return (
    <PlatformPressable
      {...props}
      style={[styles.button, style]}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}>
      {selected ? <View style={styles.activePill} /> : null}
      <View style={styles.content}>{children}</View>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    marginHorizontal: 2,
    overflow: 'hidden',
  },
  activePill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.tabBarActivePill,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    zIndex: 1,
  },
});
