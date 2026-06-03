import { StyleSheet } from 'react-native';

import { Fonts, VintageColors } from '@/constants/theme';

export const authStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: VintageColors.parchment,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  ornament: {
    width: 120,
    height: 2,
    backgroundColor: VintageColors.border,
    borderRadius: 1,
  },
  brand: {
    fontFamily: Fonts.serif,
    fontSize: 42,
    fontWeight: '700',
    color: VintageColors.brown,
    letterSpacing: 1,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontStyle: 'italic',
    color: VintageColors.brownLight,
    textAlign: 'center',
  },
  card: {
    backgroundColor: VintageColors.inputBg,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: VintageColors.border,
    padding: 24,
    shadowColor: VintageColors.shadow,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    fontWeight: '600',
    color: VintageColors.brown,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: VintageColors.brownLight,
    marginBottom: 24,
    lineHeight: 20,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontFamily: Fonts.serif,
    fontSize: 14,
    fontWeight: '600',
    color: VintageColors.brown,
    marginBottom: 8,
  },
  input: {
    backgroundColor: VintageColors.parchment,
    borderWidth: 1.5,
    borderColor: VintageColors.border,
    borderRadius: 2,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: VintageColors.brown,
  },
  passwordRow: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 72,
  },
  togglePassword: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  togglePasswordText: {
    fontSize: 13,
    color: VintageColors.rust,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: VintageColors.rust,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: VintageColors.brown,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    color: VintageColors.parchment,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
    color: VintageColors.brownLight,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: VintageColors.rust,
    textDecorationLine: 'underline',
  },
  backLink: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backLinkText: {
    fontSize: 14,
    color: VintageColors.rust,
    fontWeight: '600',
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 13,
    color: VintageColors.rust,
    textDecorationLine: 'underline',
  },
});
