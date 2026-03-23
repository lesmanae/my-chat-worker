export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

    if (request.method === "GET" && url.pathname === "/") {
      return json({
        ok: true,
        name: "my-chat-worker",
        message: "Worker aktif",
        endpoints: {
          health: "GET /",
          chat: "POST /chat"
        }
      });
    }

    if (request.method === "POST" && url.pathname === "/chat") {
      try {
        const body = await request.json();
        const userMessage = String(body?.message || "").trim();

        if (!userMessage) {
          return json({
            ok: false,
            error: "Field message wajib diisi"
          }, 400);
        }

        return json({
          ok: true,
          data: {
            role: "assistant",
            content: `Kamu bilang: ${userMessage}`
          }
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
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders()
    }
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
