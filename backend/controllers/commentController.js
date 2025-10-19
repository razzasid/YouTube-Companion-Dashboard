const { youtube } = require("../config/oauth");
const { logEvent } = require("../utils/logger");

exports.getComments = async (req, res) => {
  try {
    const response = await youtube.commentThreads.list({
      part: ["snippet", "replies"],
      videoId: req.params.videoId,
    });
    await logEvent("COMMENTS_FETCH", { videoId: req.params.videoId });
    res.json(response.data.items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postComment = async (req, res) => {
  try {
    const { text } = req.body;
    const response = await youtube.commentThreads.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          videoId: req.params.videoId,
          topLevelComment: {
            snippet: {
              textOriginal: text,
            },
          },
        },
      },
    });
    await logEvent("COMMENT_POST", { videoId: req.params.videoId, text });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.replyComment = async (req, res) => {
  try {
    const { text } = req.body;
    const response = await youtube.comments.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          parentId: req.params.commentId,
          textOriginal: text,
        },
      },
    });
    await logEvent("COMMENT_REPLY", { commentId: req.params.commentId, text });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await youtube.comments.delete({ id: req.params.commentId });
    await logEvent("COMMENT_DELETE", { commentId: req.params.commentId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
