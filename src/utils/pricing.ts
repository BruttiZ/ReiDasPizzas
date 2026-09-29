import type { Product } from '../types/menu';

export function pizzaPrice(flavors: Product[], sizeId: string): number | null {
 if (flavors.length === 0) return null;
 const prices = flavors.map(flavor => flavor.prices?.[sizeId]);
 if (prices.some(price => price == null)) return null;
 // Partes iguais; arredondamento para cima no centavo expressamente autorizado.
 const sumInCents = prices.reduce<number>((sum, price) => sum + Math.round(price! * 100), 0);
 return Math.ceil(sumInCents / prices.length) / 100;
}

export function withBorder(base: number | null, border: Product | undefined, sizeId: string): number | null {
 if (!border) return base;
 const extra = border.prices?.[sizeId] ?? null;
 return base === null || extra === null ? null : base + extra;
}
