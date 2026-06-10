import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { snackbar } from '@/src/store/snackbarStore';
import { useAuthStore } from '@/src/stores/authStore';
import { colors, fonts, motion, radii, shadow } from '@/src/theme';
import { pickAvatarImage } from '@/src/utils/pickAvatarImage';
import { selectionFeedback, successFeedback } from '@/src/utils/haptics';

type ProfileAvatarPickerProps = {
  size?: 'md' | 'lg';
  layout?: 'column' | 'inline';
};

const SIZES = {
  md: { ring: 96, icon: 52, badge: 26, edit: 14 },
  lg: { ring: 120, icon: 64, badge: 30, edit: 16 },
};

export function ProfileAvatarPicker({ size = 'md', layout = 'column' }: ProfileAvatarPickerProps) {
  const avatarUri = useAuthStore((s) => s.avatarUri);
  const setAvatarUri = useAuthStore((s) => s.setAvatarUri);
  const dims = SIZES[size];
  const ringScale = useSharedValue(1);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  const pickImage = async () => {
    selectionFeedback();
    const result = await pickAvatarImage();
    if (result?.uri) {
      setAvatarUri(result.uri);
      successFeedback();
      snackbar.success('Foto de perfil atualizada');
      ringScale.value = withSpring(1.06, motion.spring);
      ringScale.value = withSpring(1, motion.spring);
    }
  };

  const removeImage = () => {
    Alert.alert('Remover foto', 'Deseja remover a foto de perfil?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          setAvatarUri(null);
          snackbar.info('Foto de perfil removida');
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
            {
              width: dims.ring,
              height: dims.ring,
              borderRadius: dims.ring / 2,
            },
          ]}
          onPress={pickImage}
          accessibilityLabel="Editar foto de perfil">
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} contentFit="cover" />
          ) : (
            <View style={styles.placeholder}>
              <MaterialIcons name="add-a-photo" size={dims.icon * 0.55} color={colors.white} />
              <Text style={styles.placeholderHint}>Sua foto</Text>
            </View>
          )}
          <View style={[styles.editBadge, { width: dims.badge, height: dims.badge, borderRadius: dims.badge / 2 }]}>
            <MaterialIcons name="folder-open" size={dims.edit} color={colors.white} />
          </View>
        </ScalePressable>
      </Animated.View>

      <View style={styles.actions}>
        <ScalePressable onPress={pickImage} style={styles.actionBtn}>
          <MaterialIcons name="photo-library" size={16} color={colors.primary} />
          <Text style={styles.actionLabel}>{pickLabel}</Text>
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
  placeholderHint: {
    fontFamily: fonts.serif,
    fontSize: 10,
    fontWeight: '700',
    color: colors.background,
    textAlign: 'center',
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
  actionLabel: {
    fontFamily: fonts.serif,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
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
