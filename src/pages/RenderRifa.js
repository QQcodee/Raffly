import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { FixedSizeGrid as Grid } from "react-window";
import { useCart } from "../CartContext"; // Import useCart
import { useUser } from "../UserContext";

import "../css/index.css";
import HeaderHome from "../components/HeaderHome";
import HeaderSocios from "../components/HeaderSocios";
import Form from "./Form";

const RenderRifa = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [rifaDetails, setRifaDetails] = useState([]);

  const [socioMetaData, setSocioMetaData] = useState([]);

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
        setRifaDetails({
          id: data.id,
          nombre: data.nombre,
          desc: data.desc,
          precioboleto: data.precioboleto,
          numboletos: data.numboletos,
          socio: data.socio,
          img: data.img,
          user_id: data.user_id,
        });
      }
    };
    fetchRifas();
  }, [id, navigate]);

  useEffect(() => {
    const fetchUserMetaData = async () => {
      const { data, error } = await supabase
        .from("user_metadata")
        .select()
        .eq("user_id", rifaDetails.user_id);

      if (error) {
        console.log(error);
      }
      if (data) {
        setSocioMetaData(data);

        console.log(data);
      }
    };
    fetchUserMetaData();
  }, [rifaDetails]);

  const columnCount = 30; // Number of tickets per row
  const rowCount = Math.ceil(rifaDetails.numboletos / columnCount); // Total rows needed for the tickets

  const [selectedTickets, setSelectedTickets] = useState({});

  const handleAddTicketToCart = (ticketNumber) => {
    if (selectedTickets[ticketNumber]) {
      // If ticket is already selected, do nothing
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

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const ticketNumber = rowIndex * columnCount + columnIndex + 1;
    const isSelected = selectedTickets[ticketNumber]; // Check if the ticket is selected
    const buttonStyle = isSelected
      ? { backgroundColor: "black", color: "black" }
      : {};

    return (
      <div style={style}>
        <button
          className="num-boletos"
          onClick={() => handleAddTicketToCart(ticketNumber)}
          style={buttonStyle}
          disabled={isSelected} // Disable the button if it is selected
        >
          {ticketNumber}
        </button>
      </div>
    );
  };

  const numbers = useMemo(() => {
    return Array.from(
      { length: rifaDetails.numboletos },
      (_, index) => index + 1
    );
  }, [rifaDetails.numboletos]);

  //console.log(socioMetaData[0].image_url);

  return (
    <>
      <div>
        <HeaderHome textdecoration="none" />
        <HeaderSocios socioMetaData={socioMetaData} />
        <div align="center" className="body-rifa">
          <h1>{rifaDetails.nombre}</h1>
          <img height={300} src={rifaDetails.img} alt={rifaDetails.nombre} />
          <p>{rifaDetails.desc}</p>
          <p>${rifaDetails.precioboleto} per ticket</p>
          <p>{rifaDetails.numboletos} tickets available</p>
          <p>Organized by {rifaDetails.socio}</p>
        </div>

        <Grid
          className="boletos-grid"
          columnCount={columnCount}
          columnWidth={55}
          height={600}
          rowCount={rowCount}
          rowHeight={50}
          overscanRowCount={5}
          width={1650}
        >
          {Cell}
        </Grid>

        <Form
          precioBoleto={rifaDetails.precioboleto}
          descripcion={
            "Ticket:" + rifaDetails.nombre + "(" + rifaDetails.id + ")"
          }
        />
      </div>
    </>
  );
};

export default RenderRifa;
