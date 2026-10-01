import { pizzaCategoryPrices } from '../confirmed-prices';
import type { CategoryId, Product } from '../../types/menu';
import { slug } from '../../utils/text';

const rows: Record<string, string> = {
  tradicionais: `Abobrinha|abobrinha; tomate gratinado; parmesão
Alho e óleo|alho; óleo
Atum|atum; cebola
Bacon|bacon
Bacon e milho|bacon; milho
Brócolis e bacon|brócolis; bacon; requeijão
Brócolis|brócolis; requeijão
Calabresa|calabresa
Calabresa e cheddar|calabresa; cheddar
Calabresa acebolada|calabresa; cebola; azeitona
Campeira|salame colonial; ovo; tomate; azeitona
Crocante|bacon; batata palha
Frango com requeijão|frango; requeijão
Galinha escabelada|frango; creme de leite; batata palha
Havaiana|frango; palmito; requeijão
Italiana|salame italiano; cebola; pimentão
Lombo|lombo; requeijão; mussarela
Lombo com abacaxi|lombo; abacaxi
Marguerita|tomate; parmesão; manjericão; azeite de oliva
Milho|milho; requeijão
Mussarela|mussarela; azeitona
Napolitana|mussarela; tomate
Palmito|palmito; molho branco
Portuguesa|presunto; cebola; pimentão; ovos; azeitona
Presunto e queijo|presunto; queijo
Quatro queijos|mussarela; parmesão; provolone; requeijão cremoso
Cinco queijos|mussarela; parmesão; provolone; requeijão cremoso; gorgonzola
Siciliana|calabresa; bacon; pimentão; cebola
Salame italiano|salame italiano
Vegetariana|brócolis; palmito; champignon; molho branco
Toscana|calabresa ralada; alho; Catupiry
Calabresa com Catupiry|calabresa; Catupiry
Frango e cheddar|frango; cheddar`,
  premium: `Americana|filé alho e óleo; tomate em cubos; molho barbecue
Bagunça|bacon; coração; frango; cheiro-verde
Baiana|lombo; pimentão; cebola; molho de pimenta
Barberfrango|frango grelhado; requeijão cremoso; molho barbecue
Basca|bacon; alho; tomate em cubos; requeijão cremoso; parmesão
Belíssima|peito de peru; brócolis; parmesão; requeijão cremoso
Camponesa|frango; milho; bacon; requeijão; cebola
Chinesa|frango ao molho shoyu; cebola; tomate; pimentão
Coração|coração
Doritos|carne de panela desfiada; cheddar; Doritos
Favorita|bacon; alho e óleo; cebola; Catupiry; cheiro-verde
Filé alho e óleo|filé alho e óleo
Filé com gorgonzola|filé; gorgonzola
Filé aos quatro queijos|filé; mussarela; parmesão; provolone; requeijão cremoso
Moda da casa|filé; bacon; presunto; tomate; ovos; cheiro-verde
Omelete|calabresa; bacon; ovos; cheiro-verde
Peito de peru|peito de peru; requeijão cremoso
Pepperoni|pepperoni
Pepperoni especial|pepperoni; alho e óleo; azeitona; requeijão cremoso
Porto Fino|coração; bacon; requeijão cremoso; cheiro-verde
Strogonoff de carne|strogonoff de carne; batata palha
Strogonoff de frango|strogonoff de frango; batata palha
Tomate seco com rúcula|tomate seco; rúcula
Carne acebolada
Carne com bacon
Carne com requeijão cremoso
Carne com cheddar
Carne e Catupiry|carne; Catupiry`,
  doces: `Abacaxi|abacaxi; chocolate branco
Banana nevada|banana; canela; chocolate branco; leite condensado
Beijinho|chocolate branco; coco; leite condensado
Brigadeiro|chocolate preto; chocolate granulado
Califórnia|abacaxi; figo; pêssego; canela
Charge|chocolate preto; amendoim; doce de leite
Chocolate branco|chocolate branco
Chocolate preto|chocolate preto
Confetes|chocolate preto; confete
Dois amores|chocolate branco; chocolate preto
Prestígio|chocolate preto; coco; leite condensado
Romeu e Julieta|goiabada; mussarela`,
  'doces-premium': `Especial da casa|chocolate branco; mousse de maracujá
Floresta Negra|chocolate preto; bombom; morango; leite condensado
Paçoca|doce de leite; paçoca
Pedacinho do céu|chocolate branco; bombom; morango; pêssego; cereja; leite condensado
Sedução|chocolate branco; morango
Sensação|chocolate preto; morango
Suprema|chocolate branco; Ouro Branco`,
};

export const pizzas: Product[] = Object.entries(rows).flatMap(([category, data]) =>
  data.split('\n').map((row) => {
    const [name, ingredients] = row.split('|');
    return {
      id: category + '-' + slug(name),
      name,
      category: category as CategoryId,
      prices: { ...pizzaCategoryPrices[category as keyof typeof pizzaCategoryPrices] },
      ...(ingredients ? { description: ingredients.replaceAll(';', ',') } : {}),
    };
  }),
);
