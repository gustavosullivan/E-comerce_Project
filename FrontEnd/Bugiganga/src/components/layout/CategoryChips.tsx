import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { selectionFeedback } from '@/src/utils/haptics';
import { colors, fonts, loginGlass, radii, radius, shadow } from '@/src/theme';
import type { Category } from '@/src/types/product';

type CategoryChipsProps = {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  variant?: 'default' | 'warm';
};

export function CategoryChips({
  categories,
  selectedId,
  onSelect,
  variant = 'default',
}: CategoryChipsProps) {
  const warm = variant === 'warm';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}>
      <ScalePressable
        style={[
          styles.chip,
          warm && styles.chipWarm,
          selectedId === null && (warm ? styles.chipWarmActive : styles.chipActive),
        ]}
        onPress={() => {
          selectionFeedback();
          onSelect(null);
        }}>
        <Text
          style={[
            styles.label,
            warm && styles.labelWarm,
            selectedId === null && (warm ? styles.labelWarmActive : styles.labelActive),
          ]}>
          Todos
        </Text>
      </ScalePressable>
      {categories.map((cat) => {
        const active = selectedId === cat.id;
        return (
          <ScalePressable
            key={cat.id}
            style={[
              styles.chip,
              warm && styles.chipWarm,
              active && (warm ? styles.chipWarmActive : styles.chipActive),
            ]}
            onPress={() => {
              selectionFeedback();
              onSelect(active ? null : cat.id);
            }}>
            <Text
              style={[
                styles.label,
                warm && styles.labelWarm,
                active && (warm ? styles.labelWarmActive : styles.labelActive),
              ]}
              numberOfLines={1}>
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
  chipWarm: {
    borderRadius: radius.full,
    borderColor: loginGlass.chipBorder,
    backgroundColor: loginGlass.chipBg,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.text,
    ...shadow.lift,
  },
  chipWarmActive: {
    backgroundColor: loginGlass.chipActiveBg,
    borderColor: loginGlass.chipActiveBorder,
  },
  label: {
    fontFamily: fonts.serif,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    maxWidth: 140,
  },
  labelWarm: {
    fontFamily: fonts.sans,
    color: loginGlass.textMuted,
  },
  labelActive: {
    color: colors.white,
    fontWeight: '700',
  },
  labelWarmActive: {
    color: loginGlass.text,
    fontWeight: '700',
  },
});
