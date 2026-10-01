import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyAddress, isAddressComplete, parseChangeAmount } from '../src/utils/checkout';
import { buildWhatsAppMessage, buildOrderWhatsAppUrl } from '../src/utils/whatsapp';
import type { OrderItem } from '../src/types/menu';

const address = {
  ...emptyAddress,
  street: ' Rua das Flores ',
  number: '123',
  neighborhood: 'Centro',
  city: 'Cidade de teste',
  complement: 'Casa B',
  reference: 'Portão azul',
};
const items: OrderItem[] = [
  {
    id: 'pizza',
    productId: 'tradicionais-calabresa',
    name: 'Pizza',
    variant: 'Grande',
    quantity: 2,
    flavors: ['Calabresa', 'Americana'],
    border: 'Catupiry',
    borderPrice: 10,
    unitPrice: 80,
    note: 'Sem cebola na metade Calabresa',
  },
  {
    id: 'drink',
    productId: 'bebida-coca-cola-2-l',
    name: 'Coca-Cola 2 L',
    quantity: 1,
    unitPrice: 15,
  },
];

test('endereço exige os campos essenciais, aceita S/N e ignora opcionais vazios', () => {
  assert.equal(isAddressComplete(emptyAddress), false);
  assert.equal(
    isAddressComplete({ ...address, number: 'S/N', complement: '', reference: '' }),
    true,
  );
  for (const key of ['street', 'number', 'neighborhood', 'city'] as const)
    assert.equal(isAddressComplete({ ...address, [key]: '  ' }), false);
});

test('troco aceita reais com vírgula ou ponto e rejeita valores inválidos', () => {
  for (const value of ['100', ' 100,00 ', '100.00']) assert.equal(parseChangeAmount(value), 100);
  for (const value of ['', '0', '-10', 'abc', 'Infinity', '1e3', '20,005', '1.000,00'])
    assert.equal(parseChangeAmount(value), null);
});

test('mensagem discrimina produtos, endereço, observações e troco sem duplicar a borda', () => {
  const message = buildWhatsAppMessage(items, ' José & Ana ', 'Tocar a campainha', 'Dinheiro', {
    address,
    changeFor: 200,
  });
  assert.match(message, /\*1\. 2x Pizza · Grande\*/);
  assert.match(message, /Unitário: R\$\s*80,00/);
  assert.match(message, /Subtotal do item: R\$\s*160,00/);
  assert.match(message, /Total: R\$\s*185,00/);
  assert.match(message, /Troco para: R\$\s*200,00/);
  assert.match(message, /Troco previsto: R\$\s*15,00/);
  assert.ok(message.includes('Cliente: José & Ana'));
  assert.ok(message.includes('Rua das Flores, 123\nCentro · Cidade de teste'));
  assert.ok(message.includes('Complemento: Casa B'));
  assert.ok(message.includes('Referência: Portão azul'));
  assert.ok(message.includes('Observação do item: Sem cebola na metade Calabresa'));
  assert.ok(message.includes('Observação do pedido: Tocar a campainha'));
  assert.doesNotMatch(message, /preço pelo maior|média proporcional|pedido confirmado/i);
  const url = new URL(buildOrderWhatsAppUrl(message));
  assert.equal(url.searchParams.get('text'), message);
});

test('troco aparece somente em dinheiro e mensagem mantém valores desconhecidos', () => {
  for (const payment of ['Pix', 'Cartão'] as const)
    assert.doesNotMatch(
      buildWhatsAppMessage(items, '', '', payment, { address, changeFor: 200 }),
      /Troco para|Troco previsto/,
    );
  assert.match(
    buildWhatsAppMessage(items, '', '', 'Dinheiro', { address }),
    /Não precisa de troco/,
  );
  const message = buildWhatsAppMessage([{ ...items[0], unitPrice: null }], '', '', 'Dinheiro', {
    address,
    changeFor: 200,
  });
  assert.match(message, /Total: valor a confirmar/);
  assert.doesNotMatch(message, /Troco previsto/);
});
