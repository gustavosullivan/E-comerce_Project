import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, fontSizes, fonts, radius, shadows } from '@/src/theme';
import { layout } from '@/src/theme/layout';

type ProfileHeaderProps = {
  name: string;
  email: string;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function ProfileHeader({ name, email }: ProfileHeaderProps) {
  const initials = getInitials(name);

  return (
    <View style={styles.wrap}>
      <Text style={styles.screenTitle}>Minha conta</Text>

      <View style={styles.cardContainer}>
        <View style={styles.avatarOuter}>
          <View style={styles.avatar}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
          <View style={styles.badge}>
            <MaterialIcons name="verified" size={14} color={colors.textInverse} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {email}
          </Text>
        </View>
      </View>
    </View>
  );
}

const AVATAR_SIZE = 96;

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
    marginBottom: layout.lg,
    paddingTop: layout.lg,
  },
  screenTitle: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: layout.lg,
    letterSpacing: -0.3,
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: AVATAR_SIZE / 2,
    position: 'relative',
  },
  avatarOuter: {
    position: 'absolute',
    top: -(AVATAR_SIZE / 2),
    left: 0,
    right: 0,
    zIndex: 2,
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: colors.card,
    ...shadows.lg,
  },
  initials: {
    fontFamily: fonts.sans,
    fontSize: 30,
    fontWeight: '800',
    color: colors.textInverse,
    letterSpacing: 1,
  },
  badge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.card,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingTop: AVATAR_SIZE / 2 + layout.md,
    paddingBottom: layout.lg,
    paddingHorizontal: layout.md,
    ...shadows.md,
  },
  name: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    maxWidth: '100%',
  },
  email: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
    maxWidth: '100%',
  },
});
