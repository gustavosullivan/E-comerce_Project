import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { CustomInput } from '@/src/components/forms/CustomInput';
import { LogoHeader } from '@/src/components/layout/LogoHeader';
import { VintageCard } from '@/src/components/layout/VintageCard';
import { authService } from '@/src/services/authService';
import { snackbar } from '@/src/store/snackbarStore';
import { colors, fontSizes, fonts, radius } from '@/src/theme';

const forgotSchema = z.object({
  email: z.string().min(1, 'Informe seu e-mail').email('E-mail inválido'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.forgotPassword({ email: data.email });
      snackbar.success('Link de recuperação enviado para seu e-mail');
      router.replace('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar o link.');
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>

          <LogoHeader tagline="Recupere o acesso à sua conta" />

          <VintageCard>
            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Text style={styles.description}>
              Informe o e-mail cadastrado. Enviaremos instruções para redefinir sua senha.
            </Text>

            <CustomInput
              control={control}
              name="email"
              label="E-mail"
              placeholder="seu@email.com"
              keyboardType="email-address"
            />

            <PrimaryButton label="Enviar link" onPress={onSubmit} isLoading={isLoading} />
          </VintageCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 32 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  backText: { fontSize: fontSizes.md, color: colors.primary, fontWeight: '600' },
  description: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 16,
  },
  errorBanner: {
    backgroundColor: colors.dangerLight,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: colors.danger, fontSize: fontSizes.sm },
});
