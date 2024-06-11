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
import { useCart } from "../CartContext";
import { Link } from "react-router-dom";

import supabase from "../config/supabaseClient";

//import CheckoutForm.css
import "../css/CheckoutForm.css";

const stripePromise = loadStripe(
  "pk_test_51PO7ArItMOkvrGWYgiBdCuO8i16vzXxF8a4KitkwrqFLcbJQZ8CzZFnGK2mcGAAGpbJIoLommyfBdKrGEgVv2Ykl000rlrcsZY"
);

const CheckoutForm = ({ descripcion, stripe_id, totalAmount, rifa }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethodType, setPaymentMethodType] = useState("card");
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useUser();
  //const [amount, setAmount] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { cart } = useCart();

  const navigate = useNavigate();

  const handleSuccesfulPayment = async (event) => {
    // Extract ticket numbers from cart items
    const ticketNumbersArray = cart.map((item) => item.ticketNumber);

    const { data, error } = await supabase.from("boletos").insert([
      {
        id_rifa: rifa.id,
        num_boletos: ticketNumbersArray,
        user_id: user.id,
        precio: rifa.precioboleto,
        desc: rifa.desc,
        nombre_rifa: rifa.nombre,
        img_rifa: rifa.img,
        socio: rifa.socio,
        nombre: user.user_metadata.name,
        fecharifa: rifa.fecharifa,
      },
    ]);

    if (error) {
      console.error("Error inserting data: ", error);
    } else {
      console.log("Data inserted successfully: ", data);
      navigate(
        "/" +
          encodeURIComponent(rifa.socio.replace(/\s+/g, "-")) +
          "/" +
          encodeURIComponent(rifa.user_id.replace(/\s+/g, "-")) +
          "/mis-boletos"
      );
    }
  };

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
            amount: totalAmount * 100,
            currency: "mxn",
            description: descripcion,
            id,
            destination: stripe_id,
          }
        );
        console.log("data:", data);
        setErrorMessage("");

        if (data.payment.status === "succeeded") {
          handleSuccesfulPayment();
        }
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

        {user ? (
          <>
            <button
              type="submit"
              className="button"
              disabled={!stripe || isLoading}
            >
              {isLoading ? "Processing..." : "Pay"}
            </button>
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </>
        ) : (
          <div className="error-message">
            Inicia sesion para realizar el pago
            <button className="button" onClick={() => navigate("/login")}>
              Iniciar sesion
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
function Form({ descripcion, stripe_id, totalAmount, rifa }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        descripcion={descripcion}
        stripe_id={stripe_id}
        totalAmount={totalAmount}
        rifa={rifa}
      />
    </Elements>
  );
}

export default Form;
