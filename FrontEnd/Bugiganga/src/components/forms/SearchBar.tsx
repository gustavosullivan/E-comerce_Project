import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { colors, radii, shadow } from '@/src/theme';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar bugigangas...',
  editable = true,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrap, focused && styles.wrapFocused]}>
      <MaterialIcons
        name="search"
        size={22}
        color={focused ? colors.primary : colors.secondary}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        editable={editable}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value.length > 0 ? (
        <ScalePressable onPress={() => onChangeText('')} hitSlop={8} style={styles.clearBtn}>
          <MaterialIcons name="close" size={18} color={colors.textMuted} />
        </ScalePressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.full,
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginBottom: 14,
  },
  wrapFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.white,
    ...shadow.card,
  },
  input: { flex: 1, fontSize: 15, color: colors.text },
  clearBtn: {
    padding: 2,
  },
});
