import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { Badge } from '@/src/components/ui/Badge';
import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { useAuthStore } from '@/src/stores/authStore';
import { useCartStore } from '@/src/store/cartStore';
import { fonts, radii, textStyles, colors, shadow } from '@/src/theme';

type HomeHeaderProps = {
  userName: string;
};

export function HomeHeader({ userName }: HomeHeaderProps) {
  const avatarUri = useAuthStore((s) => s.avatarUri);
  const cartCount = useCartStore((s) => s.getItemCount());

  return (
    <Animated.View entering={FadeInRight.duration(400)} style={styles.wrap}>
      <ScalePressable
        style={styles.avatarWrap}
        onPress={() => router.push('/(tabs)/profile')}
        accessibilityRole="button">
        <View style={styles.avatar}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImg} contentFit="cover" />
          ) : (
            <MaterialIcons name="person" size={20} color={colors.white} />
          )}
        </View>
        <View>
          <Text style={styles.greeting}>Olá,</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {userName.split(' ')[0]}
          </Text>
        </View>
      </ScalePressable>

      <View style={styles.logoBlock}>
        <Text style={textStyles.brandSm}>BUGIGANGA</Text>
        <View style={styles.logoLine} />
      </View>

      <ScalePressable
        style={styles.cartBtn}
        onPress={() => router.push('/(tabs)/cart')}
        accessibilityRole="button">
        <MaterialIcons name="shopping-cart" size={22} color={colors.primary} />
        <Badge count={cartCount} size="md" />
      </ScalePressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 14,
  },
  avatarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '34%',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  greeting: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userName: { fontSize: 13, fontWeight: '800', color: colors.text, flexShrink: 1 },
  logoBlock: { alignItems: 'center', flex: 1 },
  logoLine: {
    width: 52,
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 5,
    borderRadius: radii.full,
    opacity: 0.55,
  },
  cartBtn: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.full,
    backgroundColor: colors.card,
    ...shadow.card,
  },
});
