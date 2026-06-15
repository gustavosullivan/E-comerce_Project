import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/src/components/buttons/SecondaryButton';
import { CustomInput } from '@/src/components/forms/CustomInput';
import { CategoryPicker } from '@/src/components/forms/CategoryPicker';
import { Loading } from '@/src/components/layout/Loading';
import { ProfilePaper } from '@/src/components/layout/ProfilePaper';
import { ScreenContainer } from '@/src/components/ui/ScreenContainer';
import { useAdminProducts } from '@/src/hooks/useProducts';
import { useProduct } from '@/src/hooks/useProducts';
import { MOCK_CATEGORIES } from '@/src/mocks/categories';
import { snackbar } from '@/src/store/snackbarStore';
import { confirmAction } from '@/src/utils/confirm';
import { colors, fontSizes, fonts, radius, textStyles } from '@/src/theme';
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

  const { product, isLoading: loadingProduct } = useProduct(isEditing ? productId : 0);
  const { createProduct, updateProduct, deleteProduct } = useAdminProducts();
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      categoryId: MOCK_CATEGORIES[0]?.id ?? 1,
      stock: '1',
      imageUrl: 'https://picsum.photos/seed/bugiganga-new/400/400',
    },
  });

  useEffect(() => {
    if (isEditing && product) {
      reset(productToFormValues(product));
    }
  }, [isEditing, product, reset]);

  if (isEditing && loadingProduct) {
    return (
      <ScreenContainer>
        <Loading />
      </ScreenContainer>
    );
  }

  const onSubmit = handleSubmit(async (data) => {
    setIsSaving(true);
    try {
      const payload = parseProductForm(data);
      if (isEditing && productId) {
        await updateProduct(productId, payload);
        snackbar.success('Produto atualizado');
      } else {
        await createProduct(payload);
        snackbar.success('Produto cadastrado');
      }
      router.replace('/(tabs)/');
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : 'Não foi possível salvar');
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
          router.replace('/(tabs)/');
        } catch {
          snackbar.error('Não foi possível excluir');
        }
      },
    });
  };

  return (
    <ScreenContainer scroll keyboard contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        <Text style={styles.backText}>Voltar</Text>
      </Pressable>

      <Text style={[textStyles.pageTitle, styles.pageTitle]}>
        {isEditing ? 'Editar produto' : 'Cadastrar produto'}
      </Text>
      <Text style={styles.subtitle}>
        Nome, legenda (descrição), preço, categoria, estoque e imagem
      </Text>

      <ProfilePaper title="Informações" subtitle="Dados do anúncio" delay={40}>
        <CustomInput control={control} name="name" label="Nome" placeholder="Nome do produto" />
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
                placeholderTextColor={colors.textMuted}
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
        />
        <CustomInput
          control={control}
          name="stock"
          label="Estoque"
          placeholder="1"
          keyboardType="number-pad"
        />
        <CustomInput
          control={control}
          name="imageUrl"
          label="URL da imagem"
          placeholder="https://..."
        />

        <Controller
          control={control}
          name="categoryId"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <CategoryPicker value={value} onChange={onChange} error={error?.message} />
          )}
        />

        <View style={styles.actions}>
          <PrimaryButton
            label={isEditing ? 'Salvar alterações' : 'Salvar produto'}
            onPress={onSubmit}
            isLoading={isSaving}
          />
          {isEditing ? (
            <SecondaryButton label="Excluir produto" onPress={handleDelete} />
          ) : null}
        </View>
      </ProfilePaper>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  backText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: colors.primary,
    fontWeight: '600',
  },
  pageTitle: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 8,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: fontSizes.md,
    color: colors.text,
    minHeight: 110,
  },
  inputError: {
    borderColor: colors.danger,
  },
  fieldError: {
    fontSize: fontSizes.xs,
    color: colors.danger,
    marginTop: 6,
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
});
