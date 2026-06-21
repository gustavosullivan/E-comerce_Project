import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { type PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { HeaderCartButton, HeaderProfileChip, HeaderSettingsButton } from '@/src/components/layout/HeaderCartButton';
import { WarmGlassSurface } from '@/src/components/layout/WarmGlassSurface';
import { routes } from '@/src/navigation/routes';
import { useCartStore } from '@/src/store/cartStore';
import { useAuthStore } from '@/src/store/authStore';
import { fontSizes, fonts, loginGlass, motion, radius } from '@/src/theme';
import { layout } from '@/src/theme/layout';

type HomeHeaderProps = {
  userName: string;
  isAdmin?: boolean;
};

type HomeHeroProps = HomeHeaderProps & {
  productCount?: number;
  favoriteCount?: number;
};

/** Altura reservada para a toolbar fixa no topo da Home */
export const HOME_STICKY_TOOLBAR_HEIGHT = 64;

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

function GlassPanel({ children }: PropsWithChildren) {
  return (
    <WarmGlassSurface level="shell" style={styles.glassShell} contentStyle={styles.glassContent}>
      {children}
    </WarmGlassSurface>
  );
}

export function HeaderAddProductButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        pressed && styles.iconButtonPressed,
      ]}>
      <MaterialIcons name="add-box" size={24} color={loginGlass.goldLight} />
    </Pressable>
  );
}

export function HomeToolbar({ userName, isAdmin }: HomeHeaderProps) {
  const initials = getInitials(userName);
  const avatarUri = useAuthStore((s) => s.avatarUri);
  const cartCount = useCartStore((s) => s.getItemCount());

  return (
    <GlassPanel>
      <View style={styles.toolbar}>
        <HeaderProfileChip
          name={userName}
          initials={initials}
          imageUri={avatarUri}
          onPress={() => router.push('/(tabs)/profile')}
          tone="warm"
        />
        <View style={styles.toolbarActions}>
          <HeaderSettingsButton onPress={() => router.push(routes.settings)} tone="warm" />
          {isAdmin ? (
            <HeaderAddProductButton onPress={() => router.push('/(tabs)/novo')} />
          ) : (
            <HeaderCartButton
              count={cartCount}
              onPress={() => router.push('/(tabs)/cart')}
              tone="warm"
            />
          )}
        </View>
      </View>
    </GlassPanel>
  );
}

export function HomeHero({ userName, productCount = 0, favoriteCount = 0 }: HomeHeroProps) {
  const firstName = userName.split(' ')[0] ?? 'Visitante';

  return (
    <View style={styles.hero}>
      <Animated.View entering={FadeInDown.duration(motion.normal).springify()}>
        <Text style={styles.greeting}>
          {getGreeting()}, <Text style={styles.greetingName}>{firstName}</Text>
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(60).duration(motion.normal).springify()}>
        <Text style={styles.headline}>Encontre peças com história</Text>
        <Text style={styles.subtitle}>
          Um mercado vintage feito para quem gosta de descobrir tesouros escondidos.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(120).duration(motion.normal).springify()}
        style={styles.statsRow}>
        <View style={styles.statChip}>
          <MaterialIcons name="inventory-2" size={14} color={loginGlass.goldLight} />
          <Text style={styles.statText}>{productCount} achados</Text>
        </View>
        <View style={styles.statChip}>
          <MaterialIcons name="favorite" size={14} color={loginGlass.gold} />
          <Text style={styles.statText}>{favoriteCount} favoritos</Text>
        </View>
      </Animated.View>
    </View>
  );
}

/** @deprecated Use HomeToolbar + HomeHero separadamente */
export function HomeHeader({ userName }: HomeHeaderProps) {
  return (
    <View style={styles.legacyContainer}>
      <HomeToolbar userName={userName} />
      <HomeHero userName={userName} />
    </View>
  );
}

const styles = StyleSheet.create({
  legacyContainer: {
    paddingTop: layout.md,
    marginBottom: layout.md,
  },
  glassShell: {
    borderRadius: radius.lg,
    shadowColor: loginGlass.gold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
  glassContent: {
    zIndex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 8,
  },
  toolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: loginGlass.inputBg,
    borderWidth: 1,
    borderColor: loginGlass.shellBorder,
  },
  iconButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  hero: {
    alignItems: 'flex-start',
    paddingTop: layout.lg,
    paddingBottom: layout.sm,
    gap: 10,
  },
  greeting: {
    fontSize: fontSizes.sm,
    color: loginGlass.textMuted,
    fontWeight: '500',
  },
  greetingName: {
    color: loginGlass.goldLight,
    fontWeight: '700',
  },
  headline: {
    fontFamily: fonts.gothic,
    fontSize: fontSizes.xl + 4,
    color: loginGlass.text,
    lineHeight: 32,
    maxWidth: 320,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: loginGlass.textMuted,
    lineHeight: 20,
    marginTop: 6,
    maxWidth: 340,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: loginGlass.chipActiveBg,
    borderWidth: 1,
    borderColor: loginGlass.chipActiveBorder,
  },
  statText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: loginGlass.cream,
  },
});
