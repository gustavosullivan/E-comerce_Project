import { type PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cardStyles, textStyles } from '@/src/theme';

type VintageCardProps = PropsWithChildren<{
  title?: string;
}>;

export function VintageCard({ children, title }: VintageCardProps) {
  return (
    <View style={styles.card}>
      {title ? <Text style={[textStyles.sectionTitle, styles.title]}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardStyles.vintage,
    marginBottom: 14,
  },
  title: {
    marginBottom: 14,
  },
});
