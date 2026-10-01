import { normalize } from '../src/utils/text';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  categories,
  pizzas,
  calzones,
  borders,
  drinks,
  xis,
  products,
  pizzaSizes,
  calzoneSizes,
} from '../src/data/menu';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  buildOrderWhatsAppUrl,
} from '../src/utils/whatsapp';
import { orderTotal } from '../src/utils/order';
import { pizzaPrice, withBorder } from '../src/utils/pricing';
import { business } from '../src/data/config';
import type { OrderItem } from '../src/types/menu';
test('contagem oficial, IDs únicos e calzones de todos os sabores', () => {
  assert.deepEqual(
    categories.map((c) => c.name),
    [
      'Pizzas tradicionais',
      'Pizzas Premium',
      'Pizzas doces tradicionais',
      'Pizzas doces Premium',
      'Calzones',
      'Bordas',
      'Xis',
      'Bebidas',
    ],
  );
  for (const [category, count] of [
    ['tradicionais', 33],
    ['premium', 28],
    ['doces', 12],
    ['doces-premium', 7],
  ] as const)
    assert.equal(pizzas.filter((p) => p.category === category).length, count);
  assert.equal(calzones.length, 80);
  assert.equal(borders.length, 8);
  assert.equal(xis.length, 16);
  assert.equal(new Set(products.map((p) => p.id)).size, products.length);
  for (const p of pizzas)
    assert.equal(calzones.find((c) => c.id === 'calzone-' + p.id)?.description, p.description);
});
test('novos Premium não possuem composição ou preço inventados', () => {
  for (const name of [
    'Carne acebolada',
    'Carne com bacon',
    'Carne com requeijão cremoso',
    'Carne com cheddar',
  ]) {
    const p = pizzas.find((p) => p.name === name)!;
    assert.ok(p);
    assert.equal(p.description, undefined);
    assert.deepEqual(p.prices, { broto: 50, media: 60, grande: 70, familia: 80 });
  }
  assert.equal(pizzas.filter((p) => p.prices).length, 80);
  assert.equal(borders.filter((p) => p.prices).length, 8);
  assert.ok(!/camarão|cachorro/i.test(JSON.stringify(products)));
});
test('todos os preços de Xis correspondem ao briefing', () => {
  assert.deepEqual(
    xis.map((p) => [p.prices!.Regular, p.prices!.Calota]),
    [
      [28, 68],
      [38, 78],
      [40, 82],
      [38, 75],
      [36, 72],
      [35, 70],
      [38, 76],
      [32, 70],
      [36, 76],
      [38, 78],
      [40, 80],
      [42, 80],
      [45, 95],
      [30, 75],
      [40, 85],
      [35, 75],
    ],
  );
  assert.equal(
    xis.find((p) => p.name === 'Xis Alcatra')!.description!.startsWith('iscas de alcatra'),
    true,
  );
});
test('tamanhos e limites oficiais', () => {
  assert.deepEqual(
    pizzaSizes.map((s) => [s.diameter, s.slices, s.maxFlavors, s.range]),
    [
      [20, 4, 1, [40, 50]],
      [30, 8, 2, [50, 60]],
      [35, 12, 3, [60, 70]],
      [40, 16, 4, [70, 80]],
    ],
  );
  assert.deepEqual(
    calzoneSizes.map((s) => [s.slices, s.maxFlavors, s.price]),
    [
      [4, 2, 50],
      [6, 2, 60],
    ],
  );
});
const known: OrderItem = {
  id: '1',
  productId: 'xis-bacon',
  name: 'Xis Bacon',
  variant: 'Regular',
  quantity: 2,
  unitPrice: 36,
};
const unknown: OrderItem = {
  id: '2',
  productId: 'tradicionais-calabresa',
  name: 'Pizza',
  variant: 'Grande',
  flavors: ['Calabresa', 'Marguerita'],
  border: 'Catupiry',
  quantity: 1,
  unitPrice: null,
};
test('totais nunca apresentam zero como preço desconhecido', () => {
  assert.equal(orderTotal([known]), 82);
  assert.equal(orderTotal([known, unknown]), null);
  assert.equal(orderTotal([]), null);
  const msg = buildWhatsAppMessage([known, unknown], 'José & Ana', 'Sem cebola\nObrigado!');
  assert.match(msg, /2x Xis Bacon/);
  assert.match(msg, /Calabresa \/ Marguerita/);
  assert.match(msg, /Borda: Catupiry/);
  assert.match(msg, /Total: valor a confirmar pelo WhatsApp/);
  assert.ok(!msg.includes('R$ 0,00'));
  const url = new URL(buildWhatsAppUrl(msg));
  assert.equal(url.pathname, '/555533035636');
  assert.equal(url.searchParams.get('text'), msg);
});
test('contatos e normalização', () => {
  assert.equal(business.whatsapp, '555533035636');
  assert.equal(business.instagram, '@reidadpizzasca');
  assert.equal(business.instagramUrl, 'https://www.instagram.com/reidadpizzasca/');
  assert.equal(normalize('BRÓCOLIS'), 'brocolis');
});
test('preferência de pagamento acompanha o pedido sem simular cobrança', () => {
  for (const payment of ['Pix', 'Cartão', 'Dinheiro'] as const) {
    const message = buildWhatsAppMessage([known], '', '', payment);
    assert.ok(
      message.includes('Preferência de pagamento: ' + payment + ' (a confirmar no atendimento)'),
    );
    assert.ok(!message.includes('pagamento aprovado'));
  }
  assert.ok(!buildWhatsAppMessage([known]).includes('Preferência de pagamento:'));
});

