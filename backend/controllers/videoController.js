const { youtube } = require("../config/oauth");
const { logEvent } = require("../utils/logger");

exports.getVideo = async (req, res) => {
  try {
    const response = await youtube.videos.list({
      part: ["snippet", "statistics", "status"],
      id: [req.params.videoId],
    });
    await logEvent("VIDEO_FETCH", { videoId: req.params.videoId });
    res.json(response.data.items[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const response = await youtube.videos.update({
      part: ["snippet"],
      requestBody: {
        id: req.params.videoId,
        snippet: {
          title,
          description,
          categoryId: "22",
        },
      },
    });
    await logEvent("VIDEO_UPDATE", {
      videoId: req.params.videoId,
      title,
      description,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
