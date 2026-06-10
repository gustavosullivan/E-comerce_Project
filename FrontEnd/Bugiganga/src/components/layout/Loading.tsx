import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/src/theme';

export function Loading() {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
});
