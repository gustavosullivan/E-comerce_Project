import { BlurView } from 'expo-blur';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSizes, fonts, radius, shadows } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';

type CartSummaryGlassProps = {
  subtotal: number;
  total: number;
  onCheckout: () => void;
};

export function CartSummaryGlass({ subtotal, total, onCheckout }: CartSummaryGlassProps) {
  return (
    <View style={styles.shell}>
      <View style={styles.glass}>
        <BlurView
          intensity={Platform.OS === 'web' ? 18 : Platform.OS === 'android' ? 28 : 34}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.tint} />
        <View style={styles.highlight} />

        <View style={styles.content}>
          <View style={styles.totals}>
            <View style={styles.row}>
              <Text style={styles.summaryLabel}>Resumo de compra</Text>
              <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelTotal}>Total</Text>
              <Text style={styles.valueTotal}>{formatCurrency(total)}</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.checkoutBtn, pressed && styles.checkoutBtnPressed]}
            onPress={onCheckout}
            accessibilityRole="button"
            accessibilityLabel="Finalizar compra">
            <Text style={styles.checkoutLabel}>Finalizar compra</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
  },
  glass: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cartGlassBorder,
    overflow: 'hidden',
    backgroundColor: colors.cartGlass,
    ...shadows.md,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(238, 242, 255, 0.45)',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 14,
    right: 14,
    height: 1,
    backgroundColor: colors.cartGlassHighlight,
  },
  content: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  totals: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.text,
  },
  summaryValue: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.textMuted,
  },
  labelTotal: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
  },
  valueTotal: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '800',
    color: colors.primary,
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 11,
    alignItems: 'center',
    ...shadows.sm,
  },
  checkoutBtnPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  checkoutLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.textInverse,
  },
});
