import { ArrowRight, ShoppingBag } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { money } from '../../utils/format';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
export function OrderActions({
  count,
  total,
  onOpenCart,
}: {
  count: number;
  total: number | null;
  onOpenCart: () => void;
}) {
  const wa = buildWhatsAppUrl();
  return (
    <>
      <a
        className={'floating-whatsapp ' + (count ? 'with-cart' : '')}
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar com a Rei das Pizzas pelo WhatsApp"
        title="Pedir pelo WhatsApp"
      >
        <WhatsAppIcon size={27} />
      </a>
      {count > 0 && (
        <button className="mobile-cart" onClick={onOpenCart}>
          <ShoppingBag size={20} />
          <strong>
            Ver pedido <span>({count})</span>
          </strong>
          <span>{total === null ? 'Confirmar valor' : money(total)}</span>
          <ArrowRight size={18} />
        </button>
      )}
    </>
  );
}
