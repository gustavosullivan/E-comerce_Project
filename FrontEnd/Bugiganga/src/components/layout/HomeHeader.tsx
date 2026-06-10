import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { HeaderIconButton } from '@/src/components/layout/HeaderIconButton';
import { useCartStore } from '@/src/store/cartStore';
import { colors, fontSizes, fonts, radius, shadows } from '@/src/theme';
import { layout } from '@/src/theme/layout';

type HomeHeaderProps = {
  userName: string;
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function HomeHeader({ userName }: HomeHeaderProps) {
  const firstName = userName.split(' ')[0] ?? 'Visitante';
  const initials = getInitials(userName);
  const cartCount = useCartStore((s) => s.items.length);

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <HeaderIconButton
          variant="primary"
          label={initials}
          onPress={() => router.push('/(tabs)/profile')}
        />

        <View style={styles.brandWrap}>
          <Text style={styles.brand}>Bugiganga</Text>
        </View>

        <HeaderIconButton
          icon="shopping-bag"
          badge={cartCount}
          onPress={() => router.push('/(tabs)/cart')}
        />
      </View>

      <View style={styles.hero}>
        <Text style={styles.greeting}>
          {getGreeting()}, <Text style={styles.greetingName}>{firstName}</Text>
        </Text>
        <Text style={styles.title}>Descubra achados incríveis</Text>
        <Text style={styles.subtitle}>Produtos selecionados para você</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: layout.md,
    marginBottom: layout.md,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: layout.sm,
    paddingHorizontal: layout.sm,
    marginBottom: layout.lg,
    ...shadows.md,
  },
  brandWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: layout.sm,
  },
  brand: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: layout.sm,
    paddingTop: layout.xs,
  },
  greeting: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 6,
  },
  greetingName: {
    color: colors.primary,
    fontWeight: '700',
  },
  title: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
});
