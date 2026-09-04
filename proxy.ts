import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

/*
  Locale negotiation, at the network boundary.

  Next 16 deprecated the `middleware` file convention and renamed it to
  `proxy`; see node_modules/next/dist/docs/01-app/03-api-reference/
  03-file-conventions/proxy.md. next-intl still calls its factory
  createMiddleware because it returns a plain request handler, which is what
  this convention wants. The name of the file and the exported function are
  what changed, not the shape.
*/
const handle = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return handle(request);
}

export const config = {
  // Everything except Next internals, the metadata routes that must stay
  // unprefixed, and anything with a file extension -- the PDFs and images under
  // /assets must not be rewritten into a locale.
  matcher: ["/((?!api|_next|_vercel|sitemap.xml|robots.txt|.*\\..*).*)"],
};
