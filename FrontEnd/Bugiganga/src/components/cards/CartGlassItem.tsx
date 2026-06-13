import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, fontSizes, fonts, radius, shadows } from '@/src/theme';
import type { CartItem } from '@/src/types/cart';
import { formatCurrency } from '@/src/utils/formatCurrency';

type CartGlassItemProps = {
  item: CartItem;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
  readOnly?: boolean;
};

export function CartGlassItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  readOnly = false,
}: CartGlassItemProps) {
  const { product, quantity } = item;
  const lineTotal = product.price * quantity;

  return (
    <View style={styles.shell}>
      <View style={styles.glass}>
        <BlurView
          intensity={Platform.OS === 'web' ? 20 : Platform.OS === 'android' ? 30 : 38}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.tint} />
        <View style={styles.highlight} />

        <View style={styles.row}>
          <View style={styles.imageColumn}>
            <View style={styles.imageFrame}>
              <Image
                source={{ uri: product.imageUrl }}
                style={styles.image}
                contentFit="cover"
                transition={180}
              />
            </View>
            <View style={styles.qtyBadge}>
              <Text style={styles.qtyBadgeText}>{quantity}x</Text>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.topLine}>
              <View style={styles.titleBlock}>
                <Text style={styles.name} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={styles.unitPrice}>
                  {formatCurrency(product.price)} · unidade
                </Text>
              </View>

              {!readOnly ? (
                <Pressable
                  style={({ pressed }) => [styles.removeBtn, pressed && styles.removeBtnPressed]}
                  onPress={onRemove}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Remover item">
                  <MaterialIcons name="delete-outline" size={18} color={colors.danger} />
                </Pressable>
              ) : null}
            </View>

            <View style={styles.bottomLine}>
              {readOnly ? (
                <Text style={styles.readOnlyQty}>Quantidade: {quantity}</Text>
              ) : (
                <View style={styles.stepper}>
                  <Pressable
                    style={({ pressed }) => [styles.stepBtn, pressed && styles.stepBtnPressed]}
                    onPress={onDecrease}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel="Diminuir quantidade">
                    <MaterialIcons name="remove" size={16} color={colors.cartGlassAccent} />
                  </Pressable>

                  <Text style={styles.qty}>{quantity}</Text>

                  <Pressable
                    style={({ pressed }) => [styles.stepBtn, pressed && styles.stepBtnPressed]}
                    onPress={onIncrease}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel="Aumentar quantidade">
                    <MaterialIcons name="add" size={16} color={colors.cartGlassAccent} />
                  </Pressable>
                </View>
              )}

              <View style={styles.totalPill}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatCurrency(lineTotal)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    marginBottom: 12,
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
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: colors.cartGlassHighlight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    padding: 12,
  },
  imageColumn: {
    position: 'relative',
    width: 84,
    height: 84,
    flexShrink: 0,
  },
  imageFrame: {
    width: '100%',
    height: '100%',
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cartGlassAccentSoft,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  qtyBadge: {
    position: 'absolute',
    right: -10,
    top: '58%',
    transform: [{ translateY: -11 }],
    backgroundColor: colors.cartGlassAccent,
    borderRadius: radius.full,
    minWidth: 28,
    height: 22,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    ...shadows.sm,
    zIndex: 2,
  },
  qtyBadgeText: {
    fontFamily: fonts.sans,
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.3,
  },
  body: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'space-between',
    gap: 10,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 18,
  },
  unitPrice: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 3,
  },
  removeBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnPressed: {
    backgroundColor: colors.dangerLight,
    transform: [{ scale: 0.96 }],
  },
  bottomLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  readOnlyQty: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.textMuted,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cartGlassStepper,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.cartGlassAccentBorder,
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 2,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.cartGlassLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnPressed: {
    backgroundColor: colors.cartGlassAccentPressed,
    transform: [{ scale: 0.94 }],
  },
  qty: {
    minWidth: 28,
    textAlign: 'center',
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '800',
    color: colors.cartGlassAccent,
  },
  totalPill: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.28)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  totalLabel: {
    fontFamily: fonts.sans,
    fontSize: 10,
    fontWeight: '600',
    color: colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  totalValue: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '800',
    color: '#0B7A55',
    marginTop: 1,
  },
});
