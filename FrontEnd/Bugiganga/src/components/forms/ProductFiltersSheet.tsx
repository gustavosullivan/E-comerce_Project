import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/src/components/buttons/SecondaryButton';
import { CategoryChips } from '@/src/components/layout/CategoryChips';
import { MOCK_CATEGORIES } from '@/src/mocks/categories';
import { fontSizes, fonts, layout, loginGlass, radius } from '@/src/theme';
import { glassBlur } from '@/src/theme/loginGlass';
import {
  EMPTY_PRODUCT_FILTERS,
  PRICE_RANGE_OPTIONS,
  type ProductFilters,
} from '@/src/types/productFilters';
import { countActiveProductFilters } from '@/src/utils/productFilters';
import { selectionFeedback } from '@/src/utils/haptics';

type ProductFiltersSheetProps = {
  visible: boolean;
  filters: ProductFilters;
  onClose: () => void;
  onApply: (filters: ProductFilters) => void;
  variant?: 'default' | 'warm';
};

export function ProductFiltersSheet({
  visible,
  filters,
  onClose,
  onApply,
  variant = 'default',
}: ProductFiltersSheetProps) {
  const warm = variant === 'warm';
  const [draft, setDraft] = useState<ProductFilters>(filters);

  useEffect(() => {
    if (visible) {
      setDraft(filters);
    }
  }, [visible, filters]);

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleClear = () => {
    setDraft(EMPTY_PRODUCT_FILTERS);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {Platform.OS !== 'web' ? (
          <BlurView
            intensity={Platform.OS === 'android' ? glassBlur.android.modal : glassBlur.ios.modal}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <View style={styles.dim} />
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" />

        <View style={[styles.sheet, warm && styles.sheetWarm]}>
          <View style={styles.header}>
            <Text style={[styles.title, warm && styles.titleWarm]}>Filtros</Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel="Fechar">
              <MaterialIcons name="close" size={22} color={warm ? loginGlass.text : '#333'} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <Text style={[styles.sectionLabel, warm && styles.sectionLabelWarm]}>Categoria</Text>
            <CategoryChips
              categories={MOCK_CATEGORIES}
              selectedId={draft.categoryId}
              onSelect={(categoryId) => setDraft((current) => ({ ...current, categoryId }))}
              variant={warm ? 'warm' : 'default'}
            />

            <Text style={[styles.sectionLabel, warm && styles.sectionLabelWarm, styles.sectionSpacing]}>
              Faixa de preço
            </Text>
            <View style={styles.priceList}>
              {PRICE_RANGE_OPTIONS.map((option) => {
                const active = draft.priceRange === option.id;
                return (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.priceChip,
                      warm && styles.priceChipWarm,
                      active && styles.priceChipActive,
                      active && warm && styles.priceChipActiveWarm,
                    ]}
                    onPress={() => {
                      selectionFeedback();
                      setDraft((current) => ({ ...current, priceRange: option.id }));
                    }}>
                    <Text
                      style={[
                        styles.priceChipLabel,
                        warm && styles.priceChipLabelWarm,
                        active && styles.priceChipLabelActive,
                      ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <SecondaryButton
              label="Limpar"
              onPress={handleClear}
              variant={warm ? 'warm' : 'default'}
            />
            <PrimaryButton label="Aplicar filtros" onPress={handleApply} variant={warm ? 'warm' : 'default'} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function PriceFilterChips({
  value,
  onChange,
  variant = 'default',
}: {
  value: ProductFilters['priceRange'];
  onChange: (priceRange: ProductFilters['priceRange']) => void;
  variant?: 'default' | 'warm';
}) {
  const warm = variant === 'warm';
  const options = PRICE_RANGE_OPTIONS.filter((option) => option.id !== 'all');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.priceChipsRow}>
      {options.map((option) => {
        const active = value === option.id;
        return (
          <Pressable
            key={option.id}
            style={[
              styles.inlineChip,
              warm && styles.inlineChipWarm,
              active && styles.inlineChipActive,
              active && warm && styles.inlineChipActiveWarm,
            ]}
            onPress={() => {
              selectionFeedback();
              onChange(active ? 'all' : option.id);
            }}>
            <Text
              style={[
                styles.inlineChipLabel,
                warm && styles.inlineChipLabelWarm,
                active && styles.inlineChipLabelActive,
              ]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function hasActiveProductFilters(filters: ProductFilters): boolean {
  return countActiveProductFilters(filters) > 0;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: `blur(${glassBlur.web.modal})`,
          WebkitBackdropFilter: `blur(${glassBlur.web.modal})`,
        }
      : {}),
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: loginGlass.modalOverlay,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: layout.md,
    paddingHorizontal: layout.md,
    paddingBottom: layout.lg,
    maxHeight: '82%',
    borderWidth: 1,
    borderColor: '#e8e0d6',
  },
  sheetWarm: {
    backgroundColor: loginGlass.modalGlass,
    borderColor: loginGlass.modalGlassBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: layout.sm,
  },
  title: {
    fontFamily: fonts.gothic,
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: '#2c1810',
  },
  titleWarm: {
    color: loginGlass.text,
  },
  content: {
    paddingBottom: layout.md,
  },
  sectionLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: '#5c4a3a',
    marginBottom: 10,
  },
  sectionLabelWarm: {
    color: loginGlass.formLabel,
  },
  sectionSpacing: {
    marginTop: layout.md,
  },
  priceList: {
    gap: 8,
  },
  priceChip: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#e0d6cc',
    backgroundColor: '#faf7f2',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  priceChipWarm: {
    borderColor: loginGlass.cardBorder,
    backgroundColor: loginGlass.formFieldBg,
  },
  priceChipActive: {
    borderColor: '#8b5a2b',
    backgroundColor: '#f3e8d8',
  },
  priceChipActiveWarm: {
    borderColor: loginGlass.gold,
    backgroundColor: 'rgba(120, 90, 40, 0.35)',
  },
  priceChipLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: '#5c4a3a',
  },
  priceChipLabelWarm: {
    color: loginGlass.textMuted,
  },
  priceChipLabelActive: {
    color: '#2c1810',
    fontWeight: '700',
  },
  actions: {
    gap: 10,
    paddingTop: layout.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  priceChipsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  inlineChip: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#e0d6cc',
    backgroundColor: '#faf7f2',
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  inlineChipWarm: {
    borderColor: loginGlass.cardBorder,
    backgroundColor: loginGlass.formFieldBg,
  },
  inlineChipActive: {
    borderColor: '#8b5a2b',
    backgroundColor: '#f3e8d8',
  },
  inlineChipActiveWarm: {
    borderColor: loginGlass.gold,
    backgroundColor: 'rgba(120, 90, 40, 0.35)',
  },
  inlineChipLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: '#5c4a3a',
  },
  inlineChipLabelWarm: {
    color: loginGlass.textMuted,
  },
  inlineChipLabelActive: {
    color: '#2c1810',
    fontWeight: '700',
  },
});
