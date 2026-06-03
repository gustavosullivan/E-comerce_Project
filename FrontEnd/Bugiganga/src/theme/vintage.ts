import { StyleSheet } from 'react-native';

import { Fonts, VintageColors } from '@/constants/theme';

export const vintageTheme = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: VintageColors.parchment,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingVertical: 36,
    justifyContent: 'space-between',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingBottom: 8,
  },
  footerText: {
    fontSize: 11,
    color: VintageColors.brownMuted,
    letterSpacing: 0.5,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  linkLabel: {
    fontSize: 14,
    color: VintageColors.brownLight,
  },
  linkAction: {
    fontSize: 14,
    fontWeight: '700',
    color: VintageColors.rust,
    textDecorationLine: 'underline',
  },
  errorBanner: {
    backgroundColor: '#F5E0DC',
    borderWidth: 1,
    borderColor: VintageColors.error,
    borderRadius: 2,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: VintageColors.error,
    fontSize: 14,
    lineHeight: 20,
  },
  demoHint: {
    fontSize: 11,
    color: VintageColors.brownMuted,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },
  brand: {
    fontFamily: Fonts.serif,
    fontSize: 36,
    fontWeight: '700',
    color: VintageColors.brown,
    letterSpacing: 4,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: Fonts.serif,
    fontSize: 15,
    fontStyle: 'italic',
    color: VintageColors.brownLight,
    textAlign: 'center',
    marginTop: 6,
  },
});
