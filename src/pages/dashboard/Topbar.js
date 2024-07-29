import { useUser } from "../../UserContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import AccountMenu from "../../components/AccountMenu";

//import navHome.css

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userMetaData } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  return (
    <>
      {userMetaData[0] ? (
        <header
          style={{
            backgroundColor: "black",
            display: "flex",
            alignItems: "center",
          }}
          className="topbar"
        >
          <h1
            style={{
              color: "white",
              fontWeight: "bold",
              fontFamily: "Poppins",
            }}
          >
            Panel de {userMetaData[0].nombre_negocio}
          </h1>

          <div
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            onClick={toggleMenu}
          >
            <i className="material-icons">account_circle</i>
            {user.user_metadata.name}
          </div>

          {isMenuOpen && <AccountMenu onClose={closeMenu} user={user} />}
        </header>
      ) : null}
    </>
  );
};

export default Topbar;
