const http = require("http");
const fs = require("fs");
const path = require("path");
const { analyze } = require("./comma_bot");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function sendJson(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

function serveStatic(res, urlPath) {
  const rel = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
  const filePath = path.join(PUBLIC_DIR, rel);

  // public 디렉터리 밖 접근 차단
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (err, buf) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Not Found");
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(buf);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/analyze") {
    const code = (url.searchParams.get("code") || "").trim();

    if (!/^\d{6}$/.test(code)) {
      return sendJson(res, 400, { error: "종목 코드는 숫자 6자리여야 합니다. (예: 005930)" });
    }

    try {
      const result = await analyze(code);
      return sendJson(res, 200, result);
    } catch (err) {
      return sendJson(res, 502, { error: err.message });
    }
  }

  serveStatic(res, url.pathname);
});

server.listen(PORT, () => {
  console.log(`✅ Comma Bot GUI 실행 중: http://localhost:${PORT}`);
});
