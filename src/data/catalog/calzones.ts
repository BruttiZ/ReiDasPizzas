import { pizzas } from './pizzas';
import { calzoneSizes } from './sizes';
import type { Product } from '../../types/menu';

export const calzones: Product[] = pizzas.map((p) => ({
  ...p,
  id: 'calzone-' + p.id,
  category: 'calzones',
  name: 'Calzone ' + p.name,
  prices: Object.fromEntries(calzoneSizes.map((s) => [s.name, s.price!])),
}));
