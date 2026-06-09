import { StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '@/src/theme';

type BadgeProps = {
  count: number;
  size?: 'sm' | 'md';
};

export function Badge({ count, size = 'sm' }: BadgeProps) {
  if (count <= 0) return null;

  const label = count > 99 ? '99+' : String(count);

  return (
    <View style={[styles.badge, size === 'md' && styles.badgeMd]}>
      <Text style={[styles.text, size === 'md' && styles.textMd]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: radii.full,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeMd: {
    minWidth: 18,
    height: 18,
    top: -5,
    right: -8,
  },
  text: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 11,
  },
  textMd: {
    fontSize: 10,
    lineHeight: 12,
  },
});
