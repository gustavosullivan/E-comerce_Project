import { StyleSheet, Text, View } from 'react-native';

import { BrandLogoMark } from '@/src/components/layout/BrandLogoMark';
import { colors, fontSizes, fonts } from '@/src/theme';

type LogoHeaderProps = {
  tagline?: string;
};

export function LogoHeader({
  tagline = 'Seu marketplace de achados únicos',
}: LogoHeaderProps) {
  return (
    <View style={styles.wrap}>
      <BrandLogoMark />
      <Text style={styles.brand}>Bugiganga</Text>
      <Text style={styles.tagline}>{tagline}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: 28 },
  brand: {
    fontFamily: fonts.gothic,
    fontSize: fontSizes.xxl + 6,
    color: colors.text,
    letterSpacing: 1,
    textTransform: 'none',
  },
  tagline: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
});
