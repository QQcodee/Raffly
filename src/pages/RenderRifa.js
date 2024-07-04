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
import HeaderGlobal from "../components/HeaderGlobal";
import FooterGlobal from "../components/FooterGlobal";
import LoadingBarRender from "../components/LoadingBarRender";
import Carousel from "../components/Carousel";

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
        console.log(data);
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
      <HeaderGlobal />

      <CustomAlertDialog
        open={open}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
      />

      <div className="background">
        <div className="content">
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            className="top-sec"
          >
            <div
              style={{ display: "flex", flexDirection: "column" }}
              className="top-izq"
            >
              <section className="tituloYFecha">
                <h1>{rifaDetails && rifaDetails.nombre}</h1>
                <p>Delicias/Chihuahua</p>

                {rifaDetails.fecharifa && (
                  <h2>Fecha del sorteo: (formatDate(rifaDetails.fecharifa))</h2>
                )}

                {rifaDetails.fecharifa === null ||
                rifaDetails.fecharifa === undefined ? (
                  <h2 style={{ color: "red" }}>
                    La fecha del sorteo sera fijada al liquidar 80% de los
                    boletos
                  </h2>
                ) : null}
              </section>
              <section
                style={{ marginTop: "30px" }}
                className="precioYContador"
              >
                <p>${rifaDetails && rifaDetails.precioboleto} MXN</p>

                {soldTickets ? (
                  <LoadingBarRender
                    boletosVendidos={soldTickets.length}
                    rifa={rifaDetails}
                  />
                ) : null}
              </section>

              {rifaDetails.fecharifa ? (
                <div className="contanier-counter">
                  <CountdownTimer
                    fecha={rifaDetails.fecharifa}
                    escala={window.innerWidth / 1000}
                  />
                </div>
              ) : null}

              <section className="tarjeta-verificado">
                <div
                  style={{
                    height: "130px",
                    width: "370px",
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
                      flexDirection: "column",
                      width: "30%",
                      textAlign: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {socioMetaData[0] && (
                      <img
                        style={{
                          width: "80px",
                          height: "80px",
                          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                          borderRadius: "50%",
                        }}
                        src={socioMetaData[0].image_url}
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
                        }}
                      >
                        Verificado
                      </p>
                      <img
                        style={{ width: "25px", height: "25px" }}
                        src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/verificado.png"
                      />
                    </div>

                    <p
                      style={{
                        fontSize: "10px",
                        marginTop: "-10px",
                        fontWeight: "bold",
                      }}
                    >
                      Certificado de Socio aprovado por Raffly
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <section
              style={{ display: "flex", justifyContent: "center" }}
              className="galeria"
            >
              <div className="contanier-img-principal">
                {rifaDetails.galeria ? (
                  <Carousel
                    images={[rifaDetails.galeria, rifaDetails.galeria]}
                    fecha={rifaDetails.fecharifa}
                  />
                ) : (
                  rifaDetails.img && (
                    <Carousel
                      images={[rifaDetails.img, rifaDetails.img]}
                      fecha={rifaDetails.fecharifa}
                    />
                  )
                )}
              </div>
            </section>
          </div>

          <section
            style={{ marginBottom: "80px", marginTop: "80px" }}
            className="premios"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#6FCF85",
                width: "165px",
                marginLeft: "-40px",
                paddingTop: "10px",
                paddingRight: "20px",

                borderRadius: "0 20px 20px 0",
                height: "40px",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  color: "white",
                  fontFamily: "Poppins",
                  fontSize: "24px",
                  fontWeight: "800",
                  marginLeft: "20px",
                }}
              >
                Premios
              </h3>
            </div>

            <div style={{ marginTop: "80px" }}>
              <ul
                style={{
                  listStyle: "none",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "32px",
                }}
                className="rifa-desc-render"
              >
                {descItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="tarjeta-verificado-mobile">
            <div
              style={{
                height: "130px",
                width: "370px",
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
                  flexDirection: "column",
                  width: "30%",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {socioMetaData[0] && (
                  <img
                    style={{
                      width: "80px",
                      height: "80px",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      borderRadius: "50%",
                    }}
                    src={socioMetaData[0].image_url}
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
                    }}
                  >
                    Verificado
                  </p>
                  <img
                    style={{ width: "25px", height: "25px" }}
                    src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/verificado.png"
                  />
                </div>

                <p
                  style={{
                    fontSize: "10px",
                    marginTop: "-10px",
                    fontWeight: "bold",
                  }}
                >
                  Certificado de Socio aprovado por Raffly
                </p>
              </div>
            </div>
          </section>
        </div>
        <div className="boletos-carrito">
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
          </div>
          {socioMetaData[0] ? (
            <div className="buy-button-container-mobile">
              <a
                href="#comprar"
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
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                {" "}
                Comprar
              </a>
            </div>
          ) : null}

          <div className="cart-section">
            <div id="comprar" className="cart-header">
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
              </div>
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

                {socioMetaData[0] ? (
                  <div className="buy-button-container-mobile">
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
                        marginTop: "20px",
                      }}
                    >
                      Comprar
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>

      <FooterGlobal />
    </>
  );
};

export default RenderRifa;

/*

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",

                marginTop: "60px",
                marginBottom: "20px",
                gap: "40px",
              }}
              className="premios"
            >
              <div
                style={{ display: "flex", transform: "scale(1.5)" }}
                className="primer-premio"
              >
                <img
                  style={{ width: "100px", height: "100px", zIndex: "10" }}
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/1st.png"
                ></img>
                <div
                  style={{
                    backgroundColor: "#212121",
                    width: "285px",
                    borderRadius: "15px",
                    marginLeft: "-60px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    display: "flex",
                  }}
                  className="1er-premio-texto"
                >
                  <div style={{ width: "70px" }}></div>
                  <p
                    style={{
                      color: "white",
                      maxWidth: "30ch",
                      fontFamily: "Poppins",
                      fontSize: "10px",
                      fontWeight: "800",
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",

                      marginTop: "10px",
                    }}
                  >
                    {rifaDetails.desc}
                  </p>
                </div>
              </div>

              <div
                style={{ display: "flex", transform: "scale(1.1)" }}
                className="segundo-premio"
              >
                <img
                  style={{ width: "100px", height: "100px", zIndex: "10" }}
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/2d.png"
                />
                <div
                  style={{
                    backgroundColor: "#212121",
                    width: "285px",
                    borderRadius: "15px",
                    marginLeft: "-60px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    display: "flex",
                  }}
                  className="2er-premio-texto"
                >
                  <div style={{ width: "100px" }}></div>
                  <p
                    style={{
                      color: "white",
                      maxWidth: "30ch",
                      fontFamily: "Poppins",
                      fontSize: "10px",
                      fontWeight: "800",

                      marginTop: "10px",
                    }}
                  >
                    Premio 2
                  </p>
                </div>
              </div>

              <div style={{ display: "flex" }} className="tercer-premio">
                <img
                  style={{ width: "100px", height: "100px", zIndex: "10" }}
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/3rd.png"
                />
                <div
                  style={{
                    backgroundColor: "#212121",
                    width: "285px",
                    borderRadius: "15px",
                    marginLeft: "-60px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    display: "flex",
                  }}
                  className="3er-premio-texto"
                >
                  <div style={{ width: "100px" }}></div>
                  <p
                    style={{
                      color: "white",
                      maxWidth: "30ch",
                      fontFamily: "Poppins",
                      fontSize: "10px",
                      fontWeight: "800",

                      marginTop: "10px",
                    }}
                  >
                    Premio 3
                  </p>
                </div>
              </div>
            </div>
          </section>

          */

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

/*

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

        */

/*CSS RENDER RIFA*/

/*

        .rifa-card {
  display: flex;
  justify-content: space-between;
  font-family: Arial, sans-serif;
  font-size: 16px;

  color: #333;
  border: 1px solid #cccccc10;

  max-width: 1500px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.288);
  margin: auto;
  margin-bottom: 80px;
}

.rifa-info-render {
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 600px;
}

.rifa-img {
  width: 900px;
  max-height: 500px;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  justify-content: center;
  align-items: center;
  display: flex;
}

.buy-button-container-mobile {
  display: none;
}

.rifa-img img {
  height: auto;
  width: 100%;
  object-fit: cover;
}

.rifa-tittle {
  display: flex;
  font-size: 16px;
  font-weight: 800;
  font-family: "Poppins";
  color: #000;
}

.divider-rifa-render {
  width: 100%;
  height: 1px;
  border-top: #000 2px solid;
}

.rifa-desc-render {
  height: 260px;
  max-height: calc(1.2em * 14);

  overflow: hidden;
  overflow-y: scroll;
}

.cart-section {
  margin: 20px auto;
  padding: 20px;
  width: 350px;
  text-align: left;
  height: 600px;
}

.cart-section h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.cart-section ul {
  list-style-type: none;
  padding-left: 20px;
  height: 330px;
  overflow-y: scroll;
}

.cart-section ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.cart-section ul li:last-child {
  border-bottom: none;
}

.cart-section ul li button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cart-section ul li button:hover {
  background-color: #c82333;
}

.cart-section p {
  font-size: 18px;
  font-weight: bold;
  text-align: right;
}

.random-ticket-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.random-ticket-button:hover {
  background-color: #0056b3;
}

.boletos-carrito {
  margin: auto;
  display: flex;
  font-family: Arial, sans-serif;
  font-size: 16px;

  color: #333;
  border: 1px solid #cccccc10;

  max-width: 1500px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.288);
}

.search-mobile {
  display: none;
}

@media (max-width: 768px) {
  .rifa-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: Arial, sans-serif;
    font-size: 16px;

    color: #333;
    border: 1px solid #cccccc10;

    max-width: 400px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.288);
    margin: auto;
    margin-bottom: 80px;
  }

  .rifa-info-render {
    display: flex;
    flex-direction: column;
    padding: 20px;
    width: 360px;
  }
  .rifa-info-render h2 {
    text-align: center;
  }

  .rifa-img {
    width: 360px;
    max-height: 300px;
    height: auto;
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    justify-content: center;
    align-items: center;
    display: flex;
  }

  .rifa-img img {
    height: auto;
    width: 100%;
    object-fit: cover;
  }

  .rifa-tittle {
    display: flex;
    flex-direction: column;
    font-size: 13px;
    font-weight: 800;
    font-family: "Poppins";
    color: #000;
    align-items: center;
  }

  .divider-rifa-render {
    width: 320px;
    height: 1px;
    border-top: #000 2px solid;
  }

  .rifa-desc-render {
    height: 250px;
    max-height: calc(1.2em * 9);
    overflow: hidden;
    overflow-y: scroll;
  }

  .cart-section {
    margin: 20px auto;
    padding: 20px;
    width: 350px;
    text-align: left;
    height: auto;
    max-height: 600px;
    margin-bottom: 30px;
  }

  .cart-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: #f5f5f5c4;
    margin-top: 20px;
    padding: 10px;
  }

  .cart-section h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .cart-section ul {
    list-style-type: none;
    padding-left: 20px;
    height: 350px;
    overflow-y: scroll;
  }

  .cart-section ul li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
  }

  .cart-section ul li:last-child {
    border-bottom: none;
  }

  .cart-section ul li button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .cart-section ul li button:hover {
    background-color: #c82333;
  }

  .cart-section p {
    font-size: 18px;
    font-weight: bold;
    text-align: right;
  }

  .random-ticket-button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .random-ticket-button:hover {
    background-color: #0056b3;
  }

  .boletos-carrito {
    margin: auto;
    display: flex;
    flex-direction: column;
    font-family: Arial, sans-serif;
    font-size: 16px;

    color: #333;
    border: 1px solid #cccccc10;

    max-width: 400px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.288);
  }

  .buy-button-container {
    display: none;
  }

  .buy-button-container-mobile {
    display: flex;
  }

  .search-container {
    display: none;
  }

  .search-mobile {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }
}


*/
