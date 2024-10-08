import CountdownTimer from "../components/CountdownTimer";
import FooterGlobal from "../components/FooterGlobal";
import HeaderGlobal from "../components/HeaderGlobal";
import LoadingBarRender from "../components/LoadingBarRender";
import "./RifaSingle.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { FixedSizeGrid as Grid } from "react-window";
import { useCart } from "../CartContext"; // Import useCart
import { useRef } from "react";

import HeaderHome from "../components/HeaderHome";
import HeaderSocios from "../components/HeaderSocios";
import Form from "./Form";
import BoletosForm from "../components/BoletosForm";

//import RenderRifa.css

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Carousel from "../components/Carousel";
import SlotMachine from "../components/SlotMachine";

const Popup = ({ handleClose, show, children }) => {
  return (
    <div className={`popup ${show ? "show" : ""}`}>
      <div className="popup-inner">
        <p
          style={{ fontSize: "20px", fontFamily: "poppins" }}
          className="close-btn"
          onClick={handleClose}
        >
          <i className="material-icons">close</i>
        </p>
        {children}
      </div>
    </div>
  );
};

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

const RifaSingle = () => {
  const { id, user_id, nombre_negocio } = useParams();
  const navigate = useNavigate();
  const { addItem, cart, removeItem, clearCart } = useCart();
  const [rifaDetails, setRifaDetails] = useState([]);
  const [socioMetaData, setSocioMetaData] = useState([]);
  const [soldTickets, setSoldTickets] = useState([]);

  const [descItems, setDescItems] = useState([]);

  const [open, setOpen] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const [columnCount, setColumnCount] = useState(7);
  const [columnWidth, setColumnWidth] = useState(50);
  const [rowHeight, setRowHeight] = useState(40);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const fetchRifas = async () => {
      const { data, error } = await supabase
        .from("rifas")
        .select()
        .eq("id", id)
        .eq("status", "true")
        .single();

      if (error) {
        console.log(error);
        navigate("/", { replace: true });
      }

      if (data) {
        setRifaDetails(data);
        //console.log(data);
        setDescItems(data.desc.split("\n"));
      }
    };
    fetchRifas();
    window.scrollTo(0, 0);
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
        .select("num_boletos")
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

  const [soldTicketsView, setSoldTicketsView] = useState([]);

  useEffect(() => {
    const fetchSoldTicketsView = async () => {
      if (!rifaDetails.id) return;

      const { data, error } = await supabase
        .from("boletos_view")
        .select()
        .eq("id_rifa", rifaDetails.id);

      if (error) {
        console.log(error);
      }
      if (
        data
          ? data[0].totalsold === undefined ||
            data[0].totalsold === null ||
            data[0].totalsold === 0
          : true
      ) {
        // Flatten the arrays of ticket numbers into a single array

        setSoldTicketsView(1);
      }
      if (data) {
        // Flatten the arrays of ticket numbers into a single array

        setSoldTicketsView(data[0].totalsold);
      }
    };
    fetchSoldTicketsView();
  }, [rifaDetails.id]);

  //const columnCount = 20; // Number of tickets per row
  //const rowCount = Math.ceil(rifaDetails.numboletos / columnCount); // Total rows needed for the tickets

  const [selectedTickets, setSelectedTickets] = useState({});

  //const ticketNumbersArray = cart.map((item) => item.ticketNumber);

  const handleAddTicketToCart = (ticketNumber) => {
    const oportunidades = [];
    for (let i = 2; i <= rifaDetails.oportunidades; i++) {
      oportunidades.push(rifaDetails.numboletos * (i - 1) + ticketNumber);
    }

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
      oportunidades: oportunidades,
    });
  };

  const handleRemoveTicketFromCart = (itemId) => {
    setSelectedTickets((prev) => {
      const newSelectedTickets = { ...prev };

      // Loop through the cart to find items with the specified itemId
      cart.forEach((item) => {
        if (item.id === itemId) {
          delete newSelectedTickets[item.ticketNumber];
        }
      });

      return newSelectedTickets;
    });

    // Remove all items with the specified itemId from the cart
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

  const handleSelectRandomTickets = (quantity) => {
    clearCart();
    setSelectedTickets({});
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

    const selectedRandomTickets = [];
    while (
      selectedRandomTickets.length < quantity &&
      availableTickets.length > 0
    ) {
      const randomIndex = Math.floor(Math.random() * availableTickets.length);
      const randomTicket = availableTickets.splice(randomIndex, 1)[0];
      selectedRandomTickets.push(randomTicket);
    }

    selectedRandomTickets.forEach((ticket) => handleAddTicketToCart(ticket));
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

  useEffect(() => {
    const updateGridLayout = () => {
      if (containerRef.current) {
        const newContainerWidth = containerRef.current.offsetWidth;
        const desiredColumnWidth = 55; // Desired width of each column in px
        const minColumnWidth = 55; // Minimum width of each column in px
        const maxColumns = Math.floor(newContainerWidth / minColumnWidth);
        const calculatedColumnCount = Math.floor(
          newContainerWidth / desiredColumnWidth
        );

        const newColumnCount = Math.min(calculatedColumnCount, maxColumns);
        const newColumnWidth = newContainerWidth / newColumnCount;

        setColumnCount(newColumnCount - 1);
        setColumnWidth(newColumnWidth);
        setRowHeight(40);
        setContainerWidth(newContainerWidth);
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
          className="boleto__agregar"
          onClick={() => handleAddTicketToCart(ticketNumber)}
          style={{
            backgroundColor: "#6FCF85",
            color: "white",
            fontSize: "16px",
            fontWeight: "500",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Agrear boleto {ticketNumber} al carrito
        </button>
      );
    }
  };

  const formatDate = (dateValue) => {
    const date = new Date(dateValue); // Convert to Date object
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="rifa__background">
        <HeaderGlobal />
        <CustomAlertDialog
          open={open}
          handleClose={handleClose}
          handleConfirm={handleConfirm}
        />

        <div className="container__rifa">
          <div className="rifa__details">
            <h1>{rifaDetails.nombre} </h1>
            <h2>{socioMetaData[0] ? socioMetaData[0].estado : null}</h2>

            {rifaDetails.fecharifa === null ||
            rifaDetails.fecharifa === undefined ? (
              <h3 style={{ color: "red" }}>
                La fecha del sorteo sera fijada al liquidar 80% de los boletos
              </h3>
            ) : null}
            {rifaDetails.fecharifa && (
              <h3>Fecha del sorteo: {formatDate(rifaDetails.fecharifa)}</h3>
            )}
            <h4>${rifaDetails.precioboleto} MXN</h4>

            {rifaDetails.fecharifa ? (
              <div className="contanier-counter">
                <CountdownTimer fecha={rifaDetails.fecharifa} />
              </div>
            ) : null}

            <section className="tarjeta__verificado">
              <div
                style={{
                  height: "130px",
                  width: "100%",
                  maxWidth: "370px",
                  backgroundImage: `url(https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/Tarjeta_oro.png)`,
                  borderRadius: "9px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",

                    width: "30%",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "10px",
                  }}
                >
                  <img
                    style={{
                      width: "80px",
                      height: "80px",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      borderRadius: "50%",
                    }}
                    src={socioMetaData[0] && socioMetaData[0].image_url}
                  />
                  {socioMetaData[0] && (
                    <img
                      style={{
                        width: "25px",
                        height: "25px",
                        position: "relative",
                        top: "30px",
                        left: "-25px",
                      }}
                      src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/verificado.png"
                    />
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "70%",
                    marginTop: "-20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",

                      alignItems: "center",

                      gap: "5px",
                    }}
                  >
                    <p
                      style={{
                        marginTop: "30px",
                        fontSize: "21px",
                        textTransform: "uppercase",
                        fontWeight: "bold",

                        color: "black",

                        fontFamily: "Poppins",
                        textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      Verificado
                    </p>
                  </div>

                  <p
                    style={{
                      fontSize: "17px",
                      marginTop: "-10px",
                      fontWeight: "500",
                    }}
                  >
                    Certificado de Socio aprovado por Raffly
                  </p>
                </div>
              </div>
            </section>
          </div>
          <div className="rifa__galeria">
            {rifaDetails.galeria ? (
              rifaDetails.galeria.length === 1 ? (
                <Carousel
                  images={[rifaDetails.galeria, rifaDetails.galeria]}
                  fecha={rifaDetails.fecharifa}
                />
              ) : (
                <Carousel
                  images={rifaDetails.galeria}
                  fecha={rifaDetails.fecharifa}
                />
              )
            ) : (
              rifaDetails.img && (
                <Carousel
                  images={[rifaDetails.img, rifaDetails.img]}
                  fecha={rifaDetails.fecharifa}
                />
              )
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
            marginBottom: "80px",

            width: "90vw",
            position: "relative",

            left: "5vw",
          }}
        >
          {soldTicketsView ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <h6 style={{ marginTop: "0px" }}>Boletos vendidos</h6>
                <LoadingBarRender
                  boletosVendidos={soldTicketsView}
                  rifa={rifaDetails}
                />
              </div>
            </>
          ) : null}
        </div>

        <div className="premios__lable">
          <h3>Premios</h3>
        </div>

        <div
          style={{
            height: "max-content",

            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
          className="premios__container"
        >
          <ul
            style={{
              listStyle: "none",
              paddingLeft: "20px",
              paddingRight: "20px",

              fontFamily: "Poppins",

              marginTop: "80px",
            }}
            className="rifa-desc-render"
          >
            <p> Descripcion premios:</p>
            <hr
              style={{
                border: "1px solid black",
                width: "40%",
                position: "relative",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
            {descItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="carrito__container">
          <div style={{ display: "flex" }}>
            <div className="carrito__content">
              <h1>Carrito</h1>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <h2>Generar boletos</h2>
                <select
                  style={{
                    marginLeft: "20px",
                    maxWidth: "40px",
                    maxHeight: "40px",
                    overflowY: "auto",
                  }}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>

                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>

                  <option value="9">9</option>

                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>

              <div style={{ maxWidth: "300px" }} className="search__container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar boleto por numero"
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    width: "220px",
                    maxWidth: "300px  ",
                  }}
                />
              </div>

              {searchResult ? (
                <div>{searchResult}</div>
              ) : (
                <h3>Boletos Seleccionados:</h3>
              )}

              <div style={{ height: "150px" }}>
                <ul
                  style={{
                    listStyle: "none",
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "5px",
                    padding: 0,
                    maxHeight: "150px",

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
                          }}
                        >
                          {oportunidad}
                        </li>
                      ))}
                    </>
                  ))}
                </ul>
              </div>

              <p
                style={{
                  textAlign: "center",
                  fontWeight: "500",
                  fontSize: "20px",
                }}
              >
                Total a pagar: ${totalAmount.toFixed(0)}
              </p>

              {socioMetaData[0] ? (
                cart.length === 0 ? null : (
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
                      backgroundColor: "#6FCF85",
                      color: "white",
                      borderRadius: "15px",
                      border: "none",
                      padding: "10px 20px",
                      fontSize: "17px",
                      cursor: "pointer",
                      width: "300px",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    Comprar
                  </button>
                )
              ) : null}
            </div>

            <div className="slot__machine">
              <img
                style={{
                  position: "relative",
                  left: "-2px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  togglePopup();
                }}
                src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slot_machine.png"
              ></img>
            </div>
          </div>

          <div className="maquinita-suerte-desktop">
            <Popup show={showPopup} handleClose={togglePopup}>
              <h2
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "32px",
                  marginBottom: "20px",
                }}
              >
                Maquinita de la Suerte
              </h2>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {" "}
                <SlotMachine columnas={5} />
              </div>
              {cart.length !== 0 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <h3 style={{ textAlign: "center" }}>Boletos Generados</h3>
                    <select
                      type="number"
                      style={{
                        marginLeft: "20px",
                        width: "auto",

                        height: "auto",
                      }}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>

                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>

                      <option value="9">9</option>

                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                    </select>{" "}
                  </div>

                  <h5 style={{ textAlign: "center" }}>
                    {rifaDetails.oportunidades} oportunidades por boleto
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <button
                      style={{ backgroundColor: "#343A40", cursor: "default" }}
                    >
                       
                    </button>
                    Boleto Principal
                    <button
                      style={{ backgroundColor: "#6FCF85", cursor: "default" }}
                    >
                       
                    </button>
                    Oportunidades
                  </div>
                  <h6
                    style={{
                      textAlign: "center",
                      marginBottom: "15px",
                      color: "red",
                    }}
                  >
                    Click en los boletos que quieras eliminar
                  </h6>
                  <ul
                    style={{
                      listStyle: "none",
                      display: "grid",
                      gridTemplateColumns: "repeat(10, 1fr)",
                      gap: "5px",
                      padding: 0,
                      maxHeight: "200px",

                      overflowY: "scroll",
                    }}
                    className="boletos__seleccionados"
                  >
                    {cart.map((item, itemIndex) => (
                      <>
                        <li
                          key={item.id}
                          onClick={() => handleRemoveTicketFromCart(item.id)}
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#343A40",
                            padding: "5px",
                            width: "55px",
                            borderRadius: "5px",
                            color: "white",
                            textAlign: "center",
                            opacity: "0",
                            "--index": itemIndex,
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
                              opacity: "0",
                              "--index": itemIndex,
                            }}
                          >
                            {oportunidad}
                          </li>
                        ))}
                      </>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => {
                    handleSelectRandomTickets(quantity);
                  }}
                  style={{
                    backgroundColor: "#343A40",
                    color: "white",
                    borderRadius: "5px",
                    border: "none",

                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "10px 20px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    fontWeight: "600",
                    fontFamily: "Poppins",
                  }}
                >
                  Generar boletos
                </button>
                {cart.length !== 0 ? (
                  <button
                    style={{
                      color: "white",
                      borderRadius: "5px",
                      border: "none",

                      cursor: "pointer",
                      fontSize: "16px",
                      padding: "10px 20px",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      fontWeight: "600",
                      fontFamily: "Poppins",
                    }}
                    onClick={togglePopup}
                  >
                    Mantener Boletos
                  </button>
                ) : null}
              </div>
            </Popup>
          </div>

          <div className="maquinita-suerte-mobile">
            <Popup show={showPopup} handleClose={togglePopup}>
              {" "}
              <h2
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "32px",
                  marginBottom: "20px",
                }}
              >
                Maquinita de la Suerte
              </h2>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {" "}
                <SlotMachine columnas={3} />
              </div>
              {cart.length !== 0 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <h3 style={{ textAlign: "center" }}>Boletos Generados</h3>
                    <select
                      style={{ marginLeft: "20px", maxWidth: "40px" }}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>

                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>

                      <option value="9">9</option>

                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                    </select>{" "}
                  </div>

                  <h5 style={{ textAlign: "center" }}>
                    {rifaDetails.oportunidades} oportunidades por boleto
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <button
                      style={{ backgroundColor: "#343A40", cursor: "default" }}
                    >
                       
                    </button>
                    Boleto Principal
                    <button
                      style={{ backgroundColor: "#6FCF85", cursor: "default" }}
                    >
                       
                    </button>
                    Oportunidades
                  </div>
                  <h6
                    style={{
                      textAlign: "center",
                      marginBottom: "15px",
                      color: "red",
                    }}
                  >
                    Click en los boletos que quieras eliminar
                  </h6>
                  <ul
                    style={{
                      listStyle: "none",
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 1fr)",
                      gap: "5px",
                      padding: 0,
                      maxHeight: "150px",

                      overflowY: "scroll",
                    }}
                    className="boletos__seleccionados"
                  >
                    {cart.map((item, itemIndex) => (
                      <>
                        <li
                          key={item.id}
                          onClick={() => handleRemoveTicketFromCart(item.id)}
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#343A40",
                            padding: "5px",
                            width: "55px",
                            borderRadius: "5px",
                            color: "white",
                            textAlign: "center",
                            opacity: "0",
                            "--index": itemIndex,
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
                              opacity: "0",
                              "--index": itemIndex,
                            }}
                          >
                            {oportunidad}
                          </li>
                        ))}
                      </>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => {
                    handleSelectRandomTickets(quantity);
                  }}
                  style={{
                    backgroundColor: "#343A40",
                    color: "white",
                    borderRadius: "5px",
                    border: "none",

                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "10px 20px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    fontWeight: "600",
                    fontFamily: "Poppins",
                  }}
                >
                  Generar boletos
                </button>
                {cart.length !== 0 ? (
                  <button
                    style={{
                      color: "white",
                      borderRadius: "5px",
                      border: "none",

                      cursor: "pointer",
                      fontSize: "16px",
                      padding: "10px 20px",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      fontWeight: "600",
                      fontFamily: "Poppins",
                    }}
                    onClick={togglePopup}
                  >
                    Mantener Boletos
                  </button>
                ) : null}
              </div>
            </Popup>
          </div>

          <div className="contenedor-grid-boletos">
            <h6>
              {" "}
              Boletos disponibles : {rifaDetails.numboletos - soldTicketsView}
            </h6>
          </div>

          <div className="grid__boletos" ref={containerRef}>
            <Grid
              className="boletos-grid"
              columnCount={columnCount}
              overscanRowCount={5}
              style={{ border: "none", overflowX: "hidden" }}
              columnWidth={columnWidth}
              height={600}
              rowCount={Math.ceil(rifaDetails.numboletos / columnCount)}
              rowHeight={rowHeight}
              width={containerWidth}
            >
              {Cell}
            </Grid>
          </div>
        </div>
      </div>

      {cart.length > 0 ? (
        <button
          className="buy_button_mobile"
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
            backgroundColor: "#007BFF",
            color: "white",
            borderRadius: "15px",
            border: "none",
            padding: "10px 20px",
            fontSize: "17px",
            cursor: "pointer",
            width: "300px",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            fontSize: "30px",
            fontWeight: "500",
          }}
        >
          Comprar
        </button>
      ) : null}
      <FooterGlobal />
    </>
  );
};

export default RifaSingle;
