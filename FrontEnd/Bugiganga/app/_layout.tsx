import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

if (Platform.OS !== 'web') {
  require('react-native-reanimated');
}
import { AuthProvider } from '@/src/providers/AuthProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ headerShown: false, title: 'Checkout' }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
    </AuthProvider>
  );
}
