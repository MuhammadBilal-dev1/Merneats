import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader2, Plus, Trash } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import EditMenu from "./EditMenu";
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema";
import { useMenustore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";

const AddMenu = () => {
  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<any>();
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [error, setError] = useState<Partial<MenuFormSchema>>({});
  const { loading, createMenu, deleteMenu } = useMenustore();
  const { restaurant } = useRestaurantStore();
  // console.log(restaurant);

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (name === "image") {
      const imageFile = e.target.files?.[0];
      setInput({ ...input, image: imageFile || undefined });
      if (imageFile) {
        setError((prev) => ({ ...prev, image: undefined }));
      } else {
        setError((prev) => ({ ...prev, image: undefined }));
      }
    } else {
      setInput({ ...input, [name]: type === "number" ? Number(value) : value });
      if (error[name as keyof MenuFormSchema]) {
        setError((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({});
    const result = menuSchema.safeParse(input);
    console.log(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setError(fieldErrors as Partial<MenuFormSchema>);
      return;
    }

    // api implementation starts from here
    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("price", input.price.toString());
      if (input.image) {
        formData.append("image", input.image);
      }
      await createMenu(formData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="flex justify-between">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
          Available Menus
        </h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="bg-orange hover:bg-hoverOrange outline-none">
              <Plus />
              Add Menus
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Menu</DialogTitle>
              <DialogDescription>
                Create a menu that will make your restaurant stand out.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submitHandler} action="" className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={input.name}
                  onChange={changeEventHandler}
                  name="name"
                  placeholder="Enter menu name"
                />
                {(error && (
                  <span className="text-red-600 text-xs font-medium">
                    {error.name}
                  </span>
                )) || <span>{""}</span>}
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Enter menu description"
                />
                {(error && (
                  <span className="text-red-600 text-xs font-medium">
                    {error.description}
                  </span>
                )) || <span>{""}</span>}
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  name="price"
                  value={input.price}
                  onChange={changeEventHandler}
                  placeholder="Enter menu price"
                />
                {error && (
                  <span className="text-red-600 text-xs font-medium">
                    {error.price}
                  </span>
                )}
              </div>
              <div>
                <Label>Upload Menu Image</Label>
                <Input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) =>
                    setInput({
                      ...input,
                      image: e.target.files?.[0] || undefined,
                    })
                  }
                />
                {(error && (
                  <span className="text-red-600 text-xs font-medium">
                    {error.image?.name}
                  </span>
                )) || <span>{""}</span>}
              </div>
              <DialogFooter className="mt-5 ">
                {loading ? (
                  <Button
                    disabled
                    className="bg-orange hover:bg-hoverOrange w-full"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button className="bg-orange hover:bg-hoverOrange w-full">
                    Submit
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {restaurant ? (
        restaurant?.menus.map((menu: any, index: number) => (
          <div key={index} className="mt-6 space-x-4">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border">
              <img
                src={menu.image}
                alt=""
                className="md:h-24 md:w-24 h-16 w-full object-cover rounded-lg"
              />
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-gray-800">
                  {menu.name}
                </h1>
                <p className="text-sm text-gray-600 mt-1">{menu.description}</p>
                <h2 className="text-md font-semibold mt-2">
                  Price: <span className="text-green-600">${menu.price}</span>
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    setSelectedMenu(menu);
                    setEditOpen(true);
                  }}
                  size={"icon"}
                  className="bg-orange hover:bg-hoverOrange w-full md:w-32 "
                >
                  <Edit />
                  Edit
                </Button>
                <Button
                  onClick={() => deleteMenu(menu._id)}
                  size={"icon"}
                  className="bg-red-600 hover:bg-red-700 w-full md:w-32 "
                >
                  <Trash />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-slate-300 text-2xl">Menus not available</div>
      )}
      <EditMenu
        selectedMenu={selectedMenu}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
      />
    </div>
  );
};

export default AddMenu;
