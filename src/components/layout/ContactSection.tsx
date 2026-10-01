import { ArrowUpRight, Instagram } from 'lucide-react';
import { business } from '../../data/config';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
export function ContactSection() {
  const wa = buildWhatsAppUrl();
  return (
    <section id="contato" className="section container contact">
      <div>
        <span className="eyebrow">VAMOS CONVERSAR?</span>
        <h2>
          Seu pedido.
          <br />
          <em>Nosso WhatsApp.</em>
        </h2>
        <p className="muted">
          Confirme os valores e combine os detalhes do pedido
          <br className="desktop-label" /> diretamente com a Rei das Pizzas.
        </p>
        <a className="button primary" href={wa} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon />
          Pedir pelo WhatsApp
          <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="contact-links">
        <a href={wa} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={28} />
          <div>
            <span>WHATSAPP</span>
            <strong>{business.phone}</strong>
          </div>
          <ArrowUpRight size={20} />
        </a>
        <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer">
          <Instagram size={28} />
          <div>
            <span>INSTAGRAM</span>
            <strong>{business.instagram}</strong>
          </div>
          <ArrowUpRight size={20} />
        </a>
      </div>
    </section>
  );
}
