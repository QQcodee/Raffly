import { useUser } from "../../UserContext";
import { Link } from "react-router-dom";

const Topbar = () => {
  const { userMetaData } = useUser();
  return (
    <>
      {userMetaData[0] ? (
        <header
          style={{ backgroundColor: userMetaData[0].color }}
          className="topbar"
        >
          <h1>Dashboard de {userMetaData[0].nombre_negocio}</h1>
          <Link to="/logout">
            <i className="material-icons"> account_circle </i>
            Logout
          </Link>
        </header>
      ) : null}
    </>
  );
};

export default Topbar;
