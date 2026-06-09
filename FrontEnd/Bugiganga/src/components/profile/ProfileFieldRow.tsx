import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { colors, fonts } from '@/src/theme';
import { selectionFeedback } from '@/src/utils/haptics';

type ProfileFieldRowProps = {
  label: string;
  value: string;
  secret?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export function ProfileFieldRow({ label, value, secret, icon = 'label' }: ProfileFieldRowProps) {
  const [visible, setVisible] = useState(false);
  const display = secret && !visible ? '••••••••••' : value || '—';

  return (
    <View style={styles.row}>
      <View style={styles.labelCol}>
        <MaterialIcons name={icon} size={14} color={colors.secondary} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.dots} />
      <View style={styles.valueCol}>
        <Text style={styles.value} numberOfLines={2}>
          {display}
        </Text>
        {secret ? (
          <ScalePressable
            onPress={() => {
              selectionFeedback();
              setVisible((v) => !v);
            }}
            hitSlop={8}
            accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}>
            <MaterialIcons
              name={visible ? 'visibility-off' : 'visibility'}
              size={18}
              color={colors.primary}
            />
          </ScalePressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 32,
  },
  labelCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 72,
  },
  label: {
    fontFamily: fonts.serif,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  dots: {
    flex: 1,
    height: 1,
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderColor: colors.borderLight,
    marginHorizontal: 8,
    marginBottom: 4,
  },
  valueCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '48%',
  },
  value: {
    fontFamily: fonts.serif,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
    flexShrink: 1,
  },
});
