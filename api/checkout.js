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

app.post("/api/checkout", async (req, res) => {
  // you can get more data to find in a database, and so on
  const { id, amount, description, destination } = req.body;

  const precioBoleto = amount;
  const platformFeePercentage = 0.01;
  const platformFee = precioBoleto * platformFeePercentage;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "mxn",
      description,
      payment_method: id,
      confirm: true,
      payment_method_types: ["card", "oxxo"],
      application_fee_amount: 0.01 * amount,
      transfer_data: {
        destination: destination,
      },
      return_url: "http://localhost:3000/success",
    });

    console.log(payment);

    return res.status(200).json({ message: "Successful Payment", payment });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.raw.message });
  }
});

module.exports = app;
module.exports.handler = serverless(app);
