import { FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { ProductCard } from '@/src/components/cards/ProductCard';
import { routes } from '@/src/navigation/routes';
import { colors, fonts } from '@/src/theme';
import type { Product } from '@/src/types/product';
import { useFavoritesStore } from '@/src/store/favoritesStore';

type ProductSectionProps = {
  title: string;
  products: Product[];
};

export function ProductSection({ title, products }: ProductSectionProps) {
  const toggle = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);

  if (products.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        horizontal
        data={products}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            horizontal
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggle(item)}
            onBuyPress={() => router.push(routes.productDetails(item.id))}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  title: {
    fontFamily: fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
    marginBottom: 10,
  },
});
