import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";

export const adminRouter = createTRPCRouter({
  upsertAdmin: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        clerkUserId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { name, email, clerkUserId } = input;

      const admin = await ctx.db.admin.upsert({
        where: { clerkUserId },
        create: {
          name,
          email,
          clerkUserId,
        },
        update: {
          name,
          email,
        },
      });

      return admin;
    }),

  getAdmin: protectedProcedure
    .input(
      z.object({
        clerkUserId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const admin = await ctx.db.admin.findFirst({
        where: {
          clerkUserId: input.clerkUserId,
        },
      });

      return admin;
    }),
});
