const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
const path = require("path");
const fs = require("fs");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keyFilePath = path.join(
    __dirname,
    "192d8724f384ed3e1c7b1880f16e4f2236a129a5"
  );
  if (!fs.existsSync(keyFilePath)) {
    return res
      .status(500)
      .json({ error: "Service account key file not found" });
  }

  const auth = new GoogleAuth({
    keyFile: keyFilePath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();
  google.options({ auth: client });

  const spreadsheetId = "1MfgHFme9xlK6LcyRL60JOrJa98ihwpIa9ji7Nh7yBvI";
  const range = "Sheet1!A1"; // Adjust as needed
  const valueInputOption = "RAW";
  const resource = {
    values: [[req.body.data]], // Assuming you're sending { "data": "your data" }
  };

  try {
    const response = await google.sheets("v4").spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });

    res.status(200).json({ result: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
