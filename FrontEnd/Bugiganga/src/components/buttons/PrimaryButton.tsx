import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/src/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, isLoading, disabled }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading || disabled}
      style={({ pressed }) => [
        styles.button,
        (isLoading || disabled) && styles.disabled,
        pressed && styles.pressed,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: colors.text,
    paddingVertical: 14,
    alignItems: 'center',
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.65 },
  label: {
    fontFamily: fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});
