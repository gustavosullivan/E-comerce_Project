import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/src/components/buttons/SecondaryButton';
import { EmptyState } from '@/src/components/layout/EmptyState';
import { ProfilePaper, ProfilePaperDivider } from '@/src/components/layout/ProfilePaper';
import { Loading } from '@/src/components/layout/Loading';
import { ScreenContainer } from '@/src/components/ui/ScreenContainer';
import { useOrder } from '@/src/hooks/useOrders';
import { routes } from '@/src/navigation/routes';
import { colors, fontSizes, fonts, textStyles } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { formatAddressCompact, formatZipCode, hasAddress } from '@/src/utils/formatAddress';
import { formatOrderDate } from '@/src/utils/formatDate';
import { getOrderStatusLabel } from '@/src/utils/orderStatus';

export default function OrderReceiptScreen() {
  const { id } = useLocalSearchParams<{ id: string; fresh?: string }>();
  const orderId = Number(id);
  const { order, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <ScreenContainer contentStyle={styles.centered}>
        <Loading />
      </ScreenContainer>
    );
  }

  if (error || !order) {
    return (
      <ScreenContainer contentStyle={styles.centered}>
        <EmptyState icon="receipt-long" message="Comprovante não encontrado." />
        <View style={styles.emptyActions}>
          <PrimaryButton label="Ver histórico" onPress={() => router.push(routes.orderHistory)} />
          <SecondaryButton label="Voltar à loja" onPress={() => router.replace(routes.home)} />
        </View>
      </ScreenContainer>
    );
  }

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryAddress = order.deliveryAddress;

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        <Text style={styles.backText}>Voltar</Text>
      </Pressable>

      <ProfilePaper
        title="Comprovante de Compra"
        subtitle="Bugiganga — Mercado de Relíquias"
        delay={40}>
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

        <ProfilePaperDivider label="Comprador" />

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

        <ProfilePaperDivider label="Endereço de entrega" />

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

        <ProfilePaperDivider label="Itens adquiridos" />

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

        <ProfilePaperDivider label="Resumo" />

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
          Este documento comprova a execução da compra na plataforma Bugiganga.
          Guarde para consultas futuras.
        </Text>
      </ProfilePaper>

      <View style={styles.actions}>
        <PrimaryButton
          label="Continuar comprando"
          onPress={() => router.replace(routes.home)}
        />
        <SecondaryButton
          label="Ver histórico de compras"
          onPress={() => router.push(routes.orderHistory)}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 32,
  },
  emptyActions: {
    gap: 10,
    paddingHorizontal: 24,
    marginTop: 8,
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
  approvedStamp: {
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: colors.success,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 16,
    transform: [{ rotate: '-4deg' }],
    opacity: 0.75,
  },
  approvedStampText: {
    fontFamily: fonts.serif,
    fontSize: 13,
    fontWeight: '800',
    color: colors.success,
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
    borderBottomColor: colors.border,
    gap: 12,
  },
  metaLabel: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    fontWeight: '600',
  },
  metaValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: fontSizes.sm,
    color: colors.text,
    fontWeight: '700',
  },
  addressMissing: {
    fontSize: fontSizes.sm,
    color: colors.danger,
    fontWeight: '600',
    lineHeight: 20,
  },
  statusPill: {
    backgroundColor: '#E8F5E9',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.2)',
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: '800',
    color: colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
  },
  itemMeta: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemTotal: {
    fontSize: fontSizes.sm,
    fontWeight: '800',
    color: colors.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  summaryValue: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: colors.border,
  },
  totalLabel: {
    ...textStyles.sectionTitle,
    fontSize: 16,
  },
  totalValue: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: colors.primary,
  },
  legalNote: {
    marginTop: 16,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  actions: {
    gap: 10,
    marginTop: 4,
  },
});
