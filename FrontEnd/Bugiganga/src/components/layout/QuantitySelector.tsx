import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, fontSizes, radius } from '@/src/theme';

type QuantitySelectorProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  compact?: boolean;
};

export function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  min = 1,
  compact,
}: QuantitySelectorProps) {
  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      <Pressable
        style={[styles.btn, quantity <= min && styles.btnDisabled]}
        onPress={onDecrease}
        disabled={quantity <= min}>
        <MaterialIcons name="remove" size={20} color={colors.primary} />
      </Pressable>
      <Text style={styles.qty}>{quantity}</Text>
      <Pressable style={styles.btn} onPress={onIncrease}>
        <MaterialIcons name="add" size={20} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    alignSelf: 'center',
    marginVertical: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  rowCompact: {
    gap: 10,
    marginVertical: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  qty: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
    minWidth: 32,
    textAlign: 'center',
  },
});
