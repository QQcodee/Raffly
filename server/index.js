const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const bodyParser = require("body-parser");

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://ivltiudjxnrytalzxfwr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2bHRpdWRqeG5yeXRhbHp4ZndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyMTMzNzgsImV4cCI6MjAzMTc4OTM3OH0.th0QprBpNXFyh3pZ_yUwEsy1ge7fOfNzd7pzTpGRwZE";

const supabase = createClient(supabaseUrl, supabaseKey);

//import supabase from config folder

const app = express();

const stripe = new Stripe(
  "sk_test_51PO7ArItMOkvrGWYvaLLvqaZW94rKqxDepb29QxRyw0ABgYvLaJu27B88C1OjkNOjEVUSfwszkAXPqFK6iEeinJT00cZHMzNFO"
);

app.use(cors({ origin: "http://localhost:3000" }));
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

app.post("/create-account-link", async (req, res) => {
  const account = await stripe.accounts.create({ type: "express" });
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "http://localhost:3000/stripe",
    return_url: "http://localhost:3000/stripe",
    type: "account_onboarding",
  });

  res.json({ url: accountLink.url, accountId: account.id });
});

app.post("/save-account-id", async (req, res) => {
  const { userId, accountId } = req.body;

  try {
    const { data, error } = await supabase
      .from("user_metadata")
      .update({ stripe_id: accountId })
      .eq("user_id", userId);
    if (error) {
      throw error;
    }

    res.status(200).send({ success: true, data });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/generate-account-link", async (req, res) => {
  const { accountId } = req.body;

  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: "http://localhost:3000/success",
      return_url: "http://localhost:3000/success",
      type: "account_onboarding",
    });

    res.json({ url: accountLink.url });
  } catch (error) {
    console.error("Error generating account link:", error);
    res.status(500).send({ error: error.message });
  }
});

app.post("/generate-dashboard-access-link", async (req, res) => {
  const { accountId } = req.body;

  try {
    const loginLink = await stripe.accounts.createLoginLink(accountId, {
      redirect_url: "http://localhost:3000/success", // Redirect URL after login
    });

    res.json({ url: loginLink.url });
  } catch (error) {
    console.error("Error generating dashboard access link:", error);
    res.status(500).send({ error: error.message });
  }
});

app.post("/check-account-exists", async (req, res) => {
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

app.listen(3001, () => {
  console.log("Server on port", 3001);
});
