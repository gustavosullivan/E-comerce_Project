import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/src/components/buttons/SecondaryButton';
import { CustomInput } from '@/src/components/forms/CustomInput';
import { PasswordField } from '@/src/components/forms/PasswordField';
import { PageContainer } from '@/src/components/layout/PageContainer';
import { ProfilePaper, ProfilePaperDivider } from '@/src/components/layout/ProfilePaper';
import { ProfileAvatarPicker } from '@/src/components/profile/ProfileAvatarPicker';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { WarmAppShell } from '@/src/components/layout/WarmAppShell';
import { useAuth } from '@/src/hooks/useAuth';
import { useAddress } from '@/src/hooks/useAddress';
import { useTabBarInset } from '@/src/hooks/useTabBarInset';
import { useWallet } from '@/src/hooks/useWallet';
import { routes } from '@/src/navigation/routes';
import { userService } from '@/src/services/userService';
import { addressService } from '@/src/services/addressService';
import { snackbar } from '@/src/store/snackbarStore';
import { useAuthStore } from '@/src/store/authStore';
import { cardStyles, colors, fontSizes, fonts, layout, loginGlass, radius } from '@/src/theme';
import { isBuyer } from '@/src/types/auth';
import { confirmAction } from '@/src/utils/confirm';
import { EMPTY_ADDRESS } from '@/src/types/address';
import { formatCurrency } from '@/src/utils/formatCurrency';
import {
  type AdminProfileSettingsFormData,
  adminProfileSettingsSchema,
  type ProfileSettingsFormData,
  profileSettingsSchema,
} from '@/src/validation/profileSettingsSchema';

function buildAddressValues(address = EMPTY_ADDRESS) {
  return {
    zipCode: address.zipCode ?? '',
    street: address.street ?? '',
    number: address.number ?? '',
    complement: address.complement ?? '',
    neighborhood: address.neighborhood ?? '',
    city: address.city ?? '',
    state: address.state ?? '',
  };
}

