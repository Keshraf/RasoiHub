/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { api } from "~/utils/api";
import CreateRecipeForm from "../form/CreateRecipeForm";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
import { useEffect, useState } from "react";
import { getBlob, getDownloadURL, ref } from "firebase/storage";
import { storage } from "~/utils/firebase";
import { useAuth } from "@clerk/nextjs";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { Badge } from "@mantine/core";

const Recipe = () => {
  const { userId } = useAuth();
  const [images, setImages] = useState<string[]>([]); // [1
  const {
    data: recipes,
    isLoading,
    isError,
    error,
    refetch,
  } = api.recipe.get.useQuery();

  const { data: inventory } = api.inventory.get.useQuery();

  // Get recipe images from all the recipes using the recipe name for all the recipes using useEffect
  useEffect(() => {
    recipes?.forEach(async (recipe) => {
      try {
        const url = await getRecipeImage(recipe);
        // @ts-ignore
        recipe.url = url; // Add 'url' property to the 'recipe' object
        setImages((prev) => [url, ...prev]);
      } catch (error) {}
    });
  }, [recipes]);

  async function getRecipeImage(recipe: any) {
    const recipeImage = ref(storage, `recipe/${recipe.name}-${userId}`);
    const url = await getDownloadURL(recipeImage);
    return url;
  }

  function isAvailable(recipe: any, inventory: any) {
    const ingredients = recipe.ingredients;
    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i];
      const inventoryItem = inventory.find(
        (item: any) => item.ingredient.name === ingredient.ingredientName,
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

  return (
    <section className="flex h-full w-full flex-col items-start justify-start gap-2">
      <div className="flex w-full flex-row  justify-between">
        <h2 className="text-xl font-bold">Recipe</h2>
        <CreateRecipeForm refetch={refetch} />
      </div>
      <div className="flex w-full flex-row flex-wrap items-start justify-start gap-2">
        {recipes?.map((recipe, index) => {
          return (
            <div
              key={recipe.id}
              className="flex w-[450px] flex-col items-start justify-start gap-2 rounded-md border border-slate-200 px-4 py-4"
            >
              <AspectRatio
                ratio={16 / 9}
                className="bg-muted overflow-hidden rounded-md "
              >
                <img
                  /* @ts-ignore */
                  src={recipe.url ?? ""}
                  alt="recipe"
                  className="object-cover"
                />
              </AspectRatio>
              <div className="flex w-full flex-row items-center justify-between">
                <div className="flex flex-col items-start justify-start gap-2">
                  <h3 className="text-lg font-bold">{recipe.name}</h3>
                  <p className="text-sm">{recipe.description}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-lg">${recipe.price.toString()}</p>
                  {isAvailable(recipe, inventory) ? (
                    <Badge color="teal">Available</Badge>
                  ) : (
                    <Badge color="dark">Out of Stock</Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Recipe;
