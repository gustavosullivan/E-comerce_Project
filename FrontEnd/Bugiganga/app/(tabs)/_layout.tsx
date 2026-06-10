import { Redirect, Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import { GlassTabBarBackground } from '@/src/components/layout/GlassTabBarBackground';
import { GlassTabButton } from '@/src/components/layout/GlassTabButton';
import { TAB_BAR_HEIGHT, useTabBarInset } from '@/src/hooks/useTabBarInset';
import { useCartStore } from '@/src/store/cartStore';
import { useAuthStore } from '@/src/stores/authStore';
import { colors, fontSizes, fonts, layout, radius } from '@/src/theme';

export default function TabLayout() {
  const token = useAuthStore((s) => s.token);
  const cartCount = useCartStore((s) => s.getItemCount());
  const { tabBarBottom } = useTabBarInset();

  if (!token) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: GlassTabButton,
        tabBarBackground: () => <GlassTabBarBackground />,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: [styles.tabBar, { bottom: tabBarBottom }],
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? 'home-filled' : 'home'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? 'favorite' : 'favorite-border'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrinho',
          tabBarBadge: cartCount > 0 ? (cartCount > 9 ? '9+' : cartCount) : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="shopping-bag" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Conta',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: layout.md,
    right: layout.md,
    height: TAB_BAR_HEIGHT,
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 6,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRadius: radius.xl,
    overflow: 'hidden',
    zIndex: 100,
    elevation: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
  },
  tabLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 0,
  },
  tabItem: {
    borderRadius: radius.lg,
    paddingVertical: 2,
  },
  badge: {
    backgroundColor: colors.accent,
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    minWidth: 18,
    height: 18,
    lineHeight: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(8, 10, 20, 0.85)',
  },
});
