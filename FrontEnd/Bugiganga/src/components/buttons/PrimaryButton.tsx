import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSizes, fonts, loginGlass, radius, shadows } from '@/src/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  compact?: boolean;
  variant?: 'default' | 'warm';
};

export function PrimaryButton({
  label,
  onPress,
  isLoading,
  loadingLabel,
  disabled,
  compact,
  variant = 'default',
}: PrimaryButtonProps) {
  const warm = variant === 'warm';

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading || disabled}
      style={({ pressed }) => [
        styles.button,
        warm && styles.buttonWarm,
        compact && styles.compact,
        (isLoading || disabled) && styles.disabled,
        pressed && !isLoading && styles.pressed,
      ]}>
      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={warm ? loginGlass.text : colors.textInverse} />
          {loadingLabel ? (
            <Text style={[styles.loadingLabel, warm && styles.loadingLabelWarm]}>{loadingLabel}</Text>
          ) : null}
        </View>
      ) : (
        <Text style={[styles.label, warm && styles.labelWarm, compact && styles.labelCompact]}>
          {label}
        </Text>
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
    justifyContent: 'center',
    minHeight: 52,
    ...shadows.sm,
  },
  buttonWarm: {
    backgroundColor: loginGlass.formButtonPrimary,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: loginGlass.formButtonPrimaryBorder,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.55 },
  compact: {
    paddingVertical: 10,
    minHeight: 40,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: colors.textInverse,
  },
  loadingLabelWarm: {
    color: loginGlass.text,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.textInverse,
  },
  labelWarm: {
    fontSize: fontSizes.md,
    color: loginGlass.text,
  },
  labelCompact: { fontSize: fontSizes.sm },
});
