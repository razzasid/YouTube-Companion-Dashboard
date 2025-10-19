const Note = require("../models/Note");
const { logEvent } = require("../utils/logger");

exports.createNote = async (req, res) => {
  try {
    const note = await Note.create(req.body);
    await logEvent("NOTE_CREATE", { noteId: note._id, content: note.content });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNotesByVideo = async (req, res) => {
  try {
    const notes = await Note.find({ videoId: req.params.videoId });
    await logEvent("NOTES_FETCH", { videoId: req.params.videoId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchNotes = async (req, res) => {
  try {
    const { q, tag } = req.query;
    let query = { videoId: req.params.videoId };
    if (q) query.content = { $regex: q, $options: "i" };
    if (tag) query.tags = tag;
    const notes = await Note.find(query);
    await logEvent("NOTES_SEARCH", {
      videoId: req.params.videoId,
      query: { q, tag },
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.noteId, req.body, {
      new: true,
    });
    await logEvent("NOTE_UPDATE", { noteId: note._id });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.noteId);
    await logEvent("NOTE_DELETE", { noteId: req.params.noteId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
