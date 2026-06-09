import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { colors, fonts, motion } from '@/src/theme';
import { formatCurrency } from '@/src/utils/formatCurrency';

type AnimatedPriceProps = {
  value: number;
  size?: 'md' | 'lg';
};

export function AnimatedPrice({ value, size = 'md' }: AnimatedPriceProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.12, { ...motion.spring, stiffness: 260 }),
      withSpring(1, motion.spring),
    );
    opacity.value = withSequence(withSpring(0.7), withSpring(1));
  }, [value, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[size === 'lg' ? styles.lg : styles.md, animatedStyle]}>
      {formatCurrency(value)}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  md: {
    fontFamily: fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 22,
  },
  lg: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
});
