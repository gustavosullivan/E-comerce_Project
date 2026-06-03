import { Redirect } from 'expo-router';

import { useAuthStore } from '@/src/stores/authStore';

export default function Index() {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}
