import { router } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ProfilePaper, ProfilePaperDivider } from '@/src/components/layout/ProfilePaper';
import { ProfileAvatarPicker } from '@/src/components/profile/ProfileAvatarPicker';
import { MenuListItem } from '@/src/components/ui/MenuListItem';
import { ScreenContainer } from '@/src/components/ui/ScreenContainer';
import { useAuth } from '@/src/hooks/useAuth';
import { routes } from '@/src/navigation/routes';
import { useCartStore } from '@/src/store/cartStore';
import { useFavoritesStore } from '@/src/store/favoritesStore';
import { colors, fonts, textStyles } from '@/src/theme';

const MENU = [
  { label: 'Minha Conta', icon: 'person-outline' as const, action: 'account' as const },
  { label: 'Configurações', icon: 'settings' as const, action: 'settings' as const },
  { label: 'Histórico de Compras', icon: 'receipt-long' as const, action: 'orders' as const },
  { label: 'Favoritos', icon: 'favorite-border' as const, route: routes.favorites },
];

function StatChip({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.statChip}>
      <MaterialIcons name={icon} size={18} color={colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const cartCount = useCartStore((s) => s.getItemCount());
  const favCount = useFavoritesStore((s) => s.items.length);

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <Text style={textStyles.pageTitle}>Conta</Text>

      <ProfilePaper
        title={user?.name ?? 'Visitante'}
        subtitle={user?.email ?? ''}
        delay={60}>
        <View style={styles.avatarSection}>
          <ProfileAvatarPicker size="lg" />
        </View>

        <View style={styles.memberRow}>
          <MaterialIcons name="verified" size={16} color={colors.success} />
          <Text style={styles.memberText}>Membro Bugiganga</Text>
        </View>

        <ProfilePaperDivider label="Resumo" />

        <View style={styles.statsRow}>
          <StatChip icon="favorite" label="Favoritos" value={favCount} />
          <StatChip icon="shopping-cart" label="Carrinho" value={cartCount} />
        </View>
      </ProfilePaper>

      <Text style={[textStyles.caption, styles.menuCaption]}>Menu</Text>
      {MENU.map((item, index) => (
        <Animated.View key={item.label} entering={FadeInDown.delay(160 + index * 50).duration(350)}>
          <MenuListItem
            label={item.label}
            icon={item.icon}
            onPress={() => {
              if ('route' in item && item.route) {
                router.push(item.route);
                return;
              }
              if (item.action === 'account') {
                router.push(routes.account);
                return;
              }
              Alert.alert(item.label, 'Em breve');
            }}
          />
        </Animated.View>
      ))}

      <MenuListItem label="Sair" icon="logout" onPress={logout} danger />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8 },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 4,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  memberText: {
    fontFamily: fonts.serif,
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statChip: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.card,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  statValue: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    lineHeight: 26,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  menuCaption: { marginBottom: 8, marginTop: 4 },
});
