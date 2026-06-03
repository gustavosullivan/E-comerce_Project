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

import { colors, fonts } from '@/src/theme';

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

export function CustomInput<T extends FieldValues>(props: CustomInputProps<T>) {
  const {
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
  } = props;
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.group}>
          <Text style={styles.label}>{label}</Text>
          <View>
            <TextInput
              style={[
                styles.input,
                showToggle && styles.inputToggle,
                focused && styles.focused,
                error && styles.errorBorder,
              ]}
              value={value}
              onChangeText={onChange}
              onBlur={() => {
                onBlur();
                setFocused(false);
              }}
              onFocus={() => setFocused(true)}
              placeholder={placeholder}
              placeholderTextColor={colors.textMuted}
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
  group: { marginBottom: 16 },
  label: {
    fontFamily: fonts.serif,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 2,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  inputToggle: { paddingRight: 72 },
  focused: { borderColor: colors.primary, borderWidth: 2 },
  errorBorder: { borderColor: colors.danger },
  toggle: { position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' },
  toggleText: { fontSize: 13, color: colors.secondary, fontWeight: '600' },
  error: { fontSize: 12, color: colors.danger, marginTop: 4 },
});
