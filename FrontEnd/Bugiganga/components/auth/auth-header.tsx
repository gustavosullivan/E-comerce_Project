import { Text, View } from 'react-native';

import { authStyles } from '@/constants/auth-styles';

export function AuthHeader() {
  return (
    <View style={authStyles.header}>
      <View style={authStyles.ornament} />
      <Text style={authStyles.brand}>Bugigangas</Text>
      <Text style={authStyles.tagline}>Tesouros com história</Text>
      <View style={authStyles.ornament} />
    </View>
  );
}
