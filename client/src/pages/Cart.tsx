import CheckOutConfirmPage from "@/components/CheckOutConfirmPage";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userCartStore } from "@/store/useCartStore";
import { Minus, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { CartItem } from "../types/cartType";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
const Cart = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { cart, incremenuQuantity, decrementQuantity } = userCartStore();

  let totalAmount = cart.reduce((acc, ele) => {
    return acc + ele.price * ele.quantity
  }, 0)
  return (
    <div className="flex flex-col max-w-7xl mx-auto my-10">
      <div className="flex justify-end">
        <Button variant="link">Clear All</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Items</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.map((item: CartItem) => (
            <TableRow>
              <TableCell>
                <Avatar>
                  <AvatarImage src={item.image} alt="Item image" />
                </Avatar>
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>${item.price}</TableCell>
              <TableCell>
                <div className="w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-md">
                  <Button
                  onClick={() => decrementQuantity(item._id)}
                    size={"icon"}
                    variant={"outline"}
                    className="rounded-full bg-gray-200"
                  >
                    <Minus />
                  </Button>
                  <Button
                    disabled
                    size={"icon"}
                    variant={"outline"}
                    className="font-bold border-none"
                  >
                    {item.quantity}
                  </Button>
                  <Button
                  onClick={() => incremenuQuantity(item._id)}
                    size={"icon"}
                    variant={"outline"}
                    className="rounded-full bg-orange hover:bg-hoverOrange"
                  >
                    <Plus className="text-white" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <Button className="bg-red-500 hover:bg-red-700 ">
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="text-lg font-bold">
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell colSpan={2}>${totalAmount.toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="flex justify-end mt-5">
        <Button
          onClick={() => setOpen(true)}
          className="bg-sky-700 hover:bg-sky-600 hover:bg-opacity-95"
        >
          Proceed to Checkout
        </Button>
      </div>
      <CheckOutConfirmPage open={open} setOpen={setOpen} />
    </div>
  );
};

export default Cart;
