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
        .eq("nombre_negocio", rifa.socio);

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
          <div className="front-container" onClick={() => handleCLick()}>
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

/*<div className="rifa-list" key={rifa.id}>
        <section onClick={handleCLick} className="imagen-rifa">
          <img src={rifa.img} style={{ width: "100%" }} />
        </section>

        <section className="info-rifa">
          <h1 className="rifa-nombre">{rifa.nombre}</h1>
          <hr className="divider" />

          <ul className="rifa-desc">
            {descItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <CountdownTimer fecha={rifa.fecharifa} />
          <p className="rifa-precio">${rifa.precioboleto}</p>
          <LoadingBar boletosVendidos={soldTickets.length} rifa={rifa} />
          <ByWho user_meta={rifa.user_id} />
        </section>
      </div>

      {socioMetaData[0] ? (
        <div className="custom-ticket" style={{ backgroundColor: "white" }}>
          <aside>{rifa.nombre}</aside>
          <section className="custom-ticket__first-section">
            <section>
              <img src={socioMetaData[0].image_url} alt="logo" />
              <h4>{rifa.socio}</h4>
            </section>

            <section>
              <strong style={{ fontSize: "16px" }}>{rifa.nombre} </strong>
            </section>
            <ul>
              <li>
                <p>
                  <strong>SORTEO:</strong>
                </p>
                <p>{rifa.nombre}</p>
              </li>

              <li>
                <p>
                  <strong>ESTADO:</strong>
                </p>
                <p>CHIHUAHUA</p>
              </li>

              <li>
                <p>
                  <strong>FECHA:</strong>
                </p>
                <p>{rifa.fecharifa}</p>
              </li>
            </ul>
          </section>

          <section
            className="custom-ticket__third-section"
            style={{ backgroundColor: socioMetaData[0].color }}
          >
            <h4>
              <LoadingBar boletosVendidos={soldTickets.length} rifa={rifa} />
            </h4>

            <CountdownTimer
              fecha={rifa.fecharifa}
              color={socioMetaData[0].color}
            />
          </section>
          <aside>{rifa.nombre}</aside>
        </div>
      ) : null}
       */
