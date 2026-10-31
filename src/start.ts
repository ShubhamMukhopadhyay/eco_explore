// TanStack Start instance configuration.
// The createStart function sets up middleware that runs on every server request.
import { createStart, createMiddleware } from "@tanstack/react-start";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    // Re-throw structured HTTP errors (e.g. 404 redirects) as-is so
    // TanStack Router handles them with the correct status code.
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error("[SSR Error]", error);
    throw error;
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));
