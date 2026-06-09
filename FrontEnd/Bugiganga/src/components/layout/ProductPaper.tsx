import { MaterialIcons } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { colors, layout, radii, shadow } from '@/src/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

type ProductPaperProps = {
  children: ReactNode;
  onClose: () => void;
  large?: boolean;
};

export function ProductPaper({ children, onClose, large }: ProductPaperProps) {
  return (
    <Animated.View entering={FadeIn.duration(220)} style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Fechar" />
      <Animated.View
        entering={ZoomIn.duration(320).springify()}
        style={[styles.paper, large && styles.paperLarge]}>
        <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={12}>
          <MaterialIcons name="close" size={20} color={colors.text} />
        </Pressable>
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlayDark,
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  paper: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.inputBg,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.border,
    paddingTop: 12,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.screenPadding,
    ...shadow.paper,
  },
  paperLarge: {
    maxWidth: Math.min(SCREEN_WIDTH - 24, 460),
    paddingHorizontal: 20,
    borderWidth: 2.5,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: colors.card,
    borderRadius: radii.full,
    padding: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
});
