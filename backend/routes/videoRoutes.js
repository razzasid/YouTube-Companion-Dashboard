const express = require("express");
const router = express.Router();
const video = require("../controllers/videoController");

router.get("/:videoId", video.getVideo);
router.put("/:videoId", video.updateVideo);

module.exports = router;
