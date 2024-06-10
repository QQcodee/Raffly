import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  CardCvcElement,
  CardNumberElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useState } from "react";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";

//import CheckoutForm.css
import "../css/CheckoutForm.css";

const stripePromise = loadStripe(
  "pk_test_51PO7ArItMOkvrGWYgiBdCuO8i16vzXxF8a4KitkwrqFLcbJQZ8CzZFnGK2mcGAAGpbJIoLommyfBdKrGEgVv2Ykl000rlrcsZY"
);

const CheckoutForm = ({ precioBoleto, descripcion, stripe_id }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethodType, setPaymentMethodType] = useState("card");
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useUser();
  //const [amount, setAmount] = useState("");

  console.log(stripe_id);
  console.log(precioBoleto, descripcion);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (paymentMethodType === "card") {
      if (!stripe || !elements) {
        setErrorMessage("Stripe has not been properly initialized.");
        setIsLoading(false);
        return;
      }

      const cardElement = elements.getElement(CardNumberElement);

      if (!cardElement) {
        setErrorMessage("Please enter your card details.");
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: paymentMethodType,
        card: cardElement,
        billing_details: {
          name: user.name,
          email: user.email,
        },
      });

      if (error) {
        console.error("Error creating payment method:", error);
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      console.log("paymentMethod:", paymentMethod);
      const { id } = paymentMethod;

      try {
        const { data } = await axios.post(
          "http://localhost:3001/api/checkout",
          {
            amount: precioBoleto * 100,
            currency: "mxn",
            description: descripcion,
            id,
            destination: stripe_id,
          }
        );
        console.log("data:", data);
        setErrorMessage("");
        navigate("/success");
      } catch (error) {
        console.error("Error processing payment:", error);
        setErrorMessage("Payment processing failed. Please try again.");
      }
    } else if (paymentMethodType === "oxxo") {
      try {
        const response = await axios.post(
          "http://localhost:3001/create-payment-intent",
          {
            amount: 2000,
            firstName,
            lastName,
            email,
          }
        );

        // Handle response, redirect to OXXO payment page
        //window.location.href = response.data.oxxoUrl;
        navigate("/success");

        window.open(response.data.oxxoUrl, "_blank");
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage("Payment processing failed. Please try again.");
      }
    }

    setIsLoading(false);
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
              <label htmlFor="name">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <label htmlFor="name">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="oxxo-element">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="button"
          disabled={!stripe || isLoading}
        >
          {isLoading ? "Processing..." : "Pay"}
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
};
function Form({ precioBoleto, descripcion, stripe_id }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        precioBoleto={precioBoleto}
        descripcion={descripcion}
        stripe_id={stripe_id}
      />
    </Elements>
  );
}

export default Form;
