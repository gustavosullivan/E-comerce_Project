import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/src/theme';

type LogoHeaderProps = {
  tagline?: string;
};

export function LogoHeader({
  tagline = 'Encontre tesouros escondidos',
}: LogoHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.line} />
      <Text style={styles.brand}>BUGIGANGA</Text>
      <Text style={styles.tagline}>{tagline}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: 24 },
  line: { width: 140, height: 1, backgroundColor: colors.border, marginVertical: 12 },
  brand: {
    fontFamily: fonts.serif,
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 4,
  },
  tagline: {
    fontFamily: fonts.serif,
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 12,
  },
});
