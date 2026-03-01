import { CartState } from '@/types/cartType'
import { MenuItem } from '@/types/restaurantType'
import { create } from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'

export const userCartStore = create<CartState>()(persist((set) => ({
  cart: [],
  addToCart: (item: MenuItem) => {
    set((state: any) => {
        const existingItem = state.cart.find((cartItem: any) => cartItem._id === item._id)
        if (existingItem) {
          return {
            cart: state.cart.map((cartItem:any) => cartItem._id === item._id ? {...cartItem, quantity: cartItem.quantity + 1} : cartItem)
          }
      }
        else {
          return {
            cart: [...state.cart, {...item, quantity: 1}]
          }
      }
      })
  },
  clearCart: () => { 
    set({ cart: [] });
  },
  removeFromCart: (id: string) => {
    set((state) => ({
      cart: state.cart.filter((item) => item._id !== id)
    }))
   },
  incremenuQuantity: (id: string) => { 
    set((state) => ({
      cart: state.cart.map((item) => item._id === id ? {...item, quantity: item.quantity + 1} : item)
    }))
  },
  decrementQuantity: (id: string) => {
    set((state) => ({
      cart: state.cart.map((item) => item._id === id && item.quantity > 1 ? {...item, quantity: item.quantity - 1} : item)
    }))
  }
  
}),
  {
    name: 'cart-name',
    storage: createJSONStorage(() => localStorage)
  }
))
