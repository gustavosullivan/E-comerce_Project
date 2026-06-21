import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { getErrorMessage } from '@/src/services/api/client';
import { uploadUserAvatar } from '@/src/services/cloudinaryService';
import { userService } from '@/src/services/userService';
import { snackbar } from '@/src/store/snackbarStore';
import { useAuthStore } from '@/src/store/authStore';
import { colors, fontSizes, fonts, loginGlass, motion, radii, radius, shadow } from '@/src/theme';
import { pickAvatarImage } from '@/src/utils/pickAvatarImage';
import { selectionFeedback, successFeedback } from '@/src/utils/haptics';

type ProfileAvatarPickerProps = {
  size?: 'md' | 'lg';
  layout?: 'column' | 'inline';
  variant?: 'default' | 'warm';
};

const SIZES = {
  md: { ring: 96, icon: 52, badge: 26, edit: 14 },
  lg: { ring: 120, icon: 64, badge: 30, edit: 16 },
};

export function ProfileAvatarPicker({
  size = 'md',
  layout = 'column',
  variant = 'default',
}: ProfileAvatarPickerProps) {
  const warm = variant === 'warm';
  const avatarUri = useAuthStore((s) => s.avatarUri);
  const setAvatarUri = useAuthStore((s) => s.setAvatarUri);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const [isUploading, setIsUploading] = useState(false);
  const dims = SIZES[size];
  const ringScale = useSharedValue(1);

  useEffect(() => {
    if (!isHydrated || avatarUri) return;

    void userService.getProfile().then((profile) => {
      if (profile.avatarUrl) {
        setAvatarUri(profile.avatarUrl);
      }
    });
  }, [avatarUri, isHydrated, setAvatarUri]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  const pickImage = async () => {
    if (isUploading) return;

    selectionFeedback();
    const asset = await pickAvatarImage();
    if (!asset) return;

    setIsUploading(true);
    try {
      const secureUrl = await uploadUserAvatar(asset);
      setAvatarUri(secureUrl);
      await userService.updateProfile({ avatarUrl: secureUrl });
      successFeedback();
      snackbar.success('Foto de perfil atualizada');
      ringScale.value = withSpring(1.06, motion.spring);
      ringScale.value = withSpring(1, motion.spring);
    } catch (error) {
      snackbar.error(getErrorMessage(error, 'Não foi possível enviar a foto de perfil'));
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    Alert.alert('Remover foto', 'Deseja remover a foto de perfil?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            try {
              setAvatarUri(null);
              await userService.updateProfile({ avatarUrl: '' });
              snackbar.info('Foto de perfil removida');
            } catch (error) {
              snackbar.error(getErrorMessage(error, 'Não foi possível remover a foto'));
            }
          })();
        },
      },
    ]);
  };

  const pickLabel = Platform.OS === 'web' ? 'Escolher da pasta' : 'Escolher da galeria';

  return (
    <View style={[styles.wrap, layout === 'inline' && styles.wrapInline]}>
      <Animated.View style={ringStyle}>
        <ScalePressable
          style={[
            styles.avatarFrame,
            warm && styles.avatarFrameWarm,
            {
              width: dims.ring,
              height: dims.ring,
              borderRadius: dims.ring / 2,
            },
          ]}
          onPress={pickImage}
          disabled={isUploading}
          accessibilityLabel="Editar foto de perfil">
          {isUploading ? (
            <View style={[styles.placeholder, warm && styles.placeholderWarm]}>
              <ActivityIndicator size="small" color={warm ? loginGlass.goldLight : colors.white} />
            </View>
          ) : avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} contentFit="cover" />
          ) : (
            <View style={[styles.placeholder, warm && styles.placeholderWarm]}>
              <MaterialIcons
                name="add-a-photo"
                size={dims.icon * 0.55}
                color={warm ? loginGlass.text : colors.white}
              />
              <Text style={[styles.placeholderHint, warm && styles.placeholderHintWarm]}>
                Sua foto
              </Text>
            </View>
          )}
          <View
            style={[
              styles.editBadge,
              warm && styles.editBadgeWarm,
              { width: dims.badge, height: dims.badge, borderRadius: dims.badge / 2 },
            ]}>
            <MaterialIcons
              name="folder-open"
              size={dims.edit}
              color={warm ? loginGlass.text : colors.white}
            />
          </View>
        </ScalePressable>
      </Animated.View>

      <View style={styles.actions}>
        <ScalePressable
          onPress={pickImage}
          disabled={isUploading}
          style={[styles.actionBtn, warm && styles.actionBtnWarm]}>
          <MaterialIcons
            name="photo-library"
            size={16}
            color={warm ? loginGlass.goldLight : colors.primary}
          />
          <Text style={[styles.actionLabel, warm && styles.actionLabelWarm]}>{pickLabel}</Text>
        </ScalePressable>
        {avatarUri ? (
          <ScalePressable onPress={removeImage} style={styles.removeBtn}>
            <MaterialIcons name="delete-outline" size={16} color={colors.danger} />
            <Text style={styles.removeLabel}>Remover</Text>
          </ScalePressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 10,
  },
  wrapInline: {
    flexShrink: 0,
  },
  avatarFrame: {
    borderWidth: 3,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    backgroundColor: colors.card,
    overflow: 'hidden',
    position: 'relative',
    ...shadow.lift,
  },
  avatarFrameWarm: {
    borderColor: loginGlass.goldLight,
    backgroundColor: loginGlass.formFieldBg,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    gap: 4,
    padding: 8,
  },
  placeholderWarm: {
    backgroundColor: loginGlass.button,
  },
  placeholderHint: {
    fontFamily: fonts.serif,
    fontSize: 10,
    fontWeight: '700',
    color: colors.background,
    textAlign: 'center',
  },
  placeholderHintWarm: {
    fontFamily: fonts.sans,
    color: loginGlass.text,
  },
  editBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadgeWarm: {
    backgroundColor: loginGlass.formButtonPrimary,
    borderColor: loginGlass.shellBorder,
  },
  actions: {
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  actionBtnWarm: {
    borderColor: loginGlass.shellBorder,
    backgroundColor: loginGlass.formFieldBg,
    borderRadius: radius.full,
  },
  actionLabel: {
    fontFamily: fonts.serif,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  actionLabelWarm: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.goldLight,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  removeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.danger,
  },
});
