import { api } from "./api";

/* eslint-disable @typescript-eslint/prefer-for-of */
export function isAvailable(recipe: any, inventory: any) {
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

export const getAvailableRecipes = async () => {
  const { data: recipes, isLoading: recipesIsLoading } =
    api.recipe.get.useQuery();
  const { data: inventory, isLoading: inventoryIsLoading } =
    api.inventory.get.useQuery();

  if (recipesIsLoading || inventoryIsLoading) {
    return [];
  }

  return recipes?.filter((recipe) => isAvailable(recipe, inventory));
};
