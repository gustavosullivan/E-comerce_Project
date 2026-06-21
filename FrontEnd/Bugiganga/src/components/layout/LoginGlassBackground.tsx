import { useEffect } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { loginGlass } from '@/src/theme/loginGlass';

type AnimatedBokehBlobProps = {
  color: string;
  size: number;
  style: ViewStyle;
  driftX?: number;
  driftY?: number;
  durationX?: number;
  durationY?: number;
  minOpacity?: number;
  maxOpacity?: number;
};

function AnimatedBokehBlob({
  color,
  size,
  style,
  driftX = 28,
  driftY = -22,
  durationX = 9000,
  durationY = 12000,
  minOpacity = 0.32,
  maxOpacity = 0.72,
}: AnimatedBokehBlobProps) {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    offsetX.value = withRepeat(
      withTiming(driftX, { duration: durationX, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    offsetY.value = withRepeat(
      withTiming(driftY, { duration: durationY, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    pulse.value = withRepeat(
      withTiming(1, { duration: durationX * 1.4, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [driftX, driftY, durationX, durationY, offsetX, offsetY, pulse]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = 1 + pulse.value * 0.12;
    const opacity = minOpacity + pulse.value * (maxOpacity - minOpacity);

    return {
      opacity,
      transform: [
        { translateX: offsetX.value },
        { translateY: offsetY.value },
        { scale },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.blob,
        { width: size, height: size, backgroundColor: color },
        style,
        animatedStyle,
      ]}
    />
  );
}

function AnimatedGradientWash() {
  const shift = useSharedValue(0);

  useEffect(() => {
    shift.value = withRepeat(
      withTiming(1, { duration: 16000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [shift]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.22 + shift.value * 0.18,
    transform: [
      { translateX: -40 + shift.value * 80 },
      { translateY: 20 - shift.value * 40 },
      { scale: 1.1 + shift.value * 0.15 },
    ],
  }));

  return (
    <Animated.View style={[styles.gradientWash, animatedStyle]} pointerEvents="none" />
  );
}

export function LoginGlassBackground() {
  return (
    <View style={styles.root} pointerEvents="none">
      <View style={styles.base} />
      <AnimatedGradientWash />
      <AnimatedBokehBlob
        color={loginGlass.bokeh1}
        size={300}
        style={styles.bokehTopLeft}
        driftX={36}
        driftY={-28}
        durationX={10000}
        durationY={14000}
      />
      <AnimatedBokehBlob
        color={loginGlass.bokeh2}
        size={240}
        style={styles.bokehTopRight}
        driftX={-32}
        driftY={24}
        durationX={12000}
        durationY={9000}
      />
      <AnimatedBokehBlob
        color={loginGlass.bokeh3}
        size={360}
        style={styles.bokehCenter}
        driftX={42}
        driftY={-34}
        durationX={15000}
        durationY={11000}
        minOpacity={0.24}
        maxOpacity={0.58}
      />
      <AnimatedBokehBlob
        color={loginGlass.bokeh4}
        size={220}
        style={styles.bokehBottom}
        driftX={-26}
        driftY={30}
        durationX={11000}
        durationY={13000}
      />
      <AnimatedBokehBlob
        color={loginGlass.bokeh1}
        size={180}
        style={styles.bokehMidRight}
        driftX={-20}
        driftY={-18}
        durationX={8000}
        durationY={10000}
        minOpacity={0.2}
        maxOpacity={0.5}
      />
      <View style={styles.vignette} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: loginGlass.background,
    ...(Platform.OS === 'web'
      ? {
          backgroundImage:
            'linear-gradient(165deg, #2F2118 0%, #4A3428 28%, #6B4C35 52%, #8B6F4E 78%, #B8956A 100%)',
        }
      : {}),
  },
  gradientWash: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 999,
    top: '28%',
    left: '10%',
    backgroundColor: 'rgba(234, 179, 8, 0.22)',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  bokehTopLeft: {
    top: -90,
    left: -70,
  },
  bokehTopRight: {
    top: 30,
    right: -80,
  },
  bokehCenter: {
    top: 240,
    left: '12%',
  },
  bokehBottom: {
    bottom: -50,
    right: -20,
  },
  bokehMidRight: {
    top: '48%',
    right: '8%',
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: loginGlass.vignette,
  },
});
