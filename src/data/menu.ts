import { pizzaCategoryPrices, confirmedBorderPrices } from './confirmed-prices';
import type { CategoryId, Product, Size } from '../types/menu';
export const categories: { id: CategoryId; name: string }[] = [
 {id:'tradicionais',name:'Pizzas tradicionais'}, {id:'premium',name:'Pizzas Premium'},
 {id:'doces',name:'Pizzas doces tradicionais'}, {id:'doces-premium',name:'Pizzas doces Premium'},
 {id:'calzones',name:'Calzones'}, {id:'bordas',name:'Bordas'}, {id:'xis',name:'Xis'}, {id:'bebidas',name:'Bebidas'}
];
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
Suprema|chocolate branco; Ouro Branco`
};
export const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const slug = (name: string) => normalize(name).replace(/[^a-z0-9]+/g, '-');
export const pizzas: Product[] = Object.entries(rows).flatMap(([category, data]) => data.split('\n').map(row => {
 const [name, ingredients] = row.split('|');
 return {id: category + '-' + slug(name), name, category: category as CategoryId, prices:{...pizzaCategoryPrices[category as keyof typeof pizzaCategoryPrices]}, ...(ingredients ? {description: ingredients.replaceAll(';', ',')} : {})};
}));
export const pizzaSizes: Size[] = [
 {id:'broto',name:'Broto',diameter:20,slices:4,maxFlavors:1,range:[40,50]},
 {id:'media',name:'Média',diameter:30,slices:8,maxFlavors:2,range:[50,60]},
 {id:'grande',name:'Grande',diameter:35,slices:12,maxFlavors:3,range:[60,70]},
 {id:'familia',name:'Família',diameter:40,slices:16,maxFlavors:4,range:[70,80]}
];
export const calzoneSizes: Size[] = [
 {id:'medio',name:'Médio',slices:4,maxFlavors:2,price:50},
 {id:'grande',name:'Grande',slices:6,maxFlavors:2,price:60}
];
export const savoryNote = 'Todas as pizzas salgadas acompanham mussarela, orégano e molho de tomate artesanal.';
export const borders: Product[] = ['Catupiry','Cheddar','Calabresa','Calabresa com Catupiry','Chocolate preto','Chocolate branco','Doce de leite','Avelã'].map(name=>({id:'borda-'+slug(name),name,category:'bordas',...(confirmedBorderPrices[name]?{prices:confirmedBorderPrices[name]}:{})}));
const xisRows = `Salada||68|pão; bife; ovo; presunto; queijo; maionese; ketchup; mostarda; alface; tomate; milho; ervilha
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
export const xis: Product[] = xisRows.split('\n').map(row=>{
 const [name, regular, calota, ingredients] = row.split('|');
 return {id:'xis-'+slug(name),name:'Xis '+name,category:'xis',description:ingredients.replaceAll(';',','),prices:{Regular:regular ? Number(regular) : null,Calota:Number(calota)}};
});
export const calzones: Product[] = pizzas.map(p=>({...p,id:'calzone-'+p.id,category:'calzones',name:'Calzone '+p.name,prices:Object.fromEntries(calzoneSizes.map(s=>[s.name,s.price!]))}));
export const drinks: Product[] = [
 ['Coca-Cola lata',6], ['Coca-Cola Zero lata',6],
 ['Coca-Cola 600 ml',8], ['Coca-Cola Zero 600 ml',8],
 ['Coca-Cola 2 L',15], ['Coca-Cola Zero 2 L',15],
 ['Fanta laranja 2 L',15], ['Sprite 2 L',15], ['Charrua 2 L',13]
].map(([name,price])=>({id:'bebida-'+slug(String(name)),name:String(name),category:'bebidas',prices:{Unidade:Number(price)}}));
export const products: Product[] = [...pizzas,...calzones,...borders,...xis,...drinks];
