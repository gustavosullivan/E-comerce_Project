import { StyleSheet, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, fontSizes, radius, shadows } from '@/src/theme';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar produtos...',
  editable = true,
}: SearchBarProps) {
  return (
    <View style={styles.wrap}>
      <MaterialIcons name="search" size={22} color={colors.textMuted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        editable={editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...shadows.sm,
  },
  input: { flex: 1, fontSize: fontSizes.md, color: colors.text },
});
