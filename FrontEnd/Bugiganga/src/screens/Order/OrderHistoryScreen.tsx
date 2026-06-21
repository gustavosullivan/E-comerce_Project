import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { EmptyState } from '@/src/components/layout/EmptyState';
import { Loading } from '@/src/components/layout/Loading';
import { PageContainer } from '@/src/components/layout/PageContainer';
import { ProfilePaper } from '@/src/components/layout/ProfilePaper';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { WarmAppShell } from '@/src/components/layout/WarmAppShell';
import { useAuth } from '@/src/hooks/useAuth';
import { useTabBarInset } from '@/src/hooks/useTabBarInset';
import { useOrders } from '@/src/hooks/useOrders';
import { routes } from '@/src/navigation/routes';
import { fontSizes, fonts, layout, loginGlass, radius } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { formatOrderDateShort } from '@/src/utils/formatDate';
import { getOrderStatusLabel } from '@/src/utils/orderStatus';

export default function OrderHistoryScreen() {
  const { user } = useAuth();
  const { orders, isLoading, error } = useOrders(user?.id);
  const { contentBottomInset } = useTabBarInset();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(routes.profile);
  };

  return (
    <WarmAppShell>
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: contentBottomInset + layout.lg }]}
            showsVerticalScrollIndicator={false}>
            <PageContainer>
              <Pressable style={styles.back} onPress={handleBack} hitSlop={12}>
                <MaterialIcons name="arrow-back" size={22} color={loginGlass.goldLight} />
                <Text style={styles.backText}>Voltar</Text>
              </Pressable>

              <ScreenHeader
                title="Histórico de Compras"
                icon="receipt-long"
                subtitle="Todas as compras realizadas na sua conta"
                variant="warm"
              />

              {isLoading ? (
                <Loading />
              ) : error ? (
                <EmptyState icon="error-outline" message={error} variant="warm" />
              ) : orders.length === 0 ? (
                <View style={styles.emptyWrap}>
                  <EmptyState
                    icon="receipt-long"
                    message="Você ainda não realizou nenhuma compra. Explore os achados e finalize seu primeiro pedido."
                    variant="warm"
                  />
                  <PrimaryButton
                    label="Ir à loja"
                    onPress={() => router.replace(routes.home)}
                    variant="warm"
                  />
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
                        showStamp={false}
                        variant="warm">
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
                            <MaterialIcons
                              name="chevron-right"
                              size={22}
                              color={loginGlass.goldLight}
                            />
                          </View>
                        </View>
                        <Text style={styles.cardHint}>Toque para ver o comprovante</Text>
                      </ProfilePaper>
                    </Pressable>
                  );
                })
              )}
            </PageContainer>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </WarmAppShell>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  content: {
    paddingTop: layout.sm,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: layout.sm,
  },
  backText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: loginGlass.goldLight,
    fontWeight: '600',
  },
  emptyWrap: {
    gap: 16,
    paddingTop: 8,
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
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.textMuted,
    fontWeight: '600',
  },
  cardTotal: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    fontWeight: '800',
    color: loginGlass.goldLight,
    marginTop: 4,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusPill: {
    backgroundColor: loginGlass.chipActiveBg,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: loginGlass.chipActiveBorder,
  },
  statusText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '800',
    color: loginGlass.text,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cardHint: {
    marginTop: 10,
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: loginGlass.textMuted,
    fontStyle: 'italic',
  },
});
