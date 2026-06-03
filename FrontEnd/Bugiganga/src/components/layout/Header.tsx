import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { routes } from '@/src/navigation/routes';
import { colors, fonts } from '@/src/theme';

type HeaderProps = {
  userName: string;
  showSearch?: boolean;
};

export function Header({ userName, showSearch = true }: HeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <MaterialIcons name="person" size={28} color={colors.white} />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {userName}
      </Text>
      {showSearch ? (
        <Pressable style={styles.iconBtn} onPress={() => router.push(routes.productList)}>
          <MaterialIcons name="search" size={26} color={colors.primary} />
        </Pressable>
      ) : (
        <View style={styles.iconBtn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  name: {
    flex: 1,
    fontFamily: fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  iconBtn: { width: 40, alignItems: 'center' },
});
