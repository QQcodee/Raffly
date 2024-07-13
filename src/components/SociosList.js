import { useNavigate } from "react-router-dom";

//import SocioList.css
import "../css/SocioList.css";

import CounterRifasActivas from "./CounterRifasActivas";

const SociosList = ({ socio }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(
      "/" +
        encodeURIComponent(socio.nombre_negocio.replace(/\s+/g, "-")) +
        "/" +
        encodeURIComponent(socio.user_id.replace(/\s+/g, "-"))
    );
  };

  return (
    <>
      <div
        style={{ cursor: "pointer", backgroundColor: "white" }}
        class="card-container"
        key={socio.user_id}
      >
        <h2
          style={{
            color: "black",
            fontWeight: "400",
            fontFamily: "Poppins",
            textAlign: "center",
            fontSize: "27px",
          }}
        >
          {socio.nombre_negocio}
        </h2>
        <img onClick={handleClick} src={socio.image_url} alt="socio" />

        <CounterRifasActivas idSocio={socio.user_id} />
        <hr
          style={{
            border: "1px solid #2e2e2e",
            width: "5vw",
            position: "relative",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        ></hr>

        <p>{socio.phone}</p>
        <p>{socio.estado}</p>
      </div>
    </>
  );
};

export default SociosList;

/*

+
        "/" +
        encodeURIComponent(socio.user_id.replace(/\s+/g, "-"))
    );

    */
