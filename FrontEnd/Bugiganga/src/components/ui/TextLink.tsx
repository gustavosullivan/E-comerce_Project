import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, textStyles } from '@/src/theme';

type TextLinkProps = {
  prefix?: string;
  label: string;
  onPress: () => void;
};

export function TextLink({ prefix, label, onPress }: TextLinkProps) {
  return (
    <View style={styles.row}>
      {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
      <Pressable onPress={onPress}>
        <Text style={textStyles.link}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  prefix: { fontSize: 14, color: colors.textMuted },
});
