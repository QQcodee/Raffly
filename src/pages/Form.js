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
import { useEffect, useState } from "react";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { Link } from "react-router-dom";

import supabase from "../config/supabaseClient";

//import CheckoutForm.css
import "../css/CheckoutForm.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC);

const CheckoutForm = ({
  descripcion,
  stripe_id,
  totalAmount,
  rifa,
  socioMetaData,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethodType, setPaymentMethodType] = useState("card");
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useUser();
  const [oxxoResponse, setOxxoResponse] = useState("");
  //const [amount, setAmount] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { cart, clearCart, removeItem, cartCount } = useCart();

  const ticketNumbersArray = cart.map((item) => item.ticketNumber);
  const ticketNumbersWhatsapp = ticketNumbersArray.join("%0A");

  const navigate = useNavigate();

  const handleRemoveSoldTicketsFromCart = async () => {
    // Fetch sold tickets from the database
    const { data, error } = await supabase
      .from("boletos")
      .select()
      .eq("id_rifa", rifa.id);

    if (error) {
      console.log(error);
      return [];
    }

    // Flatten the arrays of ticket numbers into a single array
    const soldTicketsArray = data.reduce((acc, ticket) => {
      return acc.concat(ticket.num_boletos);
    }, []);

    // Find sold tickets in the cart
    const soldTicketsInCart = cart.filter((item) =>
      soldTicketsArray.includes(item.ticketNumber)
    );

    // Remove sold tickets from the cart
    soldTicketsInCart.forEach((item) => {
      removeItem(item.id);
    });

    return soldTicketsInCart;
  };

  const handleSuccesfulPayment = async (event) => {
    // Extract ticket numbers from cart items

    if (paymentMethodType === "card") {
      const { data, error } = await supabase.from("boletos").insert([
        {
          id_rifa: rifa.id,
          num_boletos: ticketNumbersArray,
          user_id: user.id,
          precio: rifa.precioboleto,
          desc: rifa.desc,
          nombre_rifa: rifa.nombre,
          email: email,
          telefono: phone,
          img_rifa: rifa.img,
          socio: rifa.socio,
          nombre: firstName + " " + lastName,
          fecharifa: rifa.fecharifa,
          socio_user_id: rifa.user_id,
          comprado: true,
          apartado: false,
        },
      ]);

      if (error) {
        console.error("Error inserting data: ", error);
      } else {
        console.log("Data inserted successfully: ", data);
        clearCart();
        navigate(
          "/" +
            encodeURIComponent(rifa.socio.replace(/\s+/g, "-")) +
            "/" +
            encodeURIComponent(rifa.user_id.replace(/\s+/g, "-")) +
            "/mis-boletos"
        );
      }
    }
    if (paymentMethodType === "oxxo") {
      const { data, error } = await supabase.from("boletos").insert([
        {
          id_rifa: rifa.id,
          num_boletos: ticketNumbersArray,
          user_id: user.id,
          precio: rifa.precioboleto,
          desc: rifa.desc,
          nombre_rifa: rifa.nombre,
          email: email,
          telefono: phone,
          img_rifa: rifa.img,
          socio: rifa.socio,
          nombre: firstName + " " + lastName,
          fecharifa: rifa.fecharifa,
          socio_user_id: rifa.user_id,
          oxxo: true,
          apartado: false,
          oxxo_url: oxxoResponse,
        },
      ]);

      if (error) {
        console.error("Error inserting data: ", error);
      } else {
        clearCart();
        navigate(
          "/" +
            encodeURIComponent(rifa.socio.replace(/\s+/g, "-")) +
            "/" +
            encodeURIComponent(rifa.user_id.replace(/\s+/g, "-")) +
            "/mis-boletos"
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const soldTicketsInCart = await handleRemoveSoldTicketsFromCart();

    if (soldTicketsInCart.length > 0) {
      setErrorMessage(
        "Lamentablemente alguien más compró alguno de tus boletos y fueron eliminados de tu carrito puedes agregar mas o coninuar con los que ya tienes."
      );
      setIsLoading(false);
      return;
    }

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
          name: firstName + " " + lastName,
          email: email,
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
          "https://www.raffly.com.mx/api/checkout",
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
        const { data } = await axios.post(
          "https://www.raffly.com.mx/api/create-payment-intent-oxxo",
          {
            amount: totalAmount * 100,
            currency: "mxn",
            description: descripcion,
            firstName,
            lastName,
            email,
            destination: stripe_id,
          }
        );

        // Handle response, redirect to OXXO payment page
        //window.location.href = response.data.oxxoUrl;

        console.log(data);
        setOxxoResponse(oxxoUrl);
        console.log("oxxoResponse:", oxxoResponse);

        handleSuccesfulPayment();

        window.open(data.oxxoUrl, "_blank");
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage("Payment processing failed. Please try again.");
      }
    } else if (paymentMethodType === "transferencia") {
      window.open(
        "https://api.whatsapp.com/send/?phone=" +
          socioMetaData[0].phone +
          "&text=Hola aparte " +
          cartCount +
          " boletos para el combo millonario: %0A ———————————— %0A Nombre: " +
          firstName +
          "%0A Apellido: " +
          lastName +
          "%0A Telefono: " +
          phone +
          "%0A%0A Boletos:%0A" +
          ticketNumbersWhatsapp +
          "%0A%0ATOTAL: $" +
          totalAmount +
          " %0A%0A CUENTAS DE PAGO AQUI: www.raffly.com.mx %0A %0A El siguiente paso es enviar foto del comprobante de pago por aqui"
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="form-container">
      <h2 style={{ fontSize: "32px" }} className="form-header">
        Datos de pago
      </h2>
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
            <img
              src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/public/pngwing.com__5_.png"
              alt="Tarjeta"
            />
            Tarjeta
          </label>
          <label className="payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="oxxo"
              checked={paymentMethodType === "oxxo"}
              onChange={(e) => setPaymentMethodType(e.target.value)}
            />
            <img
              src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/public/logooxxo__1_.png"
              alt="OXXO"
            />
            OXXO
          </label>
          <label className="payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="transferencia"
              checked={paymentMethodType === "transferencia"}
              onChange={(e) => setPaymentMethodType(e.target.value)}
            />
            <i className="material-icons">currency_exchange</i>
            Transferencia
          </label>
        </div>

        {paymentMethodType === "card" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",

                width: "100%",
                marginBottom: "10px",
                marginTop: "10px",
                gap: "10px",
                alignItems: "center",
              }}
              className="stripe-element"
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="name">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="stripe-element">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="phone">Telefono</label>
              <input
                type="phone"
                placeholder="Numero de whatsapp"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

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
            <div className="stripe-element">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <label htmlFor="name">Apellido</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="stripe-element">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="phone">Telefono</label>
              <input
                type="phone"
                placeholder="Numero de whatsapp"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {paymentMethodType === "transferencia" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",

                width: "100%",
                marginBottom: "10px",
                marginTop: "10px",
                gap: "10px",
                alignItems: "center",
              }}
              className="stripe-element"
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="name">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="stripe-element">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="phone">Telefono</label>
              <input
                type="phone"
                placeholder="Numero de whatsapp"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {user ? (
          paymentMethodType === "card" || paymentMethodType === "oxxo" ? (
            <>
              <button
                type="submit"
                className="button"
                disabled={!stripe || isLoading}
              >
                {isLoading ? "Processing..." : "Pagar"}
              </button>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
            </>
          ) : paymentMethodType === "transferencia" ? (
            <button type="submit" className="button">
              Apartar
            </button>
          ) : null
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

function Form({
  descripcion,
  stripe_id,
  totalAmount,
  rifa,
  paymentMethodType,
  socioMetaData,
}) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        descripcion={descripcion}
        stripe_id={stripe_id}
        totalAmount={totalAmount}
        rifa={rifa}
        paymentMethodType={paymentMethodType}
        socioMetaData={socioMetaData}
      />
    </Elements>
  );
}

export default Form;
