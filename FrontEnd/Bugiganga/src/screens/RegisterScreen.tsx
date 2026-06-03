import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomInput } from '@/src/components/CustomInput';
import { LogoHeader } from '@/src/components/LogoHeader';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { VintageCard } from '@/src/components/VintageCard';
import { useAuth } from '@/src/hooks/useAuth';
import { vintageTheme } from '@/src/theme/vintage';
import { type RegisterFormData, registerSchema } from '@/src/validation/registerSchema';

export default function RegisterScreen() {
  const { register, isLoading, error, clearError } = useAuth();

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit((data) => {
    clearError();
    register(data);
  });

  return (
    <SafeAreaView style={vintageTheme.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={vintageTheme.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => router.back()} style={{ marginBottom: 8 }}>
            <Text style={vintageTheme.linkAction}>← Voltar</Text>
          </Pressable>

          <View>
            <LogoHeader />

            <VintageCard>
              {error ? (
                <View style={vintageTheme.errorBanner}>
                  <Text style={vintageTheme.errorText}>{error}</Text>
                </View>
              ) : null}

              <CustomInput
                control={control}
                name="name"
                label="Nome Completo"
                placeholder="Seu nome"
                autoCapitalize="words"
                returnKeyType="next"
              />

              <CustomInput
                control={control}
                name="email"
                label="Email"
                placeholder="seu@email.com"
                keyboardType="email-address"
                returnKeyType="next"
              />

              <CustomInput
                control={control}
                name="password"
                label="Senha"
                placeholder="Mínimo 8 caracteres"
                secureTextEntry
                showToggle
                returnKeyType="next"
              />

              <CustomInput
                control={control}
                name="confirmPassword"
                label="Confirmar Senha"
                placeholder="Repita a senha"
                secureTextEntry
                showToggle
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />

              <PrimaryButton label="Criar Conta" onPress={onSubmit} isLoading={isLoading} />
            </VintageCard>

            <View style={vintageTheme.linkRow}>
              <Text style={vintageTheme.linkLabel}>Já possui uma conta?</Text>
              <Pressable onPress={() => router.replace('/login')}>
                <Text style={vintageTheme.linkAction}>Entrar</Text>
              </Pressable>
            </View>
          </View>

          <Text style={vintageTheme.footerText}>Bugigangas © 2026</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
