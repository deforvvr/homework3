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
const port = 3000;

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

app.get("/getList", async (req, res) => {
  
  let sort = "ASC"
  if (req.query.order && req.query.order.toLowerCase() === "desc")
  {
    sort = "DESC";
  }
  
  const result = await db.all(
    "SELECT * FROM database ORDER BY date " + sort +" LIMIT :first, :second",
    {
      ":first": req.query.first || 0,
      ":second": req.query.second || 99999,
    }
  );
  res.send(result);
});


app.listen(port);