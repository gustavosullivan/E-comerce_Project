import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/src/components/buttons/SecondaryButton';
import { useConfirmStore } from '@/src/store/confirmStore';
import { colors, fontSizes, fonts, radius, shadows } from '@/src/theme';

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

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={hide}>
      <View style={styles.overlay}>
        {Platform.OS === 'web' ? (
          <View style={styles.webBackdrop} />
        ) : (
          <BlurView intensity={48} tint="dark" style={StyleSheet.absoluteFill} />
        )}
        <View style={styles.dim} />
        <Pressable style={styles.backdrop} onPress={hide} accessibilityRole="button" />

        <View style={styles.paper}>
          <View style={[styles.iconBadge, destructive && styles.iconBadgeDanger]}>
            <MaterialIcons
              name={destructive ? 'delete-outline' : 'help-outline'}
              size={22}
              color={destructive ? colors.danger : colors.primary}
            />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <SecondaryButton label={cancelLabel} onPress={hide} />
            {destructive ? (
              <Pressable
                style={[styles.dangerButton, isLoading && styles.dangerButtonDisabled]}
                onPress={handleConfirm}
                disabled={isLoading}>
                <Text style={styles.dangerButtonText}>{confirmLabel}</Text>
              </Pressable>
            ) : (
              <PrimaryButton label={confirmLabel} onPress={handleConfirm} isLoading={isLoading} />
            )}
          </View>
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
  },
  webBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 10, 20, 0.55)',
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 10, 20, 0.35)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  paper: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.lg,
    zIndex: 1,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconBadgeDanger: {
    backgroundColor: '#F5E0DC',
  },
  title: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  message: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 20,
  },
  actions: {
    gap: 10,
  },
  dangerButton: {
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButtonDisabled: {
    opacity: 0.7,
  },
  dangerButtonText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: colors.white,
  },
});
