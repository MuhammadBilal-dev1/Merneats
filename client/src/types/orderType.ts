export type CheckOutSessionRequest = {
  cartItems: {
    menuId: string;
    name: string;
    image: string;
    price: string;
    quantity: string;
  }[];
  deliveryDetails: {
    name: string;
    email: string;
    contact: string;
    address: string;
    city: string;
    country: string;
  },
  RestaurantId: string;
}

export interface Orders extends CheckOutSessionRequest {
  _id: string;
  status: string;
  totalAmount: number;
}

export type OrderState = {
  loading: boolean;
  orders: Orders[];
  createCheckOutSession: (checkOutSessionRequest: CheckOutSessionRequest) => Promise<void>;
  getOrderDetails: () => Promise<void>;
}