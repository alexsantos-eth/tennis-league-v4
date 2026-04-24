import type { APIRoute } from "astro";

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

const setKycCookie = (cookies: Parameters<APIRoute>[0]["cookies"]) => {
  cookies.set("USER_KYC_COMPLETED", "1", {
    path: "/",
    maxAge: ONE_WEEK_IN_SECONDS,
    sameSite: "lax",
    httpOnly: true,
    secure: import.meta.env.PROD,
  });
};

export const POST: APIRoute = async ({ cookies }) => {
  setKycCookie(cookies);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ cookies }) => {
  cookies.delete("USER_KYC_COMPLETED", {
    path: "/",
    sameSite: "lax",
    secure: import.meta.env.PROD,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};