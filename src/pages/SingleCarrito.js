import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useUser } from "../UserContext";
import { useParams } from "react-router-dom";

import Form from "./Form";
import HeaderSocios from "../components/HeaderSocios";

//import CartPage.css
import "../css/CartPage.css";

const SingleCarrito = () => {
  const { cart, removeItem, clearCart } = useCart();

  const [socioMetaData, setSocioMetaData] = useState([]);

  const [selectedTickets, setSelectedTickets] = useState({});

  const { user_id, nombre_negocio } = useParams();

  // console.log(cart[0].rifa.nombre);
  console.log(cart);

  const ticketNumbersArray = cart.map((item) => item.ticketNumber);

  const navigate = useNavigate();

  const handleRemoveTicketFromCart = (itemId) => {
    setSelectedTickets((prev) => {
      const newSelectedTickets = { ...prev };
      const item = cart.find((item) => item.id === itemId);
      if (item) {
        delete newSelectedTickets[item.ticketNumber];
      }
      return newSelectedTickets;
    });
    removeItem(itemId);
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const fetchUserMetaData = async () => {
      if (!user_id) return;

      const { data, error } = await supabase
        .from("user_metadata")
        .select()
        .eq("user_id", user_id);

      if (error) {
        console.log(error);
      }
      if (data) {
        setSocioMetaData(data);
      }
    };
    fetchUserMetaData();
  }, [user_id]);

  return (
    <>
      <HeaderSocios />

      <div className="page-title">
        <h2>Carrito</h2>
        <hr className="divider-title-carrito" />
      </div>

      {cart[0] ? (
        <div className="carrito-card">
          <div className="cart-section-single">
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "400",
                textAlign: "center",
              }}
            >
              Boletos {cart.length > 0 ? <>({cart.length}) </> : null}{" "}
            </h2>
            <p style={{ textAlign: "center", fontWeight: "500" }}>
              {cart[0].raffleName}
            </p>
            <p style={{ textAlign: "center", fontWeight: "500" }}>
              {cart[0].rifa.socio}
            </p>

            {cart.length === 0 ? (
              <p>Ningun boleto seleccionado</p>
            ) : (
              <>
                <ul style={{ listStyle: "none" }}>
                  {cart.map((item) => (
                    <li key={item.id}>
                      #{item.ticketNumber} - ${item.price}
                      <button
                        onClick={() => handleRemoveTicketFromCart(item.id)}
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p
              style={{
                marginTop: "20px",
                fontWeight: "bold",
                fontSize: "27px",
              }}
            >
              Total a pagar: ${totalAmount.toFixed(0)}
            </p>
          </div>

          <div className="form-checkout">
            {socioMetaData[0] ? (
              <Form
                precioBoleto={cart.price}
                rifa={cart[0].rifa}
                totalAmount={totalAmount}
                socioMetaData={socioMetaData}
                stripe_id={socioMetaData[0].stripe_id}
                descripcion={
                  "Ticket:" +
                  cart[0].rifa.nombre +
                  "(" +
                  cart[0].rifa.id +
                  ")" +
                  "Numeros:" +
                  ticketNumbersArray
                }
              />
            ) : null}
          </div>
        </div>
      ) : (
        <>
          <div
            style={{ width: "500px", marginLeft: "auto", marginRight: "auto" }}
            className="carrito-card"
          >
            <div
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                No hay boletos en el carrito
              </p>
              <button
                style={{
                  marginTop: "10px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "200px",
                  height: "40px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: socioMetaData[0]?.color,
                  color: "white",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
                onClick={() =>
                  navigate(
                    "/" +
                      encodeURIComponent(nombre_negocio.replace(/\s+/g, "-")) +
                      "/" +
                      encodeURIComponent(user_id.replace(/\s+/g, "-"))
                  )
                }
              >
                Ir a rifas Activas
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SingleCarrito;
