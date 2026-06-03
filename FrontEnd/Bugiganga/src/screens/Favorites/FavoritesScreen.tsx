import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ProductCard } from '@/src/components/cards/ProductCard';
import { EmptyState } from '@/src/components/layout/EmptyState';
import { routes } from '@/src/navigation/routes';
import { useFavoritesStore } from '@/src/store/favoritesStore';
import { colors } from '@/src/theme';

export default function FavoritesScreen() {
  const items = useFavoritesStore((s) => s.items);
  const toggle = useFavoritesStore((s) => s.toggle);

  return (
    <SafeAreaView style={styles.screen}>
      {items.length === 0 ? (
        <EmptyState
          icon="favorite-border"
          message="Você ainda não salvou nenhuma bugiganga."
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.cell}>
              <ProductCard
                product={item}
                compact
                isFavorite
                onToggleFavorite={() => toggle(item)}
                onPress={() => router.push(routes.productDetails(item.id))}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, paddingBottom: 24 },
  row: { justifyContent: 'space-between', marginBottom: 4 },
  cell: { width: '48%' },
});
