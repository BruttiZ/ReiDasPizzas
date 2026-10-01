import { SizeSelector } from './SizeSelector';
import { FlavorSelector } from './FlavorSelector';
import { BorderSelector } from './BorderSelector';
import { DrinkSelector } from './DrinkSelector';
import { useProductSelection } from '../../hooks/useProductSelection';
import { business } from '../../data/config';
import { Plus, Info } from 'lucide-react';
import type { Product, OrderItem } from '../../types/menu';
import { money } from '../../utils/format';
import { Dialog } from '../ui/Dialog';
import { Quantity } from '../ui/Quantity';
export default function ProductModal({
  product,
  onClose,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  onAdd: (item: OrderItem) => void;
}) {
  const {
    isCalzone,
    isPizza,
    customizable,
    sizes,
    sizeId,
    variant,
    setVariant,
    selected,
    selectedFlavorNames,
    border,
    setBorder,
    quantity,
    setQuantity,
    drinkQuantities,
    size,
    selectedBorder,
    basePrice,
    price,
    drinkTotal,
    changeSize,
    addToOrder,
    toggleFlavor,
    changeDrinkQuantity,
  } = useProductSelection(product);
  if (product.category === 'bordas')
    return (
      <Dialog title={product.name} onClose={onClose}>
        <p className="notice">
          <Info size={18} />A borda é escolhida durante a montagem de uma pizza.
        </p>
        <button type="button" className="button primary full" onClick={onClose}>
          Voltar ao cardápio
        </button>
      </Dialog>
    );
  return (
    <Dialog title={product.name} onClose={onClose} wide={customizable}>
      <div className={customizable ? 'product-builder' : 'product-builder simple-builder'}>
        <div className="product-builder-options">
          {product.description && <p className="muted modal-description">{product.description}.</p>}
          {customizable ? (
            <>
              <SizeSelector sizes={sizes} sizeId={sizeId} onChange={changeSize} />
              <FlavorSelector
                selected={selected}
                size={size}
                isPizza={isPizza}
                onToggle={toggleFlavor}
              />
              {isPizza && <BorderSelector sizeId={sizeId} value={border} onChange={setBorder} />}
            </>
          ) : product.category === 'xis' ? (
            <fieldset>
              <legend>Escolha a versão</legend>
              <div className="size-options">
                {['Regular', 'Calota'].map((v) => (
                  <label className={'size-option ' + (variant === v ? 'selected' : '')} key={v}>
                    <input
                      type="radio"
                      name="variant"
                      checked={variant === v}
                      onChange={() => setVariant(v)}
                    />
                    <strong>{v}</strong>
                    <span>
                      {product.prices?.[v] === null
                        ? 'Consulte o valor pelo WhatsApp'
                        : money(product.prices![v]!)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          {isPizza && (
            <p className="small pricing-rule">
              Preço da pizza: maior valor entre os sabores escolhidos para o tamanho. Com pelo menos
              um sabor Premium, vale o preço Premium. A borda recheada é somada uma única vez por
              pizza; bebidas são cobradas separadamente.
            </p>
          )}
          {isPizza && selected.length === 0 && (
            <p className="notice">
              <Info size={18} />
              Selecione pelo menos um sabor.
            </p>
          )}
          {(customizable || product.category === 'xis') && (
            <DrinkSelector
              quantities={drinkQuantities}
              total={drinkTotal}
              onQuantityChange={changeDrinkQuantity}
            />
          )}
        </div>
        <aside className="product-order-summary" aria-label="Resumo da montagem">
          <span className="eyebrow">DO SEU JEITO</span>
          <h3>Sua escolha</h3>
          <p className="summary-product">
            {isPizza ? 'Pizza personalizada' : isCalzone ? 'Calzone personalizado' : product.name}
          </p>
          {customizable && (
            <p className="small muted">
              Tamanho: {size.name} · {selected.length} de {size.maxFlavors}{' '}
              {size.maxFlavors === 1 ? 'sabor' : 'sabores'}
            </p>
          )}
          {customizable && selectedFlavorNames.length > 0 && (
            <p className="small muted summary-flavors">
              Sabores: {selectedFlavorNames.join(' / ')}
            </p>
          )}
          {(customizable || product.category === 'xis') && (
            <dl className="price-breakdown" aria-label="Composição do valor">
              <div>
                <dt>
                  {isPizza
                    ? 'Pizza por unidade'
                    : isCalzone
                      ? 'Calzone por unidade'
                      : 'Lanche por unidade'}
                </dt>
                <dd>{basePrice == null ? 'A confirmar' : money(basePrice)}</dd>
              </div>
              {selectedBorder && (
                <div>
                  <dt>Borda por pizza</dt>
                  <dd>
                    {selectedBorder.prices?.[sizeId] == null
                      ? 'A confirmar'
                      : money(selectedBorder.prices[sizeId]!)}
                  </dd>
                </div>
              )}
              {drinkTotal > 0 && (
                <div>
                  <dt>Bebidas selecionadas</dt>
                  <dd>{money(drinkTotal)}</dd>
                </div>
              )}
            </dl>
          )}
          <div className="add-footer">
            <div>
              <span className="muted small">Quantidade</span>
              <Quantity value={quantity} onChange={setQuantity} label={product.name} />
            </div>
            <div className="price-summary">
              {price === null
                ? 'Valor a confirmar pelo WhatsApp'
                : money(price * quantity + drinkTotal)}
              {drinkTotal > 0 && <small className="small"> · inclui bebidas</small>}
            </div>
          </div>
          <p className="small muted">
            Entrega de {money(business.deliveryFee)} adicionada uma única vez no carrinho.
          </p>
          <button
            className="button primary full"
            disabled={customizable && selected.length === 0}
            onClick={() => {
              addToOrder(onAdd);
              onClose();
            }}
          >
            <Plus size={18} />
            Adicionar ao pedido
          </button>
        </aside>
      </div>
    </Dialog>
  );
}
