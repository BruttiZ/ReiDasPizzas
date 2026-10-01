import type { Product } from '../../types/menu';
import { slug } from '../../utils/text';

export const drinks: Product[] = [
  ['Coca-Cola lata', 6],
  ['Coca-Cola Zero lata', 6],
  ['Coca-Cola 600 ml', 8],
  ['Coca-Cola Zero 600 ml', 8],
  ['Coca-Cola 2 L', 15],
  ['Coca-Cola Zero 2 L', 15],
  ['Fanta laranja 2 L', 15],
  ['Sprite 2 L', 15],
  ['Charrua 2 L', 13],
].map(([name, price]) => ({
  id: 'bebida-' + slug(String(name)),
  name: String(name),
  category: 'bebidas',
  prices: { Unidade: Number(price) },
}));
