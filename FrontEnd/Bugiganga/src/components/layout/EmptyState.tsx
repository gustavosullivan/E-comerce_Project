import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { colors, textStyles } from '@/src/theme';

type EmptyStateProps = {
  icon?: keyof typeof MaterialIcons.glyphMap;
  message: string;
  title?: string;
};

export function EmptyState({ icon = 'inventory-2', message, title }: EmptyStateProps) {
  return (
    <Animated.View entering={FadeInUp.duration(400).springify()} style={styles.wrap}>
      <View style={styles.iconRing}>
        <MaterialIcons name={icon} size={48} color={colors.secondary} />
      </View>
      {title ? <Text style={textStyles.sectionTitle}>{title}</Text> : null}
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  iconRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  text: {
    ...textStyles.bodyMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
});
