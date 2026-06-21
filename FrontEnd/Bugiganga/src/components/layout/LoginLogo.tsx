import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { fontSizes, fonts } from '@/src/theme';
import { loginGlass } from '@/src/theme/loginGlass';

const BRAND = 'BUGIGANGAS';
const TAGLINE = 'Descubra. Escolha. Leve histórias.';

type SparkleProps = {
  size: number;
  rotation?: string;
};

function Sparkle({ size, rotation = '0deg' }: SparkleProps) {
  return (
    <View style={{ transform: [{ rotate: rotation }] }}>
      <MaterialIcons name="auto-awesome" size={size} color={loginGlass.gold} />
    </View>
  );
}

function BugigangasLogoMark() {
  return (
    <View style={styles.mark}>
      <MaterialCommunityIcons name="bottle-wine-outline" size={68} color={loginGlass.gold} />
      <MaterialCommunityIcons
        name="heart-outline"
        size={22}
        color={loginGlass.gold}
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
    fontSize: fontSizes.xxl + 6,
    fontWeight: '900',
    color: loginGlass.text,
    letterSpacing: 2.5,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: fonts.gothic,
    fontSize: fontSizes.md,
    fontWeight: '400',
    color: loginGlass.cream,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.3,
    lineHeight: 22,
  },
  bottomSparkle: {
    marginTop: 12,
  },
});
