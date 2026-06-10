import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { useAuthStore } from '@/src/stores/authStore';
import { colors } from '@/src/theme';

type ProfileTabIconProps = {
  color: string;
  size: number;
  focused: boolean;
};

export function ProfileTabIcon({ color, size, focused }: ProfileTabIconProps) {
  const avatarUri = useAuthStore((s) => s.avatarUri);

  if (avatarUri) {
    const dim = size + 4;
    return (
      <Image
        source={{ uri: avatarUri }}
        style={[
          styles.avatar,
          {
            width: dim,
            height: dim,
            borderRadius: dim / 2,
            borderColor: focused ? colors.tabBarActive : 'rgba(255, 255, 255, 0.35)',
          },
        ]}
        contentFit="cover"
      />
    );
  }

  return (
    <MaterialIcons
      name={focused ? 'person' : 'person-outline'}
      size={size}
      color={color}
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 2,
  },
});
