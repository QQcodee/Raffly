import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
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
        .from("boletos_view")
        .select()
        .eq("id_rifa", rifa.id);

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

        setSoldTickets(1);
      }
      if (data) {
        // Flatten the arrays of ticket numbers into a single array

        setSoldTickets(data[0].totalsold);
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
  }, [rifa.user_id]);

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
          <div className="front-container" onClick={() => handleCLick()}>
            {/* Logo and name */}
            <div className="logo-name-container">
              <span className="name">{socioMetaData[0].nombre_negocio}</span>
            </div>
            <hr className="divider" />

            {/* Rifa name */}
            <div className="rifa-name-list">{rifa.nombre}</div>

            {/* Description */}
            <div className="description">
              <ul className="description">
                {descItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Loading bar and time counter */}
            {soldTickets ? (
              <div className="loading-bar-container">
                <LoadingBar boletosVendidos={soldTickets} rifa={rifa} />
              </div>
            ) : null}

            {rifa.fecharifa ? (
              <div className="countdown-container">
                <CountdownTimer fecha={rifa.fecharifa} />
              </div>
            ) : (
              <p style={{ textAlign: "center", fontWeight: "600" }}>
                {" "}
                La fecha se fijara al liquidar 80% de boletos
              </p>
            )}

            {/* Price */}
          </div>
          <div
            className="price"
            style={{ backgroundColor: socioMetaData[0].color }}
          >
            ${rifa.precioboleto}
          </div>
          <div className="logo-name-container">
            <img
              src={socioMetaData[0].image_url}
              alt="Logo"
              className="logo-rifaList"
            />
            {/*<span className="name">{socioMetaData[0].nombre_negocio}</span>*/}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default RifaList;
