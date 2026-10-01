import { Trash2, Pencil } from 'lucide-react';
import type { OrderItem } from '../../types/menu';
import { money } from '../../utils/format';
import { Quantity } from '../ui/Quantity';
interface CartItemProps {
  item: OrderItem;
  review: boolean;
  onRemove: () => void;
  onEdit: () => void;
  onQuantityChange: (quantity: number) => void;
}
export function CartItem({ item, review, onRemove, onEdit, onQuantityChange }: CartItemProps) {
  return (
    <article className="cart-item">
      <div className="cart-item-heading">
        <h3>
          {item.name}
          {item.variant ? ' · ' + item.variant : ''}
        </h3>
        {!review && (
          <div className="cart-item-actions">
            <button
              type="button"
              className="icon-button"
              aria-label={'Editar ' + item.name}
              onClick={onEdit}
            >
              <Pencil size={17} />
            </button>
            <button className="icon-button" aria-label={'Remover ' + item.name} onClick={onRemove}>
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
      {item.flavors && <p>{item.flavors.join(' / ')}</p>}
      {item.note && (
        <p className="customer-note">
          <strong>Observação do item:</strong> {item.note}
        </p>
      )}
      {item.border && (
        <p>
          Borda: {item.border}{' '}
          <span className="muted">
            (
            {item.borderPrice == null
              ? 'valor a confirmar'
              : money(item.borderPrice) + ' por unidade; incluída no valor'}
            )
          </span>
        </p>
      )}
      <div className="cart-item-bottom">
        {review ? (
          <span>{item.quantity}x</span>
        ) : (
          <Quantity label={item.name} value={item.quantity} onChange={onQuantityChange} />
        )}
        <span>
          {item.unitPrice === null
            ? 'Valor: a confirmar pelo WhatsApp'
            : money(item.unitPrice * item.quantity)}
        </span>
      </div>
      {item.unitPrice !== null && (
        <p className="small muted">Valor confirmado: {money(item.unitPrice)} por unidade</p>
      )}
    </article>
  );
}
