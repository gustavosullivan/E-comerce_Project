import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { colors, fontSizes, fonts, motion, radius } from '@/src/theme';
import { layout } from '@/src/theme/layout';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  centered?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ScreenHeader({
  title,
  subtitle,
  icon,
  centered = false,
  style,
}: ScreenHeaderProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(motion.normal).springify()}
      style={[styles.wrap, centered && styles.centered, style]}>
      {icon ? (
        <View style={styles.iconBadge}>
          <MaterialIcons name={icon} size={18} color={colors.primary} />
        </View>
      ) : null}
      <Text style={[styles.title, centered && styles.textCenter]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, centered && styles.textCenter]}>{subtitle}</Text>
      ) : null}
      <View style={[styles.rule, centered && styles.ruleCentered]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    paddingTop: layout.sm,
    paddingBottom: layout.md,
    gap: 6,
  },
  centered: {
    alignItems: 'center',
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(91, 95, 239, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.gothic,
    fontSize: fontSizes.xl + 2,
    color: colors.text,
    lineHeight: 30,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
    maxWidth: 320,
  },
  textCenter: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  rule: {
    marginTop: 8,
    height: 2,
    width: 56,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    opacity: 0.75,
  },
  ruleCentered: {
    alignSelf: 'center',
  },
});
