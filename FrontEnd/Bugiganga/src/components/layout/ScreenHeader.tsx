import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fontSizes, fonts } from '@/src/theme';
import { layout } from '@/src/theme/layout';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  centered?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ScreenHeader({
  title,
  subtitle,
  centered = true,
  style,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.wrap, centered && styles.centered, style]}>
      <Text style={[styles.title, centered && styles.textCenter]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, centered && styles.textCenter]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    paddingTop: layout.sm,
    paddingBottom: layout.md,
  },
  centered: {
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
    marginTop: 4,
  },
  textCenter: {
    textAlign: 'center',
  },
});
