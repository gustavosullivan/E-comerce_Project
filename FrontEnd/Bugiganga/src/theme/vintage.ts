import { StyleSheet } from 'react-native';

import { colors } from './colors';
import { fontSizes, fonts } from './typography';
import { radius } from './radius';

export const vintageTheme = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'space-between',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingBottom: 8,
  },
  footerText: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  linkLabel: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
  },
  linkAction: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: colors.primary,
  },
  errorBanner: {
    backgroundColor: colors.dangerLight,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSizes.md,
    lineHeight: 20,
  },
  demoHint: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },
  brand: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xxl,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 1,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
});
