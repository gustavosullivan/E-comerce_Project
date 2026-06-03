export interface PromoBanner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export const MOCK_BANNERS: PromoBanner[] = [
  {
    id: 1,
    title: 'Feira de relíquias',
    subtitle: 'Até 30% em bugigangas selecionadas',
    imageUrl: 'https://picsum.photos/seed/banner1/800/320',
  },
  {
    id: 2,
    title: 'Brechó premium',
    subtitle: 'Peças únicas com história',
    imageUrl: 'https://picsum.photos/seed/banner2/800/320',
  },
  {
    id: 3,
    title: 'Colecionáveis',
    subtitle: 'Novidades toda semana',
    imageUrl: 'https://picsum.photos/seed/banner3/800/320',
  },
];
