import express from "express";
import {
  createJournalEntry,
  deleteJournalEntry,
  getAllJournalEntries,
  getOneJournalEntry,
  updateJournalEntry,
} from "../controllers/journalController.js";

const router = express.Router();

router.post("/", createJournalEntry);
router.get("/entries", getAllJournalEntries);
router.get("/entries/:row_id", getOneJournalEntry);

// Eventually will pass this to middleware that will check if that row id exists first
/**Something like:
 * const router = expresss.Router()
 * router.use("/:row_id", checkIdExists) or app.use or whichever one
 * router.route("/:row_id").put().delete()
 * **/
router.route("/:row_id").put(updateJournalEntry).delete(deleteJournalEntry);

export default router;
