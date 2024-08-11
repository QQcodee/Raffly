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
import HeaderGlobal from "../components/HeaderGlobal";
import FooterGlobal from "../components/FooterGlobal";

const SingleCarrito = () => {
  const { cart, removeItem } = useCart();

  const [socioMetaData, setSocioMetaData] = useState([]);

  const [selectedTickets, setSelectedTickets] = useState({});

  const { user_id, nombre_negocio } = useParams();

  // console.log(cart[0].rifa.nombre);

  const ticketNumbersArray = cart.map((item) => item.ticketNumber);

  const navigate = useNavigate();
  console.log(cart);

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
      const { data, error } = await supabase
        .from("user_metadata")
        .select()
        .eq("user_id", user_id);

      if (error) {
        console.log(error);
      }
      if (data) {
        setSocioMetaData(data);
        console.log(socioMetaData);
      }
    };
    fetchUserMetaData();
  }, [user_id]);

  return (
    <>
      <HeaderGlobal />

      {cart[0] ? (
        <div style={{ marginTop: "60px" }} className="carrito-card">
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
              <div
                style={{
                  height: "max-content",
                  width: "100%",
                  maxHeight: "500px",
                }}
              >
                <ul
                  style={{
                    listStyle: "none",
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",

                    gap: "5px",
                    padding: 0,
                    maxHeight: "500px",
                    height: "max-content",
                    overflowX: "hidden",
                    width: "330px",

                    overflowY: "scroll",
                  }}
                  className="boletos__seleccionados"
                >
                  {cart.map((item) => (
                    <>
                      <li
                        key={item.id}
                        onClick={() => handleRemoveTicketFromCart(item.id)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#343A40",
                          padding: "5px",
                          width: "55px",
                          height: "30px",
                          borderRadius: "5px",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        {item.ticketNumber}
                      </li>

                      {item.oportunidades.map((oportunidad, index) => (
                        <li
                          key={`${item.id}-${index}`}
                          onClick={() => handleRemoveTicketFromCart(item.id)}
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#6FCF85",
                            padding: "5px",
                            width: "55px",
                            borderRadius: "5px",
                            color: "white",
                            textAlign: "center",
                            height: "30px",
                          }}
                        >
                          {oportunidad}
                        </li>
                      ))}
                    </>
                  ))}
                </ul>
              </div>
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
            style={{
              width: "500px",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "100px",
            }}
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
      <div style={{ height: "50px" }}></div>
      <FooterGlobal />
    </>
  );
};

export default SingleCarrito;
