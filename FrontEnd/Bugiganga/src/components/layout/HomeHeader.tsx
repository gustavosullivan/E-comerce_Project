import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors, fonts } from '@/src/theme';

type HomeHeaderProps = {
  userName: string;
};

export function HomeHeader({ userName }: HomeHeaderProps) {
  return (
    <View style={styles.row}>
      <Pressable
        style={styles.avatarWrap}
        onPress={() => router.push('/(tabs)/profile')}
        accessibilityRole="button">
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={22} color={colors.white} />
        </View>
        <Text style={styles.userName} numberOfLines={1}>
          {userName.split(' ')[0]}
        </Text>
      </Pressable>

      <Text style={styles.logo}>BUGIGANGA</Text>

      <Pressable
        style={styles.cartBtn}
        onPress={() => router.push('/(tabs)/cart')}
        accessibilityRole="button">
        <MaterialIcons name="shopping-cart" size={26} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 4,
  },
  avatarWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, maxWidth: '30%' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  userName: { fontSize: 13, fontWeight: '600', color: colors.text, flexShrink: 1 },
  logo: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 2,
    textAlign: 'center',
    flex: 1,
  },
  cartBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 3,
    backgroundColor: colors.card,
  },
});
