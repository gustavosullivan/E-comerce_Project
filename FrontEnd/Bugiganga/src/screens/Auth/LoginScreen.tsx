import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm, type Control } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { CustomInput } from '@/src/components/forms/CustomInput';
import { PasswordVisibilityToggle } from '@/src/components/forms/PasswordVisibilityToggle';
import { LoginLogo } from '@/src/components/layout/LoginLogo';
import { VintageCard } from '@/src/components/layout/VintageCard';
import { DEV_MOCK_LOGIN_FORM, formatDevLoginHint } from '@/src/config/devCredentials';
import { useAuth } from '@/src/hooks/useAuth';
import { useDevLoginDefaults } from '@/src/hooks/useDevLoginDefaults';
import { colors, fontSizes, fonts, radius } from '@/src/theme';
import { type LoginFormData, loginSchema } from '@/src/validation/loginSchema';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();
  const { defaults, save } = useDevLoginDefaults();
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: DEV_MOCK_LOGIN_FORM,
    values: defaults,
  });

  const onSubmit = handleSubmit((data) => {
    clearError();
    save(data);
    login(data);
  });

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          <View>
            <LoginLogo />
            <VintageCard>
              {error ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
              <CustomInput
                control={control}
                name="email"
                label="Email"
                placeholder="demo@bugigangas.com"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <PasswordField
                control={control}
                show={showPassword}
                onToggle={() => setShowPassword((p) => !p)}
                onSubmit={onSubmit}
              />
              <Pressable
                style={styles.forgotLink}
                onPress={() => router.push('/forgot-password')}>
                <Text style={styles.forgotText}>Esqueci a senha</Text>
              </Pressable>
              <PrimaryButton label="Entrar" onPress={onSubmit} isLoading={isLoading} />
              <Text style={styles.hint}>{formatDevLoginHint()}</Text>
            </VintageCard>
            <View style={styles.linkRow}>
              <Text style={styles.linkLabel}>Não possui conta?</Text>
              <Pressable onPress={() => router.push('/register')}>
                <Text style={styles.linkAction}>Criar conta</Text>
              </Pressable>
            </View>
          </View>
          <Text style={styles.footer}>Bugigangas © 2026</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PasswordField({
  control,
  show,
  onToggle,
  onSubmit,
}: {
  control: Control<LoginFormData>;
  show: boolean;
  onToggle: () => void;
  onSubmit: () => void;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Senha</Text>
      <View>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Sua senha"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!show}
                onSubmitEditing={onSubmit}
              />
              {error ? <Text style={styles.fieldError}>{error.message}</Text> : null}
            </>
          )}
        />
        <PasswordVisibilityToggle visible={show} onToggle={onToggle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'space-between' },
  errorBanner: {
    backgroundColor: colors.dangerLight,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: colors.danger, fontSize: fontSizes.sm, lineHeight: 20 },
  fieldGroup: { marginBottom: 8 },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
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
    paddingRight: 48,
  },
  inputError: { borderColor: colors.danger },
  fieldError: { fontSize: fontSizes.xs, color: colors.danger, marginTop: 6 },
  forgotLink: { alignSelf: 'flex-end', marginBottom: 16, marginTop: 4 },
  forgotText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  hint: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 14,
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  linkRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 24 },
  linkLabel: { fontSize: fontSizes.md, color: colors.textMuted },
  linkAction: { fontSize: fontSizes.md, fontWeight: '700', color: colors.primary },
  footer: {
    fontFamily: fonts.gothic,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
  },
});