export default function ProfileScreen() {
  const { user, changePassword, logout } = useAuth();
  const buyer = isBuyer(user);
  const { contentBottomInset } = useTabBarInset();
  const { balance } = useWallet(user?.id, buyer);
  const { address } = useAddress(buyer ? user?.id : undefined);
  const setUser = useAuthStore((s) => s.setUser);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    confirmAction({
      title: 'Confirmação de Saída',
      message: 'Tem certeza de que deseja sair da sua conta?',
      confirmLabel: 'Sair',
      onConfirm: logout,
    });
  };

  const { control, handleSubmit, reset } = useForm<
    ProfileSettingsFormData | AdminProfileSettingsFormData
  >({
    resolver: zodResolver(buyer ? profileSettingsSchema : adminProfileSettingsSchema),
    defaultValues: buyer
      ? {
          name: user?.name ?? '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          ...buildAddressValues(),
        }
      : {
          name: user?.name ?? '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        },
  });

  useEffect(() => {
    if (buyer) {
      reset({
        name: user?.name ?? '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        ...buildAddressValues(address ?? EMPTY_ADDRESS),
      });
      return;
    }

    reset({
      name: user?.name ?? '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }, [user?.name, address, buyer, reset]);

  const onSave = handleSubmit(async (data) => {
    setError(null);
    setIsSaving(true);
    try {
      const nameChanged = data.name.trim() !== (user?.name ?? '');
      const changingPassword =
        data.currentPassword.length > 0 ||
        data.newPassword.length > 0 ||
        data.confirmPassword.length > 0;
      let addressChanged = false;
      let nextAddress = EMPTY_ADDRESS;

      if (buyer && 'zipCode' in data) {
        nextAddress = {
          zipCode: data.zipCode.trim(),
          street: data.street.trim(),
          number: data.number.trim(),
          complement: data.complement?.trim() ?? '',
          neighborhood: data.neighborhood.trim(),
          city: data.city.trim(),
          state: data.state.trim().toUpperCase(),
        };
        addressChanged =
          nextAddress.zipCode !== (address?.zipCode ?? '') ||
          nextAddress.street !== (address?.street ?? '') ||
          nextAddress.number !== (address?.number ?? '') ||
          nextAddress.complement !== (address?.complement ?? '') ||
          nextAddress.neighborhood !== (address?.neighborhood ?? '') ||
          nextAddress.city !== (address?.city ?? '') ||
          nextAddress.state !== (address?.state ?? '');
      }

      if (nameChanged) {
        const updated = await userService.updateProfile({ name: data.name.trim() });
        if (user) {
          setUser({
            ...user,
            id: updated.id,
            name: updated.name,
            email: updated.email,
            username: updated.username,
          });
        }
      }

      if (changingPassword) {
        await changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        });
      }

      if (buyer && user?.id && addressChanged) {
        await addressService.saveAddress(user.id, nextAddress);
      }

      if (!nameChanged && !changingPassword && !addressChanged) {
        snackbar.info('Nenhuma alteração para salvar');
        return;
      }

      reset(
        buyer
          ? {
              name: data.name.trim(),
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
              ...buildAddressValues(nextAddress),
            }
          : {
              name: data.name.trim(),
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            },
      );

      if (nameChanged && changingPassword && addressChanged) {
        snackbar.success('Perfil, endereço e senha atualizados');
      } else if (nameChanged && addressChanged) {
        snackbar.success('Perfil e endereço atualizados');
      } else if (changingPassword && addressChanged) {
        snackbar.success('Endereço e senha atualizados');
      } else if (addressChanged) {
        snackbar.success('Endereço atualizado');
      } else if (nameChanged && changingPassword) {
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
    <WarmAppShell>
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: contentBottomInset + layout.lg }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <PageContainer>
              <ScreenHeader title="Conta" icon="person" variant="warm" />

              <ProfilePaper title="Minha Conta" delay={0} variant="warm">
                <View style={styles.avatarBlock}>
                  <ProfileAvatarPicker size="lg" variant="warm" />
                </View>

                <ProfilePaperDivider label="Dados" variant="warm" />

                {error ? (
                  <View style={[styles.errorBox, styles.errorBoxWarm]}>
                    <Text style={styles.error}>{error}</Text>
                  </View>
                ) : null}

                <CustomInput
                  control={control}
                  name="name"
                  label="Nome"
                  placeholder="Seu nome completo"
                  autoCapitalize="words"
                  variant="warm"
                />

                <View style={styles.readOnlyField}>
                  <Text style={styles.readOnlyLabel}>Email</Text>
                  <View style={styles.readOnlyBox}>
                    <Text style={styles.readOnlyText}>{user?.email ?? '—'}</Text>
                  </View>
                </View>

                {buyer ? (
                  <View style={styles.readOnlyField}>
                    <Text style={styles.readOnlyLabel}>Crédito em conta</Text>
                    <View style={[styles.readOnlyBox, styles.balanceBox]}>
                      <Text style={styles.balanceText}>{formatCurrency(balance)}</Text>
                    </View>
                  </View>
                ) : null}

                {buyer ? (
                  <>
                    <ProfilePaperDivider label="Endereço de entrega" variant="warm" />

                    <CustomInput
                      control={control}
                      name="zipCode"
                      label="CEP"
                      placeholder="00000-000"
                      keyboardType="numeric"
                      variant="warm"
                    />
                    <CustomInput
                      control={control}
                      name="street"
                      label="Rua"
                      placeholder="Nome da rua"
                      autoCapitalize="words"
                      variant="warm"
                    />
                    <CustomInput
                      control={control}
                      name="number"
                      label="Número"
                      placeholder="123"
                      variant="warm"
                    />
                    <CustomInput
                      control={control}
                      name="complement"
                      label="Complemento"
                      placeholder="Apto, bloco, referência (opcional)"
                      variant="warm"
                    />
                    <CustomInput
                      control={control}
                      name="neighborhood"
                      label="Bairro"
                      placeholder="Seu bairro"
                      autoCapitalize="words"
                      variant="warm"
                    />
                    <CustomInput
                      control={control}
                      name="city"
                      label="Cidade"
                      placeholder="Sua cidade"
                      autoCapitalize="words"
                      variant="warm"
                    />
                    <CustomInput
                      control={control}
                      name="state"
                      label="Estado (UF)"
                      placeholder="RS"
                      autoCapitalize="characters"
                      variant="warm"
                    />
                  </>
                ) : null}

                <ProfilePaperDivider label="Senha" variant="warm" />

                <PasswordField
                  control={control}
                  name="currentPassword"
                  label="Senha atual"
                  placeholder="Só se for trocar a senha"
                  variant="warm"
                />
                <PasswordField
                  control={control}
                  name="newPassword"
                  label="Nova senha"
                  placeholder="Mínimo 8 caracteres"
                  variant="warm"
                />
                <PasswordField
                  control={control}
                  name="confirmPassword"
                  label="Confirmar nova senha"
                  placeholder="Repita a nova senha"
                  variant="warm"
                />

                <View style={styles.actions}>
                  <PrimaryButton
                    label="Salvar alterações"
                    onPress={onSave}
                    isLoading={isSaving}
                    variant="warm"
                  />
                  <SecondaryButton label="Sair da conta" onPress={handleLogout} variant="warm" />
                </View>
              </ProfilePaper>

              {buyer ? (
                <ProfilePaper
                  title="Histórico de Compras"
                  subtitle="Comprovantes e pedidos realizados"
                  delay={60}
                  showStamp={false}
                  variant="warm">
                  <Text style={styles.purchaseHint}>
                    Consulte todas as compras realizadas e abra o comprovante de cada pedido.
                  </Text>
                  <SecondaryButton
                    label="Ver histórico de compras"
                    onPress={() => router.push(routes.orderHistory)}
                    variant="warm"
                  />
                </ProfilePaper>
              ) : null}
            </PageContainer>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </WarmAppShell>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  content: { paddingTop: layout.sm },
  purchaseHint: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.textMuted,
    lineHeight: 20,
    marginBottom: 14,
  },
  avatarBlock: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  readOnlyField: {
    marginBottom: 14,
  },
  readOnlyLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: loginGlass.formLabel,
    marginBottom: 8,
  },
  readOnlyBox: {
    backgroundColor: loginGlass.formFieldBg,
    borderWidth: 1,
    borderColor: loginGlass.formFieldBorder,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 12,
    opacity: 0.9,
  },
  readOnlyText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: loginGlass.textMuted,
  },
  balanceBox: {
    backgroundColor: 'rgba(16, 120, 80, 0.22)',
    borderColor: 'rgba(120, 220, 170, 0.28)',
  },
  balanceText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '800',
    color: loginGlass.goldLight,
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
  errorBoxWarm: {
    backgroundColor: 'rgba(120, 40, 30, 0.35)',
    borderColor: 'rgba(255, 140, 120, 0.45)',
    borderRadius: radius.md,
  },
  error: { color: colors.danger, fontSize: 14 },
});
