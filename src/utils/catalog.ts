import { normalize } from './text';
import { categories, products } from '../data/menu';
import type { CategoryId } from '../types/menu';

export function getMenuResults(category: CategoryId, query: string) {
  const searchQuery = normalize(query.trim());
  const filtered = products.filter(
    (product) =>
      product.available !== false &&
      (searchQuery ? normalize(product.name).includes(searchQuery) : product.category === category),
  );
  const title = searchQuery
    ? 'Resultados da busca'
    : categories.find((item) => item.id === category)!.name;
  return { searchQuery, filtered, title };
}
