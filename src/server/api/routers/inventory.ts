import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const inventoryRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.inventory.findMany({
      where: {
        restaurant: {
          clerkUserId: ctx.auth.userId,
        },
      },
      include: {
        ingredient: true,
      },
    });

    return res;
  }),
  create: protectedProcedure
    .input(
      z
        .object({
          name: z.string(),
          quantity: z.number(),
        })
        .array(),
    )
    .mutation(async ({ input, ctx }) => {
      const ingredients = input.map(async (ingredient) => {
        await ctx.db.ingredient.upsert({
          where: {
            name: ingredient.name,
          },
          update: {
            name: ingredient.name,
          },
          create: {
            name: ingredient.name,
          },
        });
      });

      await Promise.all(ingredients);

      const inventory = input.map(async (item) => {
        await ctx.db.inventory.create({
          data: {
            quantity: item.quantity,
            restaurant: {
              connect: {
                clerkUserId: ctx.auth.userId,
              },
            },
            ingredient: {
              connect: {
                name: item.name,
              },
            },
          },
        });
      });

      await Promise.all(inventory);

      return true;
    }),
});
