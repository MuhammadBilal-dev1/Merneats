import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";
import { userCartStore } from "@/store/useCartStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { CheckOutSessionRequest } from "@/types/orderType";
import { useOrderStore } from "@/store/useOrderStore";
import { Loader } from "lucide-react";

const CheckOutConfirmPage = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useUserStore();
  const [input, setInput] = useState({
    name: user?.fullname || "",
    email: user?.email || "",
    contact: user?.contact || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
  });
  const { cart } = userCartStore();
  const { restaurant, getRestaurant } = useRestaurantStore();
  const { createCheckOutSession, loading } = useOrderStore();

  const handleEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const checkOutHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // api implementation starts from here
    try {
      await getRestaurant();
      const checkOutData: CheckOutSessionRequest = {
        cartItems: cart.map((cartItem) => ({
          menuId: cartItem._id,
          name: cartItem.name,
          quantity: cartItem.quantity.toString(),
          price: cartItem.price.toString(),
          image: cartItem.image,
        })),
        deliveryDetails: input,
        RestaurantId: restaurant?._id!,
      };
      console.log("checkout Data", checkOutData);
      console.log("restaurant", restaurant);

      await createCheckOutSession(checkOutData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle className="text-2xl font-bold">
          Review Your Order
        </DialogTitle>
        <DialogDescription className="text-sm">
          Double check your delivery details and ensure everything inorder. When
          you are ready, hit continue to payment button to finalize your order
        </DialogDescription>
        <form
          onSubmit={checkOutHandler}
          className="md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0"
        >
          <div>
            <Label>Fullname</Label>
            <Input
              type="text"
              name="name"
              value={input.name}
              onChange={handleEventHandler}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              disabled
              type="email"
              name="email"
              value={input.email}
              onChange={handleEventHandler}
            />
          </div>
          <div>
            <Label>Contact</Label>
            <Input
              type="text"
              name="contact"
              value={input.contact}
              onChange={handleEventHandler}
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              type="text"
              name="address"
              value={input.address}
              onChange={handleEventHandler}
            />
          </div>
          <div>
            <Label>City</Label>
            <Input
              type="text"
              name="city"
              value={input.city}
              onChange={handleEventHandler}
            />
          </div>
          <div>
            <Label>Country</Label>
            <Input
              type="text"
              name="country"
              value={input.country}
              onChange={handleEventHandler}
            />
          </div>
          <DialogFooter className="col-span-2 pt-5">
            {loading ? (
              <Button disabled className="bg-orange hover:bg-hoverOrange">
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="bg-orange hover:bg-hoverOrange">
                Continue To Payment
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckOutConfirmPage;
