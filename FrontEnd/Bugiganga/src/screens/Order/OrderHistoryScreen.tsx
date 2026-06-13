import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { EmptyState } from '@/src/components/layout/EmptyState';
import { Loading } from '@/src/components/layout/Loading';
import { ProfilePaper } from '@/src/components/layout/ProfilePaper';
import { ScreenContainer } from '@/src/components/ui/ScreenContainer';
import { useAuth } from '@/src/hooks/useAuth';
import { useOrders } from '@/src/hooks/useOrders';
import { routes } from '@/src/navigation/routes';
import { colors, fontSizes, fonts, textStyles } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { formatOrderDateShort } from '@/src/utils/formatDate';
import { getOrderStatusLabel } from '@/src/utils/orderStatus';

export default function OrderHistoryScreen() {
  const { user } = useAuth();
  const { orders, isLoading, error } = useOrders(user?.id);

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        <Text style={styles.backText}>Voltar</Text>
      </Pressable>

      <Text style={[textStyles.pageTitle, styles.pageTitle]}>Histórico de Compras</Text>
      <Text style={styles.subtitle}>
        Todas as compras realizadas na sua conta de comprador
      </Text>

      {isLoading ? (
        <Loading />
      ) : error ? (
        <EmptyState icon="error-outline" message={error} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="receipt-long"
            message="Você ainda não realizou nenhuma compra. Explore os achados e finalize seu primeiro pedido."
          />
          <PrimaryButton label="Ir à loja" onPress={() => router.replace(routes.home)} />
        </View>
      ) : (
        orders.map((order, index) => {
          const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <Pressable
              key={order.id}
              onPress={() => router.push(routes.orderReceipt(order.id))}>
              <ProfilePaper
                title={`Pedido #${order.id}`}
                subtitle={formatOrderDateShort(order.createdAt)}
                delay={index * 40}
                showStamp={false}>
                <View style={styles.cardRow}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardMeta}>
                      {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                    </Text>
                    <Text style={styles.cardTotal}>{formatCurrency(order.total)}</Text>
                  </View>
                  <View style={styles.cardRight}>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusText}>
                        {getOrderStatusLabel(order.status)}
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={22} color={colors.primary} />
                  </View>
                </View>
                <Text style={styles.cardHint}>Toque para ver o comprovante</Text>
              </ProfilePaper>
            </Pressable>
          );
        })
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
    lineHeight: 20,
  },
  emptyWrap: {
    gap: 16,
    paddingTop: 24,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardMeta: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    fontWeight: '600',
  },
  cardTotal: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusPill: {
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(91, 95, 239, 0.2)',
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: '800',
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cardHint: {
    marginTop: 10,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
