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
  const [paymentMethodType, setPaymentMethodType] = useState(
    rifa.tarjeta === true
      ? "card"
      : rifa.oxxo === true
      ? "oxxo"
      : rifa.transferencia === true
      ? "transferencia"
      : null
  );
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useUser();
  const [oxxoResponse, setOxxoResponse] = useState("");
  //const [amount, setAmount] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [countryCode, setCountryCode] = useState("");

  console.log(countryCode + phone);

  console.log(phone.length);

  const [isLoading, setIsLoading] = useState(false);

  const { cart, clearCart, removeItem, cartCount } = useCart();

  const ticketNumbersArray = cart.map((item) => item.ticketNumber);

  const ticketNumbersWhatsapp = ticketNumbersArray.join("%0A");

  const oportunidadesArray = [];

  cart.forEach((item) => {
    if (Array.isArray(item.oportunidades)) {
      oportunidadesArray.push(...item.oportunidades);
    }
  });

  const [estado, setEstado] = useState(null);

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

  const handleSuccesfulPayment = async (oxxo_url = null, oxxo_id = null) => {
    // Extract ticket numbers from cart items

    if (paymentMethodType === "card") {
      const { data, error } = await supabase.from("boletos").insert([
        {
          id_rifa: rifa.id,
          num_boletos: ticketNumbersArray,
          user_id: user.id,
          precio: rifa.precioboleto,

          nombre_rifa: rifa.nombre,
          email: email,
          telefono: countryCode + phone,
          img_rifa: rifa.img,
          socio: rifa.socio,
          nombre: firstName + " " + lastName,
          fecharifa: rifa.fecharifa,
          socio_user_id: rifa.user_id,
          comprado: true,
          estado_mx: estado,
          oportunidades: oportunidadesArray,
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
      const now = new Date();
      const apartadoUntil = new Date(now.getTime() + 48 * 60 * 60 * 1000);

      const { data, error } = await supabase.from("boletos").insert([
        {
          id_rifa: rifa.id,
          num_boletos: ticketNumbersArray,
          user_id: user.id,
          precio: rifa.precioboleto,

          nombre_rifa: rifa.nombre,
          email: email,
          telefono: countryCode + phone,
          img_rifa: rifa.img,
          socio: rifa.socio,
          nombre: firstName + " " + lastName,
          fecharifa: rifa.fecharifa,
          socio_user_id: rifa.user_id,
          oxxo: true,

          oxxo_url: oxxo_url,
          oxxo_id: oxxo_id,
          apartado_fecha: apartadoUntil,

          estado_mx: estado,
          oportunidades: oportunidadesArray,
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

    if (paymentMethodType === "transferencia") {
      const now = new Date();
      const apartadoUntil = new Date(now.getTime() + 12 * 60 * 60 * 1000);

      const { data, error } = await supabase.from("boletos").insert([
        {
          id_rifa: rifa.id,
          num_boletos: ticketNumbersArray,
          user_id: user ? user.id : null,
          precio: rifa.precioboleto,

          nombre_rifa: rifa.nombre,
          email: email,
          telefono: countryCode + phone,
          img_rifa: rifa.img,
          socio: rifa.socio,
          nombre: firstName + " " + lastName,
          fecharifa: rifa.fecharifa,
          socio_user_id: rifa.user_id,

          apartado: true,
          apartado_fecha: apartadoUntil,
          estado_mx: estado,
          oportunidades: oportunidadesArray,
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
            "/mis-boletos/" +
            email
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
        window.open(data.oxxoUrl, "_blank");

        handleSuccesfulPayment(data.oxxoUrl, data.id);
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage("Payment processing failed. Please try again.");
      }
    } else if (paymentMethodType === "transferencia") {
      const randomIndex = Math.floor(
        Math.random() * socioMetaData[0].phones.length
      );
      const selectedPhone = socioMetaData[0].phones[randomIndex];

      console.log(selectedPhone);
      window.open(
        "https://api.whatsapp.com/send/?phone=" +
          selectedPhone +
          "&text=Hola aparte " +
          cartCount +
          " boletos para el sorteo " +
          encodeURIComponent(rifa.nombre) +
          ": %0A ———————————— %0A Nombre: " +
          firstName +
          "%0A Apellido: " +
          lastName +
          "%0A Telefono: " +
          phone +
          "%0A%0A Boletos:%0A" +
          ticketNumbersWhatsapp +
          "%0A%0ATOTAL: $" +
          totalAmount +
          ` %0A%0A CUENTAS DE PAGO AQUI: https://www.raffly.com.mx/${encodeURIComponent(
            rifa.socio.replace(/\s+/g, "-")
          )}/${encodeURIComponent(
            rifa.user_id
          )}/metodos-de-pago %0A %0A El siguiente paso es enviar foto del comprobante de pago por aqui %0A %0A Para ver el estado de tu boleto puedes entrar al siguiente enlace: %0A` +
          "https://www.raffly.com.mx/verificador/" +
          email
      );

      handleSuccesfulPayment();
    }

    setIsLoading(false);
  };

  return (
    <div className="form-container">
      <h2 style={{ fontSize: "32px" }} className="form-header">
        Datos de pago
      </h2>

      <div className="buttons-payment">
        {rifa.tarjeta === true ? (
          <button
            onClick={() => setPaymentMethodType("card")}
            className={paymentMethodType === "card" ? "active" : ""}
          >
            <img
              src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/public/pngwing.com__5_.png"
              alt="Tarjeta"
            />
            Tarjeta
          </button>
        ) : null}

        {rifa.oxxo === true ? (
          <button
            onClick={() => setPaymentMethodType("oxxo")}
            className={paymentMethodType === "oxxo" ? "active" : ""}
          >
            <img
              src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/public/logooxxo__1_.png"
              alt="OXXO"
            />
            OXXO
          </button>
        ) : null}

        {rifa.transferencia === true ? (
          <button
            onClick={() => setPaymentMethodType("transferencia")}
            className={paymentMethodType === "transferencia" ? "active" : ""}
          >
            <i
              style={{
                display: "flex",
                alignItems: "center",
              }}
              className="material-icons"
            >
              currency_exchange
            </i>
            Transferencia
          </button>
        ) : null}
      </div>

      <form onSubmit={handleSubmit}>
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
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "space-between",
                }}
              >
                {" "}
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
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <select
                  name="countryCode"
                  style={{
                    width: "100px",

                    padding: "6px",
                    margin: "10px 0 20px 0",
                  }}
                  id="countryCode"
                  required
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="">Pais</option>
                  <option value="52">Mexico</option>
                  <option value="1">USA</option>
                </select>
                <input
                  type="phone"
                  placeholder="Numero de whatsapp"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>

              <label htmlFor="estado">Estado</label>
              <select
                name="estado"
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="">SELECCIONA ESTADO</option>
                <option value="USA">USA</option>
                <option value="Aguascalientes">Aguascalientes</option>
                <option value="Baja California">Baja California</option>
                <option value="Baja California Sur">Baja California Sur</option>
                <option value="Campeche">Campeche</option>
                <option value="Chiapas">Chiapas</option>
                <option value="Chihuahua">Chihuahua</option>
                <option value="Ciudad de México">Ciudad de México</option>
                <option value="Coahuila">Coahuila</option>
                <option value="Colima">Colima</option>
                <option value="Durango">Durango</option>
                <option value="Estado de México">Estado de México</option>
                <option value="Guanajuato">Guanajuato</option>
                <option value="Guerrero">Guerrero</option>
                <option value="Hidalgo">Hidalgo</option>
                <option value="Jalisco">Jalisco</option>
                <option value="Michoacán">Michoacán</option>
                <option value="Morelos">Morelos</option>
                <option value="Nayarit">Nayarit</option>
                <option value="Nuevo León">Nuevo León</option>
                <option value="Oaxaca">Oaxaca</option>
                <option value="Puebla">Puebla</option>
                <option value="Querétaro">Querétaro</option>
                <option value="Quintana Roo">Quintana Roo</option>
                <option value="San Luis Potosí">San Luis Potosí</option>
                <option value="Sinaloa">Sinaloa</option>
                <option value="Sonora">Sonora</option>
                <option value="Tabasco">Tabasco</option>
                <option value="Tamaulipas">Tamaulipas</option>
                <option value="Tlaxcala">Tlaxcala</option>
                <option value="Veracruz">Veracruz</option>
                <option value="Yucatán">Yucatán</option>
                <option value="Zacatecas">Zacatecas</option>
              </select>
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
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "space-between",
                }}
              >
                {" "}
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
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <select
                  name="countryCode"
                  style={{
                    width: "100px",

                    padding: "6px",
                    margin: "10px 0 20px 0",
                  }}
                  id="countryCode"
                  required
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="">Pais</option>
                  <option value="52">Mexico</option>
                  <option value="1">USA</option>
                </select>
                <input
                  type="phone"
                  placeholder="Numero de whatsapp"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>

              <label htmlFor="estado">Estado</label>
              <select
                name="estado"
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="">SELECCIONA ESTADO</option>
                <option value="USA">USA</option>
                <option value="Aguascalientes">Aguascalientes</option>
                <option value="Baja California">Baja California</option>
                <option value="Baja California Sur">Baja California Sur</option>
                <option value="Campeche">Campeche</option>
                <option value="Chiapas">Chiapas</option>
                <option value="Chihuahua">Chihuahua</option>
                <option value="Ciudad de México">Ciudad de México</option>
                <option value="Coahuila">Coahuila</option>
                <option value="Colima">Colima</option>
                <option value="Durango">Durango</option>
                <option value="Estado de México">Estado de México</option>
                <option value="Guanajuato">Guanajuato</option>
                <option value="Guerrero">Guerrero</option>
                <option value="Hidalgo">Hidalgo</option>
                <option value="Jalisco">Jalisco</option>
                <option value="Michoacán">Michoacán</option>
                <option value="Morelos">Morelos</option>
                <option value="Nayarit">Nayarit</option>
                <option value="Nuevo León">Nuevo León</option>
                <option value="Oaxaca">Oaxaca</option>
                <option value="Puebla">Puebla</option>
                <option value="Querétaro">Querétaro</option>
                <option value="Quintana Roo">Quintana Roo</option>
                <option value="San Luis Potosí">San Luis Potosí</option>
                <option value="Sinaloa">Sinaloa</option>
                <option value="Sonora">Sonora</option>
                <option value="Tabasco">Tabasco</option>
                <option value="Tamaulipas">Tamaulipas</option>
                <option value="Tlaxcala">Tlaxcala</option>
                <option value="Veracruz">Veracruz</option>
                <option value="Yucatán">Yucatán</option>
                <option value="Zacatecas">Zacatecas</option>
              </select>
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
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "space-between",
                }}
              >
                {" "}
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

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <select
                  name="countryCode"
                  style={{
                    width: "100px",

                    padding: "6px",
                    margin: "10px 0 20px 0",
                  }}
                  id="countryCode"
                  required
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="">Pais</option>
                  <option value="52">Mexico</option>
                  <option value="1">USA</option>
                </select>
                <input
                  type="phone"
                  placeholder="Numero de whatsapp"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>
              <label htmlFor="estado">Estado</label>
              <select
                name="estado"
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="">SELECCIONA ESTADO</option>
                <option value="USA">USA</option>
                <option value="Aguascalientes">Aguascalientes</option>
                <option value="Baja California">Baja California</option>
                <option value="Baja California Sur">Baja California Sur</option>
                <option value="Campeche">Campeche</option>
                <option value="Chiapas">Chiapas</option>
                <option value="Chihuahua">Chihuahua</option>
                <option value="Ciudad de México">Ciudad de México</option>
                <option value="Coahuila">Coahuila</option>
                <option value="Colima">Colima</option>
                <option value="Durango">Durango</option>
                <option value="Estado de México">Estado de México</option>
                <option value="Guanajuato">Guanajuato</option>
                <option value="Guerrero">Guerrero</option>
                <option value="Hidalgo">Hidalgo</option>
                <option value="Jalisco">Jalisco</option>
                <option value="Michoacán">Michoacán</option>
                <option value="Morelos">Morelos</option>
                <option value="Nayarit">Nayarit</option>
                <option value="Nuevo León">Nuevo León</option>
                <option value="Oaxaca">Oaxaca</option>
                <option value="Puebla">Puebla</option>
                <option value="Querétaro">Querétaro</option>
                <option value="Quintana Roo">Quintana Roo</option>
                <option value="San Luis Potosí">San Luis Potosí</option>
                <option value="Sinaloa">Sinaloa</option>
                <option value="Sonora">Sonora</option>
                <option value="Tabasco">Tabasco</option>
                <option value="Tamaulipas">Tamaulipas</option>
                <option value="Tlaxcala">Tlaxcala</option>
                <option value="Veracruz">Veracruz</option>
                <option value="Yucatán">Yucatán</option>
                <option value="Zacatecas">Zacatecas</option>
              </select>
            </div>
          </>
        )}

        {user ? (
          paymentMethodType === "card" || paymentMethodType === "oxxo" ? (
            <>
              <button
                type="submit"
                className="button"
                disabled={
                  !stripe ||
                  isLoading ||
                  estado === null ||
                  estado === "" ||
                  phone.length < 10 ||
                  phone.length > 10 ||
                  countryCode === ""
                }
              >
                {isLoading ? "Processing..." : `Pagar $${totalAmount} MXN`}
              </button>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
            </>
          ) : paymentMethodType === "transferencia" ? (
            <button
              type="submit"
              className="button"
              disabled={
                isLoading ||
                estado === null ||
                estado === "" ||
                phone.length < 10 ||
                phone.length > 10 ||
                countryCode === ""
              }
            >
              {isLoading ? "Procesando..." : `Pagar $${totalAmount} MXN`}
            </button>
          ) : null
        ) : (
          <>
            {paymentMethodType === "card" || paymentMethodType === "oxxo" ? (
              <div className="error-message">
                Inicia sesion para realizar el pago
                <button
                  className="button"
                  onClick={() =>
                    navigate(
                      "/" +
                        encodeURIComponent(
                          socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                        ) +
                        "/" +
                        encodeURIComponent(
                          socioMetaData[0].user_id.replace(/\s+/g, "-")
                        ) +
                        "/login-carrito"
                    )
                  }
                >
                  Iniciar sesion
                </button>
              </div>
            ) : null}

            {paymentMethodType === "transferencia" ? (
              <button
                type="submit"
                className="button"
                disabled={
                  isLoading ||
                  estado === null ||
                  estado === "" ||
                  phone.length < 10 ||
                  phone.length > 10 ||
                  countryCode === ""
                }
              >
                {isLoading ? "Procesando..." : `Pagar $${totalAmount} MXN`}
              </button>
            ) : null}
          </>
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
