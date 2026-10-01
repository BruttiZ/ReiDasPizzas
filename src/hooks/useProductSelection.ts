import { useState } from 'react';
import { borders, drinks, pizzas, pizzaSizes, calzoneSizes } from '../data/menu';
import type { Product, OrderItem } from '../types/menu';
import { pizzaPrice, withBorder } from '../utils/pricing';
export function useProductSelection(product: Product) {
  const isCalzone = product.category === 'calzones';
  const isPizza = ['tradicionais', 'premium', 'doces', 'doces-premium'].includes(product.category);
  const customizable = isPizza || isCalzone;
  const sizes = isCalzone ? calzoneSizes : pizzaSizes;
  const [sizeId, setSizeId] = useState(sizes[0].id);
  const [variant, setVariant] = useState('Regular');
  const initialFlavor = isCalzone ? product.id.replace('calzone-', '') : product.id;
  const [selected, setSelected] = useState<string[]>(customizable ? [initialFlavor] : []);
  const [border, setBorder] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [drinkQuantities, setDrinkQuantities] = useState<Record<string, number>>({});
  const size = sizes.find((s) => s.id === sizeId)!;
  const selectedBorder = borders.find((b) => b.name === border);
  const selectedFlavorNames = selected.map((id) => pizzas.find((pizza) => pizza.id === id)!.name);
  const basePrice = isPizza
    ? pizzaPrice(
        selected.map((id) => pizzas.find((p) => p.id === id)!),
        sizeId,
      )
    : isCalzone
      ? size.price!
      : (product.prices?.[product.category === 'bebidas' ? 'Unidade' : variant] ?? null);
  const price = withBorder(basePrice, selectedBorder, sizeId);
  const drinkTotal = drinks.reduce(
    (sum, d) => sum + (drinkQuantities[d.id] || 0) * d.prices!.Unidade!,
    0,
  );
  const changeSize = (id: string) => {
    setSizeId(id);
    const max = sizes.find((s) => s.id === id)!.maxFlavors;
    setSelected((current) => current.slice(0, max));
  };

  function toggleFlavor(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((flavorId) => flavorId !== id);
      if (current.length >= size.maxFlavors) return current;
      return [...current, id];
    });
  }

  function changeDrinkQuantity(id: string, quantity: number) {
    setDrinkQuantities((current) => ({ ...current, [id]: quantity }));
  }

  function addToOrder(onAdd: (item: OrderItem) => void) {
    onAdd({
      id: crypto.randomUUID(),
      productId: product.id,
      name: isPizza ? 'Pizza' : isCalzone ? 'Calzone' : product.name,
      quantity,
      variant: customizable ? size.name : product.category === 'xis' ? variant : undefined,
      flavors: customizable
        ? selected.map((id) => pizzas.find((p) => p.id === id)!.name)
        : undefined,
      border: border || undefined,
      borderPrice: selectedBorder ? (selectedBorder.prices?.[sizeId] ?? null) : undefined,
      unitPrice: price,
    });
    for (const d of drinks) {
      if (drinkQuantities[d.id])
        onAdd({
          id: crypto.randomUUID(),
          productId: d.id,
          name: d.name,
          quantity: drinkQuantities[d.id],
          unitPrice: d.prices!.Unidade!,
        });
    }
  }
  return {
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
  };
}
