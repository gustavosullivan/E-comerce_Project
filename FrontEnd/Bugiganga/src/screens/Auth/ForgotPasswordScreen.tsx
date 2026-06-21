import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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
import { z } from 'zod';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { CustomInput } from '@/src/components/forms/CustomInput';
import { LoginGlassBackground } from '@/src/components/layout/LoginGlassBackground';
import { LoginLogo } from '@/src/components/layout/LoginLogo';
import { WarmGlassSurface } from '@/src/components/layout/WarmGlassSurface';
import { authService } from '@/src/services/authService';
import { snackbar } from '@/src/store/snackbarStore';
import { fontSizes, fonts, radius, shadows } from '@/src/theme';
import { loginGlass } from '@/src/theme/loginGlass';

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
    <View style={styles.root}>
      <StatusBar style="light" />
      <LoginGlassBackground />
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
              <MaterialIcons name="arrow-back" size={22} color={loginGlass.goldLight} />
              <Text style={styles.backText}>Voltar</Text>
            </Pressable>

            <WarmGlassSurface
              level="card"
              variant="card"
              style={styles.card}
              contentStyle={styles.cardContent}>
              <LoginLogo />

              <View style={styles.formDivider}>
                <Text style={styles.formTitle}>Recupere o acesso à sua conta</Text>
              </View>

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
                variant="warm"
              />

              <PrimaryButton
                label="Enviar link"
                onPress={onSubmit}
                isLoading={isLoading}
                variant="warm"
              />

              <Pressable
                style={({ pressed }) => [styles.loginLink, pressed && styles.loginLinkPressed]}
                onPress={() => router.replace('/login')}>
                <Text style={styles.loginText}>Voltar ao login</Text>
              </Pressable>
            </WarmGlassSurface>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: loginGlass.background },
  screen: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: loginGlass.goldLight,
    fontWeight: '600',
  },
  card: {
    borderRadius: radius.lg,
    ...shadows.md,
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
  },
  formDivider: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: loginGlass.cardBorder,
  },
  formTitle: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: loginGlass.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.textMuted,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    color: '#FECACA',
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 8,
  },
  loginLinkPressed: { opacity: 0.88 },
  loginText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: loginGlass.goldLight,
    textDecorationLine: 'underline',
  },
});
