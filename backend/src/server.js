import express from "express";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";

import { execute } from "./db/sql.js";
import journalRouter from "./routes/journalRouter.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

/** MIDDLEWARE - they go in order */
app.use(express.json()); // a "root" middleware
app.use("/", journalRouter); // the next "root" middleware
// rate limiter would go here
app.use(errorHandler);

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

// datetime('now','localtime'); --> for datetime entry, IN the query when passing VALUES

app.get("/", (req, res) => {
  console.log("Hey there");
  res.redirect("/login"); // redirects to a different route
});

app.get("/login", (req, res) => {
  res.send("Hey again"); // send is just plaintext version of res.json()
});

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
