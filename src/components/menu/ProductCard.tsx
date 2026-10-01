import { motion } from 'motion/react';
import { ArrowRight, Plus } from 'lucide-react';
import { categories } from '../../data/menu';
import type { Product } from '../../types/menu';
import { ProductPrices } from './ProductPrices';
interface ProductCardProps {
  product: Product;
  index: number;
  onChoose: (product: Product) => void;
  onChoosePizza: () => void;
}
export function ProductCard({ product: p, index, onChoose, onChoosePizza }: ProductCardProps) {
  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.32, delay: (index % 3) * 0.04 }}
      whileHover={{ y: -4 }}
    >
      <div className="product-top">
        <span className="product-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="product-category">
          {categories.find((c) => c.id === p.category)?.name}
        </span>
      </div>
      <h4>{p.name}</h4>
      {p.description && <p className="ingredients">{p.description}.</p>}
      <div className="product-bottom">
        <div className="product-price">
          <ProductPrices product={p} />
        </div>
        {p.category === 'bordas' ? (
          <button
            className="add-product"
            onClick={onChoosePizza}
            aria-label={'Escolher pizza para ' + p.name}
          >
            <ArrowRight size={19} />
            <span>Escolher pizza</span>
          </button>
        ) : (
          <button
            className="add-product"
            onClick={() => onChoose(p)}
            aria-label={'Adicionar ao pedido: ' + p.name}
          >
            <Plus size={19} />
            <span>Adicionar</span>
          </button>
        )}
      </div>
    </motion.article>
  );
}
