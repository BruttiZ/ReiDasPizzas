import { borders } from '../../data/menu';
import { money } from '../../utils/format';
import type { Product } from '../../types/menu';
interface BorderSelectorProps {
  sizeId: string;
  value: string;
  onChange: (value: string) => void;
}
export function BorderSelector({ sizeId, value, onChange }: BorderSelectorProps) {
  const borderLabel = (border: Product) =>
    border.name +
    ' — ' +
    (border.prices?.[sizeId] != null ? money(border.prices[sizeId]!) : 'valor a confirmar');
  return (
    <label className="field">
      3. Borda (opcional)
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Sem borda adicional</option>
        <optgroup label="Salgadas">
          {borders.slice(0, 4).map((b) => (
            <option key={b.id} value={b.name}>
              {borderLabel(b)}
            </option>
          ))}
        </optgroup>
        <optgroup label="Doces">
          {borders.slice(4).map((b) => (
            <option key={b.id} value={b.name}>
              {borderLabel(b)}
            </option>
          ))}
        </optgroup>
      </select>
    </label>
  );
}
