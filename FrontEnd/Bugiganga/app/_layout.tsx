import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/use-color-scheme';

import 'react-native-reanimated';
import { Snackbar } from '@/src/components/ui/Snackbar';
import { AuthProvider } from '@/src/providers/AuthProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="login">
          <Stack.Screen name="login" />
          <Stack.Screen name="index" />
          <Stack.Screen name="register" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="product"
            options={{ presentation: 'transparentModal' }}
          />
          <Stack.Screen name="checkout" />
          <Stack.Screen name="account" />
        </Stack>
        <StatusBar style="dark" />
        <Snackbar />
      </ThemeProvider>
    </AuthProvider>
  );
}
