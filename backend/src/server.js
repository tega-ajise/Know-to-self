import express from "express";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";

import { execute } from "./db/sql.js";
import {
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getAllJournalEntries,
  getOneJournalEntry,
} from "./controllers/notesController.js";

dotenv.config();

const app = express();
app.use(express.json());
const PORT_NO = process.env.PORT;

export const db = new sqlite3.Database("bte.db");

const sqlJournalInit = `CREATE TABLE IF NOT EXISTS journal_entries (
	note_id INTEGER PRIMARY KEY,
   	date TEXT NOT NULL,
	title TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    word_count INTEGER DEFAULT 0
)`;

const sqlBibleInit = `CREATE TABLE IF NOT EXISTS bible_verses (
  verse_id INTEGER PRIMARY KEY,
  passage TEXT NOT NULL UNIQUE,
  verse TEXT NOT NULL UNIQUE,
  completed INTEGER NOT NULL DEFAULT 0
);`; // completed is a boolean - 0 (false) or 1 (true)

// datetime('now','localtime'); --> for datetime entry, IN the query

app.get("/", (req, res) => {
  console.log("Hey there");
  res.redirect("/login"); // redirects to a different route
});

app.get("/login", (req, res) => {
  res.send("Hey again"); // send is just plaintext version of res.json()
});

// POST Request will be sumn like this
app.post("/", createJournalEntry);

app.put("/:row_id", updateJournalEntry);

// Eventually will pass this to middleware that will check if that row id exists first
/**Something like:
 * const router = expresss.Router()
 * router.use("/:row_id", checkIdExists) or app.use or whichever one
 * router.route("/:row_id").put().delete()
 * **/
app.delete("/:row_id", deleteJournalEntry);

app.get("/entries", getAllJournalEntries);

app.get("/entries/:row_id", getOneJournalEntry);

execute(db, sqlJournalInit)
  .then(() => {
    return execute(db, sqlBibleInit);
  })
  .then(() => {
    app.listen(PORT_NO || 5100, () => {
      console.error("App running successfully on PORT " + PORT_NO);
    });
  })
  .catch((e) => console.error("Error in table creation", e));
