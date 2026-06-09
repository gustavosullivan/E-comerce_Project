import { type PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { colors, fonts, layout, radii, shadow, textStyles } from '@/src/theme';

type ProfilePaperProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  showStamp?: boolean;
  delay?: number;
}>;

/** Folha estática estilo documento vintage — base visual do perfil. */
export function ProfilePaper({
  children,
  title,
  subtitle,
  showStamp = true,
  delay = 0,
}: ProfilePaperProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(420).springify()}
      style={styles.sheet}>
      <View style={styles.perforation} />
      <View style={styles.cornerTL} />
      <View style={styles.cornerTR} />
      <View style={styles.cornerBL} />
      <View style={styles.cornerBR} />

      {showStamp ? (
        <View style={styles.stamp}>
          <Text style={styles.stampText}>BUGIGANGA</Text>
          <Text style={styles.stampSub}>autêntico</Text>
        </View>
      ) : null}

      {title ? (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <View style={styles.headerLine} />
        </View>
      ) : null}

      {children}
    </Animated.View>
  );
}

export function ProfilePaperDivider({ label }: { label?: string }) {
  return (
    <View style={dividerStyles.wrap}>
      <View style={dividerStyles.line} />
      {label ? <Text style={dividerStyles.label}>{label}</Text> : null}
      <View style={dividerStyles.line} />
    </View>
  );
}

const CORNER = {
  position: 'absolute' as const,
  width: 18,
  height: 18,
  borderColor: colors.accent,
};

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.inputBg,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 20,
    paddingBottom: layout.cardPadding,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    ...shadow.paper,
  },
  perforation: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 6,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderLight,
    opacity: 0.8,
  },
  cornerTL: { ...CORNER, top: 8, left: 8, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { ...CORNER, top: 8, right: 8, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { ...CORNER, bottom: 8, left: 8, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { ...CORNER, bottom: 8, right: 8, borderBottomWidth: 2, borderRightWidth: 2 },
  stamp: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-12deg' }],
    opacity: 0.35,
  },
  stampText: {
    fontFamily: fonts.serif,
    fontSize: 9,
    fontWeight: '800',
    color: colors.danger,
    letterSpacing: 0.8,
  },
  stampSub: {
    fontSize: 7,
    fontWeight: '700',
    color: colors.danger,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
    paddingTop: 4,
  },
  title: {
    ...textStyles.sectionTitle,
    fontSize: 19,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'center',
  },
  headerLine: {
    width: 64,
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 10,
    borderRadius: radii.full,
    opacity: 0.45,
  },
});

const dividerStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  label: {
    fontFamily: fonts.serif,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
