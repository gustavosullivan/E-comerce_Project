import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/src/components/buttons/SecondaryButton';
import { WarmGlassSurface } from '@/src/components/layout/WarmGlassSurface';
import { useConfirmStore } from '@/src/store/confirmStore';
import { fontSizes, fonts, loginGlass, radius, shadows } from '@/src/theme';
import { glassBlur } from '@/src/theme/loginGlass';

export function ConfirmModal() {
  const visible = useConfirmStore((s) => s.visible);
  const title = useConfirmStore((s) => s.title);
  const message = useConfirmStore((s) => s.message);
  const confirmLabel = useConfirmStore((s) => s.confirmLabel);
  const cancelLabel = useConfirmStore((s) => s.cancelLabel);
  const destructive = useConfirmStore((s) => s.destructive);
  const hide = useConfirmStore((s) => s.hide);
  const confirm = useConfirmStore((s) => s.confirm);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await confirm();
    } finally {
      setIsLoading(false);
    }
  };

  const blurIntensity =
    Platform.OS === 'android' ? glassBlur.android.modal : glassBlur.ios.modal;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={hide}>
      <View style={styles.overlay}>
        <BlurView intensity={blurIntensity} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.dim} />
        <Pressable style={styles.backdrop} onPress={hide} accessibilityRole="button" />

        <View style={styles.paperWrap}>
          <WarmGlassSurface
            level="card"
            variant="modal"
            style={styles.paper}
            contentStyle={styles.paperContent}>
            <View style={[styles.iconBadge, destructive && styles.iconBadgeDanger]}>
              <MaterialIcons
                name={destructive ? 'delete-outline' : 'help-outline'}
                size={22}
                color={destructive ? '#FFB4A8' : loginGlass.goldLight}
              />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.actions}>
              <SecondaryButton label={cancelLabel} onPress={hide} variant="warm" />
              {destructive ? (
                <Pressable
                  style={[styles.dangerButton, isLoading && styles.dangerButtonDisabled]}
                  onPress={handleConfirm}
                  disabled={isLoading}>
                  <Text style={styles.dangerButtonText}>{confirmLabel}</Text>
                </Pressable>
              ) : (
                <PrimaryButton
                  label={confirmLabel}
                  onPress={handleConfirm}
                  isLoading={isLoading}
                  variant="warm"
                />
              )}
            </View>
          </WarmGlassSurface>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
  paperWrap: {
    width: '100%',
    maxWidth: 360,
    zIndex: 1,
  },
  paper: {
    borderRadius: radius.lg,
    ...shadows.lg,
  },
  paperContent: {
    padding: 24,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: loginGlass.formFieldBg,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconBadgeDanger: {
    backgroundColor: 'rgba(120, 40, 30, 0.45)',
    borderColor: 'rgba(255, 140, 120, 0.35)',
  },
  title: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    fontWeight: '800',
    color: loginGlass.text,
    marginBottom: 8,
  },
  message: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.textMuted,
    lineHeight: 20,
    marginBottom: 20,
  },
  actions: {
    gap: 10,
  },
  dangerButton: {
    backgroundColor: 'rgba(160, 45, 35, 0.92)',
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderWidth: 1,
    borderColor: 'rgba(255, 140, 120, 0.4)',
  },
  dangerButtonDisabled: {
    opacity: 0.7,
  },
  dangerButtonText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: loginGlass.text,
  },
});
