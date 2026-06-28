import { Redirect, Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import { GlassTabBar } from '@/src/components/layout/GlassTabBar';
import { TAB_BAR_HEIGHT } from '@/src/hooks/useTabBarInset';
import { selectCartItemCount, useCartStore } from '@/src/store/cartStore';
import { useAuthStore } from '@/src/store/authStore';
import { fontSizes, fonts, loginGlass } from '@/src/theme';
import { isAdmin } from '@/src/types/auth';

export default function TabLayout() {
  const { user, token } = useAuthStore();
  const userId = useAuthStore((state) => state.user?.id);
  const cartCount = useCartStore((state) => selectCartItemCount(state, userId));
  const isCurrentUserAdmin = isAdmin(user);

  if (!token) return <Redirect href="/login" />;

  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3D2B1F',
        tabBarInactiveTintColor: 'rgba(61, 43, 31, 0.65)',
        tabBarStyle: styles.tabBarMetrics,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: isCurrentUserAdmin ? 'Produtos' : 'Início',
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
          href: isCurrentUserAdmin ? null : undefined,
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
          href: isCurrentUserAdmin ? null : undefined,
          title: 'Carrinho',
          tabBarBadge: !isCurrentUserAdmin && cartCount > 0 ? cartCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="shopping-cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="novo"
        options={{
          href: isCurrentUserAdmin ? undefined : null,
          title: 'Novo',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-box" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vendas"
        options={{
          href: isCurrentUserAdmin ? undefined : null,
          title: 'Vendas',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? 'leaderboard' : 'leaderboard'}
              size={size}
              color={color}
            />
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
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Config',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="settings"
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
});
