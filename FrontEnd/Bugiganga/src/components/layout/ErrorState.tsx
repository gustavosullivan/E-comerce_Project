import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { colors, fonts } from '@/src/theme';

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{message}</Text>
      {onRetry ? <PrimaryButton label="Tentar novamente" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, gap: 16 },
  text: { fontFamily: fonts.serif, fontSize: 15, color: colors.danger, textAlign: 'center' },
});
