import { type PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, contentLayout } from '@/src/theme';

type ScreenContainerProps = PropsWithChildren<{
  scroll?: boolean;
  centered?: boolean;
  contentStyle?: ViewStyle;
  keyboard?: boolean;
}>;

function VintageBackdrop() {
  return (
    <>
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />
    </>
  );
}

export function ScreenContainer({
  children,
  scroll,
  centered,
  contentStyle,
  keyboard,
}: ScreenContainerProps) {
  const inner = scroll ? (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        centered && styles.centered,
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.body, contentStyle]}>{children}</View>
  );

  const content = keyboard ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {inner}
    </KeyboardAvoidingView>
  ) : (
    inner
  );

  return (
    <SafeAreaView style={styles.screen}>
      <VintageBackdrop />
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  blobTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.backgroundDeep,
    opacity: 0.45,
  },
  blobBottom: {
    position: 'absolute',
    bottom: 120,
    left: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.card,
    opacity: 0.35,
  },
  body: {
    flex: 1,
    paddingHorizontal: contentLayout.screenPadding,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: contentLayout.screenPadding,
    paddingBottom: contentLayout.screenPadding + 8,
  },
  centered: {
    justifyContent: 'center',
  },
});
