import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: string;          // CUID de la base de datos
  name: string;
  price: number;
  image: string;
  category: string;
  sizes?: string[];    // array de tallas
  description: string;
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size?: string) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, size) => {
        set((state) => {
          const key = `${product.id}-${size ?? ""}`;
          const existing = state.items.find(
            (i) => `${i.id}-${i.selectedSize ?? ""}` === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                `${i.id}-${i.selectedSize ?? ""}` === key
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1, selectedSize: size }] };
        });
      },
      removeItem: (id, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.selectedSize === size)
          ),
        }));
      },
      updateQuantity: (id, quantity, size) => {
        if (quantity <= 0) {
          get().removeItem(id, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.selectedSize === size ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      count: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);
