import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';

import { authStyles } from '@/constants/auth-styles';
import { VintageColors } from '@/constants/theme';

type AuthFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'words' | 'sentences';
  returnKeyType?: 'next' | 'done';
  onSubmitEditing?: () => void;
};

export function AuthFormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  returnKeyType,
  onSubmitEditing,
}: AuthFormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={authStyles.fieldGroup}>
          <Text style={authStyles.label}>{label}</Text>
          <TextInput
            style={[authStyles.input, error && { borderColor: VintageColors.error }]}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={VintageColors.brownLight}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
          />
          {error ? (
            <Text style={{ fontSize: 12, color: VintageColors.error, marginTop: 4 }}>
              {error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}
