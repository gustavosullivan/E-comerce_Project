import { ActivityIndicator, Pressable, Text } from 'react-native';

import { authStyles } from '@/constants/auth-styles';
import { VintageColors } from '@/constants/theme';

type AuthSubmitButtonProps = {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export function AuthSubmitButton({
  label,
  onPress,
  isLoading = false,
  disabled = false,
}: AuthSubmitButtonProps) {
  return (
    <Pressable
      style={[authStyles.primaryButton, (isLoading || disabled) && { opacity: 0.7 }]}
      onPress={onPress}
      disabled={isLoading || disabled}>
      {isLoading ? (
        <ActivityIndicator color={VintageColors.parchment} />
      ) : (
        <Text style={authStyles.primaryButtonText}>{label}</Text>
      )}
    </Pressable>
  );
}
