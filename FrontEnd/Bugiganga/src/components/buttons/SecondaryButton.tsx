import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/src/theme';

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
};

export function SecondaryButton({ label, onPress }: SecondaryButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.card,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 12,
    alignItems: 'center',
  },
  pressed: { opacity: 0.88 },
  label: {
    fontFamily: fonts.serif,
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
});
