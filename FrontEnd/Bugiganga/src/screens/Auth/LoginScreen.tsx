import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PasswordVisibilityToggle } from '@/src/components/forms/PasswordVisibilityToggle';
import { LoginGlassBackground } from '@/src/components/layout/LoginGlassBackground';
import { LoginLogo } from '@/src/components/layout/LoginLogo';
import { WarmGlassSurface } from '@/src/components/layout/WarmGlassSurface';
import {
  DEV_BUYER_LOGIN_FORM,
  DEV_SELLER_LOGIN_FORM,
} from '@/src/config/devCredentials';
import { useAuth } from '@/src/hooks/useAuth';
import { useDevLoginDefaults } from '@/src/hooks/useDevLoginDefaults';
import { fontSizes, fonts, radius, shadows } from '@/src/theme';
import { loginGlass } from '@/src/theme/loginGlass';
import { type LoginFormData, loginSchema } from '@/src/validation/loginSchema';

type UserRole = 'buyer' | 'seller';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();
  const { defaults, ready, save } = useDevLoginDefaults();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('buyer');
  const { control, handleSubmit, reset } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: DEV_BUYER_LOGIN_FORM,
  });

  useEffect(() => {
    if (ready) {
      reset(defaults);
      setRole(
        defaults.email === DEV_SELLER_LOGIN_FORM.email ? 'seller' : 'buyer',
      );
    }
  }, [ready, defaults, reset]);

  const onSubmit = handleSubmit((data) => {
    clearError();
    save(data);
    login(data);
  });

  const selectRole = (nextRole: UserRole) => {
    clearError();
    setRole(nextRole);
    const credentials =
      nextRole === 'seller' ? DEV_SELLER_LOGIN_FORM : DEV_BUYER_LOGIN_FORM;
    reset(credentials);
    save(credentials);
  };

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
              style={styles.loginCard}
              contentStyle={styles.loginContent}>
              <LoginLogo />

              <View style={styles.formDivider}>
                <Text style={styles.formTitle}>Acesse sua conta</Text>
              </View>

              {error ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <LoginField
                    control={control}
                    name="email"
                    label="Email"
                    placeholder={
                      role === 'seller'
                        ? DEV_SELLER_LOGIN_FORM.email
                        : DEV_BUYER_LOGIN_FORM.email
                    }
                    keyboardType="email-address"
                  />
                  <PasswordField
                    control={control}
                    show={showPassword}
                    onToggle={() => setShowPassword((p) => !p)}
                    onSubmit={onSubmit}
                  />

                  <Pressable
                    style={styles.forgotLink}
                    onPress={() => router.push('/forgot-password')}>
                    <Text style={styles.forgotText}>Esqueci a senha</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.loginButton,
                      pressed && styles.loginButtonPressed,
                      isLoading && styles.loginButtonDisabled,
                    ]}
                    onPress={onSubmit}
                    disabled={isLoading}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color={loginGlass.text} />
                    ) : (
                      <Text style={styles.loginButtonText}>Entrar</Text>
                    )}
                  </Pressable>

                  <View style={styles.roleToggle}>
                    <Pressable
                      style={[
                        styles.roleSegment,
                        role === 'buyer' && styles.roleSegmentActive,
                      ]}
                      onPress={() => selectRole('buyer')}
                      disabled={isLoading}>
                      <MaterialIcons
                        name="shopping-bag"
                        size={16}
                        color={role === 'buyer' ? loginGlass.text : loginGlass.goldMuted}
                      />
                      <Text
                        style={[
                          styles.roleText,
                          role === 'buyer' && styles.roleTextActive,
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.82}>
                        Sou comprador
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.roleSegment,
                        role === 'seller' && styles.roleSegmentActive,
                      ]}
                      onPress={() => selectRole('seller')}
                      disabled={isLoading}>
                      <MaterialIcons
                        name="storefront"
                        size={16}
                        color={role === 'seller' ? loginGlass.text : loginGlass.goldMuted}
                      />
                      <Text
                        style={[
                          styles.roleText,
                          role === 'seller' && styles.roleTextActive,
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.82}>
                        Sou vendedor
                      </Text>
                    </Pressable>
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.registerLink,
                      pressed && styles.registerLinkPressed,
                    ]}
                    onPress={() => router.push('/register')}>
                    <Text style={styles.registerText}>Cadastre-se</Text>
                  </Pressable>
            </WarmGlassSurface>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function LoginField({
  control,
  name,
  label,
  placeholder,
  keyboardType,
}: {
  control: Control<LoginFormData>;
  name: keyof LoginFormData;
  label: string;
  placeholder: string;
  keyboardType?: 'email-address' | 'default';
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
              style={[styles.input, error && styles.inputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              placeholderTextColor={loginGlass.textMuted}
              autoCapitalize="none"
              keyboardType={keyboardType}
              autoCorrect={false}
            />
            {error ? <Text style={styles.fieldError}>{error.message}</Text> : null}
          </>
        )}
      />
    </View>
  );
}

function PasswordField({
  control,
  show,
  onToggle,
  onSubmit,
}: {
  control: Control<LoginFormData>;
  show: boolean;
  onToggle: () => void;
  onSubmit: () => void;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Senha</Text>
      <View>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <>
              <TextInput
                style={[styles.input, styles.inputWithToggle, error && styles.inputError]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="••••••••"
                placeholderTextColor={loginGlass.textMuted}
                secureTextEntry={!show}
                onSubmitEditing={onSubmit}
              />
              {error ? <Text style={styles.fieldError}>{error.message}</Text> : null}
            </>
          )}
        />
        <PasswordVisibilityToggle
          visible={show}
          onToggle={onToggle}
          iconColor={loginGlass.goldMuted}
        />
      </View>
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
    paddingVertical: 24,
    justifyContent: 'center',
  },
  loginCard: {
    borderRadius: radius.lg,
    ...shadows.md,
  },
  loginContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
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
    fontWeight: '700',
    color: loginGlass.textMuted,
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
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: loginGlass.text,
  },
  inputWithToggle: { paddingRight: 48 },
  inputError: { borderColor: '#F87171' },
  fieldError: { fontSize: fontSizes.xs, color: '#FCA5A5', marginTop: 6 },
  forgotLink: { alignSelf: 'flex-end', marginBottom: 18, marginTop: -4 },
  forgotText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: loginGlass.goldLight,
    textDecorationLine: 'underline',
  },
  loginButton: {
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
  loginButtonPressed: {
    backgroundColor: loginGlass.formButtonPrimaryPressed,
    opacity: 0.96,
  },
  loginButtonDisabled: { opacity: 0.65 },
  loginButtonText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: loginGlass.text,
  },
  roleToggle: {
    flexDirection: 'row',
    marginTop: 16,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
    backgroundColor: loginGlass.formTrackBg,
    padding: 4,
    gap: 4,
    minHeight: 52,
  },
  roleSegment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 6,
    borderRadius: radius.full,
    minHeight: 44,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  roleSegmentActive: {
    backgroundColor: loginGlass.chipActiveBg,
    borderColor: loginGlass.chipActiveBorder,
  },
  roleText: {
    flexShrink: 1,
    fontFamily: fonts.sans,
    fontSize: 12,
    fontWeight: '600',
    color: loginGlass.formToggleText,
  },
  roleTextActive: {
    color: loginGlass.text,
    fontWeight: '800',
  },
  registerLink: {
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
  registerLinkPressed: {
    backgroundColor: 'rgba(45, 30, 20, 0.72)',
    opacity: 0.96,
  },
  registerText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '800',
    color: loginGlass.goldLight,
    letterSpacing: 0.3,
  },
});
