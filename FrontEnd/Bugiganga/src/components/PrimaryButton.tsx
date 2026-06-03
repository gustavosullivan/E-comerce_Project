import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { Fonts, VintageColors } from '@/constants/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  isLoading = false,
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading || disabled}
      style={({ pressed }) => [
        styles.button,
        (isLoading || disabled) && styles.buttonDisabled,
        pressed && !isLoading && styles.buttonPressed,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={VintageColors.parchment} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: VintageColors.rust,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: VintageColors.brown,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  label: {
    fontFamily: Fonts.serif,
    fontSize: 17,
    fontWeight: '700',
    color: VintageColors.parchment,
    letterSpacing: 0.5,
  },
});