test('pedidos de teste e contato oficial têm destinos separados', () => {
  const message = buildWhatsAppMessage([known]);
  assert.equal(new URL(buildOrderWhatsAppUrl(message)).pathname, '/5555935052865');
  assert.equal(new URL(buildWhatsAppUrl()).pathname, '/555533035636');
  assert.equal(new URL(buildOrderWhatsAppUrl(message)).searchParams.get('text'), message);
});
test('bebidas confirmadas e bordas variam pelo tamanho', () => {
  assert.deepEqual(
    drinks.map((d) => d.prices!.Unidade),
    [6, 6, 8, 8, 15, 15, 15, 15, 13],
  );
  assert.deepEqual(borders.find((b) => b.name === 'Chocolate preto')!.prices, {
    broto: 6,
    media: 8,
    grande: 10,
    familia: 15,
  });
  assert.deepEqual(borders.find((b) => b.name === 'Calabresa com Catupiry')!.prices, {
    broto: 6,
    media: 8,
    grande: 10,
    familia: 15,
  });
  for (const border of borders)
    assert.deepEqual(border.prices, { broto: 6, media: 8, grande: 10, familia: 15 });
  const calabresa = pizzas.find((p) => p.name === 'Calabresa')!;
  assert.equal(pizzaPrice([calabresa], 'media'), 50);
  assert.equal(
    withBorder(
      50,
      borders.find((b) => b.name === 'Catupiry'),
      'media',
    ),
    58,
  );
  assert.equal(
    withBorder(
      null,
      borders.find((b) => b.name === 'Catupiry'),
      'media',
    ),
    null,
  );
  assert.equal(
    withBorder(
      50,
      borders.find((b) => b.name === 'Avelã'),
      'media',
    ),
    58,
  );
  assert.equal(pizzaPrice([calabresa, pizzas.find((p) => p.name === 'Americana')!], 'familia'), 80);
  assert.equal(
    pizzaPrice([pizzas.find((p) => p.name === 'Carne com requeijão cremoso')!], 'familia'),
    80,
  );
});
test('sabores mistos cobram o maior valor independentemente da proporção', () => {
  const calabresa = pizzas.find((p) => p.name === 'Calabresa')!;
  const americana = pizzas.find((p) => p.name === 'Americana')!;
  assert.equal(pizzaPrice([calabresa, americana], 'familia'), 80);
  assert.equal(pizzaPrice([calabresa, americana, calabresa, americana], 'familia'), 80);
  assert.equal(pizzaPrice([calabresa, calabresa, calabresa], 'familia'), 70);
  assert.equal(
    pizzaPrice(
      [calabresa, pizzas.find((p) => p.name === 'Carne com requeijão cremoso')!],
      'familia',
    ),
    80,
  );
  assert.equal(pizzaPrice([], 'familia'), null);
  assert.equal(pizzaPrice([calabresa, calabresa, americana], 'familia'), 80);
  assert.equal(pizzaPrice([calabresa, americana, americana], 'familia'), 80);
  assert.equal(
    orderTotal([
      {
        id: 'rounding',
        productId: calabresa.id,
        name: 'Pizza',
        quantity: 3,
        unitPrice: pizzaPrice([calabresa, calabresa, americana], 'familia'),
      },
    ]),
    250,
  );
  assert.equal(pizzaPrice([pizzas.find((p) => p.name === 'Carne e Catupiry')!], 'familia'), 80);
  assert.equal(
    withBorder(
      80,
      borders.find((b) => b.name === 'Chocolate preto'),
      'familia',
    ),
    95,
  );
});
test('tabela completa, sabores mistos e borda única por pizza', () => {
  const traditional = pizzas.filter((p) => p.category === 'tradicionais' || p.category === 'doces');
  const premium = pizzas.filter((p) => p.category === 'premium' || p.category === 'doces-premium');
  for (const [size, base, top, extra] of [
    ['broto', 40, 50, 6],
    ['media', 50, 60, 8],
    ['grande', 60, 70, 10],
    ['familia', 70, 80, 15],
  ] as const) {
    for (const flavor of traditional) assert.equal(pizzaPrice([flavor], size), base);
    for (const flavor of premium) assert.equal(pizzaPrice([flavor], size), top);
    assert.equal(pizzaPrice(traditional.slice(0, 2), size), base);
    const mixed = pizzaPrice([traditional[0], premium[0]], size);
    assert.equal(mixed, top);
    assert.equal(withBorder(mixed, undefined, size), top);
    for (const border of borders) assert.equal(withBorder(mixed, border, size), top + extra);
  }
  const unitPrice = withBorder(
    pizzaPrice([traditional[0], premium[0]], 'grande'),
    borders[0],
    'grande',
  );
  assert.equal(unitPrice, 80);
  const item: OrderItem = {
    id: 'mixed',
    productId: traditional[0].id,
    name: 'Pizza',
    variant: 'Grande',
    flavors: [traditional[0].name, premium[0].name],
    border: borders[0].name,
    borderPrice: 10,
    quantity: 2,
    unitPrice,
  };
  assert.equal(orderTotal([item]), 170);
  const message = buildWhatsAppMessage([item]);
  assert.match(message, /maior valor entre os sabores/);
  assert.doesNotMatch(message, /média proporcional|arredondada|valor a confirmar/);
});
test('entrega é cobrada uma vez e discriminada mesmo com preço pendente', () => {
  assert.equal(orderTotal([known, { ...known, id: 'other' }]), 154);
  const message = buildWhatsAppMessage([known]);
  assert.match(message, /Subtotal dos produtos: R\$\s*72,00/);
  assert.match(message, /Entrega: R\$\s*10,00/);
  assert.match(message, /Total: R\$\s*82,00/);
  assert.equal(message.match(/Entrega:/g)?.length, 1);
  const pending = buildWhatsAppMessage([unknown]);
  assert.match(pending, /Entrega: R\$\s*10,00/);
  assert.match(pending, /Total: valor a confirmar/);
  assert.equal(orderTotal([]), null);
});
