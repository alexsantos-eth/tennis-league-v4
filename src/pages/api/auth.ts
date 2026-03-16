import type { APIRoute } from "astro";

export const prerender = false;

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export const POST: APIRoute = async ({ request, cookies }) => {
  let payload: { uid?: unknown };

  try {
    payload = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Payload JSON invalido" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const uid = typeof payload.uid === "string" ? payload.uid.trim() : "";

  if (!uid) {
    return new Response(
      JSON.stringify({ error: "uid es requerido" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  cookies.set("USER_UID", uid, {
    path: "/",
    maxAge: ONE_WEEK_IN_SECONDS,
    sameSite: "lax",
    httpOnly: true,
    secure: import.meta.env.PROD,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ cookies }) => {
  cookies.delete("USER_UID", {
    path: "/",
    sameSite: "lax",
    secure: import.meta.env.PROD,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
