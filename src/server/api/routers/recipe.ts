import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const recipeRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.recipe.findMany({
      where: {
        restaurant: {
          clerkUserId: ctx.auth.userId,
        },
      },
      include: {
        ingredients: true,
      },
    });

    return res;
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
        ingredients: z.array(
          z.object({
            name: z.string(),
            quantity: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const ingredients = input.ingredients.map(async (ingredient) => {
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

      const res = await ctx.db.recipe.create({
        data: {
          name: input.name,
          restaurant: {
            connect: {
              clerkUserId: ctx.auth.userId,
            },
          },
          description: input.description,
          price: input.price,
          ingredients: {
            createMany: {
              data: input.ingredients.map((ingredient) => ({
                quantity: ingredient.quantity,
                ingredientName: ingredient.name,
              })),
            },
          },
        },
      });

      return res;
    }),
});
