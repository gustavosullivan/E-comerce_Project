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
import { type LoginFormData, loginSchema } from '@/src/validation/loginSchema';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit((data) => {
    clearError();
    login(data);
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
                placeholder="Sua senha"
                secureTextEntry
                showToggle
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />

              <PrimaryButton label="Entrar" onPress={onSubmit} isLoading={isLoading} />

              <Text style={vintageTheme.demoHint}>
                Demo: demo@bugigangas.com · senha 12345678
              </Text>
            </VintageCard>

            <View style={vintageTheme.linkRow}>
              <Text style={vintageTheme.linkLabel}>Não possui uma conta?</Text>
              <Pressable onPress={() => router.push('/register')}>
                <Text style={vintageTheme.linkAction}>Criar Conta</Text>
              </Pressable>
            </View>
          </View>

          <Text style={vintageTheme.footerText}>Bugigangas © 2026</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
