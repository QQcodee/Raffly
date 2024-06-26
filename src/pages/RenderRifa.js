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

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const CustomAlertDialog = ({ open, handleClose, handleConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Error Carrito"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          No puedes agregar boletos de diferentes rifas a la vez.
          <br />
          Puedes pagar los boletos que tienes seleccionados y despues agregar
          nuevos o puedes limpar el carrito y agregar los nuevos
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Pagar Boletos Seleccionados
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          Limpiar Carrito
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const RenderRifa = () => {
  const { id, user_id, nombre_negocio } = useParams();
  const navigate = useNavigate();
  const { addItem, cart, removeItem, clearCart } = useCart(); // Destructure cart instead of cartItems
  const [rifaDetails, setRifaDetails] = useState([]);
  const [socioMetaData, setSocioMetaData] = useState([]);
  const [soldTickets, setSoldTickets] = useState([]);

  const [descItems, setDescItems] = useState([]);

  const [open, setOpen] = useState(false);

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

  //const columnCount = 20; // Number of tickets per row
  //const rowCount = Math.ceil(rifaDetails.numboletos / columnCount); // Total rows needed for the tickets

  const [selectedTickets, setSelectedTickets] = useState({});

  //const ticketNumbersArray = cart.map((item) => item.ticketNumber);

  const handleAddTicketToCart = (ticketNumber) => {
    // Check if the ticket is already selected or sold
    if (selectedTickets[ticketNumber] || soldTickets.includes(ticketNumber)) {
      // If ticket is already selected or sold, do nothing
      return;
    }

    // Check if there are items in the cart
    if (cart.length > 0) {
      // Get the raffle ID of the first item in the cart
      const existingRaffleId = cart[0].raffleId;
      // Check if the new item's raffle ID matches the existing one
      if (rifaDetails.id !== existingRaffleId) {
        // If it doesn't match, do nothing or show an alert
        setOpen(true);

        return;
      }
    }

    // Mark the ticket as selected
    setSelectedTickets((prev) => ({ ...prev, [ticketNumber]: true }));
    setSearchQuery("");

    // Add the item to the cart
    addItem({
      raffleId: rifaDetails.id,
      ticketNumber,
      price: rifaDetails.precioboleto,
      raffleName: rifaDetails.nombre,
      rifa: rifaDetails,
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

    if (ticketNumber > rifaDetails.numboletos) {
      return null; // Don't render anything if the ticket number exceeds the number of boletos
    }

    const isSelected = selectedTickets[ticketNumber]; // Check if the ticket is selected
    const isSold = soldTickets.includes(ticketNumber); // Check if the ticket is sold
    const buttonStyle = isSelected
      ? { backgroundColor: "grey", color: "white" }
      : isSold
      ? { backgroundColor: "black", color: "black" }
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

  const handleClose = () => {
    setOpen(false);
    navigate(
      "/" +
        encodeURIComponent(
          socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
        ) +
        "/" +
        encodeURIComponent(socioMetaData[0].user_id.replace(/\s+/g, "-")) +
        "/carrito"
    );
  };

  const handleConfirm = () => {
    clearCart(); // Clear the cart

    setOpen(false);
  };

  const [columnCount, setColumnCount] = useState(3);
  const [columnWidth, setColumnWidth] = useState(200);
  const [rowHeight, setRowHeight] = useState(200);
  const [responsiveWidth, setresponsiveWidth] = useState(1150);

  useEffect(() => {
    const updateGridLayout = () => {
      const width = window.innerWidth;

      if (width <= 768) {
        setColumnCount(7);
        setColumnWidth(50); // 32px padding
        setRowHeight(40);
        setresponsiveWidth(370);
      } else if (width <= 1400) {
        setColumnCount(15);
        setColumnWidth(55); // 16px gap
        setRowHeight(50);
        setresponsiveWidth(700);
      } else {
        setColumnCount(20);
        setColumnWidth(55); // 32px gap
        setRowHeight(50);
        setresponsiveWidth(1150);
      }
    };

    updateGridLayout();
    window.addEventListener("resize", updateGridLayout);

    return () => {
      window.removeEventListener("resize", updateGridLayout);
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState("");

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const handleSearch = () => {
    const ticketNumber = parseInt(searchQuery, 10);
    if (isNaN(ticketNumber)) {
      setSearchResult("");
      return;
    }
    if (ticketNumber > rifaDetails.numboletos) {
      setSearchResult("Este boleto no existe.");
    } else if (soldTickets.includes(ticketNumber)) {
      setSearchResult(`El boleto ${ticketNumber} ya se vendio.`);
    } else if (cart.some((item) => item.ticketNumber === ticketNumber)) {
      setSearchResult(`El boleto ${ticketNumber} ya fue agregado.`);
    } else {
      setSearchResult(
        <button
          className="num-boletos"
          onClick={() => handleAddTicketToCart(ticketNumber)}
        >
          Agrear boleto {ticketNumber} al carrito
        </button>
      );
    }
  };

  return (
    <>
      <div>
        <HeaderSocios socioMetaData={socioMetaData} />
        <CustomAlertDialog
          open={open}
          handleClose={handleClose}
          handleConfirm={handleConfirm}
        />

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

                <h2 className="rifa-price">${rifaDetails.precioboleto} mxn</h2>

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
            <div className="cart-header">
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "24px",
                }}
              >
                Carrito {cart.length > 0 ? <>({cart.length}) </> : null}{" "}
              </h2>
              <p style={{ textAlign: "center" }}>
                Total a pagar: ${totalAmount.toFixed(0)}
              </p>
              <button
                className="random-ticket-button"
                onClick={handleSelectRandomTicket}
              >
                Agregar boleto aleatorio
              </button>

              <div className="search-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar boleto por numero"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    width: "100%",
                    maxWidth: "300px",
                  }}
                />
                <div>{searchResult}</div>
                {/* Other component code */}
              </div>
              {socioMetaData[0] ? (
                <div className="buy-button-container-mobile">
                  <button
                    className="buy-button"
                    onClick={() => {
                      navigate(
                        "/" +
                          encodeURIComponent(
                            socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                          ) +
                          "/" +
                          encodeURIComponent(
                            socioMetaData[0].user_id.replace(/\s+/g, "-")
                          ) +
                          "/carrito"
                      );
                    }}
                    style={{
                      backgroundColor: socioMetaData[0].color,
                      color: "white",
                      borderRadius: "15px",
                      border: "none",
                      padding: "10px 20px",
                      fontSize: "16px",
                      cursor: "pointer",
                      width: "100%",
                      marginTop: "20px",
                    }}
                  >
                    Comprar
                  </button>
                </div>
              ) : null}
            </div>
            {cart.length === 0 ? (
              <p style={{ textAlign: "center", fontWeight: "400" }}>
                Ningun boleto seleccionado
              </p>
            ) : (
              <>
                <ul>
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
                {socioMetaData[0] ? (
                  <div className="buy-button-container">
                    <button
                      className="buy-button"
                      onClick={() => {
                        navigate(
                          "/" +
                            encodeURIComponent(
                              socioMetaData[0].nombre_negocio.replace(
                                /\s+/g,
                                "-"
                              )
                            ) +
                            "/" +
                            encodeURIComponent(
                              socioMetaData[0].user_id.replace(/\s+/g, "-")
                            ) +
                            "/carrito"
                        );
                      }}
                      style={{
                        backgroundColor: socioMetaData[0].color,
                        color: "white",
                        borderRadius: "15px",
                        border: "none",
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      Comprar
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>

          <Grid
            className="boletos-grid"
            columnCount={columnCount}
            overscanRowCount={5}
            style={{ border: "none", overflowX: "hidden" }}
            columnWidth={columnWidth}
            height={600}
            rowCount={Math.ceil(rifaDetails.numboletos / columnCount)}
            rowHeight={rowHeight}
            width={responsiveWidth}
          >
            {Cell}
          </Grid>
          <div className="search-mobile">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar boleto por numero"
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "100%",
                maxWidth: "300px",
              }}
            />
            <div>{searchResult}</div>
            {/* Other component code */}
          </div>
          {socioMetaData[0] ? (
            <div className="buy-button-container-mobile">
              <button
                className="buy-button"
                onClick={() => {
                  navigate(
                    "/" +
                      encodeURIComponent(
                        socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                      ) +
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].user_id.replace(/\s+/g, "-")
                      ) +
                      "/carrito"
                  );
                }}
                style={{
                  backgroundColor: socioMetaData[0].color,
                  color: "white",
                  borderRadius: "15px",
                  border: "none",
                  padding: "10px 20px",
                  fontSize: "16px",
                  cursor: "pointer",
                  width: "100%",
                  marginTop: "20px",
                }}
              >
                Comprar
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default RenderRifa;

/*
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
         */
