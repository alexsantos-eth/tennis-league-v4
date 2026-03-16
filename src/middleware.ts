import { defineMiddleware } from "astro:middleware";
import { ROUTES } from "./lib/routes";

const SKIP_AUTH = Number(import.meta.env.PUBLIC_SKIP_AUTH ?? "0");

const EXCLUDED = [
  /^\/api/,
  /^\/_astro\//,
  /^\/favicon\.ico$/,
  /^\/sitemap\.xml$/,
  /^\/robots\.txt$/,
  /^\/images\//,
  /^\/video\//,
  /^\/manifest\.webmanifest$/,
];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (EXCLUDED.some((rgx) => rgx.test(pathname))) {
    return next();
  }

  const foundRoute = Object.values(ROUTES).find((route) => {
    return new RegExp(route.pathRgx).test(pathname);
  });

  const isPublicPath = Boolean(foundRoute?.public);

  const userUID = context.cookies.get("USER_UID")?.value;

  if (pathname === "/auth" && Boolean(userUID)) {
    return context.redirect("/");
  }

  if (foundRoute && !isPublicPath && !SKIP_AUTH && !userUID) {
    return context.redirect("/auth");
  }

  return next();
});
