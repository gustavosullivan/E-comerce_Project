import { Platform, StyleSheet } from 'react-native';

import { colors } from './colors';
import { fonts } from './typography';

export const radii = {
  sm: 2,
  md: 4,
  lg: 8,
  full: 999,
} as const;

export const layout = {
  screenPadding: 16,
  cardPadding: 18,
  maxContentWidth: 480,
} as const;

export const shadow = Platform.select({
  ios: {
    card: {
      shadowColor: '#2F241D',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.14,
      shadowRadius: 8,
    },
    paper: {
      shadowColor: '#2F241D',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
    },
    lift: {
      shadowColor: '#2F241D',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.18,
      shadowRadius: 10,
    },
  },
  android: {
    card: { elevation: 4 },
    paper: { elevation: 12 },
    lift: { elevation: 6 },
  },
  default: {
    card: { boxShadow: '0 3px 12px rgba(47, 36, 29, 0.14)' },
    paper: { boxShadow: '0 14px 36px rgba(47, 36, 29, 0.32)' },
    lift: { boxShadow: '0 6px 18px rgba(47, 36, 29, 0.18)' },
  },
})!;

/** Estilos de texto reutilizáveis — fonte única de verdade */
export const textStyles = StyleSheet.create({
  brand: {
    fontFamily: fonts.serif,
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 3,
    textAlign: 'center',
  },
  brandSm: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 2,
    textAlign: 'center',
  },
  pageTitle: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  bodyMuted: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  caption: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  label: {
    fontFamily: fonts.serif,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  link: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  price: {
    fontFamily: fonts.serif,
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  priceLg: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
});

/** Campo de formulário padronizado */
export const inputStyles = StyleSheet.create({
  field: {
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingRight: 48,
    fontSize: 16,
    color: colors.text,
  },
  fieldFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  toggle: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});

export const cardStyles = StyleSheet.create({
  vintage: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: layout.cardPadding,
    ...shadow.card,
  },
  inset: {
    backgroundColor: colors.inputBg,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
});
