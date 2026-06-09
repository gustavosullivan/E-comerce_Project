import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { PasswordField } from '@/src/components/forms/PasswordField';
import { ProfilePaper } from '@/src/components/layout/ProfilePaper';
import { ProfileAvatarPicker } from '@/src/components/profile/ProfileAvatarPicker';
import { ProfileFieldRow } from '@/src/components/profile/ProfileFieldRow';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { ScreenContainer } from '@/src/components/ui/ScreenContainer';
import { useAuth } from '@/src/hooks/useAuth';
import { cardStyles, colors } from '@/src/theme';
import {
  type ChangePasswordFormData,
  changePasswordSchema,
} from '@/src/validation/changePasswordSchema';

export default function MyAccountScreen() {
  const { user, sessionPassword, changePassword, isLoading, error, clearError } = useAuth();
  const { control, handleSubmit, reset } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onChangePassword = handleSubmit(async (data) => {
    clearError();
    try {
      await changePassword(data);
      reset();
      Alert.alert('Senha alterada', 'Sua nova senha foi salva com sucesso.');
    } catch {
      // erro exibido no paper
    }
  });

  return (
    <ScreenContainer scroll keyboard contentStyle={styles.content}>
      <PageHeader title="Minha Conta" onBack={() => router.back()} />

      <ProfilePaper
        title="Ficha do Cliente"
        subtitle="Documento pessoal · Bugiganga"
        delay={80}>
        <View style={styles.avatarBlock}>
          <ProfileAvatarPicker size="lg" />
        </View>

        <View style={styles.fields}>
          <ProfileFieldRow label="Nome" value={user?.name ?? ''} icon="badge" />
          <ProfileFieldRow label="Email" value={user?.email ?? ''} icon="mail-outline" />
          <ProfileFieldRow
            label="Senha"
            value={sessionPassword ?? 'Faça login novamente'}
            secret={Boolean(sessionPassword)}
            icon="lock-outline"
          />
        </View>
      </ProfilePaper>

      <Animated.View entering={FadeInDown.delay(200).duration(420)}>
        <ProfilePaper title="Alterar senha" showStamp={false} delay={0}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : null}
          <PasswordField
            control={control}
            name="currentPassword"
            label="Senha atual"
            placeholder="Digite a senha atual"
          />
          <PasswordField
            control={control}
            name="newPassword"
            label="Nova senha"
            placeholder="Mínimo 8 caracteres"
          />
          <PasswordField
            control={control}
            name="confirmPassword"
            label="Confirmar nova senha"
            placeholder="Repita a nova senha"
          />
          <PrimaryButton label="Salvar nova senha" onPress={onChangePassword} isLoading={isLoading} />
        </ProfilePaper>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8, paddingBottom: 28 },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
  },
  fields: {
    marginTop: 8,
    paddingTop: 4,
  },
  errorBox: {
    ...cardStyles.inset,
    marginBottom: 14,
    borderColor: colors.danger,
    backgroundColor: '#F5E0DC',
  },
  error: { color: colors.danger, fontSize: 14 },
});
