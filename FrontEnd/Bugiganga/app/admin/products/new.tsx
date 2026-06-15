import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { CategoryPicker } from '@/src/components/forms/CategoryPicker';
import { CustomInput } from '@/src/components/forms/CustomInput';
import { ProfilePaper } from '@/src/components/layout/ProfilePaper';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { ScreenContainer } from '@/src/components/ui/ScreenContainer';
import { useTabBarInset } from '@/src/hooks/useTabBarInset';
import { MOCK_CATEGORIES } from '@/src/mocks/categories';
import { useAuthStore } from '@/src/store/authStore';
import { snackbar } from '@/src/store/snackbarStore';
import { productService } from '@/src/services/productService';
import { cardStyles, colors, radius, textStyles } from '@/src/theme';
import {
  type ProductFormData,
  parseProductForm,
  productFormSchema,
} from '@/src/validation/productSchema';

const DEFAULT_IMAGE = 'https://picsum.photos/seed/bugiganga-new/400/400';

export default function AdminProductNewScreen() {
  const { user } = useAuthStore();
  const { contentBottomInset } = useTabBarInset();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      categoryId: MOCK_CATEGORIES[0]?.id ?? 1,
      stock: '1',
      imageUrl: DEFAULT_IMAGE,
    },
  });

  const imageUrl = useWatch({ control, name: 'imageUrl' });
  const previewUri = imageUrl?.trim() || DEFAULT_IMAGE;

  const onSubmit = handleSubmit(async (data) => {
    if (!user?.id) {
      snackbar.error('Usuário não autenticado.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const payload = parseProductForm(data);
      await productService.create({ ...payload, userId: user.id });
      snackbar.success('Produto cadastrado com sucesso!');
      reset();
      router.replace('/(tabs)/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível cadastrar o produto.';
      setError(message);
      snackbar.error(message);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <ScreenContainer scroll keyboard contentStyle={{ paddingBottom: contentBottomInset }}>
      <ScreenHeader
        title="Cadastrar Produto"
        subtitle="Preencha os dados para adicionar um item ao seu catálogo."
        icon="add-box"
      />

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : null}

      <ProfilePaper title="Imagem" subtitle="Pré-visualização do produto" showStamp={false}>
        <View style={styles.previewWrap}>
          <Image source={{ uri: previewUri }} style={styles.previewImage} contentFit="cover" />
        </View>
        <CustomInput
          control={control}
          name="imageUrl"
          label="URL da Imagem"
          placeholder="https://example.com/imagem.jpg"
          keyboardType="url"
        />
      </ProfilePaper>

      <ProfilePaper title="Informações" subtitle="Dados principais do produto" delay={60} showStamp={false}>
        <CustomInput
          control={control}
          name="name"
          label="Nome do Produto"
          placeholder="Ex: Camisa Vintage Anos 80"
          autoCapitalize="words"
        />
        <CustomInput
          control={control}
          name="description"
          label="Descrição"
          placeholder="Detalhes do produto, estado, material..."
          multiline
          numberOfLines={4}
        />
        <Controller
          control={control}
          name="categoryId"
          render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
            <CategoryPicker
              value={value}
              onChange={onChange}
              error={fieldError?.message}
            />
          )}
        />
      </ProfilePaper>

      <ProfilePaper title="Preço e estoque" subtitle="Valores comerciais" delay={120} showStamp={false}>
        <CustomInput
          control={control}
          name="price"
          label="Preço (R$)"
          placeholder="Ex: 99.90"
          keyboardType="decimal-pad"
        />
        <CustomInput
          control={control}
          name="stock"
          label="Estoque"
          placeholder="Quantidade disponível"
          keyboardType="number-pad"
        />

        <PrimaryButton
          label="Cadastrar Produto"
          onPress={onSubmit}
          isLoading={isLoading}
          style={styles.submitButton}
        />
      </ProfilePaper>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  errorBox: {
    ...cardStyles.inset,
    backgroundColor: '#F5E0DC',
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 16,
  },
  error: {
    color: colors.danger,
    fontSize: textStyles.body.fontSize,
  },
  previewWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitButton: {
    marginTop: 8,
  },
});
