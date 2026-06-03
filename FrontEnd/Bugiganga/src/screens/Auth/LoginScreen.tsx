import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm, type Control } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { CustomInput } from '@/src/components/forms/CustomInput';
import { LogoHeader } from '@/src/components/layout/LogoHeader';
import { VintageCard } from '@/src/components/layout/VintageCard';
import { useAuth } from '@/src/hooks/useAuth';
import { colors, fonts } from '@/src/theme';
import { type LoginFormData, loginSchema } from '@/src/validation/loginSchema';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit((data) => {
    clearError();
    login(data);
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 28, justifyContent: 'space-between' }}
          keyboardShouldPersistTaps="handled">
          <View>
            <LogoHeader />
            <VintageCard>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <CustomInput
                control={control}
                name="email"
                label="Email"
                placeholder="seu@email.com"
                keyboardType="email-address"
              />
              <PasswordField control={control} show={showPassword} onToggle={() => setShowPassword((p) => !p)} onSubmit={onSubmit} />
              <PrimaryButton label="Entrar" onPress={onSubmit} isLoading={isLoading} />
              <Text style={styles.hint}>Demo: demo@bugigangas.com · 12345678</Text>
            </VintageCard>
            <View style={styles.linkRow}>
              <Text style={styles.linkLabel}>Não possui conta?</Text>
              <Pressable onPress={() => router.push('/register')}>
                <Text style={styles.linkAction}>Criar Conta</Text>
              </Pressable>
            </View>
          </View>
          <Text style={styles.footer}>Bugiganga © 2026</Text>
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
    <View style={{ marginBottom: 16 }}>
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
        <Pressable style={styles.toggle} onPress={onToggle}>
          <Text style={styles.linkAction}>{show ? 'Ocultar' : 'Ver'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = {
  error: { color: colors.danger, marginBottom: 12, fontSize: 14 },
  label: { fontFamily: fonts.serif, fontSize: 14, fontWeight: '600' as const, color: colors.text, marginBottom: 8 },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 2,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    paddingRight: 72,
  },
  inputError: { borderColor: colors.danger },
  fieldError: { fontSize: 12, color: colors.danger, marginTop: 4 },
  toggle: { position: 'absolute' as const, right: 12, top: 12 },
  hint: { fontSize: 11, color: colors.textMuted, textAlign: 'center' as const, marginTop: 12 },
  linkRow: { flexDirection: 'row' as const, justifyContent: 'center' as const, gap: 6, marginTop: 20 },
  linkLabel: { fontSize: 14, color: colors.textMuted },
  linkAction: { fontSize: 14, fontWeight: '700' as const, color: colors.primary, textDecorationLine: 'underline' as const },
  footer: { fontSize: 11, color: colors.textMuted, textAlign: 'center' as const, marginTop: 24 },
};
