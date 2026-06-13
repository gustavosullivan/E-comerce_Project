import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/src/components/buttons/SecondaryButton';
import { ProfilePaper } from '@/src/components/layout/ProfilePaper';
import { Loading } from '@/src/components/layout/Loading';
import { ScreenContainer } from '@/src/components/ui/ScreenContainer';
import { useAdminProducts } from '@/src/hooks/useProducts';
import { routes } from '@/src/navigation/routes';
import { colors, fontSizes, fonts, textStyles } from '@/src/theme';

export default function AdminDashboardScreen() {
  const { products, isLoading } = useAdminProducts();

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        <Text style={styles.backText}>Voltar</Text>
      </Pressable>

      <Text style={[textStyles.pageTitle, styles.pageTitle]}>Painel do vendedor</Text>
      <Text style={styles.subtitle}>Gerencie o que você vende no marketplace</Text>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ProfilePaper title="Resumo" subtitle="Visão geral do estoque" delay={40}>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <MaterialIcons name="inventory-2" size={22} color={colors.primary} />
                <Text style={styles.statValue}>{products.length}</Text>
                <Text style={styles.statLabel}>Produtos</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialIcons name="sell" size={22} color={colors.accent} />
                <Text style={styles.statValue}>
                  {products.filter((p) => p.stock > 0).length}
                </Text>
                <Text style={styles.statLabel}>Com estoque</Text>
              </View>
            </View>
          </ProfilePaper>

          <ProfilePaper title="Ações" subtitle="Cadastro e manutenção" delay={80} showStamp={false}>
            <View style={styles.actions}>
              <PrimaryButton
                label="Ver todos os produtos"
                onPress={() => router.push(routes.adminProducts)}
              />
              <SecondaryButton
                label="Cadastrar produto"
                onPress={() => router.push(routes.adminProductNew)}
              />
            </View>
          </ProfilePaper>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
    paddingBottom: 32,
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
  pageTitle: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  statValue: {
    fontSize: fontSizes.xxl,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    fontWeight: '600',
  },
  actions: {
    gap: 10,
  },
});
