import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOrderStore } from "@/store/useOrderStore";
import { userCartStore } from "@/store/useCartStore";
import { DollarSignIcon } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Success = () => {
  const { orders, getOrderDetails } = useOrderStore();
  const { clearCart } = userCartStore();

  useEffect(() => {
    getOrderDetails();
    clearCart();
  }, []);
  console.log(orders);

  if (orders?.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="font-bold text-2xl md:text-5xl text-slate-300 dark:text-gray-300">
          Orders not found!
        </h1>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-14">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Order Status:{" "}
            <span className="text-orange">{"confirm".toUpperCase()}</span>
          </h1>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Order Summary
          </h2>
          {/* Ordered items display here. */}
          {orders?.map((order: any, index: number) => (
            <div key={order._id || index}>
              {order.cartItems.map((item: any, idx: number) => (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt=""
                        className="h-14 w-14 object-cover rounded-md"
                      />
                      <div className="ml-4">
                        <h3 className="text-gray-800 dark:text-gray-200 font-medium">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} x ${item.price}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-800 dark:text-gray-200 flex items-center">
                        <DollarSignIcon size={16} />
                        <span className="text-lg font-semibold">
                          {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex justify-between items-center mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <span className="text-gray-700 dark:text-gray-300 font-bold">
                  Total Amount
                </span>
                <div className="text-orange flex items-center">
                  <DollarSignIcon size={20} />
                  <span className="text-xl font-extrabold">
                    {order.cartItems
                      .reduce(
                        (acc: number, item: any) =>
                          acc + item.price * item.quantity,
                        0,
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link to={"/cart"}>
          <Button className="w-full bg-orange hover:bg-hoverOrange shadow-lg py-3">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
