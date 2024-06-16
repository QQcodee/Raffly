import { useUser } from "../../UserContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import AccountMenu from "../../components/AccountMenu";

//import navHome.css
import "../../css/NavHome.css";

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
          style={{ backgroundColor: userMetaData[0].color }}
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
          <nav className="nav-home">
            <ul className="nav-home-ul">
              <li>
                <Link
                  style={{
                    textDecoration: "none",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    gap: "0.5rem",
                    color: "white",
                  }}
                  className="nav-home-item"
                  to={"#"}
                  onClick={toggleMenu}
                >
                  <i className="material-icons">account_circle</i>
                  {user.user_metadata.name}
                </Link>
              </li>

              {isMenuOpen && <AccountMenu onClose={closeMenu} user={user} />}
            </ul>
          </nav>
        </header>
      ) : null}
    </>
  );
};

export default Topbar;
