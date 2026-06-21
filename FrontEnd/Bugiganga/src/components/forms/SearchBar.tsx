import { StyleSheet, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, fontSizes, loginGlass, radius, shadows } from '@/src/theme';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  variant?: 'default' | 'warm';
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar produtos...',
  editable = true,
  variant = 'default',
}: SearchBarProps) {
  const warm = variant === 'warm';

  return (
    <View style={[styles.wrap, warm && styles.wrapWarm]}>
      <MaterialIcons
        name="search"
        size={22}
        color={warm ? loginGlass.goldMuted : colors.textMuted}
      />
      <TextInput
        style={[styles.input, warm && styles.inputWarm]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={warm ? loginGlass.textMuted : colors.textMuted}
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
  wrapWarm: {
    backgroundColor: loginGlass.inputBg,
    borderWidth: 1,
    borderColor: loginGlass.inputBorder,
    borderRadius: radius.full,
  },
  input: { flex: 1, fontSize: fontSizes.md, color: colors.text },
  inputWarm: { color: loginGlass.text },
});
