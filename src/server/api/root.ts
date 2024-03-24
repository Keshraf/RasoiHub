import { postRouter } from "~/server/api/routers/post";
import { restaurantRouter } from "~/server/api/routers/restaurant";
import { recipeRouter } from "~/server/api/routers/recipe";
import { inventoryRouter } from "~/server/api/routers/inventory";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  restaurant: restaurantRouter,
  recipe: recipeRouter,
  inventory: inventoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
