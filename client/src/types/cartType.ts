import {MenuItem} from '../types/restaurantType'

export interface CartItem extends MenuItem {
  quantity: number;
}

export type CartState = {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  clearCart: () => void;
  removeFromCart: (id: string) => void;
  incremenuQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
}