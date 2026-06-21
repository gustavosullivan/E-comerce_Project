import { type PropsWithChildren } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { WarmGlassSurface } from '@/src/components/layout/WarmGlassSurface';
import { loginGlass } from '@/src/theme/loginGlass';
import { radius } from '@/src/theme';

export function LoginGlassShell({ children }: PropsWithChildren) {
  return (
    <View style={styles.outer}>
      <View style={styles.glow} />
      <WarmGlassSurface
        level="shell"
        style={styles.shell}
        contentStyle={styles.content}>
        {children}
      </WarmGlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'relative',
    marginTop: 8,
  },
  glow: {
    position: 'absolute',
    top: 8,
    left: 12,
    right: 12,
    bottom: -6,
    borderRadius: 40,
    backgroundColor: loginGlass.shellGlow,
    ...(Platform.OS === 'web'
      ? { filter: 'blur(22px)' }
      : {}),
  },
  shell: {
    borderRadius: 36,
    borderTopLeftRadius: 44,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 48,
    shadowColor: loginGlass.gold,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 26,
  },
});
