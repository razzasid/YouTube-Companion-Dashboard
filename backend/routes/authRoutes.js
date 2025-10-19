const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router.get("/url", auth.getAuthUrl);
router.post("/callback", auth.authCallback);
router.post("/tokens", auth.setTokens);

module.exports = router;
