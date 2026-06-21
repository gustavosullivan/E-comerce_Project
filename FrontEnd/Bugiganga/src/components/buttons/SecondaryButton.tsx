import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontSizes, fonts, loginGlass, radius } from '@/src/theme';

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  compact?: boolean;
  variant?: 'default' | 'warm';
};

export function SecondaryButton({
  label,
  onPress,
  compact,
  variant = 'default',
}: SecondaryButtonProps) {
  const warm = variant === 'warm';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        warm && styles.buttonWarm,
        compact && styles.compact,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.label, warm && styles.labelWarm, compact && styles.labelCompact]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonWarm: {
    backgroundColor: loginGlass.formButtonSecondaryBg,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: loginGlass.formButtonSecondaryBorder,
  },
  pressed: { opacity: 0.88 },
  compact: { paddingVertical: 10 },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: colors.primary,
  },
  labelWarm: {
    color: loginGlass.goldLight,
  },
  labelCompact: { fontSize: fontSizes.sm },
});
