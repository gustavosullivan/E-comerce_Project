import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { colors, fontSizes, fonts, radius } from '@/src/theme';

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <MaterialIcons name="error-outline" size={36} color={colors.danger} />
      </View>
      <Text style={styles.text}>{message}</Text>
      {onRetry ? <PrimaryButton label="Tentar novamente" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, gap: 16, alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: colors.danger,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
});
