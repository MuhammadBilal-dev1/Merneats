import { CheckOutSessionRequest, OrderState } from '@/types/orderType'
import axios from 'axios'
import { API_URL } from '@/config'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const API_END_POINT = `${API_URL}/api/v1/order`;
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(persist((set => ({
  loading: false,
  orders: [],
  createCheckOutSession: async (checkOutSession: CheckOutSessionRequest) => {
    try {
      set({loading: true})
      const response = await axios.post(`${API_END_POINT}/checkout/create-checkout-session`, checkOutSession, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      window.location.href = response.data.session.url
      set({loading: false})
    } catch (error) {
      set({loading: false})
    }
  },
  getOrderDetails: async () => {
    try {
      set({ loading: true });
      const response = await axios.get(`${API_END_POINT}/`)
      
      set({loading: false, orders: response.data.allOrders})
      console.log("order detail fetching from backend: ", response.data.allOrders);
    } catch (error) {
      set({loading: false})
    }
  },
})), {
  name: "order-name",
  storage: createJSONStorage(() => localStorage)
})) 
