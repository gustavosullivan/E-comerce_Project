import { Image } from 'expo-image';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors } from '@/src/theme';

/** Marrom escuro para contorno da foto — destaca do fundo claro */
const FRAME_BROWN = colors.primary;
const FRAME_BROWN_MID = colors.secondary;

type ProductImageFrameProps = {
  uri: string;
  aspectRatio?: number;
  style?: ViewStyle;
  /** Moldura vintage em camadas (passe-partout) */
  framed?: boolean;
  /** Tamanho compacto para grid de 4 colunas */
  compact?: boolean;
  /** Modal de compra — foto grande no topo do paper */
  modal?: boolean;
};

/** Altura da foto no modal de compra */
const MODAL_PHOTO_HEIGHT = 240;

/**
 * Moldura padronizada para fotos de produto (mock ou API).
 * `framed` adiciona bordas em camadas estilo quadro antigo com contorno marrom.
 */
export function ProductImageFrame({
  uri,
  aspectRatio = 1,
  style,
  framed = false,
  compact = false,
  modal = false,
}: ProductImageFrameProps) {
  const photo = (
    <View style={[styles.photoContour, compact && styles.photoContourCompact]}>
      <Image
        source={{ uri }}
        style={styles.image}
        contentFit="contain"
        transition={200}
        accessibilityLabel="Foto do produto"
      />
    </View>
  );

  if (!framed) {
    return (
      <View style={[styles.plain, modal && styles.plainModal, !modal && { aspectRatio }, style]}>
        <View style={[styles.plainContour, compact && styles.plainContourCompact]}>{photo}</View>
      </View>
    );
  }

  const innerStyle = modal
    ? styles.framedInnerModal
    : [{ aspectRatio }, compact && styles.framedInnerCompact];

  return (
    <View style={[styles.framedRoot, modal && styles.framedRootModal, style]}>
      <View style={[styles.framedOuter, compact && !modal && styles.framedOuterCompact, modal && styles.framedOuterModal]}>
        <View style={[styles.framedMat, compact && !modal && styles.framedMatCompact, modal && styles.framedMatModal]}>
          <View style={[styles.framedInner, innerStyle]}>
            {photo}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  plain: {
    width: '100%',
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  plainModal: {
    width: '100%',
    height: MODAL_PHOTO_HEIGHT,
  },
  plainContour: {
    width: '94%',
    height: '94%',
    borderWidth: 2.5,
    borderColor: FRAME_BROWN,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  plainContourCompact: {
    borderWidth: 2,
  },
  image: {
    width: '92%',
    height: '92%',
  },
  photoContour: {
    width: '90%',
    height: '90%',
    borderWidth: 2.5,
    borderColor: FRAME_BROWN,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1,
  },
  photoContourCompact: {
    width: '88%',
    height: '88%',
    borderWidth: 2,
    borderColor: FRAME_BROWN,
  },
  framedRoot: {
    width: '100%',
  },
  framedRootModal: {
    width: '100%',
  },
  framedOuterModal: {
    padding: 8,
  },
  framedMatModal: {
    padding: 6,
    borderWidth: 3,
  },
  framedOuter: {
    padding: 5,
    backgroundColor: colors.card,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: FRAME_BROWN_MID,
  },
  framedOuterCompact: {
    padding: 3,
  },
  framedMat: {
    borderWidth: 2.5,
    borderColor: FRAME_BROWN,
    padding: 4,
    backgroundColor: colors.background,
    borderRadius: 1,
  },
  framedMatCompact: {
    borderWidth: 2,
    padding: 2,
  },
  framedInner: {
    width: '100%',
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: FRAME_BROWN_MID,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  framedInnerCompact: {
    borderWidth: 1.5,
  },
  framedInnerModal: {
    width: '100%',
    height: MODAL_PHOTO_HEIGHT - 36,
  },
});
