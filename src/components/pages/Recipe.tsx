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

const Recipe = () => {
  return (
    <section className="flex h-full w-full flex-col items-start justify-start">
      <div className="flex w-full flex-row  justify-between">
        <h2 className="text-xl font-bold">Recipe</h2>
        <CreateRecipeForm />
      </div>
    </section>
  );
};

export default Recipe;
