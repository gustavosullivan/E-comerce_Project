import { type PropsWithChildren } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
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
import { SecondaryButton } from '@/src/components/buttons/SecondaryButton';
import { EmptyState } from '@/src/components/layout/EmptyState';
import { Loading } from '@/src/components/layout/Loading';
import { PageContainer } from '@/src/components/layout/PageContainer';
import { ProfilePaper, ProfilePaperDivider } from '@/src/components/layout/ProfilePaper';
import { WarmAppShell } from '@/src/components/layout/WarmAppShell';
import { useOrder } from '@/src/hooks/useOrders';
import { useTabBarInset } from '@/src/hooks/useTabBarInset';
import { routes } from '@/src/navigation/routes';
import { fontSizes, fonts, layout, loginGlass, radius } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { formatAddressCompact, formatZipCode, hasAddress } from '@/src/utils/formatAddress';
import { formatOrderDate } from '@/src/utils/formatDate';
import { getOrderStatusLabel } from '@/src/utils/orderStatus';

function ReceiptShell({ children }: PropsWithChildren) {
  return (
    <WarmAppShell>
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        {children}
      </SafeAreaView>
    </WarmAppShell>
  );
}

export default function OrderReceiptScreen() {
  const { id, fresh } = useLocalSearchParams<{ id: string; fresh?: string }>();
  const orderId = Number(id);
  const { order, isLoading, error } = useOrder(orderId);
  const { contentBottomInset } = useTabBarInset();

  const handleBack = () => {
    if (fresh === '1') {
      router.replace(routes.orderHistory);
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(routes.orderHistory);
  };

  if (isLoading) {
    return (
      <ReceiptShell>
        <View style={styles.centered}>
          <Loading />
        </View>
      </ReceiptShell>
    );
  }

  if (error || !order) {
    return (
      <ReceiptShell>
        <View style={styles.centered}>
          <EmptyState icon="receipt-long" message="Comprovante não encontrado." variant="warm" />
          <View style={styles.emptyActions}>
            <PrimaryButton
              label="Ver histórico"
              onPress={() => router.push(routes.orderHistory)}
              variant="warm"
            />
            <SecondaryButton
              label="Voltar à loja"
              onPress={() => router.replace(routes.home)}
              variant="warm"
            />
          </View>
        </View>
      </ReceiptShell>
    );
  }

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryAddress = order.deliveryAddress;

  return (
    <ReceiptShell>
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

            <ProfilePaper
              title="Comprovante de Compra"
              subtitle="Bugiganga — Mercado de Relíquias"
              delay={40}
              variant="warm">
              <View style={styles.approvedStamp}>
                <Text style={styles.approvedStampText}>APROVADO</Text>
              </View>

              <View style={styles.metaBlock}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Nº do pedido</Text>
                  <Text style={styles.metaValue}>#{order.id}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Data</Text>
                  <Text style={styles.metaValue}>{formatOrderDate(order.createdAt)}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Status</Text>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusText}>{getOrderStatusLabel(order.status)}</Text>
                  </View>
                </View>
              </View>

              <ProfilePaperDivider label="Comprador" variant="warm" />

              <View style={styles.metaBlock}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Nome</Text>
                  <Text style={styles.metaValue}>{order.buyerName}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Email</Text>
                  <Text style={styles.metaValue}>{order.buyerEmail}</Text>
                </View>
              </View>

              <ProfilePaperDivider label="Endereço de entrega" variant="warm" />

              {hasAddress(deliveryAddress) && deliveryAddress ? (
                <View style={styles.metaBlock}>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>CEP</Text>
                    <Text style={styles.metaValue}>{formatZipCode(deliveryAddress.zipCode)}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Rua</Text>
                    <Text style={styles.metaValue}>
                      {deliveryAddress.street}, {deliveryAddress.number}
                    </Text>
                  </View>
                  {deliveryAddress.complement?.trim() ? (
                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Complemento</Text>
                      <Text style={styles.metaValue}>{deliveryAddress.complement}</Text>
                    </View>
                  ) : null}
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Bairro</Text>
                    <Text style={styles.metaValue}>{deliveryAddress.neighborhood}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Cidade / UF</Text>
                    <Text style={styles.metaValue}>
                      {deliveryAddress.city}/{deliveryAddress.state.toUpperCase()}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.addressMissing}>{formatAddressCompact(deliveryAddress)}</Text>
              )}

              <ProfilePaperDivider label="Itens adquiridos" variant="warm" />

              {order.items.map((item) => (
                <View key={item.product.id} style={styles.itemRow}>
                  <Image source={{ uri: item.product.imageUrl }} style={styles.thumb} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.product.name}</Text>
                    <Text style={styles.itemMeta}>
                      {item.quantity}x {formatCurrency(item.product.price)}
                    </Text>
                  </View>
                  <Text style={styles.itemTotal}>
                    {formatCurrency(item.product.price * item.quantity)}
                  </Text>
                </View>
              ))}

              <ProfilePaperDivider label="Resumo" variant="warm" />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Quantidade de itens</Text>
                <Text style={styles.summaryValue}>{itemCount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatCurrency(order.total)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Forma de pagamento</Text>
                <Text style={styles.summaryValue}>Crédito em conta</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total pago</Text>
                <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
              </View>

              <Text style={styles.legalNote}>
                Este documento comprova a execução da compra na plataforma Bugiganga. Guarde para
                consultas futuras.
              </Text>
            </ProfilePaper>

            <View style={styles.actions}>
              <PrimaryButton
                label="Continuar comprando"
                onPress={() => router.replace(routes.home)}
                variant="warm"
              />
              <SecondaryButton
                label="Ver histórico de compras"
                onPress={() => router.push(routes.orderHistory)}
                variant="warm"
              />
            </View>
          </PageContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </ReceiptShell>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  content: {
    paddingTop: layout.sm,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.md,
    paddingBottom: layout.lg,
  },
  emptyActions: {
    gap: 10,
    marginTop: 8,
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
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
  approvedStamp: {
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: 'rgba(120, 220, 170, 0.55)',
    backgroundColor: 'rgba(16, 120, 80, 0.18)',
    borderRadius: radius.md,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 16,
    transform: [{ rotate: '-4deg' }],
  },
  approvedStampText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    fontWeight: '800',
    color: loginGlass.goldLight,
    letterSpacing: 1.2,
  },
  metaBlock: {
    gap: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: loginGlass.shellBorder,
    gap: 12,
  },
  metaLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.textMuted,
    fontWeight: '600',
  },
  metaValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.text,
    fontWeight: '700',
  },
  addressMissing: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: '#FFB4A8',
    fontWeight: '600',
    lineHeight: 20,
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
    letterSpacing: 0.5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: loginGlass.shellBorder,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
    backgroundColor: loginGlass.formFieldBg,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: loginGlass.text,
  },
  itemMeta: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: loginGlass.textMuted,
    marginTop: 2,
  },
  itemTotal: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '800',
    color: loginGlass.goldLight,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.textMuted,
  },
  summaryValue: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: loginGlass.text,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: loginGlass.shellBorder,
  },
  totalLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '800',
    color: loginGlass.text,
  },
  totalValue: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: loginGlass.goldLight,
  },
  legalNote: {
    marginTop: 16,
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: loginGlass.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  actions: {
    gap: 10,
    marginTop: 4,
  },
});
