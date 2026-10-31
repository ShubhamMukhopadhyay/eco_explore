// Netlify-compatible server entry for TanStack Start.
//
// TanStack Start v1.x uses the standard Web Fetch API:
//   export default { fetch(request: Request): Response | Promise<Response> }
//
// Netlify Functions v2 (ESM, Node.js 20) accept exactly this signature,
// so we simply re-export TanStack Start's generated server handler as-is.

import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";

import { getRouter } from "./router";

// createStartHandler returns an object with a `fetch` method —
// Netlify's ESM function runtime calls `handler.fetch(request)` automatically.
export default createStartHandler({
  createRouter: getRouter,
})(defaultStreamHandler);
