import { Dimensions } from 'react-native';

const COLUMNS = 4;
const GAP = 6;
const PADDING_H = 10;

function getScreenWidth() {
  return Dimensions.get('window').width;
}

/** Largura fixa de cada card no grid de 4 colunas */
export function getProductGridItemWidth(screenWidth = getScreenWidth()) {
  return (screenWidth - PADDING_H * 2 - GAP * (COLUMNS - 1)) / COLUMNS;
}

export const productGrid = {
  columns: COLUMNS,
  gap: GAP,
  paddingH: PADDING_H,
  getItemWidth: getProductGridItemWidth,
} as const;
