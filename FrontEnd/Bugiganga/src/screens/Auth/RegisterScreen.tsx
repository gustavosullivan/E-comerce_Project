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
import { MaterialIcons } from '@expo/vector-icons';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { CustomInput } from '@/src/components/forms/CustomInput';
import { PasswordVisibilityToggle } from '@/src/components/forms/PasswordVisibilityToggle';
import { LogoHeader } from '@/src/components/layout/LogoHeader';
import { VintageCard } from '@/src/components/layout/VintageCard';
import { useAuth } from '@/src/hooks/useAuth';
import { colors, fontSizes, fonts, radius } from '@/src/theme';
import { type RegisterFormData, registerSchema } from '@/src/validation/registerSchema';

export default function RegisterScreen() {
  const { register, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit((data) => {
    clearError();
    register(data);
  });

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>
          <LogoHeader tagline="Crie sua conta e comece a comprar" />
          <VintageCard>
            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            <CustomInput control={control} name="name" label="Nome" placeholder="Seu nome" autoCapitalize="words" />
            <CustomInput control={control} name="email" label="Email" placeholder="seu@email.com" keyboardType="email-address" />
            <PwdField control={control} name="password" label="Senha" show={showPassword} onToggle={() => setShowPassword((p) => !p)} />
            <PwdField control={control} name="confirmPassword" label="Confirmar senha" show={showConfirm} onToggle={() => setShowConfirm((p) => !p)} onSubmit={onSubmit} />
            <PrimaryButton label="Criar conta" onPress={onSubmit} isLoading={isLoading} />
          </VintageCard>
          <View style={styles.linkRow}>
            <Text style={styles.linkLabel}>Já possui conta?</Text>
            <Pressable onPress={() => router.replace('/login')}>
              <Text style={styles.linkAction}>Entrar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PwdField({
  control,
  name,
  label,
  show,
  onToggle,
  onSubmit,
}: {
  control: Control<RegisterFormData>;
  name: 'password' | 'confirmPassword';
  label: string;
  show: boolean;
  onToggle: () => void;
  onSubmit?: () => void;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <View>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!show}
                onSubmitEditing={onSubmit}
              />
              <PasswordVisibilityToggle visible={show} onToggle={onToggle} />
            </View>
            {error ? <Text style={styles.fieldError}>{error.message}</Text> : null}
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 32 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  backText: { fontSize: fontSizes.md, color: colors.primary, fontWeight: '600' },
  errorBanner: {
    backgroundColor: colors.dangerLight,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: colors.danger, fontSize: fontSizes.sm },
  fieldGroup: { marginBottom: 16 },
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
    paddingRight: 48,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  inputError: { borderColor: colors.danger },
  fieldError: { fontSize: fontSizes.xs, color: colors.danger, marginTop: 6 },
  linkRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 24 },
  linkLabel: { fontSize: fontSizes.md, color: colors.textMuted },
  linkAction: { fontSize: fontSizes.md, fontWeight: '700', color: colors.primary },
});
