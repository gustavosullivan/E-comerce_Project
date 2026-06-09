import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { selectionFeedback } from '@/src/utils/haptics';
import { colors, fonts, radii, shadow } from '@/src/theme';
import type { Category } from '@/src/types/product';

type CategoryChipsProps = {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
};

export function CategoryChips({ categories, selectedId, onSelect }: CategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}>
      <ScalePressable
        style={[styles.chip, selectedId === null && styles.chipActive]}
        onPress={() => {
          selectionFeedback();
          onSelect(null);
        }}>
        <Text style={[styles.label, selectedId === null && styles.labelActive]}>Todos</Text>
      </ScalePressable>
      {categories.map((cat) => {
        const active = selectedId === cat.id;
        return (
          <ScalePressable
            key={cat.id}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => {
              selectionFeedback();
              onSelect(active ? null : cat.id);
            }}>
            <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
              {cat.name}
            </Text>
          </ScalePressable>
        );
      })}
      <View style={styles.trail} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
    paddingBottom: 4,
    paddingRight: 4,
  },
  trail: { width: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.text,
    ...shadow.lift,
  },
  label: {
    fontFamily: fonts.serif,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    maxWidth: 140,
  },
  labelActive: {
    color: colors.white,
    fontWeight: '700',
  },
});
