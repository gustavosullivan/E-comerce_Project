import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { Redirect, router } from 'expo-router';
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
import { PageContainer } from '@/src/components/layout/PageContainer';
import { ProfilePaper } from '@/src/components/layout/ProfilePaper';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { WarmAppShell } from '@/src/components/layout/WarmAppShell';
import { useAuth } from '@/src/hooks/useAuth';
import { useTabBarInset } from '@/src/hooks/useTabBarInset';
import { useWallet } from '@/src/hooks/useWallet';
import { routes } from '@/src/navigation/routes';
import { orderService } from '@/src/services/orderService';
import { productService } from '@/src/services/productService';
import { useCart } from '@/src/hooks/useCart';
import { useFavorites } from '@/src/hooks/useFavorites';
import { snackbar } from '@/src/store/snackbarStore';
import { useAuthStore } from '@/src/store/authStore';
import { fontSizes, fonts, layout, loginGlass, radius } from '@/src/theme';
import { getRoleLabel, hasBuyerProfile, hasSellerProfile, isAdmin } from '@/src/types/auth';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { confirmAction } from '@/src/utils/confirm';

type MenuItem = {
  icon: ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  hint?: string;
  onPress: () => void;
};

function SettingsMenuItem({ icon, label, hint, onPress }: MenuItem) {
  return (
    <Pressable
      style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
      onPress={onPress}>
      <View style={styles.menuIconWrap}>
        <MaterialIcons name={icon} size={20} color={loginGlass.goldLight} />
      </View>
      <View style={styles.menuTextWrap}>
        <Text style={styles.menuLabel}>{label}</Text>
        {hint ? <Text style={styles.menuHint}>{hint}</Text> : null}
      </View>
      <MaterialIcons name="chevron-right" size={22} color={loginGlass.textMuted} />
    </Pressable>
  );
}

