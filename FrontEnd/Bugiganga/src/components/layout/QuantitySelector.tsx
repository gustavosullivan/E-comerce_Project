import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { colors } from '@/src/theme';
import { selectionFeedback } from '@/src/utils/haptics';

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
      <ScalePressable
        style={[styles.btn, compact && styles.btnCompact, quantity <= min && styles.btnDisabled]}
        onPress={() => {
          if (quantity > min) {
            selectionFeedback();
            onDecrease();
          }
        }}
        disabled={quantity <= min}>
        <MaterialIcons name="remove" size={compact ? 18 : 22} color={colors.primary} />
      </ScalePressable>
      <Text style={[styles.qty, compact && styles.qtyCompact]}>{quantity}</Text>
      <ScalePressable
        style={[styles.btn, compact && styles.btnCompact]}
        onPress={() => {
          selectionFeedback();
          onIncrease();
        }}>
        <MaterialIcons name="add" size={compact ? 18 : 22} color={colors.primary} />
      </ScalePressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    alignSelf: 'center',
    marginVertical: 16,
  },
  rowCompact: {
    gap: 10,
    marginVertical: 0,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCompact: {
    width: 32,
    height: 32,
  },
  btnDisabled: { opacity: 0.4 },
  qty: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    minWidth: 32,
    textAlign: 'center',
  },
  qtyCompact: {
    fontSize: 16,
    minWidth: 24,
  },
});
