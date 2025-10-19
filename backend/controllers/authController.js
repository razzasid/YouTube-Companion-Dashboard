const { oauth2Client } = require("../config/oauth");
const { logEvent } = require("../utils/logger");

exports.getAuthUrl = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/youtube",
    ],
  });
  res.json({ url });
};

exports.authCallback = async (req, res) => {
  try {
    const { code } = req.body;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    await logEvent("AUTH", { action: "User authenticated" });
    res.json({ tokens });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.setTokens = (req, res) => {
  oauth2Client.setCredentials(req.body.tokens);
  res.json({ success: true });
};
