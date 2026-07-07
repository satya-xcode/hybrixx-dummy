import { create } from "zustand";

/**
 * Cart UI store — ephemeral UI state only.
 * NO server data stored here. Cart data comes from Server Components.
 */
type CartUIStore = {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

export const useCartUI = create<CartUIStore>((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),
}));
