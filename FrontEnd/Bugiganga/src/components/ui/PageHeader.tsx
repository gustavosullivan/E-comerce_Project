import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, textStyles } from '@/src/theme';

type PageHeaderProps = {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
};

export function PageHeader({ title, onBack, right }: PageHeaderProps) {
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable style={styles.back} onPress={onBack} hitSlop={10}>
          <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
      ) : (
        <View style={styles.side} />
      )}
      <Text style={[textStyles.pageTitle, styles.title]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 40,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 80,
  },
  backText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
  side: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
});
