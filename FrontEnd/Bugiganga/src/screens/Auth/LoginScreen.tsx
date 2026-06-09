import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { CustomInput } from '@/src/components/forms/CustomInput';
import { PasswordField } from '@/src/components/forms/PasswordField';
import { LogoHeader } from '@/src/components/layout/LogoHeader';
import { VintageCard } from '@/src/components/layout/VintageCard';
import { ScreenContainer } from '@/src/components/ui/ScreenContainer';
import { TextLink } from '@/src/components/ui/TextLink';
import { useAuth } from '@/src/hooks/useAuth';
import { cardStyles, colors } from '@/src/theme';
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
    <ScreenContainer scroll keyboard contentStyle={styles.content}>
      <LogoHeader />
      <Animated.View entering={FadeInUp.delay(180).duration(420)}>
        <VintageCard>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}
        <CustomInput
          control={control}
          name="email"
          label="Email"
          placeholder="seu@email.com"
          keyboardType="email-address"
        />
        <PasswordField
          control={control}
          name="password"
          label="Senha"
          placeholder="Sua senha"
          onSubmitEditing={onSubmit}
        />
        <PrimaryButton label="Entrar" onPress={onSubmit} isLoading={isLoading} />
        <View style={styles.hintBox}>
          <Text style={styles.hint}>Demo: demo@bugigangas.com · 12345678</Text>
        </View>
        </VintageCard>
      </Animated.View>
      <TextLink prefix="Não possui conta?" label="Criar Conta" onPress={() => router.push('/register')} />
      <Text style={styles.footer}>Bugiganga © 2026</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 24,
    paddingBottom: 32,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  errorBox: {
    ...cardStyles.inset,
    marginBottom: 14,
    borderColor: colors.danger,
    backgroundColor: '#F5E0DC',
  },
  error: { color: colors.danger, fontSize: 14, lineHeight: 20 },
  hintBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  hint: { fontSize: 11, color: colors.textMuted, textAlign: 'center', lineHeight: 16 },
  footer: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 28,
    letterSpacing: 0.5,
  },
});
