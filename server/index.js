const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();

const stripe = new Stripe(
  "sk_test_51PO7ArItMOkvrGWYvaLLvqaZW94rKqxDepb29QxRyw0ABgYvLaJu27B88C1OjkNOjEVUSfwszkAXPqFK6iEeinJT00cZHMzNFO"
);

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.post("/api/checkout", async (req, res) => {
  // you can get more data to find in a database, and so on
  const { id, amount } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Raffly Ticket",
      payment_method: id,
      confirm: true,
      payment_method_types: ["card"],
      return_url: "http://localhost:3000/success",
    });

    console.log(payment);

    return res.status(200).json({ message: "Successful Payment" });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.raw.message });
  }
});

app.listen(3001, () => {
  console.log("Server on port", 3001);
});
