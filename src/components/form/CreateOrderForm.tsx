import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Autocomplete, FileInput } from "@mantine/core";
import { getIngredients } from "~/utils/ingredient";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Textarea } from "../ui/textarea";
import { supabase } from "~/utils/supabase";
import { storage } from "~/utils/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { useAuth } from "@clerk/nextjs";

type Ing = {
  name: string;
  num: number;
};

const CreateOrderForm = ({ refetch }: { refetch: any }) => {
  const { data: recipes, isLoading: recipesIsLoading } =
    api.recipe.get.useQuery();
  const { data: inventory, isLoading: inventoryIsLoading } =
    api.inventory.get.useQuery();

  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [file, setFile] = useState<File | null>();
  const [desc, setDesc] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [num, setNum] = useState<number>(0);
  const [ingList, setIngList] = useState<Ing[]>([]);
  const createInventory = api.inventory.create.useMutation();
  const createOrder = api.order.create.useMutation();
  const { userId } = useAuth();

  const [recipesList, setRecipesList] = useState<any[]>([]);

  const submit = async () => {
    const orderItems = ingList.map((ing) => ({
      id: recipesList.find((recipe) => recipe.name === ing.name).id,
      name: ing.name,
      quantity: ing.num,
    }));

    await createOrder.mutateAsync({
      name,
      status,
      items: orderItems,
      date: new Date(),
    });

    refetch();
  };

  function isAvailable(recipe: any, inventory: any) {
    const ingredients = recipe.ingredients;
    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i];
      const inventoryItem = inventory.find(
        (item) => item.ingredient.name === ingredient.ingredientName,
      );
      if (
        !inventoryItem ||
        parseInt(inventoryItem.quantity) < parseInt(ingredient.quantity)
      ) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    const fetchRecipes = async () => {
      const x = recipes?.filter((recipe) => isAvailable(recipe, inventory));
      setRecipesList(x);
    };

    fetchRecipes();
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Add Order +</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Order</SheetTitle>
          {/* <SheetDescription>{" Place Order"}</SheetDescription> */}
        </SheetHeader>
        <div className="flex w-full flex-col items-start justify-start gap-4 py-4">
          <div className="flex w-full flex-col items-start justify-start gap-2">
            <Label htmlFor="name" className="text-right">
              Customer Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col items-start justify-start gap-2">
            <Label htmlFor="name" className="text-right">
              Status
            </Label>
            <Input
              id="status"
              className="col-span-3"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          <Label htmlFor="" className="text-right">
            Order
          </Label>
          <div className="flex w-full flex-row gap-1">
            <Autocomplete
              style={{
                width: "100%",
                zIndex: "9999",
              }}
              value={value}
              onChange={(value) => setValue(value)}
              data={recipesList.map((recipe) => recipe.name)}
              placeholder="Use Arrow Keys to Select Dishes"
            />
            <Input
              className="h-[36px] w-[75px]"
              id="num"
              value={num}
              onChange={(e) =>
                setNum(parseInt(e.target.value == "" ? "0" : e.target.value))
              }
            />
            <Button
              className="h-[36px]"
              onClick={() => {
                if (value === "" || num == 0) return;
                setIngList([...ingList, { name: value, num }]);
                setNum(0);
                setValue("");
              }}
            >
              +
            </Button>
          </div>
          <div className="flex flex-col ">
            {ingList.map((ing, index) => {
              return (
                <div
                  key={index}
                  className="flex w-full flex-row items-center gap-1"
                >
                  + {ing.name} x {ing.num}
                </div>
              );
            })}
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={submit}>
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CreateOrderForm;
