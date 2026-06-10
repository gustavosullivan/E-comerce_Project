import {
  BottomTabBarHeightCallbackContext,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useContext, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { GlassTabBarBackground } from '@/src/components/layout/GlassTabBarBackground';
import { TAB_BAR_HEIGHT, useTabBarInset } from '@/src/hooks/useTabBarInset';
import { colors, fontSizes, fonts, layout, motion, radius } from '@/src/theme';

const TAB_SLIDE_MS = motion.normal;
const TAB_INSET = 6;

export function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const onHeightChange = useContext(BottomTabBarHeightCallbackContext);
  const { tabBarBottom } = useTabBarInset();
  const tabCount = state.routes.length;
  const segmentPercent = tabCount > 0 ? 100 / tabCount : 0;
  const animatedIndex = useRef(new Animated.Value(state.index)).current;

  const leftInterpolation = useMemo(() => {
    if (tabCount <= 1) return '0%';

    const inputRange = Array.from({ length: tabCount }, (_, index) => index);
    const outputRange = inputRange.map((index) => `${index * segmentPercent}%`);

    return animatedIndex.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    });
  }, [animatedIndex, segmentPercent, tabCount]);

  useEffect(() => {
    Animated.timing(animatedIndex, {
      toValue: state.index,
      duration: TAB_SLIDE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [state.index, animatedIndex]);

  return (
    <View
      style={[
        styles.container,
        { bottom: tabBarBottom, height: TAB_BAR_HEIGHT },
        Platform.OS === 'web' && styles.containerWeb,
      ]}
      onLayout={(e) => onHeightChange?.(e.nativeEvent.layout.height)}>
      <GlassTabBarBackground />

      <View style={styles.indicatorLayer} pointerEvents="none">
        <Animated.View
          style={[
            styles.indicator,
            {
              width: `${segmentPercent}%`,
              left: leftInterpolation,
            },
          ]}
        />
      </View>

      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const activeColor = options.tabBarActiveTintColor ?? colors.white;
          const inactiveColor = options.tabBarInactiveTintColor ?? colors.tabBarInactive;
          const color = isFocused ? activeColor : inactiveColor;

          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          const badge = options.tabBarBadge;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? String(label)}
              onPress={onPress}
              onLongPress={onLongPress}
              onPressIn={() => {
                if (process.env.EXPO_OS === 'ios') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              style={styles.tab}>
              <View style={styles.tabInner}>
                <View style={styles.iconWrap}>
                  {options.tabBarIcon?.({ focused: isFocused, color, size: 24 })}
                  {badge != null && badge !== '' ? (
                    <View style={styles.badge}>
                      <Text style={[styles.badgeText, options.tabBarBadgeStyle]}>
                        {String(badge)}
                      </Text>
                    </View>
                  ) : null}
                </View>
                {options.tabBarShowLabel !== false ? (
                  <Text
                    style={[
                      styles.label,
                      options.tabBarLabelStyle,
                      { color },
                      isFocused && styles.labelActive,
                    ]}
                    numberOfLines={1}>
                    {label}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: layout.md,
    right: layout.md,
    paddingHorizontal: TAB_INSET,
    borderRadius: radius.xl,
    overflow: 'hidden',
    zIndex: 100,
    elevation: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
  },
  containerWeb: {
    position: 'fixed',
    zIndex: 1000,
  },
  indicatorLayer: {
    position: 'absolute',
    top: TAB_INSET,
    bottom: TAB_INSET,
    left: TAB_INSET,
    right: TAB_INSET,
    zIndex: 0,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    zIndex: 1,
  },
  tab: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'transparent',
    borderRadius: radius.lg,
  },
  tabInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '600',
    marginTop: 2,
  },
  labelActive: {
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(8, 10, 20, 0.85)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
  },
});
