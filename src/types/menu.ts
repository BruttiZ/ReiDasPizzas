export type CategoryId =
  | 'tradicionais'
  | 'premium'
  | 'doces'
  | 'doces-premium'
  | 'calzones'
  | 'bordas'
  | 'xis'
  | 'bebidas';
export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  description?: string;
  image?: string;
  available?: boolean;
  prices?: Record<string, number | null>;
}
export interface Size {
  id: string;
  name: string;
  slices: number;
  maxFlavors: number;
  diameter?: number;
  range?: [number, number];
  price?: number;
}
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  variant?: string;
  flavors?: string[];
  flavorIds?: string[];
  sizeId?: string;
  note?: string;
  border?: string;
  borderPrice?: number | null;
  unitPrice: number | null;
}
export type PaymentPreference = 'Pix' | 'Cartão' | 'Dinheiro';

export interface DeliveryAddress {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  complement: string;
  reference: string;
}

export interface CheckoutDetails {
  address: DeliveryAddress;
  changeFor?: number;
}
