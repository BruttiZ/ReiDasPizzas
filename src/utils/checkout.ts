import type { DeliveryAddress } from '../types/menu';

export const emptyAddress: DeliveryAddress = {
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  complement: '',
  reference: '',
};

export function isAddressComplete(address: DeliveryAddress) {
  return [address.street, address.number, address.neighborhood, address.city].every(
    (value) => value.trim().length > 0,
  );
}

export function parseChangeAmount(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const amount = Number(normalized);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}
