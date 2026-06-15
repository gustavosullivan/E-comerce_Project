import type { Product } from '@/src/types/product';

import { MOCK_CATEGORIES } from './categories';

const NAMES = [
  'Rádio de válvulas Philco',
  'Máquina de escrever Olivetti',
  'Câmera Kodak anos 70',
  'Vitrola portátil',
  'Relógio de bolso',
  'Lanterna militar',
  'Mapa antigo do Brasil',
  'Jogo de xadrez em madeira',
  'Telefone de disco',
  'Binóculo de latão',
  'Caderno de capa dura',
  'Luminária de mesa art déco',
  'Moedas em álbum',
  'Cassete Walkman',
  'Prato de porcelana floral',
  'Chave inglesa vintage',
  'Bússola de navio',
  'Cartaz de cinema antigo',
  'Óculos redondo retrô',
  'Maleta de couro',
];

export const MOCK_PRODUCTS: Product[] = NAMES.map((name, index) => {
  const id = index + 1;
  const category = MOCK_CATEGORIES[index % MOCK_CATEGORIES.length];
  return {
    id,
    name,
    description: `${name} em excelente estado para colecionadores e amantes de peças com história.`,
    price: Math.round((45 + index * 23.7) * 100) / 100,
    imageUrl: `https://picsum.photos/seed/bugiganga-${id}/400/400`,
    stock: (index % 5) + 1,
    categoryId: category.id,
    categoryName: category.name,
    userId: index < 7 ? 2 : 0,
    isNew: index < 6,
    isFeatured: index >= 4 && index < 12,
    isBestseller: index >= 10,
  };
});
