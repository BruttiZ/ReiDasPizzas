import type { Size } from '../../types/menu';
import { money } from '../../utils/format';
interface SizeSelectorProps {
  sizes: Size[];
  sizeId: string;
  onChange: (id: string) => void;
}
export function SizeSelector({ sizes, sizeId, onChange }: SizeSelectorProps) {
  return (
    <fieldset>
      <legend>1. Escolha o tamanho</legend>
      <div className="size-options">
        {sizes.map((s) => (
          <label className={'size-option ' + (sizeId === s.id ? 'selected' : '')} key={s.id}>
            <input
              type="radio"
              name="size"
              value={s.id}
              checked={sizeId === s.id}
              onChange={() => onChange(s.id)}
            />
            <strong>{s.name}</strong>
            <span>
              {s.diameter ? s.diameter + ' cm · ' : ''}
              {s.slices} fatias
            </span>
            <span>
              Até {s.maxFlavors} {s.maxFlavors === 1 ? 'sabor' : 'sabores'}
            </span>
            {s.price !== undefined && <b>{money(s.price)}</b>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
