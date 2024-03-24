import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  address: z.string().min(2).max(50),
  phone: z.string().length(10),
});

const CreateRestaurantForm = () => {
  const createRestaurant = api.restaurant.upsertRestaurant.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createRestaurant.mutateAsync(values);
      toast.success("Restaurant created successfully.");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  }

  const formDetails = [
    {
      label: "Name",
      placeholder: "John Doe",
      description: "This is the name of your restaurant.",
    },
    {
      label: "Email",
      placeholder: "john.doe@gmail.com",
      description: "This is the email of your restaurant.",
    },
    {
      label: "Address",
      placeholder: "123 Main St",
      description: "This is the address of your restaurant.",
    },
    {
      label: "Phone",
      placeholder: "1234567890",
      description: "This is the phone number of your restaurant.",
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {formDetails.map((detail, index) => {
          return (
            <FormField
              control={form.control}
              // @ts-expect-error - This is a hack to get the name of the field.
              name={detail.label.toLowerCase()}
              key={index}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{detail.label}</FormLabel>
                  <FormControl>
                    <Input placeholder={detail.placeholder} {...field} />
                  </FormControl>
                  <FormDescription>{detail.description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CreateRestaurantForm;
