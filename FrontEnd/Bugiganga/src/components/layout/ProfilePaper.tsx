import { type PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { WarmGlassSurface } from '@/src/components/layout/WarmGlassSurface';
import {
  colors,
  contentLayout,
  fontSizes,
  fonts,
  loginGlass,
  radii,
  radius,
  shadow,
  textStyles,
} from '@/src/theme';

type ProfilePaperProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  showStamp?: boolean;
  delay?: number;
  variant?: 'default' | 'warm';
}>;

/** Folha do perfil — vintage (default) ou vidro quente (warm). */
export function ProfilePaper({
  children,
  title,
  subtitle,
  showStamp = true,
  delay = 0,
  variant = 'default',
}: ProfilePaperProps) {
  const warm = variant === 'warm';

  const header = title ? (
    <View
      style={[
        styles.header,
        warm && styles.headerWarm,
        warm && showStamp && styles.headerWarmWithStamp,
      ]}>
      <Text style={[styles.title, warm && styles.titleWarm]}>{title}</Text>
      {subtitle && !warm ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {subtitle && warm ? (
        <Text style={styles.subtitleWarm}>{subtitle}</Text>
      ) : null}
      <View style={[styles.headerLine, warm && styles.headerLineWarm]} />
    </View>
  ) : null;

  const stamp = showStamp ? (
    <View style={[styles.stamp, warm && styles.stampWarm]}>
      <Text style={[styles.stampText, warm && styles.stampTextWarm]}>BUGIGANGA</Text>
      <Text style={[styles.stampSub, warm && styles.stampSubWarm]}>autêntico</Text>
    </View>
  ) : null;

  if (warm) {
    return (
      <Animated.View entering={FadeInDown.delay(delay).duration(420).springify()} style={styles.warmWrap}>
        <WarmGlassSurface level="card" variant="card" style={styles.warmSheet} contentStyle={styles.warmContent}>
          {stamp}
          {header}
          {children}
        </WarmGlassSurface>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(420).springify()}
      style={styles.sheet}>
      <View style={styles.perforation} />
      <View style={styles.cornerTL} />
      <View style={styles.cornerTR} />
      <View style={styles.cornerBL} />
      <View style={styles.cornerBR} />
      {stamp}
      {header}
      {children}
    </Animated.View>
  );
}

export function ProfilePaperDivider({
  label,
  variant = 'default',
}: {
  label?: string;
  variant?: 'default' | 'warm';
}) {
  const warm = variant === 'warm';

  return (
    <View style={dividerStyles.wrap}>
      <View style={[dividerStyles.line, warm && dividerStyles.lineWarm]} />
      {label ? (
        <Text style={[dividerStyles.label, warm && dividerStyles.labelWarm]}>{label}</Text>
      ) : null}
      <View style={[dividerStyles.line, warm && dividerStyles.lineWarm]} />
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
  warmWrap: {
    width: '100%',
    marginBottom: 16,
  },
  warmSheet: {
    borderRadius: radius.lg,
  },
  warmContent: {
    paddingHorizontal: contentLayout.screenPadding,
    paddingTop: 20,
    paddingBottom: contentLayout.cardPadding,
    position: 'relative',
  },
  sheet: {
    backgroundColor: colors.inputBg,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: contentLayout.screenPadding,
    paddingTop: 20,
    paddingBottom: contentLayout.cardPadding,
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
    borderWidth: 2.5,
    borderColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-12deg' }],
    opacity: 0.52,
    zIndex: 3,
  },
  stampWarm: {
    top: 8,
    right: 6,
    borderColor: loginGlass.goldLight,
    borderWidth: 2.5,
    backgroundColor: 'rgba(212, 175, 55, 0.16)',
    opacity: 0.88,
  },
  stampText: {
    fontFamily: fonts.serif,
    fontSize: 9,
    fontWeight: '800',
    color: colors.danger,
    letterSpacing: 0.8,
  },
  stampTextWarm: {
    fontFamily: fonts.sans,
    fontSize: 9,
    fontWeight: '800',
    color: loginGlass.cream,
    letterSpacing: 0.8,
  },
  stampSub: {
    fontSize: 7,
    fontWeight: '700',
    color: colors.danger,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  stampSubWarm: {
    fontSize: 7,
    fontWeight: '800',
    color: loginGlass.goldLight,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
    paddingTop: 4,
  },
  headerWarm: {
    marginBottom: 16,
  },
  headerWarmWithStamp: {
    paddingRight: 78,
  },
  title: {
    ...textStyles.sectionTitle,
    fontSize: 19,
    textAlign: 'center',
  },
  titleWarm: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.lg,
    fontWeight: '800',
    color: loginGlass.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'center',
  },
  subtitleWarm: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: loginGlass.textMuted,
    fontStyle: 'normal',
  },
  headerLine: {
    width: 64,
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 10,
    borderRadius: radii.full,
    opacity: 0.45,
  },
  headerLineWarm: {
    backgroundColor: loginGlass.goldLight,
    opacity: 1,
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
  lineWarm: {
    backgroundColor: loginGlass.shellBorder,
  },
  label: {
    fontFamily: fonts.serif,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  labelWarm: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    color: loginGlass.goldMuted,
  },
});
