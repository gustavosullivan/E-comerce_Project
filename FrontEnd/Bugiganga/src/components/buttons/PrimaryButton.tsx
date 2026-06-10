import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontSizes, fonts, radius, shadows } from '@/src/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  compact?: boolean;
};

export function PrimaryButton({ label, onPress, isLoading, disabled, compact }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading || disabled}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compact,
        (isLoading || disabled) && styles.disabled,
        pressed && styles.pressed,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={colors.textInverse} />
      ) : (
        <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    ...shadows.sm,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.55 },
  compact: {
    paddingVertical: 10,
    minHeight: 40,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.textInverse,
  },
  labelCompact: { fontSize: fontSizes.sm },
});
