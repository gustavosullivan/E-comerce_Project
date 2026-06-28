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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassTabBarBackground } from '@/src/components/layout/GlassTabBarBackground';
import { TAB_BAR_HEIGHT } from '@/src/hooks/useTabBarInset';
import { colors, fontSizes, fonts, loginGlass, motion } from '@/src/theme';

const TAB_SLIDE_MS = motion.normal;

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
  const insets = useSafeAreaInsets();
  
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
        {
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
        },
        Platform.OS === 'web' && styles.containerWeb,
      ]}
      onLayout={(e) => onHeightChange?.(e.nativeEvent.layout.height)}>
      <GlassTabBarBackground />



      <View style={styles.row}>
        {visibleRoutes.map((route, index) => {
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

          // Check if this is the middle tab (index 2 out of 5)
          const isMiddleTab = index === 2;

          if (isMiddleTab) {
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
                style={styles.centerTab}>
                <View style={styles.centerTabInner}>
                  <View style={[styles.centerCircle, isFocused && styles.centerCircleActive]}>
                    {options.tabBarIcon?.({
                      focused: isFocused,
                      color: isFocused ? loginGlass.gold : '#3D2B1F',
                      size: 26,
                    })}
                    {badgeLabel ? (
                      <View style={styles.centerBadge}>
                        <Text style={styles.centerBadgeText} numberOfLines={1}>
                          {badgeLabel}
                        </Text>
                      </View>
                    ) : null}
                  </View>
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
                </View>
              </Pressable>
            );
          }

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
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 24,
    shadowColor: '#1A1008',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    overflow: 'visible',
  },
  containerWeb: {
    position: 'fixed',
    zIndex: 1000,
  },
  indicatorLayer: {
    position: 'absolute',
    top: 6,
    height: TAB_BAR_HEIGHT - 12,
    left: 6,
    right: 6,
    zIndex: 0,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 8,
    backgroundColor: loginGlass.tabBarIndicator,
    borderWidth: 1,
    borderColor: loginGlass.tabBarIndicatorBorder,
  },
  row: {
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    zIndex: 1,
    overflow: 'visible',
  },
  tab: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  tabInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 6,
    paddingBottom: 10,
    overflow: 'visible',
  },
  centerTab: {
    flex: 1,
    zIndex: 2,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  centerTabInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
    overflow: 'visible',
  },
  centerCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F5E6D0', // Cream color from theme
    borderWidth: 1.5,
    borderColor: '#A8845C', // Gold/brown border matching the top border
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -18, // Lift the button up to overlap the tab bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 3,
  },
  centerCircleActive: {
    borderColor: loginGlass.gold,
    backgroundColor: '#FFFFFF',
  },
  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 26,
    marginBottom: 2,
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
  centerBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    height: 16,
    minWidth: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#F5E6D0',
    zIndex: 4,
  },
  centerBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 10,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
