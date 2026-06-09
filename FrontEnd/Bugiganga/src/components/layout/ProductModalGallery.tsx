import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ScalePressable } from '@/src/components/ui/ScalePressable';
import { SkeletonBlock } from '@/src/components/ui/SkeletonBlock';
import { colors, fonts, motion, radii, shadow } from '@/src/theme';
import type { Product } from '@/src/types/product';
import { getProductGalleryUrls } from '@/src/utils/productGallery';
import { selectionFeedback } from '@/src/utils/haptics';

const GALLERY_WIDTH = Math.min(Dimensions.get('window').width - 72, 400);
const GALLERY_HEIGHT = 220;

type ProductModalGalleryProps = {
  product: Product;
};

type GallerySlideProps = {
  uri: string;
  isActive: boolean;
  zoomed: boolean;
  onToggleZoom: () => void;
};

function GallerySlide({ uri, isActive, zoomed, onToggleZoom }: GallerySlideProps) {
  const [loading, setLoading] = useState(true);
  const scale = useSharedValue(1);
  const kenBurns = useSharedValue(1);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * kenBurns.value }],
  }));

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isActive) {
      scale.value = 1;
      kenBurns.value = 1;
      return;
    }
    if (zoomed) {
      kenBurns.value = 1;
      return;
    }
    if (!loading) {
      kenBurns.value = 1;
      kenBurns.value = withTiming(1.06, { duration: 4800 });
    }
  }, [isActive, zoomed, loading, scale, kenBurns]);

  useEffect(() => {
    if (!zoomed) {
      scale.value = withSpring(1, motion.spring);
    }
  }, [zoomed, scale]);

  const handleToggleZoom = () => {
    selectionFeedback();
    const nextZoom = !zoomed;
    scale.value = withSpring(nextZoom ? 1.85 : 1, motion.spring);
    onToggleZoom();
  };

  return (
    <ScalePressable style={styles.slide} onPress={handleToggleZoom} disabled={loading}>
      {loading ? (
        <View style={styles.loader}>
          <SkeletonBlock width="100%" height={GALLERY_HEIGHT - 28} />
        </View>
      ) : null}
      <Animated.View style={[styles.imageWrap, imageStyle]}>
        <Image
          source={{ uri }}
          style={styles.image}
          contentFit="cover"
          transition={320}
          onLoad={handleLoad}
          accessibilityLabel="Foto do produto"
        />
      </Animated.View>
      {!loading ? (
        <View style={styles.zoomHint}>
          <MaterialIcons name={zoomed ? 'zoom-out-map' : 'zoom-in'} size={14} color={colors.white} />
          <Text style={styles.zoomHintText}>{zoomed ? 'Reduzir' : 'Ampliar'}</Text>
        </View>
      ) : null}
    </ScalePressable>
  );
}

export function ProductModalGallery({ product }: ProductModalGalleryProps) {
  const images = useMemo(() => getProductGalleryUrls(product), [product]);
  const listRef = useRef<FlatList<string>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / GALLERY_WIDTH);
    if (idx !== activeIndex && idx >= 0 && idx < images.length) {
      setActiveIndex(idx);
      setZoomed(false);
    }
  };

  const goTo = (index: number) => {
    if (index < 0 || index >= images.length) return;
    selectionFeedback();
    setZoomed(false);
    setActiveIndex(index);
    listRef.current?.scrollToIndex({ index, animated: true });
  };

  const renderItem: ListRenderItem<string> = ({ item, index }) => (
    <GallerySlide
      uri={item}
      isActive={index === activeIndex}
      zoomed={zoomed && index === activeIndex}
      onToggleZoom={() => setZoomed((z) => !z)}
    />
  );

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.root}>
      <View style={styles.frameOuter}>
        <View style={styles.cornerTL} />
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
        <View style={styles.cornerBR} />

        <View style={styles.frameMat}>
          <View style={styles.frameInner}>
            <FlatList
              ref={listRef}
              data={images}
              horizontal
              pagingEnabled
              bounces={false}
              scrollEnabled={!zoomed}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(uri, i) => `${product.id}-${i}`}
              onScroll={onScroll}
              scrollEventThrottle={16}
              getItemLayout={(_, index) => ({
                length: GALLERY_WIDTH,
                offset: GALLERY_WIDTH * index,
                index,
              })}
              renderItem={renderItem}
            />

            {images.length > 1 && !zoomed ? (
              <>
                {activeIndex > 0 ? (
                  <ScalePressable
                    style={[styles.navBtn, styles.navPrev]}
                    onPress={() => goTo(activeIndex - 1)}
                    hitSlop={8}>
                    <MaterialIcons name="chevron-left" size={22} color={colors.primary} />
                  </ScalePressable>
                ) : null}
                {activeIndex < images.length - 1 ? (
                  <ScalePressable
                    style={[styles.navBtn, styles.navNext]}
                    onPress={() => goTo(activeIndex + 1)}
                    hitSlop={8}>
                    <MaterialIcons name="chevron-right" size={22} color={colors.primary} />
                  </ScalePressable>
                ) : null}
              </>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.dots}>
          {images.map((_, i) => (
            <ScalePressable key={i} onPress={() => goTo(i)} style={styles.dotHit}>
              <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
            </ScalePressable>
          ))}
        </View>
        <Text style={styles.counter}>
          {activeIndex + 1}/{images.length}
        </Text>
      </View>

      {product.isNew ? (
        <View style={styles.tag}>
          <Text style={styles.tagText}>Novo</Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

const CORNER = {
  position: 'absolute' as const,
  width: 14,
  height: 14,
  borderColor: colors.accent,
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 4,
  },
  frameOuter: {
    width: GALLERY_WIDTH + 16,
    padding: 8,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    ...shadow.lift,
  },
  cornerTL: { ...CORNER, top: 4, left: 4, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { ...CORNER, top: 4, right: 4, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { ...CORNER, bottom: 4, left: 4, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { ...CORNER, bottom: 4, right: 4, borderBottomWidth: 2, borderRightWidth: 2 },
  frameMat: {
    borderWidth: 3,
    borderColor: colors.primary,
    padding: 5,
    backgroundColor: colors.background,
    borderRadius: 2,
  },
  frameInner: {
    width: GALLERY_WIDTH,
    height: GALLERY_HEIGHT,
    overflow: 'hidden',
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    position: 'relative',
  },
  slide: {
    width: GALLERY_WIDTH,
    height: GALLERY_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    padding: 10,
    zIndex: 2,
  },
  imageWrap: {
    width: GALLERY_WIDTH,
    height: GALLERY_HEIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  zoomHint: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(47, 36, 29, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  zoomHintText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.3,
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -18,
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
    zIndex: 5,
  },
  navPrev: { left: 6 },
  navNext: { right: 6 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: GALLERY_WIDTH + 16,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dotHit: {
    padding: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.primary,
  },
  counter: {
    fontFamily: fonts.serif,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  tag: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.text,
    zIndex: 6,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
