const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();

const geminiApiKey = process.env.GEMINI_API_KEY;

app.use(
  "/api",
  createProxyMiddleware({
    target: "https://api.google.com",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "/gemini/v1/upload",
    },
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader("Authorization", `Bearer ${geminiApiKey}`);
    },
    onError: (err, req, res) => {
      res.status(500).send({ error: "Proxy error", details: err.message });
    },
  }),
);

app.listen(3001, () => {
  console.log("Proxy server running on http://localhost:3001");
});
