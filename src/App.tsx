import { useState } from 'react';
import type { CategoryId, Product, OrderItem } from './types/menu';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { ContactSection } from './components/layout/ContactSection';
import { OrderSteps } from './components/layout/OrderSteps';
import { HeroExperience } from './components/home/HeroExperience';
import { MenuSection } from './components/menu/MenuSection';
import { SizeGuide } from './components/menu/SizeGuide';
import { OrderActions } from './components/cart/OrderActions';
import { Announcement } from './components/ui/Announcement';
import ProductModal from './components/product/ProductModal';
import Cart from './components/cart/Cart';
import { useCart } from './hooks/useCart';
import { useAnnouncement } from './hooks/useAnnouncement';
import { FoodBackground } from './components/layout/FoodBackground';

export default function App() {
  const [category, setCategory] = useState<CategoryId>('tradicionais');
  const [query, setQuery] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { items, setItems, addItem, count, total } = useCart();
  const { announcement, announce, dismiss } = useAnnouncement();

  function chooseCategory(id: CategoryId) {
    setCategory(id);
    setQuery('');
  }

  function handleAddItem(item: OrderItem) {
    addItem(item);
    announce(`${item.name} adicionado ao pedido`);
  }

  return (
    <>
      <FoodBackground />
      <a className="skip-link" href="#cardapio">
        Ir para o cardápio
      </a>
      <SiteHeader count={count} onOpenCart={() => setCartOpen(true)} />
      <main>
        <HeroExperience onChoose={setProduct} onNavigate={chooseCategory} />
        <OrderSteps />
        <MenuSection
          category={category}
          query={query}
          setQuery={setQuery}
          chooseCategory={chooseCategory}
          onChoose={setProduct}
        />
        <SizeGuide />
        <ContactSection />
      </main>
      <SiteFooter />
      <OrderActions count={count} total={total} onOpenCart={() => setCartOpen(true)} />
      <Announcement announcement={announcement} onDismiss={dismiss} />
      {product && (
        <ProductModal
          key={product.id}
          product={product}
          onClose={() => setProduct(null)}
          onAdd={handleAddItem}
        />
      )}
      {cartOpen && <Cart items={items} onChange={setItems} onClose={() => setCartOpen(false)} />}
    </>
  );
}
