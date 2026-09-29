// Tabela por categoria confirmada pelo responsável em 28/09/2026.
export const pizzaCategoryPrices = {
 tradicionais: {broto:40,media:50,grande:60,familia:70},
 premium: {broto:50,media:60,grande:70,familia:80},
 doces: {broto:40,media:50,grande:60,familia:70},
 'doces-premium': {broto:50,media:60,grande:70,familia:80},
};
export const confirmedBorderPrices: Record<string, Record<string, number>> = {
 'Catupiry': { broto: 6, media: 8, grande: 10, familia: 12 },
 'Cheddar': { broto: 6, media: 8, grande: 10, familia: 12 },
 'Calabresa': { broto: 6, media: 8, grande: 10, familia: 12 },
 'Calabresa com Catupiry': { broto: 8, media: 10, grande: 12, familia: 14 },
 'Chocolate preto': { broto: 6, media: 10, grande: 12, familia: 15 },
 'Chocolate branco': { broto: 6, media: 10, grande: 12, familia: 15 },
};
