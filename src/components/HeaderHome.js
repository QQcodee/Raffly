import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { useUser } from "../UserContext";
import AccountMenu from "./AccountMenu";
import "../css/index.css";
import "../css/NavHome.css";

const HeaderHome = () => {
  const navigate = useNavigate();
  const { user, userRole } = useUser();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header-home">
      <Link to="/" style={{ textDecoration: "none" }}>
        <h1 className="logo-title">Raffly</h1>
      </Link>
      <div className="hamburger" onClick={toggleNav}></div>
      <nav className={`nav-home ${isNavOpen ? "active" : ""}`}>
        <ul className="nav-home-ul">
          <li>
            <Link className="nav-home-item" to="/" onClick={toggleNav}>
              Inicio
            </Link>
          </li>
          <li>
            <Link className="nav-home-item" to="/socios" onClick={toggleNav}>
              Socios
            </Link>
          </li>
          <li>
            <Link className="nav-home-item" to={"/cart"} onClick={toggleNav}>
              <i className="material-icons">local_mall</i>
              <sub>{cartCount}</sub>
            </Link>
          </li>
          {userRole === "Socio" || userRole === "Admin" ? (
            <li>
              <Link
                className="nav-home-item"
                to={`/dashboard/${user.id}`}
                onClick={toggleNav}
              >
                Dashboard
              </Link>
            </li>
          ) : null}
          <li>
            {user ? (
              <>
                <Link
                  style={{
                    textDecoration: "none",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    gap: "0.5rem",
                  }}
                  className="nav-home-item"
                  to="#"
                  onClick={toggleMenu}
                >
                  <i className="material-icons">account_circle</i>
                  {user.user_metadata.name}
                </Link>
                {isMenuOpen && (
                  <AccountMenu
                    onClose={closeMenu}
                    user={user}
                    socio_id={null}
                    nombre_negocio={null}
                  />
                )}
              </>
            ) : (
              <Link
                style={{
                  textDecoration: "none",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  gap: "0.5rem",
                }}
                className="nav-home-item"
                to="/login"
                onClick={toggleNav}
              >
                <i className="material-icons">account_circle</i>
                Iniciar Sesion
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderHome;
