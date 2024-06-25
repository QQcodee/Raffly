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

app.get("/api/payment-status-oxxo/:oxxo_id", async (req, res) => {
  const { oxxo_id } = req.params;

  console.log(oxxo_id);

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(oxxo_id);
    res.json({ status: paymentIntent.status });
    console.log(paymentIntent.status);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
});

module.exports = app;
