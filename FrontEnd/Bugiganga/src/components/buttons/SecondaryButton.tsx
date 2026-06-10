import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontSizes, fonts, radius } from '@/src/theme';

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  compact?: boolean;
};

export function SecondaryButton({ label, onPress, compact }: SecondaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, compact && styles.compact, pressed && styles.pressed]}>
      <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
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
  pressed: { opacity: 0.88 },
  compact: { paddingVertical: 10 },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: colors.primary,
  },
  labelCompact: { fontSize: fontSizes.sm },
});
