import { useState } from 'react';
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { Fonts, VintageColors } from '@/constants/theme';

type CustomInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  showToggle?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: () => void;
};

export function CustomInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry,
  showToggle,
  keyboardType = 'default',
  autoCapitalize = 'none',
  returnKeyType,
  onSubmitEditing,
}: CustomInputProps<T>) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.group}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                showToggle && styles.inputWithToggle,
                focused && styles.inputFocused,
                error && styles.inputError,
              ]}
              value={value}
              onChangeText={onChange}
              onBlur={() => {
                onBlur();
                setFocused(false);
              }}
              onFocus={() => setFocused(true)}
              placeholder={placeholder}
              placeholderTextColor={VintageColors.brownMuted}
              secureTextEntry={secureTextEntry && !visible}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              autoCorrect={false}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
            />
            {showToggle && secureTextEntry ? (
              <Pressable style={styles.toggle} onPress={() => setVisible((v) => !v)}>
                <Text style={styles.toggleText}>{visible ? 'Ocultar' : 'Ver'}</Text>
              </Pressable>
            ) : null}
          </View>
          {error ? <Text style={styles.error}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 18,
  },
  label: {
    fontFamily: Fonts.serif,
    fontSize: 14,
    fontWeight: '600',
    color: VintageColors.brown,
    marginBottom: 8,
  },
  inputRow: {
    position: 'relative',
  },
  input: {
    backgroundColor: VintageColors.inputBg,
    borderWidth: 1.5,
    borderColor: VintageColors.border,
    borderRadius: 2,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: VintageColors.brown,
  },
  inputWithToggle: {
    paddingRight: 72,
  },
  inputFocused: {
    borderColor: VintageColors.focus,
    borderWidth: 2,
    backgroundColor: VintageColors.parchment,
  },
  inputError: {
    borderColor: VintageColors.error,
  },
  toggle: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 13,
    color: VintageColors.rust,
    fontWeight: '600',
  },
  error: {
    fontSize: 12,
    color: VintageColors.error,
    marginTop: 4,
  },
});
