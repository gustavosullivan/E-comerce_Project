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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ padding: 28 }} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: colors.primary, fontWeight: '600', marginBottom: 8 }}>← Voltar</Text>
          </Pressable>
          <LogoHeader />
          <VintageCard>
            {error ? <Text style={{ color: colors.danger, marginBottom: 12 }}>{error}</Text> : null}
            <CustomInput control={control} name="name" label="Nome" placeholder="Seu nome" autoCapitalize="words" />
            <CustomInput control={control} name="email" label="Email" placeholder="seu@email.com" keyboardType="email-address" />
            <PwdField control={control} name="password" label="Senha" show={showPassword} onToggle={() => setShowPassword((p) => !p)} />
            <PwdField control={control} name="confirmPassword" label="Confirmar Senha" show={showConfirm} onToggle={() => setShowConfirm((p) => !p)} onSubmit={onSubmit} />
            <PrimaryButton label="Criar Conta" onPress={onSubmit} isLoading={isLoading} />
          </VintageCard>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 20 }}>
            <Text style={{ color: colors.textMuted }}>Já possui conta?</Text>
            <Pressable onPress={() => router.replace('/login')}>
              <Text style={{ color: colors.primary, fontWeight: '700', textDecorationLine: 'underline' }}>Entrar</Text>
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
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontFamily: fonts.serif, fontWeight: '600', marginBottom: 8, color: colors.text }}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <TextInput
              style={{
                backgroundColor: colors.inputBg,
                borderWidth: 1.5,
                borderColor: error ? colors.danger : colors.border,
                borderRadius: 2,
                padding: 12,
                paddingRight: 72,
                color: colors.text,
              }}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={!show}
              onSubmitEditing={onSubmit}
            />
            <Pressable style={{ position: 'absolute', right: 12, top: 38 }} onPress={onToggle}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>{show ? 'Ocultar' : 'Ver'}</Text>
            </Pressable>
            {error ? <Text style={{ fontSize: 12, color: colors.danger, marginTop: 4 }}>{error.message}</Text> : null}
          </>
        )}
      />
    </View>
  );
}
