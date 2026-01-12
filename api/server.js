import express from "express";
import pg from "pg";

const app = express();
const port = process.env.PORT || 3000;

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 5432),
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

app.get("/api/health", (_, res) => res.status(200).json({ ok: true }));

app.get("/api/products", async (_, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, image_url FROM products ORDER BY id;"
    );
    res.json(rows);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.listen(port, "0.0.0.0", () => console.log(`API listening on :${port}`));