function SummaryChip({
  icon,
  value,
  label,
}: {
  icon: ComponentProps<typeof MaterialIcons>['name'];
  value: string | number;
  label: string;
}) {
  return (
    <View style={styles.summaryChip}>
      <MaterialIcons name={icon} size={16} color={loginGlass.goldLight} />
      <Text style={styles.summaryValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const token = useAuthStore((s) => s.token);
  const setActiveRole = useAuthStore((s) => s.setActiveRole);
  const admin = isAdmin(user);
  const buyer = user?.role === 'BUYER';
  const canBuy = hasBuyerProfile(user);
  const canSell = hasSellerProfile(user);
  const { itemCount: cartCount } = useCart();
  const { count: favoriteCount } = useFavorites();
  const [orderCount, setOrderCount] = useState(0);
  const { balance } = useWallet(user?.id, canBuy);
  const { contentBottomInset } = useTabBarInset();
  const [productCount, setProductCount] = useState(0);
  const [salesTotal, setSalesTotal] = useState(0);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(routes.profile);
  };

  useEffect(() => {
    if (!canSell || !user?.id) return;

    let active = true;

    (async () => {
      try {
        const [products, summary] = await Promise.all([
          productService.getAdminProducts(user.id),
          orderService.getAdminSalesSummary(user.id),
        ]);
        if (!active) return;
        setProductCount(products.length);
        setSalesTotal(summary.totalSalesValue);
      } catch {
        if (!active) return;
        setProductCount(0);
        setSalesTotal(0);
      }
    })();

    return () => {
      active = false;
    };
  }, [canSell, user?.id]);

  useEffect(() => {
    if (!canBuy || !user?.id) {
      setOrderCount(0);
      return;
    }

    let active = true;

    (async () => {
      try {
        const orders = await orderService.listOrders(user.id, {
          buyerName: user.name,
          buyerEmail: user.email,
        });
        if (active) setOrderCount(orders.length);
      } catch {
        if (active) setOrderCount(0);
      }
    })();

    return () => {
      active = false;
    };
  }, [canBuy, user?.email, user?.id, user?.name]);

  if (!token) {
    return <Redirect href="/login" />;
  }

  const shortcutItems: MenuItem[] = [
    {
      icon: 'person-outline',
      label: 'Editar minha conta',
      hint: 'Foto, nome e senha',
      onPress: () => router.push(routes.profile),
    },
  ];

  if (canBuy) {
    shortcutItems.push(
      {
        icon: 'favorite-border',
        label: 'Meus favoritos',
        hint: favoriteCount > 0 ? `${favoriteCount} salvos` : 'Nenhum favorito ainda',
        onPress: () => router.push(routes.favorites),
      },
      {
        icon: 'shopping-bag',
        label: 'Carrinho',
        hint: cartCount > 0 ? `${cartCount} itens` : 'Carrinho vazio',
        onPress: () => router.push(routes.cart),
      },
      {
        icon: 'receipt-long',
        label: 'Histórico de compras',
        hint: orderCount > 0 ? `${orderCount} pedidos` : 'Nenhuma compra ainda',
        onPress: () => router.push(routes.orderHistory),
      },
    );
  }

  if (canSell) {
    shortcutItems.push(
      {
        icon: 'storefront',
        label: 'Painel do vendedor',
        hint: admin ? 'Gerenciar catálogo' : 'Ativar perfil vendedor',
        onPress: () => {
          setActiveRole('ADMIN');
          router.replace(routes.home);
        },
      },
      {
        icon: 'add-box',
        label: 'Cadastrar produto',
        hint: 'Novo achado à venda',
        onPress: () => {
          setActiveRole('ADMIN');
          router.push(routes.adminProductNew);
        },
      },
    );
  }

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
                title="Configurações"
                icon="settings"
                subtitle="Atalhos e preferências da sessão"
                variant="warm"
              />

              <ProfilePaper
                title="Resumo"
                subtitle={`Perfil ativo: ${getRoleLabel(user?.role)}`}
                delay={0}
                showStamp={false}
                variant="warm">
                <View style={styles.summaryRow}>
                  {canBuy ? (
                    <>
                      <SummaryChip icon="favorite" value={favoriteCount} label="Favoritos" />
                      <SummaryChip icon="shopping-bag" value={cartCount} label="Carrinho" />
                      <SummaryChip
                        icon="account-balance-wallet"
                        value={formatCurrency(balance)}
                        label="Saldo"
                      />
                    </>
                  ) : null}
                  {canSell ? (
                    <>
                      <SummaryChip icon="inventory-2" value={productCount} label="Produtos" />
                      <SummaryChip
                        icon="storefront"
                        value={formatCurrency(salesTotal)}
                        label="Vendas"
                      />
                    </>
                  ) : null}
                </View>
              </ProfilePaper>

              <ProfilePaper
                title="Atalhos"
                subtitle="Acesso rápido às áreas do app"
                delay={40}
                showStamp={false}
                variant="warm">
                <View style={styles.menuList}>
                  {shortcutItems.map((item) => (
                    <SettingsMenuItem key={item.label} {...item} />
                  ))}
                </View>
              </ProfilePaper>

              {canSell ? (
                <ProfilePaper
                  title="Área do vendedor"
                  subtitle={admin ? 'Perfil vendedor ativo' : 'Ative para vender'}
                  delay={80}
                  showStamp={false}
                  variant="warm">
                  <Text style={styles.helper}>
                    Esta conta vende no marketplace. Gerencie o catálogo, estoque e descrições dos
                    achados.
                  </Text>
                  <View style={styles.adminActions}>
                    <PrimaryButton
                      label={admin ? 'Gerenciar produtos' : 'Usar como vendedor'}
                      onPress={() => {
                        setActiveRole('ADMIN');
                        router.replace(routes.home);
                      }}
                      variant="warm"
                    />
                    <SecondaryButton
                      label="Cadastrar novo produto"
                      onPress={() => {
                        setActiveRole('ADMIN');
                        router.push(routes.adminProductNew);
                      }}
                      variant="warm"
                    />
                  </View>
                </ProfilePaper>
              ) : null}

              {canBuy ? (
                <ProfilePaper
                  title="Área do comprador"
                  subtitle={buyer ? 'Perfil comprador ativo' : 'Ative para comprar'}
                  delay={80}
                  showStamp={false}
                  variant="warm">
                  <Text style={styles.helper}>
                    Explore achados, favorite produtos, use o carrinho e acompanhe suas compras com a
                    mesma conta.
                  </Text>
                  <SecondaryButton
                    label={buyer ? 'Continuar como comprador' : 'Usar como comprador'}
                    onPress={() => {
                      setActiveRole('BUYER');
                      router.push(routes.home);
                    }}
                    variant="warm"
                  />
                </ProfilePaper>
              ) : null}

              <ProfilePaper
                title="Sobre o Bugiganga"
                subtitle="Marketplace vintage"
                delay={120}
                showStamp={false}
                variant="warm">
                <Text style={styles.aboutText}>
                  Brechó digital para quem gosta de achados com história. Compre, favorite e acompanhe
                  seus pedidos em um só lugar.
                </Text>
                <View style={styles.aboutRow}>
                  <Text style={styles.aboutLabel}>Versão</Text>
                  <Text style={styles.aboutValue}>1.0.0</Text>
                </View>
                <Pressable
                  style={styles.supportLink}
                  onPress={() =>
                    snackbar.info('Em breve: central de ajuda e suporte ao cliente.')
                  }>
                  <MaterialIcons name="help-outline" size={18} color={loginGlass.goldLight} />
                  <Text style={styles.supportText}>Ajuda e suporte</Text>
                </Pressable>
              </ProfilePaper>

              <ProfilePaper
                title="Sessão"
                subtitle="Encerrar acesso neste dispositivo"
                delay={200}
                showStamp={false}
                variant="warm">
                <SecondaryButton
                  label="Sair da conta"
                  variant="warm"
                  onPress={() => {
                    confirmAction({
                      title: 'Confirmação de Saída',
                      message: 'Tem certeza de que deseja sair da sua conta?',
                      confirmLabel: 'Sair',
                      onConfirm: logout,
                    });
                  }}
                />
              </ProfilePaper>
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
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryChip: {
    flexGrow: 1,
    flexBasis: '30%',
    alignItems: 'center',
    backgroundColor: loginGlass.formFieldBg,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
    gap: 4,
  },
  summaryValue: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '800',
    color: loginGlass.goldLight,
    textAlign: 'center',
  },
  summaryLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: loginGlass.textMuted,
    fontWeight: '600',
  },
  menuList: {
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    backgroundColor: loginGlass.formFieldBg,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
  },
  menuItemPressed: {
    opacity: 0.88,
    backgroundColor: 'rgba(45, 30, 20, 0.72)',
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: loginGlass.shellBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    flex: 1,
  },
  menuLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: loginGlass.text,
  },
  menuHint: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: loginGlass.textMuted,
    marginTop: 2,
  },
  helper: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.textMuted,
    lineHeight: 20,
    marginBottom: 16,
  },
  adminActions: {
    gap: 10,
  },
  credentialsBox: {
    backgroundColor: loginGlass.formFieldBg,
    borderRadius: radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
  },
  credentialsTitle: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '800',
    color: loginGlass.goldMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  credentialsLine: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.text,
    lineHeight: 20,
  },
  aboutText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.textMuted,
    lineHeight: 20,
    marginBottom: 14,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: loginGlass.shellBorder,
    marginBottom: 10,
  },
  aboutLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.textMuted,
    fontWeight: '600',
  },
  aboutValue: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.text,
    fontWeight: '700',
  },
  supportLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  supportText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.goldLight,
    fontWeight: '700',
  },
});
