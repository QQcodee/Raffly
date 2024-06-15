require("dotenv").config();

const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const bodyParser = require("body-parser");

const stripeSecretKey = process.env.STRIPE_SECRET;
const clientURL = process.env.REACT_APP_CLIENT_URL;

const app = express();

const stripe = new Stripe(stripeSecretKey);

app.use(cors({ origin: clientURL }));
app.use(express.json());
app.use(bodyParser.json());

app.post("/api/check-account-exists", async (req, res) => {
  const { accountId } = req.body;

  try {
    const account = await stripe.accounts.retrieve(accountId);

    if (account) {
      // Check if charges are enabled on the account
      const paymentsActive = account.charges_enabled;

      return res
        .status(200)
        .json({ exists: true, paymentsActive, message: "shibirubu" });
    } else {
      return res.status(404).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking account existence:", error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = app;
module.exports.handler = serverless(app);
