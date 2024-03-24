import { api } from "~/utils/api";
import CreateInventoryForm from "../form/CreateInventoryForm";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const Inventory = () => {
  const inventory = api.inventory.get.useQuery();

  return (
    <section className="flex h-full w-full flex-col items-start justify-start gap-2">
      <div className="flex w-full flex-row  justify-between">
        <h2 className="text-xl font-bold">Inventory</h2>
        <CreateInventoryForm refetch={inventory.refetch} />
      </div>
      <Table>
        <TableCaption>A list of all your recent ingredients.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-left">Ingredient</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.data?.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.ingredient.name}
                </TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
};

export default Inventory;
