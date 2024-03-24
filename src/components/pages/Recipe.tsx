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

const Recipe = () => {
  const { userId } = useAuth();
  const [images, setImages] = useState<string[]>([]); // [1
  const {
    data: recipes,
    isLoading,
    isError,
    error,
  } = api.recipe.get.useQuery();

  // Get recipe images from all the recipes using the recipe name for all the recipes using useEffect
  useEffect(() => {
    recipes?.forEach(async (recipe) => {
      try {
        const url = await getRecipeImage(recipe);
        setImages((prev) => [url, ...prev]);
      } catch (error) {}
    });
  }, [recipes]);

  async function getRecipeImage(recipe: any) {
    const recipeImage = ref(storage, `recipe/${recipe.name}-${userId}`);
    const url = await getDownloadURL(recipeImage);
    return url;
  }

  return (
    <section className="flex h-full w-full flex-col items-start justify-start gap-2">
      <div className="flex w-full flex-row  justify-between">
        <h2 className="text-xl font-bold">Recipe</h2>
        <CreateRecipeForm />
      </div>
      <div className="flex w-full flex-row items-start justify-start gap-2">
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
                  src={images[index] ?? ""}
                  alt="recipe"
                  className="object-cover"
                />
              </AspectRatio>
              <div className="flex w-full flex-row items-center justify-between">
                <div className="flex flex-col items-start justify-start gap-2">
                  <h3 className="text-lg font-bold">{recipe.name}</h3>
                  <p className="text-sm">{recipe.description}</p>
                </div>
                <div>
                  <p className="text-lg">${recipe.price}</p>
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
