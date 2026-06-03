import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ProductCard } from '@/src/components/cards/ProductCard';
import { SearchBar } from '@/src/components/forms/SearchBar';
import { ErrorState } from '@/src/components/layout/ErrorState';
import { HomeHeader } from '@/src/components/layout/HomeHeader';
import { Loading } from '@/src/components/layout/Loading';
import { useAuth } from '@/src/hooks/useAuth';
import { useProducts } from '@/src/hooks/useProducts';
import { routes } from '@/src/navigation/routes';
import { useFavoritesStore } from '@/src/store/favoritesStore';
import { colors } from '@/src/theme';

export default function HomeScreen() {
  const { user } = useAuth();
  const { products, isLoading, error, reload } = useProducts();
  const [query, setQuery] = useState('');
  const toggle = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q),
    );
  }, [products, query]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <Loading />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <ErrorState message={error} onRetry={reload} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <HomeHeader userName={user?.name ?? 'Visitante'} />
            <SearchBar value={query} onChangeText={setQuery} />
            <View style={styles.spacer} />
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <ProductCard
              product={item}
              compact
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggle(item)}
              onPress={() => router.push(routes.productDetails(item.id))}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { justifyContent: 'space-between' },
  cell: { width: '48%', marginBottom: 12 },
  spacer: { height: 12 },
});
