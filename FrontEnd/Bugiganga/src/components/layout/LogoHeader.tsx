import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { colors, textStyles } from '@/src/theme';

type LogoHeaderProps = {
  tagline?: string;
};

export function LogoHeader({
  tagline = 'Encontre tesouros escondidos',
}: LogoHeaderProps) {
  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.wrap}>
      <View style={styles.ornament}>
        <View style={styles.line} />
        <Text style={styles.diamond}>◆</Text>
        <View style={styles.line} />
      </View>
      <Animated.Text entering={FadeInDown.delay(120).duration(400)} style={textStyles.brand}>
        BUGIGANGA
      </Animated.Text>
      <Text style={styles.tagline}>{tagline}</Text>
      <View style={styles.ornament}>
        <View style={styles.line} />
        <Text style={styles.diamond}>◆</Text>
        <View style={styles.line} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: 28, marginTop: 8 },
  ornament: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  line: { width: 56, height: 1, backgroundColor: colors.border },
  diamond: { fontSize: 8, color: colors.secondary },
  tagline: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
});
