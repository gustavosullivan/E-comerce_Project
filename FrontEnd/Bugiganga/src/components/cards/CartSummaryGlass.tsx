import { BlurView } from 'expo-blur';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSizes, fonts, radius, shadows } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';

type CartSummaryGlassProps = {
  subtotal: number;
  total: number;
  balance?: number;
  actionLabel?: string;
  isLoading?: boolean;
  loadingLabel?: string;
  onCheckout: () => void;
};

export function CartSummaryGlass({
  subtotal,
  total,
  balance,
  actionLabel = 'Finalizar compra',
  isLoading = false,
  loadingLabel = 'Processando...',
  onCheckout,
}: CartSummaryGlassProps) {
  const showWallet = balance != null;
  const hasEnoughBalance = !showWallet || balance >= total;
  const balanceAfter = showWallet ? Math.max(0, balance - total) : 0;
  const actionDisabled = isLoading || (showWallet && !hasEnoughBalance);

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
            {showWallet ? (
              <>
                <View style={styles.row}>
                  <Text style={styles.summaryLabel}>Saldo disponível</Text>
                  <Text style={[styles.summaryValue, styles.balanceValue]}>
                    {formatCurrency(balance)}
                  </Text>
                </View>
                <View style={styles.divider} />
              </>
            ) : null}
            {!showWallet ? (
              <View style={styles.row}>
                <Text style={styles.summaryLabel}>Resumo de compra</Text>
                <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
              </View>
            ) : null}
            <View style={styles.row}>
              <Text style={styles.labelTotal}>Total da compra</Text>
              <Text style={styles.valueTotal}>{formatCurrency(total)}</Text>
            </View>
            {showWallet ? (
              <View style={styles.row}>
                <Text style={styles.labelRemaining}>Saldo após compra</Text>
                <Text
                  style={[
                    styles.valueRemaining,
                    hasEnoughBalance ? styles.valueRemainingOk : styles.valueRemainingWarn,
                  ]}>
                  {formatCurrency(balanceAfter)}
                </Text>
              </View>
            ) : null}
          </View>

          {showWallet && !hasEnoughBalance ? (
            <Text style={styles.walletWarning}>Sem saldo suficiente para realizar compra</Text>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              styles.checkoutBtn,
              actionDisabled && styles.checkoutBtnDisabled,
              pressed && !actionDisabled && styles.checkoutBtnPressed,
            ]}
            onPress={onCheckout}
            disabled={actionDisabled}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}>
            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={colors.textInverse} />
                <Text style={styles.checkoutLabel}>{loadingLabel}</Text>
              </View>
            ) : (
              <Text style={styles.checkoutLabel}>{actionLabel}</Text>
            )}
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
    backgroundColor: colors.cartGlassTint,
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
  divider: {
    height: 1,
    backgroundColor: colors.cartGlassDivider,
    marginVertical: 2,
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
  balanceValue: {
    fontWeight: '800',
    color: colors.success,
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
    color: colors.cartGlassAccent,
  },
  labelRemaining: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
  },
  valueRemaining: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '800',
  },
  valueRemainingOk: {
    color: colors.success,
  },
  valueRemainingWarn: {
    color: colors.danger,
  },
  walletWarning: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.danger,
    textAlign: 'center',
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
  checkoutBtnDisabled: {
    opacity: 0.45,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkoutLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.textInverse,
  },
});
