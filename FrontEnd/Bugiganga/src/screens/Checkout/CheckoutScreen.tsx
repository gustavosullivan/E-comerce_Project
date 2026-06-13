import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

import { CartGlassItem } from '@/src/components/cards/CartGlassItem';
import { CartSummaryGlass } from '@/src/components/cards/CartSummaryGlass';
import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { CheckoutAddressModal } from '@/src/components/checkout/CheckoutAddressModal';
import { EmptyState } from '@/src/components/layout/EmptyState';
import { PageContainer } from '@/src/components/layout/PageContainer';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { useAddress } from '@/src/hooks/useAddress';
import { useAuth } from '@/src/hooks/useAuth';
import { useWallet } from '@/src/hooks/useWallet';
import { routes } from '@/src/navigation/routes';
import { orderService } from '@/src/services/orderService';
import { walletService } from '@/src/services/walletService';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { snackbar } from '@/src/store/snackbarStore';
import { useCartStore } from '@/src/store/cartStore';
import { isBuyer } from '@/src/types/auth';
import type { UserAddress } from '@/src/types/address';
import { InsufficientBalanceError } from '@/src/types/wallet';
import { colors, fontSizes, fonts, layout, radius } from '@/src/theme';

export default function CheckoutScreen() {
  const { user } = useAuth();
  const buyer = isBuyer(user);
  const { balance } = useWallet(user?.id, buyer);
  const { address, hasAddress: addressReady, saveAddress } = useAddress(user?.id);
  const items = useCheckoutStore((s) => s.items);
  const mode = useCheckoutStore((s) => s.mode);
  const total = useCheckoutStore((s) => s.getTotal());
  const clearCheckout = useCheckoutStore((s) => s.clear);
  const clearCart = useCartStore((s) => s.clearCart);
  const [isConfirming, setIsConfirming] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSaveAddress = async (nextAddress: UserAddress) => {
    setIsSavingAddress(true);
    try {
      await saveAddress(nextAddress);
      snackbar.success('Endereço salvo');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível salvar o endereço';
      snackbar.error(message);
      throw error;
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleConfirm = async () => {
    if (!user?.id) return;

    if (!buyer) {
      snackbar.error('Use a conta comprador para finalizar compras');
      return;
    }

    if (!addressReady || !address) {
      snackbar.error('Cadastre seu endereço antes de confirmar a compra');
      setAddressModalOpen(true);
      return;
    }

    if (!walletService.canAfford(user.id, total, buyer)) {
      snackbar.insufficientBalance();
      return;
    }

    setIsConfirming(true);
    try {
      await walletService.debit(user.id, total, buyer);

      try {
        const order = await orderService.createOrder(orderService.fromCartItems(items), {
          items,
          userId: user.id,
          buyerName: user.name,
          buyerEmail: user.email,
          deliveryAddress: address,
        });

        if (mode === 'cart') clearCart();
        clearCheckout();
        snackbar.purchaseSuccess();
        router.replace(routes.orderReceipt(order.id, true));
      } catch {
        walletService.credit(user.id, total);
        snackbar.error('Não foi possível confirmar a compra');
      }
    } catch (error) {
      if (error instanceof InsufficientBalanceError) {
        snackbar.insufficientBalance();
      } else {
        snackbar.error('Não foi possível processar o pagamento');
      }
    } finally {
      setIsConfirming(false);
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <EmptyState icon="shopping-bag" message="Nenhum item para finalizar." />
        <View style={styles.emptyAction}>
          <PrimaryButton label="Voltar à home" onPress={() => router.replace('/(tabs)')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <PageContainer>
          <Pressable style={styles.back} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>

          <ScreenHeader
            title="Confirmar compra"
            icon="shopping-bag"
            subtitle={`${itemCount} unidade(s) · ${items.length} produto(s)`}
          />
        </PageContainer>

        <View style={styles.body}>
          <FlatList
            style={styles.listFlex}
            data={items}
            keyExtractor={(item) => String(item.product.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <PageContainer>
                <CartGlassItem item={item} readOnly />
              </PageContainer>
            )}
          />

          <View style={styles.summaryDock}>
            <PageContainer>
              {buyer ? (
                <Pressable
                  style={({ pressed }) => [styles.addressBtn, pressed && styles.addressBtnPressed]}
                  onPress={() => setAddressModalOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Ver endereço de entrega">
                  <MaterialIcons name="location-on" size={14} color={colors.cartGlassAccent} />
                  <Text style={styles.addressBtnLabel}>Endereço</Text>
                </Pressable>
              ) : null}

              <CartSummaryGlass
                subtotal={total}
                total={total}
                balance={buyer ? balance : undefined}
                actionLabel="Confirmar compra"
                isLoading={isConfirming}
                loadingLabel="Finalizando..."
                onCheckout={handleConfirm}
              />
            </PageContainer>
          </View>
        </View>
      </View>

      <CheckoutAddressModal
        visible={addressModalOpen}
        address={address}
        isSaving={isSavingAddress}
        onClose={() => setAddressModalOpen(false)}
        onSave={handleSaveAddress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  emptyAction: { padding: 16 },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: layout.sm,
  },
  backText: {
    fontSize: fontSizes.md,
    color: colors.primary,
    fontWeight: '600',
  },
  body: { flex: 1 },
  listFlex: { flex: 1 },
  summaryDock: {
    flexShrink: 0,
    paddingTop: layout.xs,
    paddingBottom: layout.md,
  },
  list: {
    paddingTop: layout.sm,
    paddingBottom: layout.md,
    alignItems: 'center',
  },
  addressBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: layout.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.cartGlassLight,
    borderWidth: 1,
    borderColor: colors.cartGlassBorder,
  },
  addressBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  addressBtnLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.cartGlassAccent,
  },
});
