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
import { useState } from "react";
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

const CreateRecipeForm = () => {
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File | null>();
  const [desc, setDesc] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [num, setNum] = useState<number>(0);
  const [ingList, setIngList] = useState<Ing[]>([]);
  const createRecipe = api.recipe.create.useMutation();
  const { userId } = useAuth();

  const handleUpload = async () => {
    const recipeImage = ref(storage, `recipe/${name}-${userId}`);

    if (!file) return;
    await uploadBytes(recipeImage, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  };

  const submit = async () => {
    await createRecipe.mutateAsync({
      name,
      description: desc,
      price,
      ingredients: ingList.map((ing) => ({
        name: ing.name,
        quantity: ing.num,
      })),
    });
    await handleUpload();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Add Recipe +</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Recipe</SheetTitle>
          <SheetDescription>
            {
              " Create your recipe here by adding all the ingredients by measurement."
            }
          </SheetDescription>
        </SheetHeader>
        <div className="flex w-full flex-col items-start justify-start gap-4 py-4">
          <div className="flex w-full flex-col items-start justify-start gap-2">
            <Label htmlFor="name" className="text-right">
              Recipe Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col items-start justify-start gap-2">
            <Label htmlFor="cost" className="text-right">
              Cost of Dish
            </Label>
            <Input
              id="cost"
              className="col-span-3"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div className="flex w-full flex-col items-start justify-start gap-2">
            <Label htmlFor="desc" className="text-right">
              Description
            </Label>
            <Textarea
              className="col-span-3"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col items-start justify-start gap-2">
            <Label htmlFor="desc" className="text-right">
              Image Upload
            </Label>
            <FileInput onChange={(e) => setFile(e)} />
          </div>
          <Label htmlFor="" className="text-right">
            Ingredients
          </Label>
          <div className="flex w-full flex-row gap-1">
            <Autocomplete
              style={{
                width: "100%",
                zIndex: "9999",
              }}
              value={value}
              onChange={(value) => setValue(value)}
              data={getIngredients(value)}
              placeholder="Use Arrow Keys to Select Ingredients"
            />
            <Input
              className="h-[36px] w-[75px]"
              id="num"
              value={num}
              onChange={(e) => setNum(parseInt(e.target.value))}
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

export default CreateRecipeForm;
