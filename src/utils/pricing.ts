import type { Product } from '../types/menu';

export function pizzaPrice(flavors: Product[], sizeId: string): number | null {
  if (flavors.length === 0) return null;
  const prices = flavors.map((flavor) => flavor.prices?.[sizeId]);
  if (prices.some((price) => price == null)) return null;
  // O sabor de maior valor define o preço da pizza para o tamanho escolhido.
  return Math.max(...prices.map((price) => price!));
}

export function withBorder(
  base: number | null,
  border: Product | undefined,
  sizeId: string,
): number | null {
  if (!border) return base;
  const extra = border.prices?.[sizeId] ?? null;
  return base === null || extra === null ? null : base + extra;
}
