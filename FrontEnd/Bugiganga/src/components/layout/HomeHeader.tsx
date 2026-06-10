import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { type PropsWithChildren } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { HeaderCartButton, HeaderProfileChip } from '@/src/components/layout/HeaderCartButton';
import { useCartStore } from '@/src/store/cartStore';
import { useAuthStore } from '@/src/stores/authStore';
import { colors, fontSizes, fonts, motion, radius, shadows } from '@/src/theme';
import { layout } from '@/src/theme/layout';

type HomeHeaderProps = {
  userName: string;
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
    <View style={styles.glassShell}>
      {Platform.OS === 'web' ? (
        <View style={styles.webGlassFill} />
      ) : (
        <BlurView
          intensity={Platform.OS === 'android' ? 32 : 44}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.glassTint} />
      <View style={styles.glassSheen} />
      <View style={styles.glassContent}>{children}</View>
    </View>
  );
}

export function HomeToolbar({ userName }: HomeHeaderProps) {
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
        />
        <HeaderCartButton
          count={cartCount}
          onPress={() => router.push('/(tabs)/cart')}
        />
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
          <MaterialIcons name="inventory-2" size={14} color={colors.tabBarActive} />
          <Text style={styles.statText}>{productCount} achados</Text>
        </View>
        <View style={styles.statChip}>
          <MaterialIcons name="favorite" size={14} color={colors.accent} />
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
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.tabBarGlass,
    ...shadows.md,
  },
  webGlassFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.tabBarGlass,
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 10, 20, 0.34)',
  },
  glassSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.glassHighlight,
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
  hero: {
    alignItems: 'flex-start',
    paddingTop: layout.lg,
    paddingBottom: layout.sm,
    gap: 10,
  },
  greeting: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    fontWeight: '500',
  },
  greetingName: {
    color: colors.primary,
    fontWeight: '700',
  },
  headline: {
    fontFamily: fonts.gothic,
    fontSize: fontSizes.xl + 2,
    color: colors.text,
    lineHeight: 30,
    maxWidth: 320,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
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
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(91, 95, 239, 0.18)',
  },
  statText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
