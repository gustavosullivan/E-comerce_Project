import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Controller, useForm, type Control } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { PasswordVisibilityToggle } from '@/src/components/forms/PasswordVisibilityToggle';
import { LoginGlassBackground } from '@/src/components/layout/LoginGlassBackground';
import { LoginLogo } from '@/src/components/layout/LoginLogo';
import { WarmGlassSurface } from '@/src/components/layout/WarmGlassSurface';
import { useAuth } from '@/src/hooks/useAuth';
import { fontSizes, fonts, radius, shadows } from '@/src/theme';
import { loginGlass } from '@/src/theme/loginGlass';
import { type RegisterFormData, registerSchema } from '@/src/validation/registerSchema';

const webInputReset =
  Platform.OS === 'web'
    ? ({
        outlineStyle: 'none',
        boxShadow: 'none',
      } as unknown as TextStyle)
    : null;

export default function RegisterScreen() {
  const { register, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', type: 'Common' },
  });

  const onSubmit = handleSubmit((data) => {
    clearError();
    register(data);
  });

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LoginGlassBackground />
      <SafeAreaView style={styles.screen}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <WarmGlassSurface
              level="card"
              variant="card"
              style={styles.registerCard}
              contentStyle={styles.registerContent}>
              <Pressable style={styles.backBtn} onPress={() => router.back()}>
                <MaterialIcons name="arrow-back" size={20} color={loginGlass.goldLight} />
                <Text style={styles.backText}>Voltar</Text>
              </Pressable>

              <LoginLogo />

              <View style={styles.formDivider}>
                <Text style={styles.formTitle}>Crie sua conta</Text>
                <Text style={styles.formSubtitle}>Entre para comprar suas bugigangas favoritas</Text>
              </View>

              {error ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <RegisterField
                control={control}
                name="name"
                label="Nome"
                placeholder="Seu nome"
                autoCapitalize="words"
              />
              <RegisterField
                control={control}
                name="email"
                label="Email"
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <PwdField
                control={control}
                name="password"
                label="Senha"
                show={showPassword}
                onToggle={() => setShowPassword((p) => !p)}
              />
              <PwdField
                control={control}
                name="confirmPassword"
                label="Confirmar senha"
                show={showConfirm}
                onToggle={() => setShowConfirm((p) => !p)}
                onSubmit={onSubmit}
              />

              <Controller
                control={control}
                name="type"
                render={({ field: { value, onChange } }) => (
                  <View style={[styles.fieldGroup, { marginTop: 10 }]}>
                    <Text style={styles.label}>Tipo de conta</Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                      <Pressable
                        style={[
                          { flex: 1, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: loginGlass.goldMuted, alignItems: 'center' },
                          value === 'Common' && { backgroundColor: loginGlass.goldMuted }
                        ]}
                        onPress={() => onChange('Common')}
                      >
                        <Text style={{ color: value === 'Common' ? '#000' : loginGlass.text, fontWeight: value === 'Common' ? 'bold' : 'normal' }}>Cliente</Text>
                      </Pressable>
                      <Pressable
                        style={[
                          { flex: 1, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: loginGlass.goldMuted, alignItems: 'center' },
                          value === 'Admin' && { backgroundColor: loginGlass.goldMuted }
                        ]}
                        onPress={() => onChange('Admin')}
                      >
                        <Text style={{ color: value === 'Admin' ? '#000' : loginGlass.text, fontWeight: value === 'Admin' ? 'bold' : 'normal' }}>Vendedor</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.registerButton,
                  pressed && styles.registerButtonPressed,
                  isLoading && styles.registerButtonDisabled,
                ]}
                onPress={onSubmit}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={loginGlass.text} />
                ) : (
                  <Text style={styles.registerButtonText}>Criar conta</Text>
                )}
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.loginLink,
                  pressed && styles.loginLinkPressed,
                ]}
                onPress={() => router.replace('/login')}>
                <Text style={styles.loginText}>Já possui conta? Entrar</Text>
              </Pressable>
            </WarmGlassSurface>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function RegisterField({
  control,
  name,
  label,
  placeholder,
  keyboardType,
  autoCapitalize = 'none',
}: {
  control: Control<RegisterFormData>;
  name: 'name' | 'email';
  label: string;
  placeholder: string;
  keyboardType?: 'email-address' | 'default';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <TextInput
              style={[styles.input, webInputReset, error && styles.inputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              onFocus={clearNativeFocusColor}
              placeholder={placeholder}
              placeholderTextColor={loginGlass.textMuted}
              selectionColor={loginGlass.goldLight}
              cursorColor={loginGlass.goldLight}
              underlineColorAndroid="transparent"
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              autoCorrect={false}
              autoComplete="off"
            />
            {error ? <Text style={styles.fieldError}>{error.message}</Text> : null}
          </>
        )}
      />
    </View>
  );
}

