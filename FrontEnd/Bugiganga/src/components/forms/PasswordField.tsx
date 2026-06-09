import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, inputStyles, textStyles } from '@/src/theme';

type PasswordFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  onSubmitEditing?: () => void;
};

export function PasswordField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Sua senha',
  onSubmitEditing,
}: PasswordFieldProps<T>) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.group}>
      <Text style={textStyles.label}>{label}</Text>
      <View>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <>
              <TextInput
                style={[
                  inputStyles.field,
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
                secureTextEntry={!show}
                onSubmitEditing={onSubmitEditing}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {error ? <Text style={styles.error}>{error.message}</Text> : null}
            </>
          )}
        />
        <Pressable
          style={inputStyles.toggle}
          onPress={() => setShow((v) => !v)}
          hitSlop={8}
          accessibilityLabel={show ? 'Ocultar senha' : 'Mostrar senha'}>
          <MaterialIcons
            name={show ? 'visibility-off' : 'visibility'}
            size={22}
            color={colors.primary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: 16 },
  error: { fontSize: 12, color: colors.danger, marginTop: 4 },
});
