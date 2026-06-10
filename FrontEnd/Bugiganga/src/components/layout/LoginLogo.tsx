import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSizes, fonts } from '@/src/theme';

const BRAND = 'BUGIGANGAS';
const TAGLINE = 'Descubra. Escolha. Leve histórias.';

type SparkleProps = {
  size: number;
  rotation?: string;
};

function Sparkle({ size, rotation = '0deg' }: SparkleProps) {
  return (
    <View style={{ transform: [{ rotate: rotation }] }}>
      <MaterialIcons name="auto-awesome" size={size} color={colors.primary} />
    </View>
  );
}

function BugigangasLogoMark() {
  return (
    <View style={styles.mark}>
      <MaterialCommunityIcons name="bottle-wine-outline" size={68} color={colors.text} />
      <MaterialCommunityIcons
        name="heart-outline"
        size={22}
        color={colors.text}
        style={styles.heart}
      />
    </View>
  );
}

export function LoginLogo() {
  return (
    <View style={styles.wrap} accessibilityRole="header">
      <View style={styles.iconRow}>
        <Sparkle size={22} rotation="-12deg" />
        <BugigangasLogoMark />
        <Sparkle size={22} rotation="8deg" />
      </View>

      <Text style={styles.brand}>{BRAND}</Text>
      <Text style={styles.tagline}>{TAGLINE}</Text>

      <View style={styles.bottomSparkle}>
        <Sparkle size={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 6,
  },
  mark: {
    width: 72,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    position: 'absolute',
    bottom: 16,
  },
  brand: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xxl + 8,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 2.5,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '500',
    color: colors.primary,
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 0.2,
  },
  bottomSparkle: {
    marginTop: 10,
  },
});