function PwdField({
  control,
  name,
  label,
  show,
  onToggle,
  onSubmit,
}: {
  control: Control<RegisterFormData>;
  name: 'password' | 'confirmPassword';
  label: string;
  show: boolean;
  onToggle: () => void;
  onSubmit?: () => void;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <View>
              <TextInput
                style={[styles.input, webInputReset, error && styles.inputError]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                onFocus={clearNativeFocusColor}
                placeholder=""
                placeholderTextColor={loginGlass.textMuted}
                selectionColor={loginGlass.goldLight}
                cursorColor={loginGlass.goldLight}
                underlineColorAndroid="transparent"
                secureTextEntry={!show}
                autoComplete="new-password"
                onSubmitEditing={onSubmit}
              />
              <PasswordVisibilityToggle
                visible={show}
                onToggle={onToggle}
                iconColor={loginGlass.goldMuted}
              />
            </View>
            {error ? <Text style={styles.fieldError}>{error.message}</Text> : null}
          </>
        )}
      />
    </View>
  );
}

function clearNativeFocusColor() {
  // Mantem a cor glass no web/Android, que podem aplicar destaque branco no foco.
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: loginGlass.background },
  screen: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  registerCard: {
    borderRadius: radius.lg,
    ...shadows.md,
  },
  registerContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
  },
  backBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    paddingVertical: 6,
  },
  backText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.goldLight,
    fontWeight: '700',
  },
  formDivider: {
    marginBottom: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: loginGlass.cardBorder,
  },
  formTitle: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '800',
    color: loginGlass.textMuted,
    textAlign: 'center',
  },
  formSubtitle: {
    marginTop: 4,
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.textMuted,
    textAlign: 'center',
    lineHeight: 19,
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
  fieldGroup: { marginBottom: 14 },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: loginGlass.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: loginGlass.formFieldBg,
    borderWidth: 1,
    borderColor: loginGlass.formFieldBorder,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 48,
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: loginGlass.text,
  },
  inputError: { borderColor: '#F87171' },
  fieldError: { fontSize: fontSizes.xs, color: '#FCA5A5', marginTop: 6 },
  registerButton: {
    backgroundColor: loginGlass.formButtonPrimary,
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderWidth: 1,
    borderColor: loginGlass.formButtonPrimaryBorder,
    ...shadows.sm,
  },
  registerButtonPressed: {
    backgroundColor: loginGlass.formButtonPrimaryPressed,
    opacity: 0.96,
  },
  registerButtonDisabled: { opacity: 0.65 },
  registerButtonText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: loginGlass.text,
  },
  loginLink: {
    alignSelf: 'stretch',
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
    backgroundColor: loginGlass.formButtonSecondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  loginLinkPressed: {
    backgroundColor: 'rgba(45, 30, 20, 0.72)',
    opacity: 0.96,
  },
  loginText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '800',
    color: loginGlass.goldLight,
    letterSpacing: 0.3,
  },
});
