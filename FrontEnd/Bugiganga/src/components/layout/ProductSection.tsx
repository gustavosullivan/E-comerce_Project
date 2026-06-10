import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ProductCard } from '@/src/components/cards/ProductCard';
import { ProductPreviewSheet } from '@/src/components/cards/ProductPreviewSheet';
import { colors, fonts } from '@/src/theme';
import type { Product } from '@/src/types/product';
import { useFavoritesStore } from '@/src/store/favoritesStore';

type ProductSectionProps = {
  title: string;
  products: Product[];
};

export function ProductSection({ title, products }: ProductSectionProps) {
  const toggle = useFavoritesStore((s) => s.toggle);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  if (products.length === 0) return null;

  return (
    <View style={styles.section}>
      {previewProduct ? (
        <ProductPreviewSheet
          product={previewProduct}
          visible
          onClose={() => setPreviewProduct(null)}
        />
      ) : null}

      <Text style={styles.title}>{title}</Text>
      <FlatList
        horizontal
        data={products}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onToggleFavorite={() => toggle(item)}
            onPress={() => setPreviewProduct(item)}
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
