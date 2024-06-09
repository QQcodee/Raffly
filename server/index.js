const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const stripe = new Stripe(
  "sk_test_51PO7ArItMOkvrGWYvaLLvqaZW94rKqxDepb29QxRyw0ABgYvLaJu27B88C1OjkNOjEVUSfwszkAXPqFK6iEeinJT00cZHMzNFO"
);

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(bodyParser.json());

app.post("/api/checkout", async (req, res) => {
  // you can get more data to find in a database, and so on
  const { id, amount, description, clientName, clientEmail } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "mxn",
      description,
      payment_method: id,
      confirm: true,
      payment_method_types: ["card", "oxxo"],
      return_url: "http://localhost:3000/success",
      billing_details: {
        name: clientName,
        email: clientEmail,
      },
    });

    console.log(payment);

    return res.status(200).json({ message: "Successful Payment" });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.raw.message });
  }
});

app.post("/create-payment-intent", async (req, res) => {
  const { amount, firstName, lastName, email } = req.body;

  // Validate first and last names
  if (firstName.length < 2 || lastName.length < 2) {
    return res.status(400).send({
      error: "First and last names must each be at least 2 characters long.",
    });
  }

  try {
    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: "mxn",
      payment_method_types: ["oxxo"],
      receipt_email: email,
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

app.listen(3001, () => {
  console.log("Server on port", 3001);
});
