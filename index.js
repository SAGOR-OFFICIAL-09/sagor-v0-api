const express = require("express");

// SAGOR v0 API — v0.app API-r full wrapper
// KEY BOSANO: niche V0_API_KEY-e tomar v0 API key bosao
// (v0.app/settings/keys theke nao), na hole Vercel-e
// V0_API_KEY env var bosao. Key chara shob call error dibe.

const V0_API_KEY = process.env.V0_API_KEY || "v1:team_0czxwJI6WJ98snMvq9eMDbeb:vcp_3A4VcYIs5p5AXLwge7S0XP66hQvTVbTKLWtBCyOPKkpihnjPij2KnxTv";
const V0_BASE = "https://api.v0.dev";
const PORT = 3000;

const app = express();
app.use(express.json({ limit: "5mb" }));

const ENDPOINTS = [
  "GET /sagor/projects",
  "POST /sagor/projects",
  "GET /sagor/projects/:id",
  "PUT /sagor/projects/:id",
  "DELETE /sagor/projects/:id",
  "POST /sagor/chats",
  "POST /sagor/chats/init",
  "GET /sagor/chats",
  "GET /sagor/chats/:id",
  "PATCH /sagor/chats/:id",
  "DELETE /sagor/chats/:id",
  "POST /sagor/chats/:id/fork",
  "POST /sagor/chats/:id/favorite",
  "GET /sagor/chats/:id/versions",
  "GET /sagor/chats/:id/versions/:versionId",
  "GET /sagor/chats/:id/versions/:versionId/download",
  "POST /sagor/chats/:id/versions/:versionId/restore",
  "PATCH /sagor/chats/:id/versions/:versionId",
  "POST /sagor/chats/:id/tasks/resolve",
  "GET /sagor/chats/:id/messages",
  "POST /sagor/chats/:id/messages",
  "GET /sagor/chats/:id/messages/:messageId",
  "POST /sagor/chats/:id/messages/:messageId/resume",
  "POST /sagor/chats/:id/messages/:messageId/stop",
  "POST /sagor/deployments",
  "GET /sagor/deployments",
  "GET /sagor/deployments/:id",
  "DELETE /sagor/deployments/:id",
  "GET /sagor/deployments/:id/errors",
  "GET /sagor/deployments/:id/logs",
  "POST /sagor/hooks",
  "GET /sagor/hooks",
  "GET /sagor/hooks/:id",
  "PUT /sagor/hooks/:id",
  "DELETE /sagor/hooks/:id",
  "POST /sagor/mcp-servers",
  "GET /sagor/mcp-servers",
  "PATCH /sagor/mcp-servers/:id",
  "DELETE /sagor/mcp-servers/:id",
  "POST /sagor/mcp-servers/:id/oauth/authorize",
  "GET /sagor/integrations/vercel/projects",
  "POST /sagor/integrations/vercel/projects",
];

app.get("/", (req, res) => {
  res.json({
    status: "success",
    author: "SAGOR",
    endpoint: "/sagor",
    usage: "Use /sagor/<v0-path> with the same method, query and JSON body as the v0 API. Example: POST /sagor/chats {\"message\": \"Build a todo app\"}",
    endpoints: ENDPOINTS,
  });
});

app.all("/sagor/*", async (req, res) => {
  if (V0_API_KEY.includes("YOUR-V0-API-KEY-HERE")) {
    return res.status(500).json({
      status: "error",
      author: "SAGOR",
      message: "V0_API_KEY bosano hoyni — index.js-e V0_API_KEY bodlao, na hole Vercel-e V0_API_KEY env var bosao",
    });
  }

  const rest = req.params[0];
  const query = req.originalUrl.split("?")[1];
  const target = V0_BASE + "/v1/" + rest + (query ? "?" + query : "");

  try {
    const r = await fetch(target, {
      method: req.method,
      headers: {
        Authorization: "Bearer " + V0_API_KEY,
        "Content-Type": "application/json",
      },
      body: ["GET", "HEAD"].includes(req.method)
        ? undefined
        : JSON.stringify(req.body || {}),
    });

    const buf = Buffer.from(await r.arrayBuffer());
    const type = r.headers.get("content-type") || "";

    if (!type.includes("application/json")) {
      res.status(r.status);
      if (type) res.set("Content-Type", type);
      return res.send(buf);
    }

    let data;
    try {
      data = JSON.parse(buf.toString("utf8"));
    } catch {
      data = { raw: buf.toString("utf8") };
    }

    if (!r.ok) {
      return res.status(r.status).json({
        status: "error",
        author: "SAGOR",
        message: (data && data.error && data.error.message) || "v0 API failed",
        detail: data && data.error ? data.error : data,
      });
    }

    return res.json({ status: "success", author: "SAGOR", data });
  } catch (err) {
    return res.status(502).json({
      status: "error",
      author: "SAGOR",
      message: "v0 API failed",
      detail: err.message,
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () =>
    console.log("SAGOR v0 API cholche: http://localhost:" + PORT)
  );
}

module.exports = app;
