import { StyleSheet, Text } from 'react-native';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { colors, fonts, radii } from '@/src/theme';
import { selectionFeedback } from '@/src/utils/haptics';

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  compact?: boolean;
};

export function SecondaryButton({ label, onPress, compact }: SecondaryButtonProps) {
  return (
    <ScalePressable
      onPress={() => {
        selectionFeedback();
        onPress();
      }}
      style={[styles.button, compact && styles.compact]}>
      <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.card,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  compact: {
    paddingVertical: 10,
    minHeight: 40,
  },
  label: {
    fontFamily: fonts.serif,
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  labelCompact: { fontSize: 13 },
});
