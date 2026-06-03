import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors } from '@/src/theme';

type QuantitySelectorProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
};

export function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  min = 1,
}: QuantitySelectorProps) {
  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.btn, quantity <= min && styles.btnDisabled]}
        onPress={onDecrease}
        disabled={quantity <= min}>
        <MaterialIcons name="remove" size={22} color={colors.primary} />
      </Pressable>
      <Text style={styles.qty}>{quantity}</Text>
      <Pressable style={styles.btn} onPress={onIncrease}>
        <MaterialIcons name="add" size={22} color={colors.primary} />
      </Pressable>
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
  btnDisabled: { opacity: 0.4 },
  qty: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    minWidth: 32,
    textAlign: 'center',
  },
});
