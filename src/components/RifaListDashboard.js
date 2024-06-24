import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { useUser } from "../UserContext";
import { useEffect } from "react";

//components
import LoadingBar from "./LoadingBar";

//css
import "../css/RifaList.css";

const RifaList = ({ rifa }) => {
  const [soldTickets, setSoldTickets] = useState([]);

  const navigate = useNavigate();

  const [isBackContainerHovered, setIsBackContainerHovered] = useState(false);

  const handleToggleHover = () => {
    setIsBackContainerHovered(!isBackContainerHovered);
  };

  const handleCLick = () => {
    navigate(
      "/" +
        encodeURIComponent(rifa.socio.replace(/\s+/g, "-")) +
        "/" +
        encodeURIComponent(rifa.nombre.replace(/\s+/g, "-")) +
        "/" +
        rifa.id +
        "/" +
        rifa.user_id
    );
  };

  const descItems = rifa.desc.split("\n");

  useEffect(() => {
    const fetchSoldTickets = async () => {
      if (!rifa.id) return;

      const { data, error } = await supabase
        .from("boletos")
        .select()
        .eq("id_rifa", rifa.id);

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
  }, [rifa.id]);

  const [socioMetaData, setSocioMetaData] = useState([]);

  useEffect(() => {
    const fetchUserMetaData = async () => {
      const { data, error } = await supabase
        .from("user_metadata")
        .select()
        .eq("user_id", rifa.user_id);

      if (error) {
        console.log(error);
      }
      if (data) {
        setSocioMetaData(data);
      }
    };
    fetchUserMetaData();
  }, [rifa.socio]);

  return (
    <>
      {socioMetaData[0] ? (
        <div
          className={`listing-container ${
            isBackContainerHovered ? "hovered" : ""
          }`}
        >
          {/* Back container */}
          <div className="back-container">
            <img
              src={rifa.img}
              alt="Background"
              className="background-image"
              onClick={handleToggleHover}
            />
            <div className="eye-icon">
              <i className="material-icons" onClick={handleToggleHover}>
                visibility
              </i>
            </div>
          </div>

          {/* Front container */}
          <div style={{ cursor: "default" }} className="front-container">
            {/* Logo and name */}
            <div className="logo-name-container">
              <span className="name">{socioMetaData[0].nombre_negocio}</span>
            </div>
            <hr className="divider" />

            {/* Rifa name */}
            <div className="rifa-name">{rifa.nombre}</div>

            {/* Description */}
            <div className="description">
              <ul className="description">
                {descItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Loading bar and time counter */}
            <div className="loading-bar-container">
              <LoadingBar boletosVendidos={soldTickets.length} rifa={rifa} />
            </div>

            <div className="countdown-container">
              <CountdownTimer fecha={rifa.fecharifa} />
            </div>

            {/* Price */}
          </div>
          <div
            className="price"
            style={{ backgroundColor: socioMetaData[0].color }}
          >
            ${rifa.precioboleto}
          </div>
          <div className="logo-name-container">
            <img src={socioMetaData[0].image_url} alt="Logo" className="logo" />
            {/*<span className="name">{socioMetaData[0].nombre_negocio}</span>*/}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default RifaList;

/*

const rifa_user_id = rifas.user_id;
  const [userMetaData, setUserMetaData] = useState(null);
  useEffect(() => {
    const fetchUserMetaData = async () => {
      const { data, error } = await supabase
        .from("user_metadata_view")
        .select()
        .eq("user_id", rifa_user_id);
      if (error) {
        console.log(error);
      }
      if (data) {
        setUserMetaData(data);
      }
    };
    fetchUserMetaData();
  }, []);

  console.log(userMetaData);

  */
