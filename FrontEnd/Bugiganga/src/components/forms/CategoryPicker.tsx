import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MOCK_CATEGORIES } from '@/src/mocks/categories';
import { colors, fontSizes, fonts, loginGlass, radius } from '@/src/theme';

type CategoryPickerProps = {
  value: number;
  onChange: (categoryId: number) => void;
  error?: string;
  variant?: 'default' | 'warm';
};

export function CategoryPicker({
  value,
  onChange,
  error,
  variant = 'default',
}: CategoryPickerProps) {
  const warm = variant === 'warm';

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, warm && styles.labelWarm]}>Categoria</Text>
      <View style={styles.categoryRow}>
        {MOCK_CATEGORIES.map((category) => {
          const active = value === category.id;
          return (
            <Pressable
              key={category.id}
              style={[
                styles.categoryChip,
                warm && styles.categoryChipWarm,
                active && (warm ? styles.categoryChipActiveWarm : styles.categoryChipActive),
              ]}
              onPress={() => onChange(category.id)}>
              <Text
                style={[
                  styles.categoryText,
                  warm && styles.categoryTextWarm,
                  active && (warm ? styles.categoryTextActiveWarm : styles.categoryTextActive),
                ]}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 8,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  labelWarm: {
    color: loginGlass.text,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipWarm: {
    backgroundColor: loginGlass.formFieldBg,
    borderColor: loginGlass.cardBorder,
  },
  categoryChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  categoryChipActiveWarm: {
    backgroundColor: 'rgba(212, 168, 83, 0.18)',
    borderColor: loginGlass.goldMuted,
  },
  categoryText: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    fontWeight: '600',
  },
  categoryTextWarm: {
    color: loginGlass.textMuted,
  },
  categoryTextActive: {
    color: colors.primaryDark,
  },
  categoryTextActiveWarm: {
    color: loginGlass.goldLight,
  },
  fieldError: {
    fontSize: fontSizes.xs,
    color: colors.danger,
    marginTop: 6,
  },
});
