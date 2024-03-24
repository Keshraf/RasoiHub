import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const Dashboard: React.FC = () => {
  const hello = api.post.hello.useQuery();

  console.log(hello);

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-lg">Welcome to your dashboard.</p>
      <Button>Click me</Button>
    </div>
  );
};

export default Dashboard;
