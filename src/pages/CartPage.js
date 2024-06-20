import React from "react";
import { useCart } from "../CartContext";

import HeaderHome from "../components/HeaderHome";
import { useState } from "react";
import supabase from "../config/supabaseClient";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//import CartPage.css
import "../css/CartPage.css";
import Form from "./Form";
const CartPage = () => {
  const { cart, removeItem, clearCart } = useCart();

  const [socioMetaData, setSocioMetaData] = useState([]);

  const [selectedTickets, setSelectedTickets] = useState({});

  // console.log(cart[0].rifa.nombre);
  //console.log(cart);

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
      if (!cart[0]) return;

      const { data, error } = await supabase
        .from("user_metadata")
        .select()
        .eq("user_id", cart[0].rifa.user_id);

      if (error) {
        console.log(error);
      }
      if (data) {
        setSocioMetaData(data);
      }
    };
    fetchUserMetaData();
  }, [cart[0]]);

  return (
    <>
      <HeaderHome cartCount={cart.length} />
      <h2>Carrito</h2>
      {cart[0] ? (
        <div className="carrito-card">
          <div className="cart-section">
            <h2>Carrito {cart.length > 0 ? <>({cart.length}) </> : null} </h2>
            <p>Total a pagar: ${totalAmount.toFixed(0)}</p>

            {cart.length === 0 ? (
              <p>Ningun boleto seleccionado</p>
            ) : (
              <>
                <ul>
                  {cart.map((item) => (
                    <li key={item.id}>
                      Boleto #{item.ticketNumber} - ${item.price}
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
          </div>

          <div className="form-checkout">
            <Form
              precioBoleto={cart.price}
              rifa={cart[0].rifa}
              totalAmount={totalAmount}
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
          </div>
        </div>
      ) : (
        <>
          <div className="carrito-card">
            <p>No hay boletos en el carrito pongase a jalar</p>
            <button
              onClick={() =>
                navigate(
                  "/" +
                    encodeURIComponent(
                      socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                    ) +
                    "/" +
                    encodeURIComponent(
                      socioMetaData[0].user_id.replace(/\s+/g, "-")
                    )
                )
              }
            >
              Ir a rifas Activas
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default CartPage;
