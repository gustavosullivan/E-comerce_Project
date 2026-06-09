import { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors, radii } from '@/src/theme';

type SkeletonBlockProps = {
  width?: number | `${number}%`;
  height: number;
  style?: ViewStyle;
  rounded?: boolean;
};

export function SkeletonBlock({ width = '100%', height, style, rounded }: SkeletonBlockProps) {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.95, { duration: 900 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, borderRadius: rounded ? radii.full : radii.sm },
        style,
        animatedStyle,
      ]}
    />
  );
}

export function ProductGridSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: 8 }).map((_, i) => (
        <View key={i} style={styles.cell}>
          <SkeletonBlock height={72} />
          <SkeletonBlock height={10} style={styles.gap} />
          <SkeletonBlock height={10} width="60%" />
          <SkeletonBlock height={22} style={styles.gap} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.shimmer,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 8,
  },
  cell: {
    width: '23%',
    gap: 4,
  },
  gap: {
    marginTop: 6,
  },
});
