import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { Brand } from '../ui/Brand';
export function SiteHeader({ count, onOpenCart }: { count: number; onOpenCart: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#inicio" className="brand" aria-label="Rei das Pizzas — início">
          <Brand />
        </a>
        <nav className={'main-nav ' + (menuOpen ? 'open' : '')} aria-label="Navegação principal">
          <a href="#cardapio" onClick={() => setMenuOpen(false)}>
            Cardápio
          </a>
          <a href="#tamanhos" onClick={() => setMenuOpen(false)}>
            Tamanhos
          </a>
          <a href="#contato" onClick={() => setMenuOpen(false)}>
            Contato
          </a>
        </nav>
        <div className="header-actions">
          <button className="button cart-trigger" onClick={onOpenCart}>
            <ShoppingBag size={18} />
            <span className="desktop-label">Ver pedido</span>
            <motion.span
              className="count"
              key={count}
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {count}
            </motion.span>
          </button>
          <button
            className="icon-button mobile-menu"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
