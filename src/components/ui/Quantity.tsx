import { Minus, Plus } from 'lucide-react';
export function Quantity({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
}) {
  return (
    <div className="quantity">
      <button
        type="button"
        disabled={value <= 1}
        aria-label={'Diminuir quantidade de ' + label}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={16} />
      </button>
      <output aria-label={'Quantidade de ' + label}>{value}</output>
      <button
        type="button"
        aria-label={'Aumentar quantidade de ' + label}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
