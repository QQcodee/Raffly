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

app.post("/api/create-account-link", async (req, res) => {
  const account = await stripe.accounts.create({ type: "express" });
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "https://www.raffly.com.mx",
    return_url: "https://www.raffly.com.mx",
    type: "account_onboarding",
  });

  res.json({ url: accountLink.url, accountId: account.id });
});

module.exports = app;
