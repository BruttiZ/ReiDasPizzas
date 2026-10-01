import { ArrowUpRight, Instagram } from 'lucide-react';
import { business } from '../../data/config';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { Brand } from '../ui/Brand';
export function SiteFooter() {
  const wa = buildWhatsAppUrl();
  return (
    <footer>
      <div className="container footer-main">
        <a href="#inicio" className="brand" aria-label="Rei das Pizzas — início">
          <Brand />
        </a>
        <p>
          Pizzas de forno a lenha.
          <br />
          Seu próximo pedido começa aqui.
        </p>
        <nav aria-label="Navegação do rodapé">
          <a href="#cardapio">Cardápio</a>
          <a href="#tamanhos">Tamanhos</a>
          <a href="#contato">Contato</a>
        </nav>
        <a href={wa} className="footer-cta" target="_blank" rel="noopener noreferrer">
          Pedir pelo WhatsApp
          <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="container footer-bottom">
        <span>Rei das Pizzas</span>
        <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer">
          <Instagram size={15} />
          {business.instagram}
        </a>
      </div>
    </footer>
  );
}
