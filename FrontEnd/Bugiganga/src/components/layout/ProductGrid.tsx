import { useMemo, type ReactNode } from 'react';
import {
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  type ListRenderItem,
  type RefreshControlProps,
} from 'react-native';

import { layout } from '@/src/theme/layout';
import type { Product } from '@/src/types/product';

const GRID_GAP = 12;

type ProductGridProps = {
  products: Product[];
  ListHeaderComponent?: ReactNode;
  renderCard: (product: Product) => ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  contentBottomInset?: number;
};

type ProductRow = {
  key: string;
  items: Product[];
};

function useGridMetrics() {
  const { width } = useWindowDimensions();
  const gridWidth = Math.min(width - layout.md * 2, layout.maxContentWidth);
  const cellWidth = Math.floor((gridWidth - GRID_GAP) / 2);

  return { gridWidth, cellWidth };
}

export function ProductGrid({
  products,
  ListHeaderComponent,
  renderCard,
  refreshControl,
  contentBottomInset = 0,
}: ProductGridProps) {
  const { gridWidth, cellWidth } = useGridMetrics();

  const rows = useMemo(() => {
    const chunks: ProductRow[] = [];
    for (let i = 0; i < products.length; i += 2) {
      const pair = products.slice(i, i + 2);
      chunks.push({
        key: pair.map((item) => item.id).join('-'),
        items: pair,
      });
    }
    return chunks;
  }, [products]);

  const renderRow: ListRenderItem<ProductRow> = ({ item }) => (
    <View style={[styles.row, { width: gridWidth, gap: GRID_GAP }]}>
      {item.items.map((product) => (
        <View key={product.id} style={[styles.cell, { width: cellWidth }]}>
          {renderCard(product)}
        </View>
      ))}
      {item.items.length === 1 ? (
        <View style={[styles.cellGhost, { width: cellWidth }]} />
      ) : null}
    </View>
  );

  return (
    <FlatList
      data={rows}
      keyExtractor={(item) => item.key}
      renderItem={renderRow}
      contentContainerStyle={[styles.list, { paddingBottom: layout.lg + contentBottomInset }]}
      ListHeaderComponent={
        ListHeaderComponent ? (
          <View style={[styles.headerWrap, { width: gridWidth }]}>{ListHeaderComponent}</View>
        ) : null
      }
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
    alignItems: 'center',
  },
  headerWrap: {
    alignSelf: 'center',
    marginBottom: layout.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'center',
    marginBottom: layout.md,
  },
  cell: {
    flexShrink: 0,
  },
  cellGhost: {
    flexShrink: 0,
  },
});
