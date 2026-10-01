import { business } from '../data/config';
import type { OrderItem, PaymentPreference, CheckoutDetails } from '../types/menu';
import { money } from './format';
import { orderSubtotal, orderTotal } from './order';

export function buildWhatsAppMessage(
  items: OrderItem[],
  name = '',
  note = '',
  payment?: PaymentPreference,
  details?: CheckoutDetails,
) {
  const lines = ['🍕 *PEDIDO — REI DAS PIZZAS*', ''];
  if (name.trim()) lines.push('Cliente: ' + name.trim(), '');

  items.forEach((item, index) => {
    lines.push(
      '*' +
        (index + 1) +
        '. ' +
        item.quantity +
        'x ' +
        item.name +
        (item.variant ? ' · ' + item.variant : '') +
        '*',
    );
    if (item.flavors?.length) {
      const division =
        item.flavors.length > 1 ? ' (' + item.flavors.length + ' partes iguais)' : '';
      lines.push('Sabores' + division + ': ' + item.flavors.join(' / '));
    }
    if (item.border)
      lines.push(
        'Borda: ' +
          item.border +
          (item.borderPrice == null
            ? ' — valor a confirmar pelo WhatsApp'
            : ' — ' + money(item.borderPrice) + ' por unidade, incluída no valor'),
      );
    if (item.note?.trim()) lines.push('Observação do item: ' + item.note.trim());
    if (item.unitPrice === null) lines.push('Valor: a confirmar pelo WhatsApp');
    else if (item.quantity > 1)
      lines.push(
        'Unitário: ' + money(item.unitPrice),
        'Subtotal do item: ' + money(item.unitPrice * item.quantity),
      );
    else lines.push((item.border ? 'Valor com borda: ' : 'Valor: ') + money(item.unitPrice));
    lines.push('');
  });

  const subtotal = orderSubtotal(items);
  const total = orderTotal(items);
  lines.push(
    subtotal === null
      ? 'Subtotal dos produtos: valor a confirmar pelo WhatsApp'
      : 'Subtotal dos produtos: ' + money(subtotal),
  );
  if (items.length) lines.push('Entrega: ' + money(business.deliveryFee));
  lines.push(
    '*' +
      (total === null ? 'Total: valor a confirmar pelo WhatsApp' : 'Total: ' + money(total)) +
      '*',
  );

  if (details) {
    const address = details.address;
    lines.push(
      '',
      '📍 *Endereço de entrega*',
      address.street.trim() + ', ' + address.number.trim(),
      address.neighborhood.trim() + ' · ' + address.city.trim(),
    );
    if (address.complement.trim()) lines.push('Complemento: ' + address.complement.trim());
    if (address.reference.trim()) lines.push('Referência: ' + address.reference.trim());
  }
  if (payment) lines.push('', '💳 Pagamento: ' + payment);
  if (payment === 'Dinheiro') {
    const changeFor = details?.changeFor;
    if (
      changeFor !== undefined &&
      Number.isFinite(changeFor) &&
      changeFor > 0 &&
      (total === null || changeFor >= total)
    ) {
      lines.push('Troco para: ' + money(changeFor));
      if (total !== null)
        lines.push(
          'Troco previsto: ' + money((Math.round(changeFor * 100) - Math.round(total * 100)) / 100),
        );
    } else lines.push('Não precisa de troco.');
  }
  if (note.trim()) lines.push('', '📝 Observação do pedido: ' + note.trim());
  lines.push('', 'Podem confirmar o pedido e informar o prazo de entrega?');
  return lines.join('\n');
}
export const buildWhatsAppUrl = (message = 'Olá! Gostaria de fazer um pedido na Rei das Pizzas.') =>
  'https://wa.me/' + business.whatsapp + '?text=' + encodeURIComponent(message);
export const buildOrderWhatsAppUrl = (message: string) =>
  'https://wa.me/' + business.orderWhatsapp + '?text=' + encodeURIComponent(message);
