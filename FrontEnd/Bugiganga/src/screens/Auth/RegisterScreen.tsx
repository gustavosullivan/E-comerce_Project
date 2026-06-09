import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { CustomInput } from '@/src/components/forms/CustomInput';
import { PasswordField } from '@/src/components/forms/PasswordField';
import { LogoHeader } from '@/src/components/layout/LogoHeader';
import { VintageCard } from '@/src/components/layout/VintageCard';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { ScreenContainer } from '@/src/components/ui/ScreenContainer';
import { TextLink } from '@/src/components/ui/TextLink';
import { useAuth } from '@/src/hooks/useAuth';
import { cardStyles, colors } from '@/src/theme';
import { type RegisterFormData, registerSchema } from '@/src/validation/registerSchema';

export default function RegisterScreen() {
  const { register, isLoading, error, clearError } = useAuth();
  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit((data) => {
    clearError();
    register(data);
  });

  return (
    <ScreenContainer scroll keyboard contentStyle={styles.content}>
      <PageHeader title="Criar Conta" onBack={() => router.back()} />
      <LogoHeader tagline="Junte-se à caça aos tesouros" />
      <VintageCard>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}
        <CustomInput control={control} name="name" label="Nome" placeholder="Seu nome" autoCapitalize="words" />
        <CustomInput control={control} name="email" label="Email" placeholder="seu@email.com" keyboardType="email-address" />
        <PasswordField control={control} name="password" label="Senha" placeholder="Mínimo 8 caracteres" />
        <PasswordField
          control={control}
          name="confirmPassword"
          label="Confirmar Senha"
          placeholder="Repita a senha"
          onSubmitEditing={onSubmit}
        />
        <PrimaryButton label="Criar Conta" onPress={onSubmit} isLoading={isLoading} />
      </VintageCard>
      <TextLink prefix="Já possui conta?" label="Entrar" onPress={() => router.replace('/login')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8, paddingBottom: 32 },
  errorBox: {
    ...cardStyles.inset,
    marginBottom: 14,
    borderColor: colors.danger,
    backgroundColor: '#F5E0DC',
  },
  error: { color: colors.danger, fontSize: 14 },
});
