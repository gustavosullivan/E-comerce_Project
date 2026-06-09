import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { colors, radii, shadow } from '@/src/theme';
import { selectionFeedback } from '@/src/utils/haptics';

type MenuListItemProps = {
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  danger?: boolean;
};

export function MenuListItem({ label, icon, onPress, danger }: MenuListItemProps) {
  return (
    <ScalePressable
      style={[styles.item, danger && styles.itemDanger]}
      onPress={() => {
        selectionFeedback();
        onPress();
      }}>
      <View style={styles.left}>
        {icon ? (
          <View style={[styles.iconWrap, danger && styles.iconWrapDanger]}>
            <MaterialIcons
              name={icon}
              size={18}
              color={danger ? colors.danger : colors.primary}
            />
          </View>
        ) : null}
        <Text style={[styles.label, danger && styles.danger]}>{label}</Text>
      </View>
      {!danger ? (
        <MaterialIcons name="chevron-right" size={22} color={colors.secondary} />
      ) : null}
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 8,
    ...shadow.card,
  },
  itemDanger: {
    backgroundColor: '#F5E8E6',
    borderColor: colors.danger,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radii.full,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrapDanger: {
    backgroundColor: colors.white,
  },
  label: { fontSize: 15, fontWeight: '600', color: colors.text },
  danger: { color: colors.danger },
});
