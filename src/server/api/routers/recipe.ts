import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const recipeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
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
          ingredients: {
            createMany: {
              data: input.ingredients.map((ingredient) => ({
                name: ingredient.name,
                quantity: ingredient.quantity,
                ingredientName: ingredient.name,
                ingredient: {
                  connectOrCreate: {
                    where: {
                      name: ingredient.name,
                    },
                    create: {
                      name: ingredient.name,
                    },
                  },
                },
              })),
            },
          },
        },
      });

      return res;
    }),
});
