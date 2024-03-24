import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import CreateRestaurantForm from "~/components/form/CreateRestaurantForm";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const Dashboard: React.FC = () => {
  const { userId } = useAuth();

  const { data: res } = api.restaurant.getRes.useQuery({
    clerkUserId: userId ?? "",
  });

  if (!res) {
    return (
      <div className="flex min-h-svh flex-row items-center justify-center bg-black">
        <CreateRestaurantForm />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-lg">Welcome to your dashboard.</p>
      <Button>Click me</Button>
    </div>
  );
};

export default Dashboard;
