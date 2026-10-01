import type { DeliveryAddress } from '../../types/menu';

interface DeliveryFieldsProps {
  address: DeliveryAddress;
  onChange: (address: DeliveryAddress) => void;
}

const fields = [
  { key: 'street', label: 'Rua / avenida', autocomplete: 'address-line1', required: true },
  { key: 'number', label: 'Número', placeholder: 'Número ou S/N', required: true },
  { key: 'neighborhood', label: 'Bairro', required: true },
  { key: 'city', label: 'Cidade', autocomplete: 'address-level2', required: true },
  { key: 'complement', label: 'Complemento', autocomplete: 'address-line2', required: false },
  { key: 'reference', label: 'Ponto de referência', required: false },
] as const;

export function DeliveryFields({ address, onChange }: DeliveryFieldsProps) {
  return (
    <fieldset className="delivery-fields">
      <legend>Endereço de entrega</legend>
      <p className="small muted">
        Informe onde receber o pedido. A área atendida e o prazo serão confirmados pela pizzaria.
      </p>
      <div className="delivery-grid">
        {fields.map((field) => (
          <label className={'field delivery-' + field.key} key={field.key}>
            <span>
              {field.label}
              {!field.required && <span className="muted"> (opcional)</span>}
            </span>
            <input
              value={address[field.key]}
              required={field.required}
              maxLength={field.key === 'number' ? 20 : 150}
              autoComplete={'autocomplete' in field ? field.autocomplete : undefined}
              placeholder={'placeholder' in field ? field.placeholder : undefined}
              onChange={(event) => onChange({ ...address, [field.key]: event.target.value })}
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
