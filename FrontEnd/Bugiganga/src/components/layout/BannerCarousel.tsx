import { Image } from 'expo-image';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { MOCK_BANNERS } from '@/src/mocks/banners';
import { colors, fonts, layout, loginGlass, radius } from '@/src/theme';

type BannerCarouselProps = {
  variant?: 'default' | 'warm';
};

export function BannerCarousel({ variant = 'default' }: BannerCarouselProps) {
  const warm = variant === 'warm';

  return (
    <FlatList
      horizontal
      data={MOCK_BANNERS}
      keyExtractor={(item) => String(item.id)}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.list, warm && styles.listWarm]}
      renderItem={({ item }) => (
        <View style={[styles.banner, warm && styles.bannerWarm]}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
          <View style={styles.overlay}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 8 },
  listWarm: { paddingTop: layout.sm },
  banner: {
    width: 280,
    height: 140,
    marginRight: 12,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  bannerWarm: {
    borderRadius: radius.lg,
    borderColor: loginGlass.cardBorder,
  },
  image: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(47, 36, 29, 0.45)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  subtitle: { fontSize: 12, color: loginGlass.cream, marginTop: 4 },
});
