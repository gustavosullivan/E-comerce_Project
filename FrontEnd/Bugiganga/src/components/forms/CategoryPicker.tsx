import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MOCK_CATEGORIES } from '@/src/mocks/categories';
import { colors, fontSizes, fonts, radius } from '@/src/theme';

type CategoryPickerProps = {
  value: number;
  onChange: (categoryId: number) => void;
  error?: string;
};

export function CategoryPicker({ value, onChange, error }: CategoryPickerProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Categoria</Text>
      <View style={styles.categoryRow}>
        {MOCK_CATEGORIES.map((category) => {
          const active = value === category.id;
          return (
            <Pressable
              key={category.id}
              style={[styles.categoryChip, active && styles.categoryChipActive]}
              onPress={() => onChange(category.id)}>
              <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
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
  categoryChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: colors.primaryDark,
  },
  fieldError: {
    fontSize: fontSizes.xs,
    color: colors.danger,
    marginTop: 6,
  },
});
