import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/src/theme';

/** Marca visual vintage — sacola antiga em moldura ornamentada */
export function BrandLogoMark() {
  return (
    <View style={styles.outerRing}>
      <View style={styles.innerRing}>
        <View style={styles.core}>
          <MaterialIcons name="shopping-basket" size={30} color={colors.textInverse} />
        </View>
      </View>
      <View style={styles.cornerTL} />
      <View style={styles.cornerTR} />
      <View style={styles.cornerBL} />
      <View style={styles.cornerBR} />
    </View>
  );
}

const CORNER = {
  position: 'absolute' as const,
  width: 10,
  height: 10,
  borderColor: colors.accent,
};

const styles = StyleSheet.create({
  outerRing: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    backgroundColor: colors.primaryLight,
  },
  innerRing: {
    width: 58,
    height: 58,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerTL: { ...CORNER, top: 6, left: 6, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { ...CORNER, top: 6, right: 6, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { ...CORNER, bottom: 6, left: 6, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { ...CORNER, bottom: 6, right: 6, borderBottomWidth: 2, borderRightWidth: 2 },
});
