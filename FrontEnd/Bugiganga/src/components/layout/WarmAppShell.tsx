import { StatusBar } from 'expo-status-bar';
import { type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { LoginGlassBackground } from '@/src/components/layout/LoginGlassBackground';
import { loginGlass } from '@/src/theme/loginGlass';

export function WarmAppShell({ children }: PropsWithChildren) {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LoginGlassBackground />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: loginGlass.background },
});
