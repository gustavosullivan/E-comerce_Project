import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { fontSizes, fonts, loginGlass, radius } from '@/src/theme';
import { colors } from '@/src/theme/colors';

type EmptyStateProps = {
  icon?: keyof typeof MaterialIcons.glyphMap;
  message: string;
  variant?: 'default' | 'warm';
};

export function EmptyState({ icon = 'inventory-2', message, variant = 'default' }: EmptyStateProps) {
  const warm = variant === 'warm';

  return (
    <View style={styles.wrap}>
      <View style={[styles.iconWrap, warm && styles.iconWrapWarm]}>
        <MaterialIcons
          name={icon}
          size={40}
          color={warm ? loginGlass.goldLight : colors.primary}
        />
      </View>
      <Text style={[styles.text, warm && styles.textWarm]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16 },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapWarm: {
    backgroundColor: loginGlass.cardGlass,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
  },
  text: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  textWarm: {
    color: loginGlass.textMuted,
  },
});
