import { BlurView } from 'expo-blur';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSizes, fonts, loginGlass, radius, shadows } from '@/src/theme';
import { glassBlur } from '@/src/theme/loginGlass';
import { formatCurrency } from '@/src/utils/formatCurrency';

type CartSummaryGlassProps = {
  subtotal: number;
  total: number;
  balance?: number;
  actionLabel?: string;
  isLoading?: boolean;
  loadingLabel?: string;
  onCheckout: () => void;
  variant?: 'default' | 'warm';
};

export function CartSummaryGlass({
  subtotal,
  total,
  balance,
  actionLabel = 'Finalizar compra',
  isLoading = false,
  loadingLabel = 'Processando...',
  onCheckout,
  variant = 'default',
}: CartSummaryGlassProps) {
  const warm = variant === 'warm';
  const blurIntensity =
    Platform.OS === 'android' ? glassBlur.android.card : glassBlur.ios.card;
  const showWallet = balance != null;
  const hasEnoughBalance = !showWallet || balance >= total;
  const balanceAfter = showWallet ? Math.max(0, balance - total) : 0;
  const actionDisabled = isLoading || (showWallet && !hasEnoughBalance);

  return (
    <View style={styles.shell}>
      <View
        style={[
          styles.glass,
          warm && styles.glassWarm,
          warm &&
            Platform.OS === 'web' && {
              backdropFilter: `blur(${glassBlur.web.card})`,
              WebkitBackdropFilter: `blur(${glassBlur.web.card})`,
            },
        ]}>
        {Platform.OS === 'web' ? (
          <View style={[styles.webFill, warm && styles.webFillWarm]} />
        ) : (
          <BlurView
            intensity={warm ? blurIntensity : Platform.OS === 'android' ? 28 : 34}
            tint={warm ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        )}
        <View style={[styles.tint, warm && styles.tintWarm]} />
        <View style={[styles.highlight, warm && styles.highlightWarm]} />

        <View style={styles.content}>
          <View style={styles.totals}>
            {showWallet ? (
              <>
                <View style={styles.row}>
                  <Text style={[styles.summaryLabel, warm && styles.summaryLabelWarm]}>
                    Saldo disponível
                  </Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      styles.balanceValue,
                      warm && styles.balanceValueWarm,
                    ]}>
                    {formatCurrency(balance)}
                  </Text>
                </View>
                <View style={[styles.divider, warm && styles.dividerWarm]} />
              </>
            ) : null}
            {!showWallet ? (
              <View style={styles.row}>
                <Text style={[styles.summaryLabel, warm && styles.summaryLabelWarm]}>
                  Resumo de compra
                </Text>
                <Text style={[styles.summaryValue, warm && styles.summaryValueWarm]}>
                  {formatCurrency(subtotal)}
                </Text>
              </View>
            ) : null}
            <View style={styles.row}>
              <Text style={[styles.labelTotal, warm && styles.labelTotalWarm]}>
                Total da compra
              </Text>
              <Text style={[styles.valueTotal, warm && styles.valueTotalWarm]}>
                {formatCurrency(total)}
              </Text>
            </View>
            {showWallet ? (
              <View style={styles.row}>
                <Text style={[styles.labelRemaining, warm && styles.labelRemainingWarm]}>
                  Saldo após compra
                </Text>
                <Text
                  style={[
                    styles.valueRemaining,
                    hasEnoughBalance ? styles.valueRemainingOk : styles.valueRemainingWarn,
                    warm && hasEnoughBalance && styles.valueRemainingOkWarm,
                    warm && !hasEnoughBalance && styles.valueRemainingWarnWarm,
                  ]}>
                  {formatCurrency(balanceAfter)}
                </Text>
              </View>
            ) : null}
          </View>

          {showWallet && !hasEnoughBalance ? (
            <Text style={[styles.walletWarning, warm && styles.walletWarningWarm]}>
              Sem saldo suficiente para realizar compra
            </Text>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              styles.checkoutBtn,
              warm && styles.checkoutBtnWarm,
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
  glassWarm: {
    backgroundColor: loginGlass.cardGlass,
    borderColor: loginGlass.cardBorder,
  },
  webFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.cartGlass,
  },
  webFillWarm: {
    backgroundColor: loginGlass.glassWebFill,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.cartGlassTint,
  },
  tintWarm: {
    backgroundColor: loginGlass.cardTint,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 14,
    right: 14,
    height: 1,
    backgroundColor: colors.cartGlassHighlight,
  },
  highlightWarm: {
    backgroundColor: loginGlass.shellHighlight,
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
  dividerWarm: {
    backgroundColor: loginGlass.cardBorder,
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
  summaryLabelWarm: {
    color: loginGlass.text,
  },
  summaryValue: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.textMuted,
  },
  summaryValueWarm: {
    color: loginGlass.textMuted,
  },
  balanceValue: {
    fontWeight: '800',
    color: colors.success,
  },
  balanceValueWarm: {
    color: loginGlass.goldLight,
  },
  labelTotal: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
  },
  labelTotalWarm: {
    color: loginGlass.text,
  },
  valueTotal: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '800',
    color: colors.cartGlassAccent,
  },
  valueTotalWarm: {
    color: loginGlass.goldLight,
  },
  labelRemaining: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
  },
  labelRemainingWarm: {
    color: loginGlass.text,
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
  valueRemainingOkWarm: {
    color: loginGlass.goldLight,
  },
  valueRemainingWarnWarm: {
    color: '#FCA5A5',
  },
  walletWarning: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.danger,
    textAlign: 'center',
  },
  walletWarningWarm: {
    color: '#FCA5A5',
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 11,
    alignItems: 'center',
    ...shadows.sm,
  },
  checkoutBtnWarm: {
    backgroundColor: loginGlass.button,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: loginGlass.formButtonPrimaryBorder,
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
