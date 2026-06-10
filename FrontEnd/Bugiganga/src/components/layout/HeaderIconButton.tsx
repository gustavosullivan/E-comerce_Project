import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, fontSizes, fonts, radius, shadows } from '@/src/theme';

type HeaderIconButtonProps = {
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  label?: string;
  badge?: number;
  variant?: 'primary' | 'surface';
};

export function HeaderIconButton({
  onPress,
  icon,
  label,
  badge = 0,
  variant = 'surface',
}: HeaderIconButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.hitArea, pressed && styles.pressed]}>
      <View style={[styles.button, isPrimary ? styles.primary : styles.surface]}>
        {label ? (
          <Text style={[styles.label, isPrimary && styles.labelPrimary]}>{label}</Text>
        ) : icon ? (
          <MaterialIcons
            name={icon}
            size={20}
            color={isPrimary ? colors.textInverse : colors.primary}
          />
        ) : null}
        {badge > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const BUTTON_SIZE = 44;

const styles = StyleSheet.create({
  hitArea: {
    padding: 4,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  primary: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  surface: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '800',
    color: colors.primary,
  },
  labelPrimary: {
    color: colors.textInverse,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.card,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textInverse,
  },
});
