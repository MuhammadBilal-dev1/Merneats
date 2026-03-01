import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrderStore } from "@/store/useOrderStore";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DollarSignIcon } from "lucide-react";

const OrderDetails = () => {
  const params = useParams();
  const { orders, getOrderDetails, loading } = useOrderStore();

  useEffect(() => {
    if (!orders || orders.length === 0) {
      getOrderDetails();
    }
  }, []);

  const order = orders?.find((o: any) => o._id === params.id);

  if (loading && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Order not found
      </div>
    );
  }

  const total = order.cartItems?.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6">
        Order #{order._id?.slice(-6)}
      </h1>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              <div className="capitalize">
                Status: <span className="font-semibold">{order.status}</span>
              </div>
              <div className="">
                Deliver to:{" "}
                <span className="font-semibold">
                  {order.deliveryDetails?.name}
                </span>
              </div>
              <div className="">Address: {order.deliveryDetails?.address}</div>
              <div className="">City: {order.deliveryDetails?.city}</div>
            </div>
            <div className="text-orange font-extrabold text-xl flex items-center">
              <DollarSignIcon />
              {total?.toFixed(2)}
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            {order.cartItems?.map((item: any, idx: number) => {
              const sub = item.price * item.quantity;
              return (
                <div
                  key={idx}
                  className="flex justify-between items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      className="h-14 w-14 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        Qty: {item.quantity} x ${item.price}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold flex items-center">
                    <DollarSignIcon size={16} />
                    {sub.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <div className="font-bold">Total</div>
            <div className="text-orange font-extrabold text-xl flex items-center">
              <DollarSignIcon />
              {total?.toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6">
        <Link to="/orders">
          <Button className="bg-orange hover:bg-hoverOrange">Back</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderDetails;

