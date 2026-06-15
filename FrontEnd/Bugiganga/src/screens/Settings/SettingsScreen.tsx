import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { Redirect, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/src/components/buttons/SecondaryButton';
import { ProfilePaper } from '@/src/components/layout/ProfilePaper';
import { ScreenContainer } from '@/src/components/ui/ScreenContainer';
import {
  DEV_BUYER_CREDENTIALS,
  DEV_SELLER_CREDENTIALS,
} from '@/src/config/devCredentials';
import { useAuth } from '@/src/hooks/useAuth';
import { useWallet } from '@/src/hooks/useWallet';
import { routes } from '@/src/navigation/routes';
import { orderService } from '@/src/services/orderService';
import { productService } from '@/src/services/productService';
import { useCartStore } from '@/src/store/cartStore';
import { useFavoritesStore } from '@/src/store/favoritesStore';
import { useOrderHistoryStore } from '@/src/store/orderHistoryStore';
import { snackbar } from '@/src/store/snackbarStore';
import { useAuthStore } from '@/src/store/authStore';
import { colors, fontSizes, fonts, textStyles } from '@/src/theme';
import { isBuyer, isAdmin } from '@/src/types/auth';
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
        <MaterialIcons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.menuTextWrap}>
        <Text style={styles.menuLabel}>{label}</Text>
        {hint ? <Text style={styles.menuHint}>{hint}</Text> : null}
      </View>
      <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
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
      <MaterialIcons name={icon} size={16} color={colors.primary} />
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
  const admin = isAdmin(user);
  const buyer = isBuyer(user);
  const cartCount = useCartStore((s) => s.getItemCount());
  const favoriteCount = useFavoritesStore((s) => s.items.length);
  const orderCount = useOrderHistoryStore((s) =>
    user?.id ? s.orders.filter((o) => o.userId === user.id).length : 0,
  );
  const { balance } = useWallet(user?.id, buyer);
  const [productCount, setProductCount] = useState(0);
  const [salesTotal, setSalesTotal] = useState(0);

  useEffect(() => {
    if (!admin || !user?.id) return;

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
  }, [admin, user?.id]);

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

  if (buyer) {
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

  if (admin) {
    shortcutItems.push(
      {
        icon: 'storefront',
        label: 'Painel do vendedor',
        hint: 'Gerenciar catálogo',
        onPress: () => router.replace(routes.home),
      },
      {
        icon: 'add-box',
        label: 'Cadastrar produto',
        hint: 'Novo achado à venda',
        onPress: () => router.push(routes.adminProductNew),
      },
    );
  }

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        <Text style={styles.backText}>Voltar</Text>
      </Pressable>

      <Text style={[textStyles.pageTitle, styles.pageTitle]}>Configurações</Text>
      <Text style={styles.subtitle}>Atalhos e preferências da sessão</Text>

      <ProfilePaper title="Resumo" subtitle="Sua atividade no marketplace" delay={0} showStamp={false}>
        <View style={styles.summaryRow}>
          {buyer ? (
            <>
              <SummaryChip icon="favorite" value={favoriteCount} label="Favoritos" />
              <SummaryChip icon="shopping-bag" value={cartCount} label="Carrinho" />
              <SummaryChip
                icon="account-balance-wallet"
                value={formatCurrency(balance)}
                label="Saldo"
              />
            </>
          ) : (
            <>
              <SummaryChip icon="inventory-2" value={productCount} label="Produtos" />
              <SummaryChip
                icon="storefront"
                value={formatCurrency(salesTotal)}
                label="Vendas"
              />
            </>
          )}
        </View>
      </ProfilePaper>

      <ProfilePaper title="Atalhos" subtitle="Acesso rápido às áreas do app" delay={40} showStamp={false}>
        <View style={styles.menuList}>
          {shortcutItems.map((item) => (
            <SettingsMenuItem key={item.label} {...item} />
          ))}
        </View>
      </ProfilePaper>

      {admin ? (
        <ProfilePaper
          title="Área do vendedor"
          subtitle="Cadastre produtos, legendas e preços"
          delay={80}
          showStamp={false}>
          <Text style={styles.helper}>
            Esta conta vende no marketplace. Gerencie o catálogo, estoque e descrições dos
            achados.
          </Text>
          <View style={styles.adminActions}>
            <PrimaryButton label="Gerenciar produtos" onPress={() => router.replace('/(tabs)/')} />
            <SecondaryButton
              label="Cadastrar novo produto"
              onPress={() => router.push(routes.adminProductNew)}
            />
          </View>
        </ProfilePaper>
      ) : (
        <ProfilePaper
          title="Área do comprador"
          subtitle="Você compra e explora achados"
          delay={80}
          showStamp={false}>
          <Text style={styles.helper}>
            Esta conta é de quem compra. Para cadastrar produtos à venda, saia e entre com a
            conta de vendedor.
          </Text>
          <View style={styles.credentialsBox}>
            <Text style={styles.credentialsTitle}>Conta vendedor (demo)</Text>
            <Text style={styles.credentialsLine}>{DEV_SELLER_CREDENTIALS.email}</Text>
            <Text style={styles.credentialsLine}>Senha: {DEV_SELLER_CREDENTIALS.password}</Text>
          </View>
        </ProfilePaper>
      )}

      <ProfilePaper title="Sobre o Bugiganga" subtitle="Marketplace vintage" delay={120} showStamp={false}>
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
          <MaterialIcons name="help-outline" size={18} color={colors.primary} />
          <Text style={styles.supportText}>Ajuda e suporte</Text>
        </Pressable>
      </ProfilePaper>

      {admin ? (
        <ProfilePaper title="Trocar de conta" subtitle="Entrar como comprador" delay={160} showStamp={false}>
          <Text style={styles.helper}>
            Para comprar como cliente, saia e use a conta comprador.
          </Text>
          <View style={styles.credentialsBox}>
            <Text style={styles.credentialsTitle}>Conta comprador (demo)</Text>
            <Text style={styles.credentialsLine}>{DEV_BUYER_CREDENTIALS.email}</Text>
            <Text style={styles.credentialsLine}>Senha: {DEV_BUYER_CREDENTIALS.password}</Text>
          </View>
        </ProfilePaper>
      ) : null}

      <ProfilePaper title="Sessão" subtitle="Encerrar acesso neste dispositivo" delay={200} showStamp={false}>
        <SecondaryButton
          label="Sair da conta"
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
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryChip: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(91, 95, 239, 0.16)',
    gap: 4,
  },
  summaryValue: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
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
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItemPressed: {
    opacity: 0.85,
    backgroundColor: colors.primaryLight,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    flex: 1,
  },
  menuLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
  },
  menuHint: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  helper: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 16,
  },
  adminActions: {
    gap: 10,
  },
  credentialsBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(91, 95, 239, 0.18)',
  },
  credentialsTitle: {
    fontSize: fontSizes.xs,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  credentialsLine: {
    fontSize: fontSizes.sm,
    color: colors.text,
    lineHeight: 20,
  },
  aboutText: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 14,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 10,
  },
  aboutLabel: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    fontWeight: '600',
  },
  aboutValue: {
    fontSize: fontSizes.sm,
    color: colors.text,
    fontWeight: '700',
  },
  supportLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  supportText: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: '700',
  },
});
