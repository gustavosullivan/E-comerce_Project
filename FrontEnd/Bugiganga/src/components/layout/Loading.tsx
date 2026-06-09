import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { colors, fonts } from '@/src/theme';

type LoadingProps = {
  label?: string;
};

export function Loading({ label }: LoadingProps) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.wrap}>
      <View style={styles.ring}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
      {label ? <Animated.Text style={styles.label}>{label}</Animated.Text> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14 },
  ring: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.serif,
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
});
