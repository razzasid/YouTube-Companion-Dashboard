const express = require("express");
const router = express.Router();
const notes = require("../controllers/noteController");

router.post("/", notes.createNote);
router.get("/:videoId", notes.getNotesByVideo);
router.get("/:videoId/search", notes.searchNotes);
router.put("/:noteId", notes.updateNote);
router.delete("/:noteId", notes.deleteNote);

module.exports = router;
