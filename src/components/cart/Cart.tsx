import { useState } from 'react';
import { business } from '../../data/config';
import { ArrowLeft, ShoppingBag, Info } from 'lucide-react';
import type { OrderItem, PaymentPreference } from '../../types/menu';
import { buildWhatsAppMessage, buildOrderWhatsAppUrl } from '../../utils/whatsapp';
import { money } from '../../utils/format';
import { orderSubtotal, orderTotal } from '../../utils/order';
import { Dialog } from '../ui/Dialog';
import { CartItem } from './CartItem';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
export default function Cart({
  items,
  onChange,
  onClose,
}: {
  items: OrderItem[];
  onChange: (items: OrderItem[]) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [review, setReview] = useState(false);
  const [payment, setPayment] = useState<PaymentPreference | null>(null);
  const total = orderTotal(items);
  const subtotal = orderSubtotal(items);
  return (
    <Dialog title={review ? 'Revise seu pedido' : 'Seu pedido'} onClose={onClose}>
      {items.length === 0 ? (
        <div className="empty">
          <ShoppingBag size={40} />
          <h3>O pedido começa no cardápio</h3>
          <p className="muted">Escolha o que deseja e adicione por aqui.</p>
          <button className="button primary" onClick={onClose}>
            Ver cardápio
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                review={review}
                onRemove={() => onChange(items.filter((current) => current.id !== item.id))}
                onQuantityChange={(quantity) =>
                  onChange(
                    items.map((current) =>
                      current.id === item.id ? { ...current, quantity } : current,
                    ),
                  )
                }
              />
            ))}
          </div>
          <section className="cart-costs" aria-label="Valores do pedido">
            <dl className="price-breakdown cart-breakdown">
              <div>
                <dt>Subtotal dos produtos</dt>
                <dd>{subtotal === null ? 'A confirmar' : money(subtotal)}</dd>
              </div>
              <div>
                <dt>Entrega</dt>
                <dd>{money(business.deliveryFee)}</dd>
              </div>
            </dl>
            <div className="cart-total">
              <span>Total</span>
              <strong>{total === null ? 'Valor a confirmar pelo WhatsApp' : money(total)}</strong>
            </div>
          </section>
          {!review ? (
            <div className="cart-checkout">
              <label className="field">
                Seu nome <span className="muted">(opcional)</span>
                <input
                  autoComplete="given-name"
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="field">
                Observação do pedido <span className="muted">(opcional)</span>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Algo que deseja informar à pizzaria?"
                />
              </label>
              <fieldset className="payment-options">
                <legend>Forma de pagamento</legend>
                <p className="muted small">Selecione uma opção para revisar o pedido.</p>
                <div className="size-options">
                  {(['Pix', 'Cartão', 'Dinheiro'] as const).map((method) => (
                    <label
                      key={method}
                      className={'size-option ' + (payment === method ? 'selected' : '')}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === method}
                        onChange={() => setPayment(method)}
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <button
                className="button primary full"
                disabled={!payment}
                onClick={() => setReview(true)}
              >
                Revisar pedido
              </button>
              <button className="button text-button full" onClick={onClose}>
                <ArrowLeft size={16} />
                Voltar ao cardápio
              </button>
            </div>
          ) : (
            <>
              <div className="cart-customer-details">
                {payment && (
                  <p className="payment-review">
                    <strong>Preferência de pagamento:</strong> {payment}
                    <br />
                    <span className="muted small">A confirmar no atendimento.</span>
                  </p>
                )}
                {name && (
                  <p>
                    <strong>Nome:</strong> {name}
                  </p>
                )}
                {note && (
                  <p className="customer-note">
                    <strong>Observação:</strong> {note}
                  </p>
                )}
              </div>
              <div className="cart-checkout-actions">
                <p className="notice">
                  <Info size={18} />O WhatsApp abrirá com seu pedido preenchido. Envie a mensagem e
                  confirme valores, pagamento e entrega com o atendimento.
                </p>
                <a
                  className="button primary full"
                  href={buildOrderWhatsAppUrl(
                    buildWhatsAppMessage(items, name, note, payment ?? undefined),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  Finalizar pelo WhatsApp
                </a>
                <button className="button text-button full" onClick={() => setReview(false)}>
                  <ArrowLeft size={16} />
                  Editar pedido
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Dialog>
  );
}
