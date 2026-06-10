import { Redirect, Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import { GlassTabBar } from '@/src/components/layout/GlassTabBar';
import { TAB_BAR_HEIGHT } from '@/src/hooks/useTabBarInset';
import { useCartStore } from '@/src/store/cartStore';
import { useAuthStore } from '@/src/stores/authStore';
import { colors, fontSizes, fonts } from '@/src/theme';

export default function TabLayout() {
  const token = useAuthStore((s) => s.token);
  const cartCount = useCartStore((s) => s.getItemCount());

  if (!token) return <Redirect href="/login" />;

  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: styles.tabBarMetrics,
        tabBarLabelStyle: styles.tabLabel,
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
  tabBarMetrics: {
    height: TAB_BAR_HEIGHT,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    position: 'absolute',
  },
  tabLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 0,
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
