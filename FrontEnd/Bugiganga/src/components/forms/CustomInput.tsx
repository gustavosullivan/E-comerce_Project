import { useState } from 'react';
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { colors, fontSizes, fonts, loginGlass, radius } from '@/src/theme';

import { PasswordVisibilityToggle } from './PasswordVisibilityToggle';

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
  variant?: 'default' | 'warm';
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
    variant = 'default',
  } = props;
  const warm = variant === 'warm';
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.group}>
          <Text style={[styles.label, warm && styles.labelWarm]}>{label}</Text>
          <View>
            <TextInput
              style={[
                styles.input,
                warm && styles.inputWarm,
                showToggle && styles.inputToggle,
                focused && (warm ? styles.focusedWarm : styles.focused),
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
              placeholderTextColor={warm ? loginGlass.textMuted : colors.textMuted}
              secureTextEntry={secureTextEntry && !visible}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              autoCorrect={false}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
            />
            {showToggle && secureTextEntry ? (
              <PasswordVisibilityToggle visible={visible} onToggle={() => setVisible((v) => !v)} />
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
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  labelWarm: {
    color: loginGlass.formLabel,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  inputWarm: {
    backgroundColor: loginGlass.formFieldBg,
    borderColor: loginGlass.formFieldBorder,
    borderRadius: radius.full,
    color: loginGlass.text,
  },
  inputToggle: { paddingRight: 72 },
  focused: { borderColor: colors.borderFocus, backgroundColor: colors.white },
  focusedWarm: {
    borderColor: loginGlass.goldLight,
    backgroundColor: loginGlass.formFieldBg,
  },
  errorBorder: { borderColor: colors.danger },
  error: { fontSize: fontSizes.xs, color: colors.danger, marginTop: 6 },
});
