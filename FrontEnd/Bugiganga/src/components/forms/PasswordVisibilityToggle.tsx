import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { colors } from '@/src/theme';

type PasswordVisibilityToggleProps = {
  visible: boolean;
  onToggle: () => void;
  iconColor?: string;
};

export function PasswordVisibilityToggle({
  visible,
  onToggle,
  iconColor = colors.textMuted,
}: PasswordVisibilityToggleProps) {
  return (
    <Pressable
      style={styles.toggle}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}>
      <MaterialIcons
        name={visible ? 'visibility' : 'visibility-off'}
        size={22}
        color={iconColor}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toggle: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});
