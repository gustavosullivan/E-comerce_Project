import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSizes, fonts, loginGlass, radius, shadows } from '@/src/theme';
import { glassBlur } from '@/src/theme/loginGlass';
import type { Product } from '@/src/types/product';
import { formatCurrency } from '@/src/utils/formatCurrency';

export const ADMIN_PRODUCT_CARD_HEIGHT = 268;
const IMAGE_HEIGHT = 130;

type AdminProductCardProps = {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  compact?: boolean;
  variant?: 'default' | 'warm';
};

export function AdminProductCard({
  product,
  onEdit,
  onDelete,
  compact,
  variant = 'default',
}: AdminProductCardProps) {
  const warm = variant === 'warm';
  const blurIntensity =
    Platform.OS === 'android' ? glassBlur.android.card : glassBlur.ios.card;

  return (
    <View style={[styles.shell, compact && styles.shellCompact]}>
      <View
        style={[
          styles.card,
          warm && styles.cardWarm,
          warm &&
            Platform.OS === 'web' && {
              backdropFilter: `blur(${glassBlur.web.card})`,
              WebkitBackdropFilter: `blur(${glassBlur.web.card})`,
            },
        ]}>
        {Platform.OS === 'web' ? (
          <View style={[styles.webGlass, warm && styles.webGlassWarm]} pointerEvents="none" />
        ) : (
          <BlurView
            intensity={warm ? blurIntensity : Platform.OS === 'android' ? 28 : 36}
            tint={warm ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        )}
        <View style={[styles.tint, warm && styles.tintWarm]} pointerEvents="none" />
        <View style={[styles.highlight, warm && styles.highlightWarm]} pointerEvents="none" />

        <View style={styles.cardContent}>
          <View style={styles.imageWrap}>
            <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="cover" />
            <View style={[styles.stockBadge, warm && styles.stockBadgeWarm]}>
              <Text style={styles.stockText}>Estoque: {product.stock}</Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.textBlock}>
              <Text style={[styles.name, warm && styles.nameWarm]} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={[styles.category, warm && styles.categoryWarm]} numberOfLines={1}>
                {product.categoryName}
              </Text>
            </View>

            <View style={styles.footer}>
              <Text style={[styles.price, warm && styles.priceWarm]} numberOfLines={1}>
                {formatCurrency(product.price)}
              </Text>
              <View style={styles.actions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionBtn,
                    warm && styles.actionBtnWarm,
                    pressed && styles.actionBtnPressed,
                  ]}
                  onPress={onEdit}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel="Editar produto">
                  <MaterialIcons
                    name="edit"
                    size={16}
                    color={warm ? loginGlass.text : colors.white}
                  />
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionBtn,
                    warm ? styles.actionBtnDangerWarm : styles.actionBtnDanger,
                    pressed && styles.actionBtnPressed,
                  ]}
                  onPress={onDelete}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel="Excluir produto">
                  <MaterialIcons
                    name="delete-outline"
                    size={16}
                    color={warm ? '#F5C4BE' : colors.white}
                  />
                </Pressable>
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
    width: 160,
    height: ADMIN_PRODUCT_CARD_HEIGHT,
    marginRight: 12,
  },
  shellCompact: {
    width: '100%',
    height: ADMIN_PRODUCT_CARD_HEIGHT,
    marginRight: 0,
  },
  card: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: colors.cartGlass,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cartGlassBorder,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardWarm: {
    backgroundColor: loginGlass.cardGlass,
    borderColor: loginGlass.cardBorder,
  },
  webGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.cartGlass,
  },
  webGlassWarm: {
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
    zIndex: 1,
  },
  highlightWarm: {
    backgroundColor: loginGlass.shellHighlight,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    zIndex: 2,
  },
  imageWrap: {
    position: 'relative',
    height: IMAGE_HEIGHT,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cartGlassAccentSoft,
  },
  stockBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(8, 10, 20, 0.72)',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stockBadgeWarm: {
    backgroundColor: 'rgba(20, 12, 8, 0.78)',
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
  },
  stockText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.white,
  },
  content: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'space-between',
    minHeight: 0,
  },
  textBlock: {
    flexShrink: 1,
    minHeight: 52,
  },
  name: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 18,
    height: 36,
  },
  nameWarm: {
    color: loginGlass.text,
  },
  category: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
    height: 16,
    lineHeight: 16,
  },
  categoryWarm: {
    color: loginGlass.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
    gap: 8,
    marginTop: 8,
  },
  price: {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: '800',
    color: colors.cartGlassAccent,
    minWidth: 0,
  },
  priceWarm: {
    color: loginGlass.goldLight,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 0,
    zIndex: 10,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  actionBtnWarm: {
    backgroundColor: loginGlass.button,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
  },
  actionBtnDanger: {
    backgroundColor: colors.danger,
  },
  actionBtnDangerWarm: {
    backgroundColor: 'rgba(160, 50, 45, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(220, 80, 70, 0.35)',
  },
  actionBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
});
