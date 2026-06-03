import { type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/src/theme';

export function VintageCard({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 20,
  },
});
