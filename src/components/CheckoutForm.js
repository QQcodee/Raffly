import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

import "../css/CheckoutForm.css";

import cardIcon from "../assets/cardicon1.png";
import oxxoIcon from "../assets/logooxxo.png";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentMethodType, setPaymentMethodType] = useState("card");
  const [oxxoEmail, setOxxoEmail] = useState("");
  const [oxxoName, setOxxoName] = useState("");

  const createPaymentIntent = async () => {
    const response = await fetch("/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: 2000, paymentMethodType }), // amount in cents
    });

    const { clientSecret } = await response.json();
    setClientSecret(clientSecret);
  };

  useEffect(() => {
    createPaymentIntent();
  }, [paymentMethodType]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    if (paymentMethodType === "card") {
      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
          },
        }
      );

      if (error) {
        setError(error.message);
        setProcessing(false);
      } else if (paymentIntent.status === "succeeded") {
        setSucceeded(true);
        setProcessing(false);
      }
    } else if (paymentMethodType === "oxxo") {
      const { error, paymentIntent } = await stripe.confirmOxxoPayment(
        clientSecret,
        {
          payment_method: {
            billing_details: {
              name: oxxoName,
              email: oxxoEmail,
            },
          },
        }
      );

      if (error) {
        setError(error.message);
        setProcessing(false);
      } else if (paymentIntent.status === "requires_action") {
        // OXXO voucher generated
        window.location.href =
          paymentIntent.next_action.oxxo_display_details.hosted_voucher_url;
      }
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-header">Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div className="payment-methods">
          <label className="payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethodType === "card"}
              onChange={(e) => setPaymentMethodType(e.target.value)}
            />
            Card
            <img src={cardIcon} alt="Card" />
          </label>
          <label className="payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="oxxo"
              checked={paymentMethodType === "oxxo"}
              onChange={(e) => setPaymentMethodType(e.target.value)}
            />
            OXXO
            <img src={oxxoIcon} alt="OXXO" />
          </label>
        </div>

        {paymentMethodType === "card" && (
          <>
            <div className="stripe-element">
              <label htmlFor="cardNumber">Card Number</label>
              <CardNumberElement id="cardNumber" />
            </div>
            <div className="expiry-cvc-container">
              <div className="stripe-element">
                <label htmlFor="cardExpiry">Expiration Date</label>
                <CardExpiryElement id="cardExpiry" />
              </div>
              <div className="stripe-element">
                <label htmlFor="cardCvc">CVC</label>
                <CardCvcElement id="cardCvc" />
              </div>
            </div>
          </>
        )}

        {paymentMethodType === "oxxo" && (
          <>
            <div className="oxxo-element">
              <label htmlFor="oxxoName">Full Name</label>
              <input
                type="text"
                id="oxxoName"
                value={oxxoName}
                onChange={(e) => setOxxoName(e.target.value)}
                required
              />
            </div>
            <div className="oxxo-element">
              <label htmlFor="oxxoEmail">Email</label>
              <input
                type="email"
                id="oxxoEmail"
                value={oxxoEmail}
                onChange={(e) => setOxxoEmail(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="button"
          disabled={!stripe || processing || succeeded}
        >
          {processing ? "Processing..." : "Pay"}
        </button>
        {error && <div className="error-message">{error}</div>}
        {succeeded && <div className="success-message">Payment Succeeded!</div>}
      </form>
    </div>
  );
};

export default CheckoutForm;
