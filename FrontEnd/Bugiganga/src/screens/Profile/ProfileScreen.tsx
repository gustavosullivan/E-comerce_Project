import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useAuth } from '@/src/hooks/useAuth';
import { colors, fonts } from '@/src/theme';

const MENU: { label: string; route?: string; action?: 'orders' | 'settings' | 'account' }[] = [
  { label: 'Minha Conta', action: 'account' },
  { label: 'Configurações', action: 'settings' },
  { label: 'Histórico de Compras', action: 'orders' },
  { label: 'Favoritos', route: '/(tabs)/favorites' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleMenu = (item: (typeof MENU)[number]) => {
    if (item.route) {
      router.push(item.route as '/(tabs)/favorites');
      return;
    }
    Alert.alert(item.label, 'Em breve');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={48} color={colors.white} />
          </View>
          <Text style={styles.name}>{user?.name ?? 'Usuário'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
        </View>

        {MENU.map((item) => (
          <Pressable key={item.label} style={styles.menuItem} onPress={() => handleMenu(item)}>
            <Text style={styles.menuText}>{item.label}</Text>
            <MaterialIcons name="chevron-right" size={22} color={colors.secondary} />
          </Pressable>
        ))}

        <Pressable style={styles.logout} onPress={logout}>
          <MaterialIcons name="logout" size={22} color={colors.danger} />
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 16, paddingBottom: 32 },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 24,
    marginBottom: 20,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  email: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    padding: 14,
    marginBottom: 8,
  },
  menuText: { fontSize: 15, color: colors.text },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 14,
    justifyContent: 'center',
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: colors.danger },
});
