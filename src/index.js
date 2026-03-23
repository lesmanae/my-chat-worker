export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return json({
        ok: true,
        message: "Halo, Worker aktif"
      });
    }

    if (request.method === "POST" && url.pathname === "/chat") {
      try {
        const body = await request.json();
        const userMessage = body?.message || "";

        return json({
          ok: true,
          reply: `Kamu bilang: ${userMessage}`,
          note: "Ini masih dummy response"
        });
      } catch (error) {
        return json({
          ok: false,
          error: "Body harus JSON valid"
        }, 400);
      }
    }

    return json({
      ok: false,
      error: "Route tidak ditemukan"
    }, 404);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8"
    }
  });
}
