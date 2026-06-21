import { BlurView } from 'expo-blur';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/src/components/buttons/SecondaryButton';
import { CustomInput } from '@/src/components/forms/CustomInput';
import { ProfilePaper } from '@/src/components/layout/ProfilePaper';
import { EMPTY_ADDRESS, type UserAddress } from '@/src/types/address';
import { fontSizes, fonts, layout, loginGlass, radius } from '@/src/theme';
import { glassBlur } from '@/src/theme/loginGlass';
import { formatAddressCompact, hasAddress } from '@/src/utils/formatAddress';
import { addressSchema, type AddressFormData } from '@/src/validation/addressSchema';

type CheckoutAddressModalProps = {
  visible: boolean;
  address: UserAddress | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (address: UserAddress) => Promise<void>;
};

function toFormValues(address?: UserAddress | null): AddressFormData {
  return {
    zipCode: address?.zipCode ?? '',
    street: address?.street ?? '',
    number: address?.number ?? '',
    complement: address?.complement ?? '',
    neighborhood: address?.neighborhood ?? '',
    city: address?.city ?? '',
    state: address?.state ?? '',
  };
}

function toUserAddress(data: AddressFormData): UserAddress {
  return {
    zipCode: data.zipCode.trim(),
    street: data.street.trim(),
    number: data.number.trim(),
    complement: data.complement?.trim() ?? '',
    neighborhood: data.neighborhood.trim(),
    city: data.city.trim(),
    state: data.state.trim().toUpperCase(),
  };
}

export function CheckoutAddressModal({
  visible,
  address,
  isSaving,
  onClose,
  onSave,
}: CheckoutAddressModalProps) {
  const addressReady = hasAddress(address);
  const [isEditing, setIsEditing] = useState(!addressReady);

  const { control, handleSubmit, reset } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: toFormValues(address ?? EMPTY_ADDRESS),
  });

  useEffect(() => {
    if (!visible) return;
    setIsEditing(!hasAddress(address));
    reset(toFormValues(address ?? EMPTY_ADDRESS));
  }, [visible, address, reset]);

  const handleSave = handleSubmit(async (data) => {
    await onSave(toUserAddress(data));
    setIsEditing(false);
  });

  const blurIntensity =
    Platform.OS === 'android' ? glassBlur.android.modal : glassBlur.ios.modal;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <BlurView intensity={blurIntensity} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.dim} />
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Fechar" />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <ProfilePaper
              title="Endereço de entrega"
              subtitle={
                isEditing ? 'Preencha ou atualize o endereço' : 'Revise o endereço da entrega'
              }
              showStamp={false}
              delay={0}
              variant="warm">
              <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={10}>
                <MaterialIcons name="close" size={20} color={loginGlass.text} />
              </Pressable>

              {isEditing ? (
                <View style={styles.form}>
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
                    placeholder="Apto, bloco (opcional)"
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
                </View>
              ) : (
                <View style={styles.preview}>
                  <MaterialIcons name="location-on" size={22} color={loginGlass.goldLight} />
                  <Text style={styles.previewText}>{formatAddressCompact(address)}</Text>
                </View>
              )}

              <View style={styles.actions}>
                {isEditing ? (
                  <>
                    <PrimaryButton
                      label="Salvar endereço"
                      onPress={handleSave}
                      isLoading={isSaving}
                      loadingLabel="Salvando..."
                      variant="warm"
                    />
                    {addressReady ? (
                      <SecondaryButton
                        label="Cancelar"
                        onPress={() => setIsEditing(false)}
                        variant="warm"
                      />
                    ) : (
                      <SecondaryButton label="Fechar" onPress={onClose} variant="warm" />
                    )}
                  </>
                ) : (
                  <>
                    <SecondaryButton
                      label="Trocar endereço"
                      onPress={() => setIsEditing(true)}
                      variant="warm"
                    />
                    <SecondaryButton label="Fechar" onPress={onClose} variant="warm" />
                  </>
                )}
              </View>
            </ProfilePaper>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: `blur(${glassBlur.web.modal})`,
          WebkitBackdropFilter: `blur(${glassBlur.web.modal})`,
        }
      : {}),
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: loginGlass.modalOverlay,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.md,
    paddingVertical: layout.lg,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: loginGlass.formFieldBg,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: loginGlass.formFieldBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
    padding: 16,
    marginBottom: 8,
  },
  previewText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: loginGlass.text,
    lineHeight: 22,
  },
  form: {
    gap: 0,
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
});
