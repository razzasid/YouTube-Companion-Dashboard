const express = require("express");
const router = express.Router();
const logs = require("../controllers/logController");

router.get("/", logs.getLogs);

module.exports = router;
