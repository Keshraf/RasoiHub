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
import { Autocomplete } from "@mantine/core";
import { getIngredients } from "~/utils/ingredient";
import { useState } from "react";

type Ing = {
  name: string;
  num: number;
};

const CreateRecipeForm = () => {
  const [value, setValue] = useState<string>("");
  const [num, setNum] = useState<number>(0);
  const [ingList, setIngList] = useState<Ing[]>([]);

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
            <Input id="name" className="col-span-3" />
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
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CreateRecipeForm;
