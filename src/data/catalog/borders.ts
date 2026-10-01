import { confirmedBorderPrices } from '../confirmed-prices';
import type { Product } from '../../types/menu';
import { slug } from '../../utils/text';

export const borders: Product[] = [
  'Catupiry',
  'Cheddar',
  'Calabresa',
  'Calabresa com Catupiry',
  'Chocolate preto',
  'Chocolate branco',
  'Doce de leite',
  'Avelã',
].map((name) => ({
  id: 'borda-' + slug(name),
  name,
  category: 'bordas',
  ...(confirmedBorderPrices[name] ? { prices: confirmedBorderPrices[name] } : {}),
}));
