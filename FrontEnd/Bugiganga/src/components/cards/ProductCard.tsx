import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, fonts } from '@/src/theme';
import type { Product } from '@/src/types/product';
import { formatCurrency } from '@/src/utils/formatCurrency';

type ProductCardProps = {
  product: Product;
  onPress: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  compact?: boolean;
};

export function ProductCard({
  product,
  onPress,
  onToggleFavorite,
  isFavorite,
  compact,
}: ProductCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, compact && styles.compact]}
      accessibilityRole="button">
      <View>
        <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="cover" />
        <Pressable style={styles.favBtn} onPress={onToggleFavorite} hitSlop={8}>
          <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={22}
            color={isFavorite ? colors.danger : colors.primary}
          />
        </Pressable>
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.price}>{formatCurrency(product.price)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 12,
    backgroundColor: colors.card,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
  },
  compact: { width: '100%', marginRight: 0, marginBottom: 0 },
  image: { width: '100%', height: 120, borderRadius: 2, backgroundColor: colors.inputBg },
  favBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 4,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    minHeight: 34,
  },
  price: { fontSize: 14, fontWeight: '700', color: colors.primary, marginTop: 4 },
});
