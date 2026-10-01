import { normalize } from '../../utils/text';
import { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { categories, pizzas } from '../../data/menu';
import type { Size } from '../../types/menu';
import { money } from '../../utils/format';
interface FlavorSelectorProps {
  selected: string[];
  size: Size;
  isPizza: boolean;
  onToggle: (id: string) => void;
}
export function FlavorSelector({ selected, size, isPizza, onToggle }: FlavorSelectorProps) {
  const sizeId = size.id;
  const [query, setQuery] = useState('');
  const [flavorCategory, setFlavorCategory] = useState('all');
  const eligible = pizzas.filter(
    (product) =>
      product.available !== false &&
      normalize(product.name).includes(normalize(query)) &&
      (flavorCategory === 'all' || product.category === flavorCategory),
  );
  return (
    <fieldset>
      <legend>
        2. Escolha os sabores{' '}
        <span className="legend-count">
          {selected.length}/{size.maxFlavors}
        </span>
      </legend>
      <p className="muted small">
        Os sabores dividem a pizza em partes iguais. Ao reduzir o tamanho, serão mantidos os
        primeiros sabores selecionados.
      </p>
      <div className="selected-flavors">
        {selected.map((id) => (
          <span key={id}>
            <Check size={14} />
            {pizzas.find((p) => p.id === id)?.name}
          </span>
        ))}
      </div>
      <label className="search compact">
        <Search size={18} />
        <input
          aria-label="Buscar sabor na montagem"
          placeholder="Buscar sabor"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <label className="field">
        Categoria de sabores
        <select value={flavorCategory} onChange={(e) => setFlavorCategory(e.target.value)}>
          <option value="all">Todas as pizzas</option>
          {categories.slice(0, 4).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <div className="flavor-list">
        {eligible.map((p) => (
          <label key={p.id} className={'flavor ' + (selected.includes(p.id) ? 'selected' : '')}>
            <input
              type="checkbox"
              checked={selected.includes(p.id)}
              disabled={!selected.includes(p.id) && selected.length >= size.maxFlavors}
              onChange={() => onToggle(p.id)}
            />
            <span>
              <strong>{p.name}</strong>
              {p.description && <small>{p.description}</small>}
              {isPizza && (
                <small>
                  {p.prices?.[sizeId] != null
                    ? money(p.prices[sizeId]!) + ' · pizza de um sabor'
                    : 'Valor a confirmar'}
                </small>
              )}
            </span>
          </label>
        ))}
        {eligible.length === 0 && <p className="muted">Nenhum sabor encontrado.</p>}
      </div>
    </fieldset>
  );
}
