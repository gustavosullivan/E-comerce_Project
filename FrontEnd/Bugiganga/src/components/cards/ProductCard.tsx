import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ProductImageFrame } from '@/src/components/layout/ProductImageFrame';
import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { colors, fonts, shadow } from '@/src/theme';
import type { Product } from '@/src/types/product';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { lightImpact, selectionFeedback } from '@/src/utils/haptics';

type ProductCardProps = {
  product: Product;
  onBuyPress: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  grid?: boolean;
  horizontal?: boolean;
  width?: number;
};

export function ProductCard({
  product,
  onBuyPress,
  onToggleFavorite,
  isFavorite,
  grid,
  horizontal,
  width,
}: ProductCardProps) {
  const isCompact = grid || horizontal;

  const handleFavorite = () => {
    selectionFeedback();
    onToggleFavorite();
  };

  const handleBuy = () => {
    lightImpact();
    onBuyPress();
  };

  return (
    <View
      style={[
        styles.card,
        grid && styles.gridCard,
        horizontal && styles.horizontal,
        width != null && { width },
      ]}>
      <ScalePressable
        onPress={handleBuy}
        accessibilityRole="button"
        accessibilityLabel={product.name}
        style={styles.pressArea}>
        <View style={[styles.imageSection, grid && styles.imageSectionGrid]}>
          <ProductImageFrame
            uri={product.imageUrl}
            aspectRatio={1}
            framed
            compact={isCompact}
          />
          {product.isNew ? (
            <View style={styles.tagNew}>
              <Text style={styles.tagText}>Novo</Text>
            </View>
          ) : null}
          <ScalePressable
            style={[styles.favBtn, grid && styles.favBtnGrid, isFavorite && styles.favBtnActive]}
            onPress={handleFavorite}
            hitSlop={6}>
            <MaterialIcons
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={grid ? 13 : 16}
              color={isFavorite ? colors.white : colors.primary}
            />
          </ScalePressable>
        </View>
      </ScalePressable>

      <View style={[styles.legend, grid && styles.legendGrid]}>
        <Text style={[styles.name, grid && styles.nameGrid]} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={[styles.price, grid && styles.priceGrid]} numberOfLines={1}>
          {formatCurrency(product.price)}
        </Text>
        <ScalePressable
          style={styles.buyBtn}
          onPress={handleBuy}
          accessibilityRole="button"
          accessibilityLabel={`Comprar ${product.name}`}>
          <MaterialIcons name="shopping-bag" size={11} color={colors.white} />
          <Text style={[styles.buyLabel, grid && styles.buyLabelGrid]}>Comprar</Text>
        </ScalePressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.inputBg,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.card,
  },
  gridCard: {
    borderWidth: 1,
  },
  horizontal: {
    width: 120,
    marginRight: 10,
  },
  pressArea: {
    width: '100%',
  },
  imageSection: {
    position: 'relative',
    padding: 6,
    paddingBottom: 4,
    backgroundColor: colors.card,
  },
  imageSectionGrid: {
    padding: 4,
    paddingBottom: 2,
  },
  tagNew: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.text,
  },
  tagText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  favBtnGrid: {
    top: 5,
    right: 5,
    padding: 3,
    borderRadius: 10,
  },
  favBtnActive: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  legend: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 3,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  legendGrid: {
    paddingHorizontal: 7,
    paddingVertical: 7,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 15,
  },
  nameGrid: {
    fontWeight: '700',
  },
  price: {
    fontFamily: fonts.serif,
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  priceGrid: {
    fontWeight: '800',
  },
  buyBtn: {
    marginTop: 4,
    backgroundColor: colors.primary,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.text,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  buyLabel: {
    fontFamily: fonts.serif,
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  buyLabelGrid: {
    fontSize: 10,
  },
});
