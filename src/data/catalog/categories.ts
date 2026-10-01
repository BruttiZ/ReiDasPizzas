import type { CategoryId } from '../../types/menu';

export const categories: { id: CategoryId; name: string }[] = [
  { id: 'tradicionais', name: 'Pizzas tradicionais' },
  { id: 'premium', name: 'Pizzas Premium' },
  { id: 'doces', name: 'Pizzas doces tradicionais' },
  { id: 'doces-premium', name: 'Pizzas doces Premium' },
  { id: 'calzones', name: 'Calzones' },
  { id: 'bordas', name: 'Bordas' },
  { id: 'xis', name: 'Xis' },
  { id: 'bebidas', name: 'Bebidas' },
];

export const savoryNote =
  'Todas as pizzas salgadas acompanham mussarela, orégano e molho de tomate artesanal.';
