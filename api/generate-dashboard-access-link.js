require("dotenv").config();

const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const bodyParser = require("body-parser");

const stripeSecretKey = process.env.STRIPE_SECRET;
const clientURL = process.env.CLIENT_URL;

const app = express();

const stripe = new Stripe(stripeSecretKey);

app.use(cors({ origin: clientURL }));
app.use(express.json());
app.use(bodyParser.json());

app.post("/api/generate-dashboard-access-link", async (req, res) => {
  const { accountId } = req.body;

  try {
    const loginLink = await stripe.accounts.createLoginLink(accountId, {
      redirect_url: "https://www.raffly.com.mx//success", // Redirect URL after login
    });

    res.json({ url: loginLink.url });
  } catch (error) {
    console.error("Error generating dashboard access link:", error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = app;
