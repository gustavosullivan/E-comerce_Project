import { useState } from 'react';
import { Image, type ImageStyle, StyleSheet, type StyleProp } from 'react-native';

type ProductImageProps = {
  sourceUrl: string;
  style?: StyleProp<ImageStyle>;
};

export function ProductImage({ sourceUrl, style }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!sourceUrl || hasError) {
    return (
      <Image
        source={require('@/assets/images/icon.png')}
        style={[styles.fallback, style]}
        resizeMode="cover"
      />
    );
  }

  return (
    <Image
      onError={() => setHasError(true)}
      resizeMode="cover"
      source={{ uri: sourceUrl }}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    opacity: 0.35,
  },
});
