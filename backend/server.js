import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import hadithsRouter from "./routes/hadiths.js";
import searchRouter from "./routes/search.js";
import collectionsRouter from "./routes/collections.js";
import { loadCollections } from "./store/memoryStore.js";

const app = express();
app.use(cors());
app.use(express.json());

const USE_MONGO = process.env.MONGODB_URI && !process.env.SKIP_MONGO;
if (USE_MONGO) process.env.USE_MONGO = "1";

app.use("/api/hadiths", hadithsRouter);
app.use("/api/search", searchRouter);
app.use("/api/collections", collectionsRouter);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, store: USE_MONGO ? "mongo" : "memory" });
});

app.use((err, req, res, _next) => {
  console.error("[error]", err.message);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;

async function start() {
  if (USE_MONGO) {
    await connectDB(process.env.MONGODB_URI);
  } else {
    await loadCollections();
  }
  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT} (store: ${USE_MONGO ? "mongo" : "memory"})`);
  });
}

start().catch((err) => {
  console.error("[startup] failed:", err);
  process.exit(1);
});
