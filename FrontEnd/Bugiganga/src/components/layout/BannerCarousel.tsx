import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { MOCK_BANNERS, type PromoBanner } from '@/src/mocks/banners';
import { colors, fonts, radii, shadow } from '@/src/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BANNER_WIDTH = Math.min(SCREEN_WIDTH - 48, 320);
const BANNER_HEIGHT = 148;
const INTERVAL_MS = 4500;

export function BannerCarousel() {
  const listRef = useRef<FlatList<PromoBanner>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % MOCK_BANNERS.length;
      indexRef.current = next;
      setActiveIndex(next);
      listRef.current?.scrollToIndex({ index: next, animated: true });
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (BANNER_WIDTH + 12));
    if (idx !== indexRef.current && idx >= 0 && idx < MOCK_BANNERS.length) {
      indexRef.current = idx;
      setActiveIndex(idx);
    }
  };

  const renderItem: ListRenderItem<PromoBanner> = ({ item, index }) => (
    <Animated.View entering={FadeIn.delay(index * 80).duration(400)}>
      <ScalePressable style={styles.banner}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
        <View style={styles.vignette} />
        <View style={styles.overlay}>
          <Text style={styles.eyebrow}>Promoção</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </ScalePressable>
    </Animated.View>
  );

  return (
    <View style={styles.wrap}>
      <FlatList
        ref={listRef}
        horizontal
        data={MOCK_BANNERS}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_WIDTH + 12}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        getItemLayout={(_, index) => ({
          length: BANNER_WIDTH + 12,
          offset: (BANNER_WIDTH + 12) * index,
          index,
        })}
      />
      <View style={styles.dots}>
        {MOCK_BANNERS.map((b, i) => (
          <View key={b.id} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  list: { paddingVertical: 2 },
  banner: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    marginRight: 12,
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    ...shadow.lift,
  },
  image: { width: '100%', height: '100%' },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(47, 36, 29, 0.15)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(47, 36, 29, 0.42)',
    justifyContent: 'flex-end',
    padding: 14,
    gap: 2,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.background,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    opacity: 0.9,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 24,
  },
  subtitle: { fontSize: 12, color: colors.background, marginTop: 2, lineHeight: 16 },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.primary,
    opacity: 1,
  },
});
