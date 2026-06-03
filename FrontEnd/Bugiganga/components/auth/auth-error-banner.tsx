import { Text, View } from 'react-native';

import { VintageColors } from '@/constants/theme';

type AuthErrorBannerProps = {
  message: string | null;
};

export function AuthErrorBanner({ message }: AuthErrorBannerProps) {
  if (!message) return null;

  return (
    <View
      style={{
        backgroundColor: '#F5E0DC',
        borderWidth: 1,
        borderColor: VintageColors.error,
        borderRadius: 2,
        padding: 12,
        marginBottom: 16,
      }}>
      <Text style={{ color: VintageColors.error, fontSize: 14, lineHeight: 20 }}>{message}</Text>
    </View>
  );
}
