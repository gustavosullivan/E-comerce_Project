import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/src/components/buttons/SecondaryButton';
import { CustomInput } from '@/src/components/forms/CustomInput';
import { PasswordField } from '@/src/components/forms/PasswordField';
import { ProfilePaper, ProfilePaperDivider } from '@/src/components/layout/ProfilePaper';
import { ProfileAvatarPicker } from '@/src/components/profile/ProfileAvatarPicker';
import { ScreenContainer } from '@/src/components/ui/ScreenContainer';
import { useAuth } from '@/src/hooks/useAuth';
import { useTabBarInset } from '@/src/hooks/useTabBarInset';
import { userService } from '@/src/services/userService';
import { snackbar } from '@/src/store/snackbarStore';
import { useAuthStore } from '@/src/stores/authStore';
import { cardStyles, colors, textStyles } from '@/src/theme';
import {
  type ProfileSettingsFormData,
  profileSettingsSchema,
} from '@/src/validation/profileSettingsSchema';

export default function ProfileScreen() {
  const { user, changePassword, logout } = useAuth();
  const { contentBottomInset } = useTabBarInset();
  const setUser = useAuthStore((s) => s.setUser);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<ProfileSettingsFormData>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: user?.name ?? '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user?.name) {
      reset({
        name: user.name,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user?.name, reset]);

  const onSave = handleSubmit(async (data) => {
    setError(null);
    setIsSaving(true);
    try {
      const nameChanged = data.name.trim() !== (user?.name ?? '');
      const changingPassword =
        data.currentPassword.length > 0 ||
        data.newPassword.length > 0 ||
        data.confirmPassword.length > 0;

      if (nameChanged) {
        const updated = await userService.updateProfile({ name: data.name.trim() });
        setUser({
          id: updated.id,
          name: updated.name,
          email: updated.email,
          username: updated.username,
        });
      }

      if (changingPassword) {
        await changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        });
      }

      if (!nameChanged && !changingPassword) {
        snackbar.info('Nenhuma alteração para salvar');
        return;
      }

      reset({
        name: data.name.trim(),
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      if (nameChanged && changingPassword) {
        snackbar.success('Perfil e senha atualizados');
      } else if (nameChanged) {
        snackbar.success('Nome atualizado');
      } else {
        snackbar.success('Senha alterada com sucesso');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível salvar';
      setError(message);
      snackbar.error(message);
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <ScreenContainer
      scroll
      keyboard
      contentStyle={{ ...styles.content, paddingBottom: contentBottomInset + 24 }}>
      <Text style={[textStyles.pageTitle, styles.pageTitle]}>Conta</Text>

      <ProfilePaper
        title="Minha Conta"
        subtitle="Foto, nome e senha"
        delay={60}>
        <View style={styles.avatarBlock}>
          <ProfileAvatarPicker size="lg" />
        </View>

        <ProfilePaperDivider label="Dados" />

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}

        <CustomInput
          control={control}
          name="name"
          label="Nome"
          placeholder="Seu nome completo"
          autoCapitalize="words"
        />

        <View style={styles.readOnlyField}>
          <Text style={textStyles.label}>Email</Text>
          <View style={styles.readOnlyBox}>
            <Text style={styles.readOnlyText}>{user?.email ?? '—'}</Text>
          </View>
        </View>

        <ProfilePaperDivider label="Senha" />

        <PasswordField
          control={control}
          name="currentPassword"
          label="Senha atual"
          placeholder="Só se for trocar a senha"
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

        <View style={styles.actions}>
          <PrimaryButton label="Salvar alterações" onPress={onSave} isLoading={isSaving} />
          <SecondaryButton label="Sair da conta" onPress={logout} />
        </View>
      </ProfilePaper>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8, paddingBottom: 28 },
  pageTitle: { marginBottom: 12 },
  avatarBlock: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  readOnlyField: {
    marginBottom: 14,
  },
  readOnlyBox: {
    ...cardStyles.inset,
    paddingVertical: 12,
    opacity: 0.85,
  },
  readOnlyText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMuted,
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
  errorBox: {
    ...cardStyles.inset,
    marginBottom: 14,
    borderColor: colors.danger,
    backgroundColor: '#F5E0DC',
  },
  error: { color: colors.danger, fontSize: 14 },
});
