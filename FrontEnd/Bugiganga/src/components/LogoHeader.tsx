import { Text, View } from 'react-native';

import { vintageTheme } from '@/src/theme/vintage';

export function LogoHeader() {
  return (
    <View style={{ alignItems: 'center', marginBottom: 28 }}>
      <View
        style={{
          width: 140,
          height: 1,
          backgroundColor: '#9A8268',
          marginBottom: 16,
        }}
      />
      <Text style={vintageTheme.brand}>BUGIGANGAS</Text>
      <Text style={vintageTheme.tagline}>Encontre tesouros esquecidos</Text>
      <View
        style={{
          width: 140,
          height: 1,
          backgroundColor: '#9A8268',
          marginTop: 16,
        }}
      />
    </View>
  );
}
