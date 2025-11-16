// automatically handles try catch blocks
import { asyncHandler } from "express-async-handler";
import { db } from "../server";
import { execute } from "../db/sql";

export const createJournalEntry = asyncHandler(async (req, res) => {
  if (Object.values(req.body).some((arg) => !arg)) {
    res.status(400);
    throw new Error("Malformed request body");
  }

  const timestamp = new Date();
  const { date, title, content } = req.body;
  const query = `INSERT INTO journal_entries(note_id, date, title, content) VALUES (?,?,?,?)`;
  await execute(db, query, [timestamp.getTime(), date, title, content]);
  return res.status(201).json({ message: "New entry created " });
});

export const updateJournalEntry = asyncHandler(async (req, res) => {
  // Never put string quotes '' around values to format them for query
  // Pass ? parameter instead
  const { row_id } = req.params;

  if (Number.isNaN(parseInt(row_id))) {
    res.status(400);
    throw new Error("Bad parameter mister");
  }

  const updates = req.body;
  const parsedUpdate = Object.keys(updates)
    .map((k) => `${k} = ?`)
    .join(",");

  const query = `UPDATE journal_entries SET ${parsedUpdate} WHERE note_id = ?`;

  await execute(db, query, [...Object.values(updates), row_id]);
  return res.status(200).json({ message: "Successfully updated!" });
});

export const deleteJournalEntry = asyncHandler(async (req, res) => {
  const { row_id } = req.params;
  if (Number.isNaN(parseInt(row_id))) {
    res.status(400);
    throw new Error("Bad parameter mister");
  }

  const query = `DELETE FROM journal_entries WHERE note_id = ?`;
  await execute(db, query, [row_id]);
  return res.status(200).json({ message: "Successfully deleted" });
});

export const getAllJournalEntries = (req, res) => {
  try {
    const query = `SELECT * FROM journal_entries`;
    // returns all matching rows from table
    db.all(query, (err, rows) => {
      if (!err) {
        return res.status(200).json({ rows });
      }
    });
  } catch (error) {
    console.log("Error getting all rows", error);
    res.status(500).json({ message: "ERRRRRR" });
  }
};

export const getOneJournalEntry = (req, res) => {
  try {
    const { row_id } = req.params;
    const query = `SELECT * FROM journal_entries WHERE note_id = ?`;
    // returns first matching row from table
    db.get(query, [row_id], (err, row) => {
      if (!err) {
        return res.status(200).json({ row });
      }
    });
  } catch (error) {
    console.log("Error getting single row", error);
    res.status(500).json({ message: "INTERNAL ERROR!" });
  }
};
