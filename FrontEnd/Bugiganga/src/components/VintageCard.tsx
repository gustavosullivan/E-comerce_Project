import { type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { VintageColors } from '@/constants/theme';

export function VintageCard({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: VintageColors.cardBg,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: VintageColors.border,
    padding: 24,
    shadowColor: VintageColors.shadow,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
});
