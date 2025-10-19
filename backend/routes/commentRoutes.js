const express = require("express");
const router = express.Router();
const comments = require("../controllers/commentController");

// comments for a video
router.get("/:videoId", comments.getComments);
router.post("/:videoId", comments.postComment);

// replies / delete
router.post("/:commentId/reply", comments.replyComment);
router.delete("/:commentId", comments.deleteComment);

module.exports = router;
