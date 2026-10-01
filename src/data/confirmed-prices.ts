// Tabela por categoria confirmada pelo responsável em 28/09/2026.
export const pizzaCategoryPrices = {
  tradicionais: { broto: 40, media: 50, grande: 60, familia: 70 },
  premium: { broto: 50, media: 60, grande: 70, familia: 80 },
  doces: { broto: 40, media: 50, grande: 60, familia: 70 },
  'doces-premium': { broto: 50, media: 60, grande: 70, familia: 80 },
};
export const stuffedBorderPrices = { broto: 6, media: 8, grande: 10, familia: 15 };
export const confirmedBorderPrices: Record<string, Record<string, number>> = Object.fromEntries(
  [
    'Catupiry',
    'Cheddar',
    'Calabresa',
    'Calabresa com Catupiry',
    'Chocolate preto',
    'Chocolate branco',
    'Doce de leite',
    'Avelã',
  ].map((name) => [name, stuffedBorderPrices]),
);
