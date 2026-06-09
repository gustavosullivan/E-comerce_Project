import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/use-color-scheme';

import 'react-native-reanimated';
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
        <Stack.Screen name="product" options={{ headerShown: false, presentation: 'transparentModal' }} />
        <Stack.Screen name="checkout" options={{ headerShown: false, title: 'Checkout' }} />
        <Stack.Screen name="account" options={{ headerShown: false, title: 'Minha Conta' }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
    </AuthProvider>
  );
}
