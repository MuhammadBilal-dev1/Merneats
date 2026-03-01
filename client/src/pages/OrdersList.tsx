import { useEffect } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const OrdersList = () => {
  const { orders, getOrderDetails, loading } = useOrderStore();

  useEffect(() => {
    getOrderDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No orders found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6">Your Orders</h1>
      <div className="grid gap-4">
        {orders.map((order: any) => {
          const total = order.cartItems?.reduce(
            (acc: number, item: any) => acc + item.price * item.quantity,
            0
          );
          return (
            <Card key={order._id} className="shadow-md">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">
                    Order #{order._id?.slice(-6)}
                  </div>
                  <div className="text-sm text-gray-500 capitalize">
                    Status: {order.status || "confirmed"}
                  </div>
                  <div className="text-sm text-gray-500">
                    Items: {order.cartItems?.length || 0}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-orange">
                    ${total?.toFixed(2)}
                  </span>
                  <Link to={`/order/${order._id}`}>
                    <Button className="bg-orange hover:bg-hoverOrange">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersList;

