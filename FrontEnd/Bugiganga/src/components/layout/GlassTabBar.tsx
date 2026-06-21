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
import { colors, fontSizes, fonts, layout, loginGlass, motion, radius } from '@/src/theme';

const TAB_SLIDE_MS = motion.normal;
const TAB_INSET = 6;

function formatTabBadge(value: string | number): string {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  if (Number.isNaN(parsed)) return String(value);
  if (parsed > 99) return '99+';
  return String(parsed);
}

function getBadgeWidth(label: string): number {
  if (label.length >= 3) return 24;
  if (label.length === 2) return 20;
  return 16;
}

export function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const onHeightChange = useContext(BottomTabBarHeightCallbackContext);
  const { tabBarBottom } = useTabBarInset();
  const visibleRoutes = useMemo(
    () =>
      state.routes.filter((route) => {
        const { options } = descriptors[route.key];
        return options.tabBarButton == null;
      }),
    [state.routes, descriptors],
  );
  const tabCount = visibleRoutes.length;
  const segmentPercent = tabCount > 0 ? 100 / tabCount : 0;
  const focusedVisibleIndex = Math.max(
    0,
    visibleRoutes.findIndex((route) => route.key === state.routes[state.index]?.key),
  );
  const animatedIndex = useRef(new Animated.Value(focusedVisibleIndex)).current;

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
      toValue: focusedVisibleIndex,
      duration: TAB_SLIDE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [focusedVisibleIndex, animatedIndex]);

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
        {visibleRoutes.map((route) => {
          const routeIndex = state.routes.findIndex((item) => item.key === route.key);
          const { options } = descriptors[route.key];
          const isFocused = state.index === routeIndex;
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
          const badgeLabel =
            badge != null && badge !== '' ? formatTabBadge(badge) : null;

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
                  {options.tabBarIcon?.({ focused: isFocused, color, size: 22 })}
                  {badgeLabel ? (
                    <View
                      style={[
                        styles.badge,
                        { minWidth: getBadgeWidth(badgeLabel) },
                        options.tabBarBadgeStyle,
                      ]}>
                      <Text style={styles.badgeText} numberOfLines={1}>
                        {badgeLabel}
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
    borderWidth: 1,
    borderColor: loginGlass.shellBorder,
    shadowColor: '#1A1008',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
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
    backgroundColor: loginGlass.tabBarIndicator,
    borderWidth: 1,
    borderColor: loginGlass.tabBarIndicatorBorder,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    zIndex: 1,
    paddingTop: 2,
  },
  tab: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'transparent',
    borderRadius: radius.lg,
    overflow: 'visible',
  },
  tabInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    overflow: 'visible',
  },
  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 26,
    marginBottom: 1,
    overflow: 'visible',
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '600',
    marginTop: 0,
    lineHeight: 14,
  },
  labelActive: {
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -7,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: loginGlass.tabBarGlass,
    zIndex: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 11,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
