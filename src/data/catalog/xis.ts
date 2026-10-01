import type { Product } from '../../types/menu';
import { slug } from '../../utils/text';

const xisRows = `Salada|28|68|pão; bife; ovo; presunto; queijo; maionese; ketchup; mostarda; alface; tomate; milho; ervilha
Salada Especial|38|78|pão; 2 bifes; 2 ovos; presunto; queijo; maionese; ketchup; mostarda; alface; tomate; milho; ervilha
Abacaxi|40|82|pão; iscas de alcatra; abacaxi; ovo; queijo; maionese; ketchup; mostarda; alface; tomate; milho; ervilha
Alcatra|38|75|iscas de alcatra; ovo; presunto; queijo; maionese; ketchup; mostarda; alface; tomate; milho; ervilha
Bacon|36|72|pão; bife; bacon; ovo; presunto; queijo; maionese; mostarda; ketchup; alface; tomate; milho; ervilha
Calabresa|35|70|pão; bife; calabresa; ovo; presunto; queijo; maionese; mostarda; ketchup; alface; tomate; milho; ervilha
Calabresa com Cheddar|38|76|pão; bife; calabresa; cheddar; ovo; presunto; queijo; maionese; mostarda; ketchup; alface; tomate; milho; ervilha
Frango|32|70|pão; frango grelhado; ovo; presunto; queijo; maionese; mostarda; ketchup; alface; tomate; milho; ervilha
Frango com Catupiry|36|76|pão; frango grelhado; Catupiry; ovo; presunto; queijo; maionese; mostarda; ketchup; alface; tomate; milho; ervilha
Coração|38|78|pão; coração; ovo; presunto; queijo; maionese; ketchup; mostarda; alface; tomate; milho; ervilha
Coração com Bacon|40|80|pão; coração; bacon; ovo; presunto; queijo; maionese; ketchup; mostarda; alface; tomate; milho; ervilha
do Rei|42|80|pão; alcatra; bacon; cebola; ovo; presunto; queijo; maionese; ketchup; mostarda; alface; tomate; milho; ervilha
Moda da Casa|45|95|pão; bife; alcatra; coração; bacon; calabresa; frango; ovo; presunto; queijo; maionese; ketchup; mostarda; alface; tomate; milho; ervilha
Portuguesa|30|75|pão; bife; cebola; pimentão; ovo; presunto; queijo; maionese; ketchup; mostarda; alface; tomate; milho; ervilha
Strogonoff|40|85|pão; strogonoff de carne; ovo; presunto; queijo; maionese; ketchup; mostarda; alface; tomate; milho; ervilha
Califórnia|35|75|pão; bife; abacaxi; figo; pêssego; ovo; presunto; queijo; maionese; ketchup; mostarda; alface; tomate; milho; ervilha`;

export const xis: Product[] = xisRows.split('\n').map((row) => {
  const [name, regular, calota, ingredients] = row.split('|');
  return {
    id: 'xis-' + slug(name),
    name: 'Xis ' + name,
    category: 'xis',
    description: ingredients.replaceAll(';', ','),
    prices: { Regular: regular ? Number(regular) : null, Calota: Number(calota) },
  };
});
