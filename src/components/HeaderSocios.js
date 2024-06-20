import "../css/HeaderSocios.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../UserContext";

import AccountMenu from "./AccountMenu";
import { useCart } from "../CartContext";

const HeaderSocios = () => {
  const { user_id, nombre_negocio } = useParams();

  const [socioMetaData, setSocioMetaData] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const { user, userRole } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserMetaData = async () => {
      const { data, error } = await supabase
        .from("user_metadata")
        .select()
        .eq("user_id", user_id);

      if (error) {
        console.log(error);
      }
      if (data) {
        setSocioMetaData(data);

        //console.log(data);
      }
    };
    fetchUserMetaData();
  }, []);
  return (
    <>
      {socioMetaData[0] ? (
        <>
          <header
            className="header-socio"
            style={{ backgroundColor: socioMetaData[0].color }}
          >
            <div className="logo-title-socio">
              <img
                src={socioMetaData[0].image_url}
                alt="logo"
                className="logo-socio"
              />{" "}
              <h1 className="title-socio">{socioMetaData[0].nombre_negocio}</h1>
            </div>
            <nav className="nav-menu-socio">
              <ul>
                {user ? (
                  <li>
                    <a
                      href={
                        "/" +
                        encodeURIComponent(
                          socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                        ) +
                        "/" +
                        encodeURIComponent(
                          socioMetaData[0].user_id.replace(/\s+/g, "-")
                        ) +
                        "/mis-boletos"
                      }
                    >
                      Mis Boletos
                    </a>
                  </li>
                ) : null}

                <li>
                  <a
                    href={
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                      ) +
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].user_id.replace(/\s+/g, "-")
                      )
                    }
                  >
                    Rifas Activas
                  </a>
                </li>
                <li>
                  <a
                    href={
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                      ) +
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].user_id.replace(/\s+/g, "-")
                      ) +
                      "/contacto"
                    }
                  >
                    Contacto
                  </a>
                </li>

                <li>
                  <a href="#metodos-de-pago">Metodos de pago</a>
                </li>

                {user || userRole === "Socio" ? (
                  <li>
                    <a href={"/dashboard/" + user?.id}>Panel de socio</a>
                  </li>
                ) : null}

                <li>
                  <Link
                    className="nav-home-item"
                    to={
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                      ) +
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].user_id.replace(/\s+/g, "-")
                      ) +
                      "/carrito"
                    }
                  >
                    <i className="material-icons">local_mall</i>
                    <sub>{cartCount}</sub>
                  </Link>
                </li>

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
                        to={"#"}
                        onClick={toggleMenu}
                      >
                        <i className="material-icons">account_circle</i>
                        {user.user_metadata.name}
                      </Link>
                      {isMenuOpen && (
                        <AccountMenu
                          onClose={closeMenu}
                          user={user}
                          socio_id={user_id}
                          nombre_negocio={nombre_negocio}
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
                      to={
                        "/" +
                        encodeURIComponent(
                          socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                        ) +
                        "/" +
                        encodeURIComponent(
                          socioMetaData[0].user_id.replace(/\s+/g, "-")
                        ) +
                        "/login"
                      }
                    >
                      <i
                        onClick={() =>
                          navigate(
                            "/" +
                              encodeURIComponent(
                                socioMetaData[0].nombre_negocio.replace(
                                  /\s+/g,
                                  "-"
                                )
                              ) +
                              "/" +
                              encodeURIComponent(
                                socioMetaData[0].user_id.replace(/\s+/g, "-")
                              ) +
                              "/login"
                          )
                        }
                        className="material-icons"
                      >
                        account_circle
                      </i>
                      Iniciar Sesion
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </header>
        </>
      ) : null}
    </>
  );
};

export default HeaderSocios;
