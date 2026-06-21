import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import type { ImagePickerAsset } from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/src/components/buttons/SecondaryButton';
import { CustomInput } from '@/src/components/forms/CustomInput';
import { CategoryPicker } from '@/src/components/forms/CategoryPicker';
import { ProductImagePicker } from '@/src/components/forms/ProductImagePicker';
import { Loading } from '@/src/components/layout/Loading';
import { PageContainer } from '@/src/components/layout/PageContainer';
import { ProfilePaper } from '@/src/components/layout/ProfilePaper';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { WarmAppShell } from '@/src/components/layout/WarmAppShell';
import { useTabBarInset } from '@/src/hooks/useTabBarInset';
import { useAdminProducts } from '@/src/hooks/useProducts';
import { useProduct } from '@/src/hooks/useProducts';
import { routes } from '@/src/navigation/routes';
import { MOCK_CATEGORIES } from '@/src/mocks/categories';
import { snackbar } from '@/src/store/snackbarStore';
import { getErrorMessage } from '@/src/services/api/client';
import { confirmAction } from '@/src/utils/confirm';
import { fontSizes, fonts, layout, loginGlass, radius } from '@/src/theme';
import {
  type ProductFormData,
  parseProductForm,
  productFormSchema,
  productToFormValues,
} from '@/src/validation/productSchema';

export default function AdminProductFormScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const productId = params.id ? Number(params.id) : null;
  const isEditing = productId != null && !Number.isNaN(productId);
  const { contentBottomInset } = useTabBarInset();

  const { product, isLoading: loadingProduct } = useProduct(isEditing ? productId : 0);
  const { createProduct, updateProduct, deleteProduct } = useAdminProducts();
  const [isSaving, setIsSaving] = useState(false);
  const [imageAsset, setImageAsset] = useState<ImagePickerAsset | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const { control, handleSubmit, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      categoryId: MOCK_CATEGORIES[0]?.id ?? 1,
      stock: '1',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (isEditing && product) {
      reset(productToFormValues(product));
      setImageUrl(product.imageUrl);
      setImageAsset(null);
    }
  }, [isEditing, product, reset]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(routes.home);
  };

  if (isEditing && loadingProduct) {
    return (
      <WarmAppShell>
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
          <Loading />
        </SafeAreaView>
      </WarmAppShell>
    );
  }

  const onSubmit = handleSubmit(async (data) => {
    if (!imageAsset && !imageUrl.trim()) {
      snackbar.error('Selecione uma imagem do produto');
      return;
    }

    setIsSaving(true);
    try {
      const payload = parseProductForm({ ...data, imageUrl });
      const submit = { data: payload, imageAsset };

      if (isEditing && productId) {
        await updateProduct(productId, submit);
        snackbar.success('Produto atualizado');
      } else {
        await createProduct(submit);
        snackbar.success('Produto cadastrado');
      }
      router.replace(routes.home);
    } catch (err) {
      snackbar.error(getErrorMessage(err, 'Não foi possível salvar'));
    } finally {
      setIsSaving(false);
    }
  });

  const handleDelete = () => {
    if (!isEditing || !productId) return;
    confirmAction({
      title: 'Excluir produto',
      message: 'Deseja remover este produto do catálogo?',
      confirmLabel: 'Excluir',
      onConfirm: async () => {
        try {
          await deleteProduct(productId);
          snackbar.success('Produto removido');
          router.replace(routes.home);
        } catch {
          snackbar.error('Não foi possível excluir');
        }
      },
    });
  };

  return (
    <WarmAppShell>
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={[
              styles.content,
              { paddingBottom: contentBottomInset + layout.lg },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <PageContainer>
              <Pressable style={styles.back} onPress={handleBack} hitSlop={12}>
                <MaterialIcons name="arrow-back" size={22} color={loginGlass.goldLight} />
                <Text style={styles.backText}>Voltar</Text>
              </Pressable>

              <ScreenHeader
                title={isEditing ? 'Editar produto' : 'Cadastrar produto'}
                subtitle="Nome, legenda, preço, categoria, estoque e imagem"
                icon={isEditing ? 'edit' : 'add-box'}
                variant="warm"
              />

              <ProfilePaper
                title="Imagem"
                subtitle="Selecione a foto do produto"
                showStamp={false}
                variant="warm">
                <ProductImagePicker
                  disabled={isSaving}
                  imageAsset={imageAsset}
                  imageUrl={imageUrl}
                  onRemoveImage={() => {
                    setImageUrl('');
                    setImageAsset(null);
                  }}
                  onSelectImage={setImageAsset}
                  variant="warm"
                />
              </ProfilePaper>

              <ProfilePaper title="Informações" subtitle="Dados do anúncio" delay={40} variant="warm">
                <CustomInput
                  control={control}
                  name="name"
                  label="Nome"
                  placeholder="Nome do produto"
                  variant="warm"
                />
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <View style={styles.fieldGroup}>
                      <Text style={styles.label}>Legenda / descrição</Text>
                      <TextInput
                        style={[styles.textArea, error && styles.inputError]}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Descreva a peça, história e estado de conservação"
                        placeholderTextColor={loginGlass.textMuted}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                      />
                      {error ? <Text style={styles.fieldError}>{error.message}</Text> : null}
                    </View>
                  )}
                />
                <CustomInput
                  control={control}
                  name="price"
                  label="Preço (R$)"
                  placeholder="99.90"
                  keyboardType="decimal-pad"
                  variant="warm"
                />
                <CustomInput
                  control={control}
                  name="stock"
                  label="Estoque"
                  placeholder="1"
                  keyboardType="number-pad"
                  variant="warm"
                />

                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <CategoryPicker
                      value={value}
                      onChange={onChange}
                      error={error?.message}
                      variant="warm"
                    />
                  )}
                />

                <View style={styles.actions}>
                  <PrimaryButton
                    label={isEditing ? 'Salvar alterações' : 'Salvar produto'}
                    onPress={onSubmit}
                    isLoading={isSaving}
                    variant="warm"
                  />
                  {isEditing ? (
                    <SecondaryButton
                      label="Excluir produto"
                      onPress={handleDelete}
                      variant="warm"
                    />
                  ) : null}
                </View>
              </ProfilePaper>
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
  content: {
    paddingTop: layout.sm,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: layout.sm,
  },
  backText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: loginGlass.goldLight,
    fontWeight: '600',
  },
  fieldGroup: {
    marginBottom: 8,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: loginGlass.text,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: loginGlass.formFieldBg,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: fontSizes.md,
    color: loginGlass.text,
    minHeight: 110,
  },
  inputError: {
    borderColor: 'rgba(220, 80, 70, 0.65)',
  },
  fieldError: {
    fontSize: fontSizes.xs,
    color: '#F5A8A0',
    marginTop: 6,
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
});
