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
import CreateOrderForm from "../form/CreateOrderForm";

const Order = () => {
  const order = api.order.get.useQuery();

  return (
    <section className="flex h-full w-full flex-col items-start justify-start gap-2">
      <div className="flex w-full flex-row  justify-between">
        <h2 className="text-xl font-bold">Orders</h2>
        <CreateOrderForm refetch={order.refetch} />
      </div>
      <Table>
        <TableCaption>A list of all your recent orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-left">Date</TableHead>
            <TableHead className="text-left">Customer Name</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.data?.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.orderDate.toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">
                  {item.customerName}
                </TableCell>
                <TableCell className="text-right">{item.status}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
};

export default Order;
