import { pizzas } from './catalog/pizzas';
import { calzones } from './catalog/calzones';
import { borders } from './catalog/borders';
import { xis } from './catalog/xis';
import { drinks } from './catalog/drinks';
import type { Product } from '../types/menu';

export { categories, savoryNote } from './catalog/categories';
export { pizzaSizes, calzoneSizes } from './catalog/sizes';
export { pizzas, calzones, borders, xis, drinks };

export const products: Product[] = [...pizzas, ...calzones, ...borders, ...xis, ...drinks];
