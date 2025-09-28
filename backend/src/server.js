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

const initQuery = `CREATE TABLE IF NOT EXISTS journal_entries (
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

// POST Request will be sumn like this
app.post("/", async (req, res) => {
  try {
    if (Object.values(req.body).some((arg) => !arg)) {
      return res.status(400).json({ message: "Malformed request body" });
    }
    const timestamp = new Date();
    const { date, title, content } = req.body;
    const query = `INSERT INTO journal_entries(note_id, date, title, content) VALUES (?,?,?,?)`;
    await execute(db, query, [timestamp.getTime(), date, title, content]);
    return res.status(201).json({ message: "New entry created " });
  } catch (error) {
    console.log("Error in request", error);
    return res.status(500);
  }
});

app.put("/:row_id", async (req, res) => {
  try {
    // Never put string quotes '' around values to format them for query
    // Pass ? parameter instead
    const { row_id } = req.params;

    if (Number.isNaN(parseInt(row_id)))
      return res.status(400).json({ message: "Bad parameter mister" });

    const updates = req.body;
    const parsedUpdate = Object.keys(updates)
      .map((k) => `${k} = ?`)
      .join(",");

    const query = `UPDATE journal_entries SET ${parsedUpdate} WHERE note_id = ?`;

    await execute(db, query, [...Object.values(updates), row_id]);
    return res.status(200).json({ message: "Successfully updated!" });
  } catch (error) {
    console.log("Caught an error", error);
    return res.status(500).json({ message: "Internal server errorrrr" });
  }
});

// Eventually will pass this to middleware that will check if that row id exists first
/**Something like:
 * const router = expresss.Router()
 * router.use("/:row_id", checkIdExists) or app.use or whichever one
 * router.route("/:row_id").put().delete()
 * **/
app.delete("/:row_id", async (req, res) => {
  try {
    const { row_id } = req.params;
    if (Number.isNaN(parseInt(row_id)))
      return res.status(400).json({ message: "Bad parameter mister" });

    const query = `DELETE FROM journal_entries WHERE note_id = ?`;
    await execute(db, query, [row_id]);
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.log("Error deleting", error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

// get all
app.get("/entries", (req, res) => {
  try {
    const query = `SELECT * FROM journal_entries`;
    db.all(query, (err, rows) => {
      if (!err) {
        return res.status(200).json({ rows });
      }
    });
  } catch (error) {
    console.log("Error getting all rows", error);
    res.status(500).json({ message: "ERRRRRR" });
  }
});

// get one
app.get("/entries/:row_id", (req, res) => {
  try {
    const { row_id } = req.params;
    const query = `SELECT * FROM journal_entries WHERE note_id = ?`;
    db.all(query, [row_id], (err, row) => {
      if (!err) {
        return res.status(200).json({ row });
      }
    });
  } catch (error) {}
});

execute(db, initQuery)
  .then(() => {
    app.listen(PORT_NO || 5100, () => {
      console.log("App running successfully on PORT " + PORT_NO);
    });
  })
  .catch((e) => console.log("Error in table creation", e));
