import { type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, shadows } from '@/src/theme';

export function VintageCard({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 24,
    ...shadows.md,
  },
});
