import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/src/store/authStore';
import { isAdmin } from '@/src/types/auth';

export default function AdminLayout() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token || !isAdmin(user)) {
    return <Redirect href="/settings" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="products/index" />
      <Stack.Screen name="products/new" />
      <Stack.Screen name="products/[id]" />
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}
