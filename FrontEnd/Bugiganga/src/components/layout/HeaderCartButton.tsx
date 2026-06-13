import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { colors, fontSizes, fonts, motion, radius } from '@/src/theme';

const BUTTON_SIZE = 44;

type HeaderCartButtonProps = {
  count: number;
  onPress: () => void;
};

export function HeaderCartButton({ count, onPress }: HeaderCartButtonProps) {
  const scale = useSharedValue(1);
  const badgeScale = useSharedValue(count > 0 ? 1 : 0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (count > 0) {
      badgeScale.value = withSpring(1, motion.spring);
      scale.value = withSequence(
        withSpring(1.12, { damping: 8, stiffness: 320 }),
        withSpring(1, motion.spring),
      );
      rotate.value = withSequence(
        withSpring(-8, { damping: 10, stiffness: 280 }),
        withSpring(8, { damping: 10, stiffness: 280 }),
        withSpring(0, motion.spring),
      );
    } else {
      badgeScale.value = withSpring(0, motion.spring);
    }
  }, [count, scale, badgeScale, rotate]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeScale.value,
  }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Carrinho"
      style={({ pressed }) => [styles.hitArea, pressed && styles.pressed]}>
      <Animated.View style={[styles.button, buttonStyle]}>
        <MaterialIcons name="shopping-bag" size={22} color={colors.glassText} />
        {count > 0 ? (
          <Animated.View style={[styles.badge, badgeStyle]}>
            <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
          </Animated.View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

type HeaderSettingsButtonProps = {
  onPress: () => void;
};

export function HeaderSettingsButton({ onPress }: HeaderSettingsButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Configurações"
      style={({ pressed }) => [styles.hitArea, pressed && styles.pressed]}>
      <View style={styles.button}>
        <MaterialIcons name="settings" size={22} color={colors.glassText} />
      </View>
    </Pressable>
  );
}

type HeaderProfileChipProps = {
  name: string;
  initials: string;
  imageUri?: string | null;
  onPress: () => void;
};

export function HeaderProfileChip({
  name,
  initials,
  imageUri,
  onPress,
}: HeaderProfileChipProps) {
  const displayName = name.trim() || 'Visitante';
  const firstName = displayName.split(' ')[0] ?? displayName;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.profileChip, pressed && styles.pressed]}>
      <View style={styles.avatarWrap}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatarImage} contentFit="cover" />
        ) : (
          <Text style={styles.avatarInitials}>{initials}</Text>
        )}
      </View>
      <View style={styles.nameWrap}>
        <Text style={styles.userName} numberOfLines={1}>
          {firstName}
        </Text>
        {displayName !== firstName ? (
          <Text style={styles.userFullName} numberOfLines={1}>
            {displayName}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    padding: 4,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: colors.glassImageBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: colors.tabBarGlass,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
  },
  profileChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
    paddingRight: 8,
  },
  avatarWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '800',
    color: colors.textInverse,
  },
  nameWrap: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    fontWeight: '800',
    color: colors.glassText,
    letterSpacing: -0.2,
  },
  userFullName: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: colors.glassMuted,
    marginTop: 1,
  },
});
