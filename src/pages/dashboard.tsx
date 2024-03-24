import { UserButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import CreateRestaurantForm from "~/components/form/CreateRestaurantForm";
import Inventory from "~/components/pages/Inventory";
import Order from "~/components/pages/Order";
import Recipe from "~/components/pages/Recipe";
import { Button, buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { api } from "~/utils/api";

const Dashboard: React.FC = () => {
  const { userId } = useAuth();
  const [page, setPage] = useState<number>(1);

  const { data: res, isLoading } = api.restaurant.getRes.useQuery({
    clerkUserId: userId ?? "",
  });

  if (isLoading) {
    return <></>;
  }

  if (!res) {
    return (
      <div className="flex min-h-svh flex-row items-center justify-center bg-black">
        <CreateRestaurantForm />
      </div>
    );
  }

  return (
    <div className="mx-6 my-10 flex h-full flex-col items-start justify-center overflow-hidden">
      <div className="flex w-full flex-row justify-between">
        <h1 className="text-4xl font-bold">Welcome, {res.name}</h1>
        <UserButton />
      </div>
      <Separator className="my-2" />
      <div className="grid w-full grid-cols-5 gap-4">
        <div className="col-span-1 min-h-screen px-2">
          <div className="flex flex-col gap-3">
            <Button
              className={buttonVariants({
                variant: "outline",
                size: "lg",
              })}
              onClick={() => setPage(1)}
            >
              Recipe
            </Button>
            <Button
              className={buttonVariants({
                variant: "outline",
                size: "lg",
              })}
              onClick={() => setPage(2)}
            >
              Inventory
            </Button>
            <Button
              className={buttonVariants({
                variant: "outline",
                size: "lg",
              })}
              onClick={() => setPage(3)}
            >
              Order
            </Button>
          </div>
        </div>
        <div className="col-span-4">
          {page === 1 && <Recipe />}
          {page === 2 && <Inventory />}
          {page === 3 && <Order />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
