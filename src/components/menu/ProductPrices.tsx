import { calzoneSizes, pizzaSizes } from '../../data/menu';
import type { Product } from '../../types/menu';
import { money } from '../../utils/format';

export function ProductPrices({ product }: { product: Product }) {
  switch (product.category) {
    case 'xis':
      return (
        <>
          {['Regular', 'Calota'].map((variant) => (
            <span key={variant}>
              {variant}{' '}
              <b>
                {product.prices?.[variant] == null ? 'A confirmar' : money(product.prices[variant])}
              </b>
            </span>
          ))}
        </>
      );
    case 'calzones':
      return (
        <>
          {calzoneSizes.map((size) => (
            <span key={size.id}>
              {size.name} <b>{money(size.price!)}</b>
            </span>
          ))}
        </>
      );
    case 'bebidas':
      return <b>{money(product.prices!.Unidade!)}</b>;
    default:
      return (
        <span className="border-price-list">
          {pizzaSizes.map((size) => (
            <span key={size.id}>
              <span>{size.name}</span>
              <b>
                {product.prices?.[size.id] == null
                  ? 'a confirmar'
                  : money(product.prices[size.id]!)}
              </b>
            </span>
          ))}
        </span>
      );
  }
}
