import express from "express";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";

import { execute } from "./db/sql.js";

dotenv.config();

const app = express();
app.use(express.json());
const PORT_NO = process.env.PORT;

const db = new sqlite3.Database("bte.db");
// const testDb = new sqlite3.Database("chinook.db", sqlite3.OPEN_READWRITE);

const query = `CREATE TABLE IF NOT EXISTS journal_entries (
	note_id INTEGER PRIMARY KEY,
   	date TEXT NOT NULL,
	title TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    word_count INTEGER DEFAULT 0
)`;

// datetime('now','localtime'); --> for datetime entry

app.get("/", (req, res) => {
  console.log("Hey there");
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.send("Hey again");
});

app.post("/", async (req, res) => {
  try {
    if (Object.values(req.body).some((arg) => !arg)) {
      return res.status(400).json({ message: "Malformed request body" });
    }
    const { date, title, content } = req.body;
    const query = `INSERT INTO journal_entries(note_id, date, title, content) VALUES (${new Date().getDate()}, ?,?,?)`;
    await execute(db, query, [date, title, content]);
    return res.status(201).json({ message: "New entry created " });
  } catch (error) {
    console.log("Error in request", error);
    return res.status(500);
  }
});

execute(db, query)
  .then(() => {
    app.listen(PORT_NO || 5100, () => {
      console.log("App running successfully on PORT " + PORT_NO);
    });
  })
  .catch((e) => console.log("Error in table creation", e));
//   .finally(() => db.close());
