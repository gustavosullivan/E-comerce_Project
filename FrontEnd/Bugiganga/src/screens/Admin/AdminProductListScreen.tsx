import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { EmptyState } from '@/src/components/layout/EmptyState';
import { Loading } from '@/src/components/layout/Loading';
import { ScreenContainer } from '@/src/components/ui/ScreenContainer';
import { useAdminProducts } from '@/src/hooks/useProducts';
import { routes } from '@/src/navigation/routes';
import { snackbar } from '@/src/store/snackbarStore';
import { colors, fontSizes, fonts, radius, textStyles } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';
import type { Product } from '@/src/types/product';

export default function AdminProductListScreen() {
  const { products, isLoading, deleteProduct } = useAdminProducts();

  const handleDelete = (product: Product) => {
    Alert.alert(
      'Excluir produto',
      `Deseja remover "${product.name}" do catálogo?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(product.id);
              snackbar.success('Produto removido');
            } catch {
              snackbar.error('Não foi possível excluir o produto');
            }
          },
        },
      ],
    );
  };

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        <Text style={styles.backText}>Voltar</Text>
      </Pressable>

      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={[textStyles.pageTitle, styles.pageTitle]}>Produtos</Text>
          <Text style={styles.subtitle}>Edite legendas, preços e estoque</Text>
        </View>
        <PrimaryButton
          label="Novo"
          compact
          onPress={() => router.push(routes.adminProductNew)}
        />
      </View>

      {isLoading ? (
        <Loading />
      ) : products.length === 0 ? (
        <EmptyState icon="inventory-2" message="Nenhum produto cadastrado." />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imageUrl }} style={styles.thumb} contentFit="cover" />
              <View style={styles.cardBody}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.meta} numberOfLines={2}>
                  {item.description}
                </Text>
                <Text style={styles.price}>{formatCurrency(item.price)}</Text>
                <Text style={styles.stock}>Estoque: {item.stock}</Text>
              </View>
              <View style={styles.cardActions}>
                <Pressable
                  style={styles.iconBtn}
                  onPress={() => router.push(routes.adminProductEdit(item.id))}>
                  <MaterialIcons name="edit" size={20} color={colors.primary} />
                </Pressable>
                <Pressable style={styles.iconBtn} onPress={() => handleDelete(item)}>
                  <MaterialIcons name="delete-outline" size={20} color={colors.danger} />
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 24,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  backText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: colors.primary,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  headerCopy: {
    flex: 1,
  },
  pageTitle: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.inputBg,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: fontSizes.md,
    fontWeight: '800',
    color: colors.text,
  },
  meta: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  price: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 6,
  },
  stock: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  cardActions: {
    gap: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
});
