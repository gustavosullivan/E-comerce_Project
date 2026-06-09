import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { colors, fonts, radii, shadow } from '@/src/theme';
import { lightImpact } from '@/src/utils/haptics';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  compact?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  isLoading,
  disabled,
  compact,
}: PrimaryButtonProps) {
  const handlePress = () => {
    lightImpact();
    onPress();
  };

  return (
    <ScalePressable
      onPress={handlePress}
      disabled={isLoading || disabled}
      scaleTo={0.97}
      style={[
        styles.button,
        compact && styles.compact,
        (isLoading || disabled) && styles.disabled,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
      )}
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: colors.text,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    ...shadow.lift,
  },
  compact: {
    paddingVertical: 10,
    minHeight: 40,
  },
  disabled: { opacity: 0.6 },
  label: {
    fontFamily: fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.3,
  },
  labelCompact: { fontSize: 13 },
});
