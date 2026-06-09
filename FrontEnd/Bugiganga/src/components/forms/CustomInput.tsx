import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form';
import { Pressable, StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

import { colors, inputStyles, textStyles } from '@/src/theme';

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
          <Text style={textStyles.label}>{label}</Text>
          <View>
            <TextInput
              style={[
                inputStyles.field,
                showToggle && styles.withToggle,
                focused && inputStyles.fieldFocused,
                error && inputStyles.fieldError,
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
              <Pressable
                style={inputStyles.toggle}
                onPress={() => setVisible((v) => !v)}
                hitSlop={8}
                accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}>
                <MaterialIcons
                  name={visible ? 'visibility-off' : 'visibility'}
                  size={22}
                  color={colors.primary}
                />
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
  withToggle: { paddingRight: 48 },
  error: { fontSize: 12, color: colors.danger, marginTop: 4 },
});
