import { type ReactNode } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { motion } from '@/src/theme';

type FadeInViewProps = {
  children: ReactNode;
  index?: number;
  delay?: number;
};

export function FadeInView({ children, index = 0, delay = motion.stagger }: FadeInViewProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * delay)
        .duration(motion.normal)
        .springify()
        .damping(motion.spring.damping)}>
      {children}
    </Animated.View>
  );
}
