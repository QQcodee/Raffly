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
    <div
      style={{ cursor: "pointer", backgroundColor: "white" }}
      class="card-container"
      key={socio.user_id}
    >
      <h1>{socio.nombre_negocio}</h1>
      <img onClick={handleClick} src={socio.image_url} alt="socio" />

      <CounterRifasActivas idSocio={socio.user_id} />

      <p>{socio.phone}</p>
      <p>{socio.estado}</p>
    </div>
  );
};

export default SociosList;

/*

+
        "/" +
        encodeURIComponent(socio.user_id.replace(/\s+/g, "-"))
    );

    */
