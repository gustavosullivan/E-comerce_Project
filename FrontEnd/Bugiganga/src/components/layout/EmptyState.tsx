import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, fonts } from '@/src/theme';

type EmptyStateProps = {
  icon?: keyof typeof MaterialIcons.glyphMap;
  message: string;
};

export function EmptyState({ icon = 'inventory-2', message }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <MaterialIcons name={icon} size={64} color={colors.secondary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16 },
  text: {
    fontFamily: fonts.serif,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
});
