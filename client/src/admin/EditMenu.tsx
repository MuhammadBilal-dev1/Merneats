import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema";
import { useMenustore } from "@/store/useMenuStore";
import { Loader2 } from "lucide-react";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";

const EditMenu = ({
  selectedMenu,
  editOpen,
  setEditOpen,
}: {
  selectedMenu: MenuFormSchema & { _id: string };
  editOpen: boolean;
  setEditOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [input, setInput] = useState<any>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });
  const { loading, editMenu } = useMenustore();
  const [error, setError] = useState<Partial<MenuFormSchema>>({});

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
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
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setError(fieldErrors as Partial<MenuFormSchema>);
      console.log(input);
      return;
    }
    // api implementation
    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("price", input.price.toString());
      if (input.image) {
        formData.append("image", input.image);
      }
      await editMenu(selectedMenu._id, formData);
      console.log(selectedMenu);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setInput({
      name: selectedMenu?.name || "",
      description: selectedMenu?.description || "",
      price: selectedMenu?.price || 0,
      image: undefined,
    });
  }, [selectedMenu]);

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>
            Update your menu to keep your offering fresh and exciting!
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
  );
};

export default EditMenu;
