import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { FixedSizeGrid as Grid } from "react-window";
import { useCart } from "../CartContext"; // Import useCart

import HeaderHome from "../components/HeaderHome";
import HeaderSocios from "../components/HeaderSocios";
import Form from "./Form";
import BoletosForm from "../components/BoletosForm";

//import RenderRifa.css
import "../css/RenderRifa.css";
import CountdownTimer from "../components/CountdownTimer";
import LoadingBar from "../components/LoadingBar";

const RenderRifa = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, cart, removeItem } = useCart(); // Destructure cart instead of cartItems
  const [rifaDetails, setRifaDetails] = useState([]);
  const [socioMetaData, setSocioMetaData] = useState([]);
  const [soldTickets, setSoldTickets] = useState([]);

  const [descItems, setDescItems] = useState([]);

  useEffect(() => {
    const fetchRifas = async () => {
      const { data, error } = await supabase
        .from("rifas")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        navigate("/", { replace: true });
      }

      if (data) {
        setRifaDetails(data);
        setDescItems(data.desc.split("\n"));
      }
    };
    fetchRifas();
  }, [id, navigate]);

  useEffect(() => {
    const fetchUserMetaData = async () => {
      if (!rifaDetails.user_id) return;

      const { data, error } = await supabase
        .from("user_metadata")
        .select()
        .eq("user_id", rifaDetails.user_id);

      if (error) {
        console.log(error);
      }
      if (data) {
        setSocioMetaData(data);
      }
    };
    fetchUserMetaData();
  }, [rifaDetails.user_id]);

  useEffect(() => {
    const fetchSoldTickets = async () => {
      if (!rifaDetails.id) return;

      const { data, error } = await supabase
        .from("boletos")
        .select()
        .eq("id_rifa", rifaDetails.id);

      if (error) {
        console.log(error);
      }
      if (data) {
        // Flatten the arrays of ticket numbers into a single array
        const soldTicketsArray = data.reduce((acc, ticket) => {
          return acc.concat(ticket.num_boletos);
        }, []);
        setSoldTickets(soldTicketsArray);
      }
    };
    fetchSoldTickets();
  }, [rifaDetails.id]);

  const columnCount = 20; // Number of tickets per row
  const rowCount = Math.ceil(rifaDetails.numboletos / columnCount); // Total rows needed for the tickets

  const [selectedTickets, setSelectedTickets] = useState({});

  const ticketNumbersArray = cart.map((item) => item.ticketNumber);

  const handleAddTicketToCart = (ticketNumber) => {
    if (selectedTickets[ticketNumber] || soldTickets.includes(ticketNumber)) {
      // If ticket is already selected or sold, do nothing
      return;
    }
    // Mark the ticket as selected
    setSelectedTickets((prev) => ({ ...prev, [ticketNumber]: true }));

    addItem({
      raffleId: rifaDetails.id,
      ticketNumber,
      price: rifaDetails.precioboleto,
      raffleName: rifaDetails.nombre,
    });
  };

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

  const handleSelectRandomTicket = () => {
    const availableTickets = Array.from(
      { length: rifaDetails.numboletos },
      (_, i) => i + 1
    ).filter(
      (ticketNumber) =>
        !soldTickets.includes(ticketNumber) && !selectedTickets[ticketNumber]
    );

    if (availableTickets.length === 0) {
      return;
    }

    const randomTicket =
      availableTickets[Math.floor(Math.random() * availableTickets.length)];
    handleAddTicketToCart(randomTicket);
  };

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const ticketNumber = rowIndex * columnCount + columnIndex + 1;
    const isSelected = selectedTickets[ticketNumber]; // Check if the ticket is selected
    const isSold = soldTickets.includes(ticketNumber); // Check if the ticket is sold
    const buttonStyle = isSelected
      ? { backgroundColor: "black", color: "white" }
      : isSold
      ? { backgroundColor: "grey", color: "grey" }
      : {};

    return (
      <div style={style}>
        <button
          className="num-boletos"
          onClick={() => handleAddTicketToCart(ticketNumber)}
          style={buttonStyle}
          disabled={isSelected || isSold} // Disable the button if it is selected or sold
        >
          {ticketNumber}
        </button>
      </div>
    );
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <>
      <div>
        <HeaderHome textdecoration="none" />
        <HeaderSocios socioMetaData={socioMetaData} />

        {rifaDetails.fecharifa ? (
          <>
            <div className="rifa-card">
              <div className="rifa-info-render">
                <div className="rifa-tittle">
                  <h1>{rifaDetails.nombre}</h1>
                  {socioMetaData[0] ? (
                    <CountdownTimer
                      fecha={rifaDetails.fecharifa}
                      color={socioMetaData[0].color}
                    />
                  ) : null}
                </div>

                <h2>${rifaDetails.precioboleto} / numero</h2>

                <hr className="divider-rifa-render" />

                <div className="rifa-description">
                  <ul className="rifa-desc-render">
                    {descItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <div className="rifa-loadingbar">
                    {" "}
                    <LoadingBar
                      boletosVendidos={soldTickets.length}
                      rifa={rifaDetails}
                    />
                  </div>
                </div>
              </div>

              <div className="rifa-img">
                <img src={rifaDetails.img} />
              </div>
            </div>
          </>
        ) : null}

        <div className="boletos-carrito">
          <div className="cart-section">
            <h2>Carrito {cart.length > 0 ? <>({cart.length}) </> : null} </h2>
            <p>Total a pagar: ${totalAmount.toFixed(0)}</p>
            <button
              className="random-ticket-button"
              onClick={handleSelectRandomTicket}
            >
              Agregar boleto aleatorio
            </button>
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
          <Grid
            className="boletos-grid"
            columnCount={columnCount}
            columnWidth={55}
            height={600}
            rowCount={rowCount}
            rowHeight={50}
            overscanRowCount={5}
            width={1150}
            style={{ border: "none", overflowX: "hidden" }}
          >
            {Cell}
          </Grid>
        </div>

        {rifaDetails && socioMetaData[0] ? (
          <Form
            precioBoleto={rifaDetails.precioboleto}
            rifa={rifaDetails}
            totalAmount={totalAmount}
            stripe_id={socioMetaData[0].stripe_id}
            descripcion={
              "Ticket:" +
              rifaDetails.nombre +
              "(" +
              rifaDetails.id +
              ")" +
              "Numeros:" +
              ticketNumbersArray
            }
          />
        ) : null}
      </div>
    </>
  );
};

export default RenderRifa;
