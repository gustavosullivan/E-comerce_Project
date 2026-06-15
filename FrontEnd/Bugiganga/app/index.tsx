import { Redirect } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '@/src/hooks/useAuth';

/** Entrada do app — sempre começa na tela de login */
export default function Index() {
  const { isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) {
    // Show a loading indicator while the authentication state is being hydrated
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    // If authenticated, redirect to the home tabs
    return <Redirect href="/(tabs)" />;
  } else {
    // If not authenticated, redirect to the login screen
    return <Redirect href="/login" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
