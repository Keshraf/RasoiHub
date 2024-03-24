import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.order.findMany({
      where: {
        restaurant: {
          clerkUserId: ctx.auth.userId,
        },
      },
      include: {
        items: true,
      },
    });

    return res;
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        date: z.date(),
        status: z.string(),
        items: z
          .object({
            id: z.string(),
            name: z.string(),
            quantity: z.number(),
          })
          .array(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const order = await ctx.db.order.create({
        data: {
          customerName: input.name,
          orderDate: input.date,
          status: input.status,
          restaurant: {
            connect: {
              clerkUserId: ctx.auth.userId,
            },
          },
        },
      });

      const items = input.items.map(async (item) => {
        await ctx.db.orderItem.create({
          data: {
            quantity: item.quantity,
            order: {
              connect: {
                id: order.id,
              },
            },
            recipe: {
              connect: {
                id: item.id,
              },
            },
          },
        });
      });

      await Promise.all(items);

      return true;
    }),
});
