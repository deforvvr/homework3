import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDB() {
  return open({
    filename: "database.db",
    driver: sqlite3.Database,
  });
}

const db = await openDB();
const app = express();
const port = 3002;

app.get("/", async (req, res) => {
  const result = await db.all("SELECT * FROM database");
  res.send(result);
});

app.get("/addItem", async (req, res) => {
  const result = await db.run(
    "INSERT INTO database (date, message) VALUES (:now, :message)",
    {
      ":message": req.query.message,
      ":now": new Date()
    }
  );
  res.send(result);
});

app.get("/deleteItem", async (req, res) => {
  const result = await db.run(
    "DELETE FROM database WHERE ID=:id",
    {
      ":id": req.query.id,
    }
  );
  res.send(result);
});

app.get("/getListAsc", async (req, res) => {
  const result = await db.all(
    "SELECT * FROM database ORDER BY date ASC LIMIT :first, :second",
    {
      ":first": req.query.first,
      ":second": req.query.second,
    }
  );
  res.send(result);
});


app.get("/getListDesc", async (req, res) => {
  const result = await db.all(
    "SELECT * FROM database ORDER BY date DESC LIMIT :first, :second",
    {
      ":first": req.query.first,
      ":second": req.query.second,
    }
  );
  res.send(result);
});

app.listen(port);