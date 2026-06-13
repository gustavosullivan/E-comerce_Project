import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
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
import { useAddress } from '@/src/hooks/useAddress';
import { useTabBarInset } from '@/src/hooks/useTabBarInset';
import { useWallet } from '@/src/hooks/useWallet';
import { routes } from '@/src/navigation/routes';
import { userService } from '@/src/services/userService';
import { addressService } from '@/src/services/addressService';
import { snackbar } from '@/src/store/snackbarStore';
import { useAuthStore } from '@/src/stores/authStore';
import { cardStyles, colors, textStyles } from '@/src/theme';
import { isBuyer } from '@/src/types/auth';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { EMPTY_ADDRESS } from '@/src/types/address';
import {
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
  const { contentBottomInset } = useTabBarInset();
  const { balance } = useWallet(user?.id, isBuyer(user));
  const { address } = useAddress(user?.id);
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
      ...buildAddressValues(),
    },
  });

  useEffect(() => {
    reset({
      name: user?.name ?? '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      ...buildAddressValues(address ?? EMPTY_ADDRESS),
    });
  }, [user?.name, address, reset]);

  const onSave = handleSubmit(async (data) => {
    setError(null);
    setIsSaving(true);
    try {
      const nameChanged = data.name.trim() !== (user?.name ?? '');
      const changingPassword =
        data.currentPassword.length > 0 ||
        data.newPassword.length > 0 ||
        data.confirmPassword.length > 0;
      const nextAddress = {
        zipCode: data.zipCode.trim(),
        street: data.street.trim(),
        number: data.number.trim(),
        complement: data.complement?.trim() ?? '',
        neighborhood: data.neighborhood.trim(),
        city: data.city.trim(),
        state: data.state.trim().toUpperCase(),
      };
      const addressChanged =
        nextAddress.zipCode !== (address?.zipCode ?? '') ||
        nextAddress.street !== (address?.street ?? '') ||
        nextAddress.number !== (address?.number ?? '') ||
        nextAddress.complement !== (address?.complement ?? '') ||
        nextAddress.neighborhood !== (address?.neighborhood ?? '') ||
        nextAddress.city !== (address?.city ?? '') ||
        nextAddress.state !== (address?.state ?? '');

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

      if (user?.id && addressChanged) {
        await addressService.saveAddress(user.id, nextAddress);
      }

      if (!nameChanged && !changingPassword && !addressChanged) {
        snackbar.info('Nenhuma alteração para salvar');
        return;
      }

      reset({
        name: data.name.trim(),
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        ...buildAddressValues(nextAddress),
      });

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
    <ScreenContainer
      scroll
      keyboard
      contentStyle={{ ...styles.content, paddingBottom: contentBottomInset + 24 }}>
      <Text style={[textStyles.pageTitle, styles.pageTitle]}>Conta</Text>

      <ProfilePaper
        title="Minha Conta"
        subtitle="Foto, dados, endereço e senha"
        delay={0}>
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

        {isBuyer(user) ? (
          <View style={styles.readOnlyField}>
            <Text style={textStyles.label}>Crédito em conta</Text>
            <View style={[styles.readOnlyBox, styles.balanceBox]}>
              <Text style={styles.balanceText}>{formatCurrency(balance)}</Text>
            </View>
          </View>
        ) : null}

        <ProfilePaperDivider label="Endereço de entrega" />

        <CustomInput
          control={control}
          name="zipCode"
          label="CEP"
          placeholder="00000-000"
          keyboardType="numeric"
        />
        <CustomInput
          control={control}
          name="street"
          label="Rua"
          placeholder="Nome da rua"
          autoCapitalize="words"
        />
        <CustomInput
          control={control}
          name="number"
          label="Número"
          placeholder="123"
        />
        <CustomInput
          control={control}
          name="complement"
          label="Complemento"
          placeholder="Apto, bloco, referência (opcional)"
        />
        <CustomInput
          control={control}
          name="neighborhood"
          label="Bairro"
          placeholder="Seu bairro"
          autoCapitalize="words"
        />
        <CustomInput
          control={control}
          name="city"
          label="Cidade"
          placeholder="Sua cidade"
          autoCapitalize="words"
        />
        <CustomInput
          control={control}
          name="state"
          label="Estado (UF)"
          placeholder="RS"
          autoCapitalize="characters"
        />

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

      {isBuyer(user) ? (
        <ProfilePaper
          title="Histórico de Compras"
          subtitle="Comprovantes e pedidos realizados"
          delay={60}
          showStamp={false}>
          <Text style={styles.purchaseHint}>
            Consulte todas as compras realizadas e abra o comprovante de cada pedido.
          </Text>
          <SecondaryButton
            label="Ver histórico de compras"
            onPress={() => router.push(routes.orderHistory)}
          />
        </ProfilePaper>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8, paddingBottom: 28 },
  pageTitle: { marginBottom: 12 },
  purchaseHint: {
    fontSize: 14,
    color: colors.textMuted,
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
  balanceBox: {
    backgroundColor: '#EEF8F3',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.success,
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
