import { business } from '../data/config';
import type { OrderItem, PaymentPreference } from '../types/menu';
export const money = (amount: number) => amount.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export const orderSubtotal = (items: OrderItem[]): number | null => items.length === 0 || items.some(item=>item.unitPrice === null) ? null : items.reduce((sum,item)=>sum + Math.round(item.unitPrice! * 100) * item.quantity,0) / 100;
export const orderTotal = (items: OrderItem[]): number | null => {
 const subtotal=orderSubtotal(items);
 return subtotal===null?null:(Math.round(subtotal*100)+Math.round(business.deliveryFee*100))/100;
};
export function buildWhatsAppMessage(items: OrderItem[], name = '', note = '', payment?: PaymentPreference) {
 const lines = ['Olá! Gostaria de fazer um pedido na Rei das Pizzas.'];
 if(name.trim()) lines.push('Nome: '+name.trim());
 lines.push('', 'Pedido:');
 for(const item of items) {
  lines.push(item.quantity+'x '+item.name);
  if(item.variant) lines.push('Tamanho/versão: '+item.variant);
  if(item.flavors?.length) lines.push('Sabores: '+item.flavors.join(' / '));
  if(item.name==='Pizza' && item.flavors && item.flavors.length>1) lines.push('Divisão: '+item.flavors.length+' partes iguais; preço pela média proporcional, arredondada para cima no centavo.');
  if(item.border) lines.push('Borda: '+item.border+(item.borderPrice==null?' — valor a confirmar pelo WhatsApp':' — '+money(item.borderPrice)+' por unidade (incluída no valor quando confirmado)'));
  lines.push(item.unitPrice === null ? 'Valor: a confirmar pelo WhatsApp' : 'Valor unitário: '+money(item.unitPrice)+' | Subtotal: '+money(item.unitPrice * item.quantity), '');
 }
 const subtotal=orderSubtotal(items);
 const total=orderTotal(items);
 lines.push(subtotal===null?'Subtotal dos produtos: valor a confirmar pelo WhatsApp':'Subtotal dos produtos: '+money(subtotal));
 if(items.length) lines.push('Entrega: '+money(business.deliveryFee));
 lines.push(total === null ? 'Total: valor a confirmar pelo WhatsApp' : 'Total: '+money(total));
 if(payment) lines.push('Preferência de pagamento: '+payment+' (a confirmar no atendimento)');
 if(note.trim()) lines.push('', 'Observação: '+note.trim());
 lines.push('', 'Gostaria de confirmar os valores e os detalhes e finalizar o pedido pelo WhatsApp.');
 return lines.join('\n');
}
export const buildWhatsAppUrl = (message = 'Olá! Gostaria de fazer um pedido na Rei das Pizzas.') => 'https://wa.me/'+business.whatsapp+'?text='+encodeURIComponent(message);
export const buildOrderWhatsAppUrl = (message: string) => 'https://wa.me/'+business.orderWhatsapp+'?text='+encodeURIComponent(message);
