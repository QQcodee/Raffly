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

app.post("/api/create-payment-intent-oxxo", async (req, res) => {
  const { amount, firstName, lastName, email, description, destination } =
    req.body;

  // Validate first and last names
  if (firstName.length < 2 || lastName.length < 2) {
    return res.status(400).send({
      error: "First and last names must each be at least 2 characters long.",
    });
  }

  try {
    // Create PaymentIntent
    const amountInCentavos = amount;
    const platformFee = Math.round(
      0.01 * amountInCentavos +
        amountInCentavos * 0.036 +
        amountInCentavos * 0.036 * 0.16
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Stripe expects amount in cents
      currency: "mxn",
      description,
      payment_method_types: ["oxxo"],
      receipt_email: email,
      application_fee_amount: platformFee,
      transfer_data: {
        destination: destination,
      },
    });

    // Generate OXXO payment details with billing details
    const oxxoPayment = await stripe.paymentMethods.create({
      type: "oxxo",
      billing_details: {
        name: `${firstName} ${lastName}`,
        email: email,
      },
    });

    // Confirm the PaymentIntent with the OXXO payment method
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      {
        payment_method: oxxoPayment.id,
      }
    );

    res.json({
      id: confirmedPaymentIntent.id,
      oxxoUrl:
        confirmedPaymentIntent.next_action.oxxo_display_details
          .hosted_voucher_url,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Failed to create PaymentIntent" });
  }
});

module.exports = app;
