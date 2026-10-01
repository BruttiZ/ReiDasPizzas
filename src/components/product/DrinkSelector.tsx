import { drinks } from '../../data/menu';
import { money } from '../../utils/format';
import { Quantity } from '../ui/Quantity';
interface DrinkSelectorProps {
  quantities: Record<string, number>;
  total: number;
  onQuantityChange: (id: string, quantity: number) => void;
}
export function DrinkSelector({
  quantities: drinkQuantities,
  total: drinkTotal,
  onQuantityChange,
}: DrinkSelectorProps) {
  return (
    <details className="drink-extras">
      <summary>Bebidas (opcional)</summary>
      <p className="small muted">
        As quantidades de bebidas são independentes da quantidade de pizzas ou lanches.
      </p>
      <div className="drink-options">
        {drinks.map((d) => (
          <div className="drink-option" key={d.id}>
            <label>
              <input
                type="checkbox"
                checked={!!drinkQuantities[d.id]}
                onChange={(e) => onQuantityChange(d.id, e.target.checked ? 1 : 0)}
              />
              <span>
                {d.name}
                <small>{money(d.prices!.Unidade!)}</small>
              </span>
            </label>
            {!!drinkQuantities[d.id] && (
              <Quantity
                value={drinkQuantities[d.id]}
                onChange={(q) => onQuantityChange(d.id, q)}
                label={d.name}
              />
            )}
          </div>
        ))}
      </div>
      {drinkTotal > 0 && <p className="drink-subtotal">Bebidas: {money(drinkTotal)}</p>}
    </details>
  );
}
