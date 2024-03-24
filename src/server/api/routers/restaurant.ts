import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";

export const restaurantRouter = createTRPCRouter({
  upsertRestaurant: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        address: z.string(),
        phone: z.string(),
        email: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const res = await ctx.db.restaurant.upsert({
        where: {
          clerkUserId: ctx.auth.userId,
        },
        update: {
          name: input.name,
          address: input.address,
          phone: input.phone,
          email: input.email,
        },
        create: {
          name: input.name,
          address: input.address,
          phone: input.phone,
          email: input.email,
          clerkUserId: ctx.auth.userId,
        },
      });

      return res;
    }),
  getRes: protectedProcedure
    .input(
      z.object({
        clerkUserId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const res = await ctx.db.restaurant.findFirst({
        where: {
          clerkUserId: input.clerkUserId,
        },
      });

      return res;
    }),
});
