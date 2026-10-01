import type { Size } from '../../types/menu';

export const pizzaSizes: Size[] = [
  { id: 'broto', name: 'Broto', diameter: 20, slices: 4, maxFlavors: 1, range: [40, 50] },
  { id: 'media', name: 'Média', diameter: 30, slices: 8, maxFlavors: 2, range: [50, 60] },
  { id: 'grande', name: 'Grande', diameter: 35, slices: 12, maxFlavors: 3, range: [60, 70] },
  { id: 'familia', name: 'Família', diameter: 40, slices: 16, maxFlavors: 4, range: [70, 80] },
];

export const calzoneSizes: Size[] = [
  { id: 'medio', name: 'Médio', slices: 4, maxFlavors: 2, price: 50 },
  { id: 'grande', name: 'Grande', slices: 6, maxFlavors: 2, price: 60 },
];
