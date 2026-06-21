import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSizes, fonts, loginGlass, radius } from '@/src/theme';

type ProductStockBadgeProps = {
  stock: number;
  variant?: 'default' | 'warm';
  compact?: boolean;
};

function getStockLabel(stock: number): string {
  if (stock <= 0) return 'Sem estoque';
  if (stock === 1) return 'Última unidade';
  if (stock <= 3) return `Últimas ${stock} unidades`;
  return `${stock} em estoque`;
}

export function ProductStockBadge({
  stock,
  variant = 'default',
  compact = false,
}: ProductStockBadgeProps) {
  const warm = variant === 'warm';
  const outOfStock = stock <= 0;
  const lowStock = stock > 0 && stock <= 3;

  return (
    <View
      style={[
        styles.badge,
        compact && styles.badgeCompact,
        warm && styles.badgeWarm,
        outOfStock && styles.badgeOut,
        outOfStock && warm && styles.badgeOutWarm,
        lowStock && !outOfStock && styles.badgeLow,
        lowStock && !outOfStock && warm && styles.badgeLowWarm,
      ]}>
      <Text
        style={[
          styles.label,
          compact && styles.labelCompact,
          warm && styles.labelWarm,
          outOfStock && styles.labelOut,
          lowStock && !outOfStock && styles.labelLow,
        ]}>
        {getStockLabel(stock)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: 'rgba(16, 120, 80, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 120, 80, 0.28)',
  },
  badgeCompact: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeWarm: {
    backgroundColor: 'rgba(16, 120, 80, 0.22)',
    borderColor: 'rgba(120, 220, 170, 0.28)',
  },
  badgeOut: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  badgeOutWarm: {
    backgroundColor: 'rgba(120, 40, 30, 0.35)',
    borderColor: 'rgba(255, 140, 120, 0.45)',
  },
  badgeLow: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  badgeLowWarm: {
    backgroundColor: 'rgba(120, 90, 30, 0.35)',
    borderColor: 'rgba(255, 200, 100, 0.35)',
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.success,
  },
  labelCompact: {
    fontSize: 10,
  },
  labelWarm: {
    color: loginGlass.goldLight,
  },
  labelOut: {
    color: colors.danger,
  },
  labelLow: {
    color: '#F59E0B',
  },
});
